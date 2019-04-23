const { getRevenueData, getPriceData } = require('../../helpers/IEXHelpers');

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

        prices.filter()
    });
};

const heatMapChart = async symbol => {
    //get financial data
    const revenue = await getRevenueData(symbol, 4);
    console.log('revenue', revenue);
    //get prices from the start of revenue data
    // const priceSeries = await getPriceData(symbol, '1y');
    // console.log('priceSeries', priceSeries);
    //generate multiple data
    const multiples = generateMultiple(revenue, priceSeries);
    //generate heatMap

    return {
        //[{date: date, value: price}]
        priceData: {},
        //[{date: date, value: multiple}]
        multipleData: {},
        //[{bucket: bucket, value: frequency}]
        heatMap: {}
    };
};

heatMapChart('xone');

module.exports = heatMapChart;
