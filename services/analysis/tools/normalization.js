require('isomorphic-fetch');
const { getRevenueData, getPriceData } = require('../../helpers/IEXHelpers');
const zipWith = require('lodash.zipwith');
const get = require('lodash.get');
const { getStandardDeviation } = require('../../helpers/mathHelpers');
const { positions } = require('../../portfolio/portfolio.json');

const benchmarkNormalization = async (symbol, period, dataParams, cachedBenchMarkSeries) => {
    try {
        const dataParams = { chartCloseOnly: true };
        //get financial data
        const targetPriceSeries = await getPriceData(symbol, period, dataParams);
        const benchmarkPriceSeries = cachedBenchMarkSeries
            ? cachedBenchMarkSeries
            : await getPriceData('spy', period, dataParams);

        // zip and normalize
        // dont actually need zipWith can just derive the diff on the FE but w/e
        // still useful to compare dates make sure data is good
        const diffs = [];
        const normalizedPriceSeries = zipWith(
            benchmarkPriceSeries,
            targetPriceSeries,
            (spyData, targetData) => {
                const { date: spyDate, changeOverTime: spyChangeOverTime } = spyData;
                const { date: targetDate, changeOverTime: targetChangeOverTime } = targetData;
                const normalizedChangeOverTime = targetChangeOverTime - spyChangeOverTime;

                if (spyDate !== targetDate) {
                    return { error: 'mismatch dates' };
                }
                diffs.push(normalizedChangeOverTime);
                return {
                    spy: spyData,
                    [symbol]: Object.assign({ normalizedChangeOverTime }, targetData)
                };
            }
        );

        const standardDeviation = getStandardDeviation(diffs);

        return { priceSeries: normalizedPriceSeries, standardDeviation };
    } catch (e) {
        console.log('ERROR: ', e);
    }
};

// enventually have to move this out if i evaluate more than one criteria.
// of course could just export this to a pipeline of analystics fns
const evaluatePortfolio = async (portolio, period, dataParams) => {
    // TODO when you run map async and try to fetch the respective benchmark data only if you need it
    // it will run each map function asynchronously so you cant cache and use data from a previous iteration
    // there must be a way to do that
    // thats also why when console logging from the inner map function shit is out of order?
    const benchMarkspy = await getPriceData('spy', period, dataParams);
    const benchMarkqqq = await getPriceData('qqq', period, dataParams);
    const benchMarkxbi = await getPriceData('xbi', period, dataParams);
    const cachedBenchMarkData = {
        spy: benchMarkspy,
        qqq: benchMarkqqq,
        xbi: benchMarkxbi
    };
    // const cachedBenchMarkData = {}

    return portolio.map(async ({ symbol, benchmark }) => {
        try {
            let benchmarkData = cachedBenchMarkData[benchmark];
            // doesnt work cause the map function continues and doesnt respect the await, await is only honored within the map function
            // if (!benchmarkData) {
            //     // console.log('no cached data', benchmark);
            //     benchmarkData = await getPriceData(benchmark, period, dataParams);
            //     console.log('cacheable data', benchmarkData.length);
            //     cachedBenchMarkData[benchmark] = benchmarkData;
            // }
            const { standardDeviation, priceSeries } = await benchmarkNormalization(
                symbol,
                period,
                null,
                benchmarkData
            );
            const lastPoint = priceSeries[priceSeries.length - 1];

            const relativePerformance = get(lastPoint, `${symbol}.normalizedChangeOverTime`);
            const isHighDeviation = Math.abs(relativePerformance) > standardDeviation * 2;
            let recommendation = null;
            if (!isHighDeviation) {
                recommendation = 'hold';
            } else {
                // if out performing to the upside rebalance down by selling
                recommendation = relativePerformance > 0 ? 'sell' : 'buy';
            }

            console.log({
                symbol,
                recommendation,
                standardDeviation,
                relativePerformance,
                benchmark
            });
            return {
                symbol,
                recommendation,
                standardDeviation,
                relativePerformance,
                benchmark
            };
        } catch (e) {
            console.log('ERROR in eval portfolio', e);
        }
    });
};

module.exports = {
    benchmarkNormalization,
    evaluatePortfolio
};

evaluatePortfolio(positions);
