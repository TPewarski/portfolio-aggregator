const { getRevenueData, getPriceData, getKeyStats } = require('../../helpers/IEXHelpers');

const heatMap = (multipleList, period) => {
    // get multiple range
    //divide by multiple period to create buckets
    // determine frequency of each bucket
    // return bucket map
};

const generateMultiple = (normalizeData, prices) => {
    // assumes normalize data and prices is sorted by date.
    // map to multiple for every price
    let startRange = null;
    let endRange = null;
    let cursor = 0;

    normalizeData.forEach(({ reportDate, revenue }) => {
        // revenue applies from report date forward
        startRange = reportDate;
        endRange = new Date(reportDate);

        prices.filter();
    });
};

// it appears i cant get enough data from iex to generate my heat map
// i can get price, and revenue for 4 quarters but can only get the most recent market cap or float
// i could use current float to calculate shares outstanding but that number changes with time
// ill do that for now and add TODO
// TODO use floating shares for a given quarter to calculate heat map instead of just most recent float
// intrino seems to have
// TODO perhaps should apply some weighting for more recent ps ratios?
//TODO my big concern is if rounding floating points has a big impact on the results
// TODO this also uses a lof of messages, look to see if i can reduce load on api probably put something in the price data call
// wow looks like financials call has a ridiculous msg weighting
const heatMapChart = async symbol => {
    try {
        //get financial data
        const revenueUnsorted = await getRevenueData(symbol, 4);
        const revenue = (revenueUnsorted || []) && revenueUnsorted.reverse();
        const firstReportDate = revenue[0].reportDate.split('-').join('');

        //get float
        const float = await getKeyStats(symbol, 'float');

        //get prices from the start of revenue data
        const priceSeries = await getPriceData(symbol, '1m');

        let minPS = null;
        let maxPS = null;
        const psSeries = priceSeries.map((quote, idx) => {
            const { date, close } = quote;
            // TODO could search from earliest and then modify rev so search is easier
            // just going to brute force for now
            const relevantRev = revenue.reduce((prev, data, idx) => {
                const { revenue, reportDate } = data;
                // price to sales is trailing 12 month revenue
                //we only get 4 reports so we have to sum them all or data is no good
                // TODO fix this so we take only 4 most recent revenues so this works in cases where we have more than the last 4 reports
                if (date > reportDate) {
                    return revenue + prev;
                } else {
                    return null;
                }
            }, 0);

            //we can find the range of price to sales in this pass to save a pass in the future
            const psRatio =
                relevantRev && parseFloat((quote.close / (relevantRev / float)).toFixed(3));
            if (!minPS || psRatio < minPS) {
                minPS = psRatio;
            }
            if (!maxPS || psRatio > maxPS) {
                maxPS = psRatio;
            }

            return {
                ...quote,
                priceToSales: psRatio
            };
        });

        //generate buckets and buck psRatios
        //TODO extract out into a helper function
        const NUM_BUCKETS = 10;
        const bucketSize = parseFloat(((maxPS - minPS) / NUM_BUCKETS).toFixed(3));
        let counter = 0;
        const buckets = {};
        let startingBucket = minPS;
        while (startingBucket < maxPS && counter < 10) {
            buckets[startingBucket] = 0;
            startingBucket = parseFloat((startingBucket + bucketSize).toFixed(3));
            counter++;
        }

        const bucketKeys = Object.keys(buckets);
        psSeries.forEach(({ priceToSales }) => {
            if (priceToSales) {
                //short out the for each when the num has been bucketed
                let isBucketed = false;
                bucketKeys.forEach((key, idx) => {
                    //TODO good spot for a binary search although not necessary with small num of buckets
                    if (!isBucketed) {
                        if (idx == bucketKeys.length - 1) {
                            buckets[key]++;
                            isBucketed = true;
                        } else if (priceToSales >= key && priceToSales < bucketKeys[idx + 1]) {
                            buckets[key]++;
                            isBucketed = true;
                        }
                    }
                });
            }
        });

        return {
            //[{date: date, value: price}]
            priceData: psSeries,
            //[{date: date, value: multiple}]
            multipleFrequency: buckets
        };
    } catch (e) {
        console.log('Error in heat map: ', e);
    }
};

heatMapChart('xone');

module.exports = heatMapChart;
