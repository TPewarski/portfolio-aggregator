require('isomorphic-fetch');
const { getRevenueData, getPriceData } = require('../../helpers/IEXHelpers');

const spyNormilization = async (symbol, period, dateRange) => {
    try {
        // //get financial data
        // const revenue = await getRevenueData(symbol);
        // console.log('revenue', revenue);
        //get prices
        const priceSeries = await getPriceData(symbol);
        console.log('priceSeries', priceSeries);
        //generate multiple data
        //generate heatMap

        return {
            //[{date: date, value: price}]
            priceData: {},
            //[{date: date, value: multiple}]
            multipleData: {},
            //[{bucket: bucket, value: frequency}]
            heatMap: {}
        };
    } catch (e) {
        console.log('ERROR: ', e);
    }
};

spyNormilization('aapl');
