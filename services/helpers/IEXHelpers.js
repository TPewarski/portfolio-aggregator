require('isomorphic-fetch');
const IEX_URL_PREFIX = 'https://api.iextrading.com/1.0';

const getFinancialsURL = (symbol, params) =>
    `${IEX_URL_PREFIX}/stock/${symbol}/financials?${params || ''}`;

const normalizeResp = resp => resp.json();
function getRevenueData(symbol, dateRange, period) {
    return fetch(getFinancialsURL(symbol))
        .then(normalizeResp)
        .then(data => {
            const financials = data.financials;
            // console.log('data', data);
            return financials.map(({ totalRevenue, reportDate }) => ({
                revenue: totalRevenue,
                reportDate
            }));
        })
        .catch(e => console.log('err', e));
}

//period 1y, 2y
function getPriceData(symbol, period) {
    return fetch(`${IEX_URL_PREFIX}/stock/${symbol}/chart/${period}`)
        .then(normalizeResp)
        .then(data => data.map(({ date, close }) => ({ date, close })));
}

module.exports = {
    getFinancialsURL,
    getRevenueData,
    getPriceData
};
