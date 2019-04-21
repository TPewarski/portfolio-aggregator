require('isomorphic-fetch');
const querystring = require('querystring');
const { iex_pub_key, iex_sandbox_pub_key } = require('../../apiKeys.json');

const IEX_URL_PREFIX = 'https://cloud.iexapis.com/v1';
const IEX_SANDBOX_URL = 'https://sandbox.iexapis.com/stable';

const getIEXUrl = (isSandbox = false) => (isSandbox ? IEX_SANDBOX_URL : IEX_URL_PREFIX);

const getParams = (params, isSandbox) =>
    querystring.stringify(
        Object.assign({ token: isSandbox ? iex_sandbox_pub_key : iex_pub_key }, params),
        '&',
        '='
    );

const normalizeResp = resp => {
    // console.log('resp', resp);
    return resp.json();
};

function getRevenueData(symbol, range, params, isSandbox = true) {
    return fetch(
        `${getIEXUrl(isSandbox)}/stock/${symbol}/financials/2?${getParams(params, isSandbox)}`
    )
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
function getPriceData(symbol, range = 'ytd', params, isSandbox = true) {
    return fetch(
        `${getIEXUrl(isSandbox)}/stock/${symbol}/chart/${range}?${getParams(params, isSandbox)}`
    ).then(normalizeResp);
}

module.exports = {
    getRevenueData,
    getPriceData
};
