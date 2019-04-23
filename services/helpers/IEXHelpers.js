require('isomorphic-fetch');
const querystring = require('querystring');
const { iex_pub_key, iex_sandbox_pub_key } = require('../../apiKeys.json');

const IEX_URL_PREFIX = 'https://cloud.iexapis.com/v1';
const IEX_SANDBOX_URL = 'https://sandbox.iexapis.com/stable';

// TODO put in a config file somwhere
const isSandbox = true;

const getIEXUrl = isSandbox => (isSandbox ? IEX_SANDBOX_URL : IEX_URL_PREFIX);

const getParams = (params, isSandbox) =>
    querystring.stringify(
        Object.assign({ token: isSandbox ? iex_sandbox_pub_key : iex_pub_key }, params),
        '&',
        '='
    );

const normalizeResp = async resp => {
    // const jsonifiedResp = await resp.json();
    if (resp.status !== 200) {
        console.log('resp', jsonifiedResp);
    }
    return resp.json();
};

async function getRevenueData(symbol, last = 4, params) {
    return fetch(
        `${getIEXUrl(isSandbox)}/stock/${symbol}/financials/${last}?${getParams(params, isSandbox)}`
    )
        .then(normalizeResp)
        .then(data => {
            const financials = data.financials;
            return financials.map(({ totalRevenue, reportDate }) => ({
                revenue: totalRevenue,
                reportDate
            }));
        })
        .catch(e => console.log('err', e));
}

//period 1y, 2y
const getPriceData = async (symbol, range = 'ytd', params) => {
    return fetch(
        `${getIEXUrl(isSandbox)}/stock/${symbol}/chart/${range}?${getParams(params, isSandbox)}`
    ).then(normalizeResp);
};

module.exports = {
    getRevenueData,
    getPriceData
};
