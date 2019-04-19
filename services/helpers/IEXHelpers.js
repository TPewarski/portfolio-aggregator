require('isomorphic-fetch');
const querystring = require('querystring');
const { iex_public_key } = require('../../apiKeys.json');

const IEX_URL_PREFIX = 'https://cloud.iexapis.com/v1';
const IEX_SANDBOX_URL = 'https://sandbox.iexapis.com';

const getIEXUrl = (isSandbox = false) => (isSandbox ? IEX_SANDBOX_URL : IEX_URL_PREFIX);

const getParams = params =>
    querystring.stringify(Object.assign({ token: iex_public_key }, params), '&', '=');

const normalizeResp = resp => resp.json();

function getRevenueData(symbol, dateRange, period) {
    return fetch(`${getIEXUrl()}/stock/${symbol}/financials/2?${getParams()}`)
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
function getPriceData(symbol, range, date) {
    return fetch(`${getIEXUrl()}/stock/${symbol}/chart/${range}/${date}?${getParams()}`)
        .then(normalizeResp)
        .then(console.log);
}

module.exports = {
    getFinancialsURL,
    getRevenueData,
    getPriceData
};
