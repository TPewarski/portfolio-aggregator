require('isomorphic-fetch');
const { getRevenueData, getPriceData } = require('../../helpers/IEXHelpers');
const zipWith = require('lodash.zipwith');

const useSandBox = false;
const spyNormilization = async (symbol, period, dateRange) => {
    try {
        const dataParams = { chartCloseOnly: true };
        // //get financial data
        const targetPriceSeries = await getPriceData(symbol, 'ytd', dataParams, useSandBox);
        const spyPriceSeries = await getPriceData('spy', 'ytd', dataParams, useSandBox);

        // zip and normalize
        // dont actually need zipWith can just derive the diff on the FE but w/e
        // still useful to compare dates make sure data is good
        const normalizedPriceSeries = zipWith(
            spyPriceSeries,
            targetPriceSeries,
            (spyData, targetData) => {
                const { date: spyDate, changeOverTime: spyChangeOverTime } = spyData;
                const { date: targetDate, changeOverTime: targetChangeOverTime } = targetData;
                const normalizedChangeOverTime = targetChangeOverTime - spyChangeOverTime;

                if (spyDate !== targetDate) {
                    return { error: 'mismatch dates' };
                }
                return {
                    spy: spyData,
                    [symbol]: Object.assign({ normalizedChangeOverTime }, targetData)
                };
            }
        );

        console.log('normalizedPriceSeries', normalizedPriceSeries);

        return normalizedPriceSeries;
    } catch (e) {
        console.log('ERROR: ', e);
    }
};

spyNormilization('hon');
