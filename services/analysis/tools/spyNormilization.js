const { getRevenueData, getPriceData } = require('../../helpers/IEXHelpers');

const spyNormilization = async (symbol, fincialDataKey, period, dateRange) => {
    //get prices
    const priceSeries = await getPriceData(symbol, '1y');
    console.log('priceSeries', priceSeries);
    //get financial data
    const revenue = await getRevenueData(symbol);
    console.log('revenue', revenue);
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
};
