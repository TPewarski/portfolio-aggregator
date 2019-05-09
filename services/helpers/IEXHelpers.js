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

const normalizeResp = resp => {
    console.log('Response Status: ', resp.status);
    if (resp.status !== 200) {
        console.log('resp', resp);
        return resp;
    }
    // console.log(resp.json());
    return resp.json();
};

const iexFetch = (...args) => {
    // Intentional console.log, log all my calls
    console.log('Fetching: ', ...args);
    return fetch(...args).then(normalizeResp);
};

async function getRevenueData(symbol, last = 4, params) {
    return iexFetch(
        `${getIEXUrl(isSandbox)}/stock/${symbol}/financials/${last}?${getParams(params, isSandbox)}`
    )
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
const getPriceData = async (symbol, range = 'ytd', date, params) => {
    // if there is a range we use range, if there is a date we add date to the url and use date
    //not sure if we can use both so this func might fail if you try to
    const url = `${getIEXUrl(isSandbox)}/stock/${symbol}/chart/${range ? range + '/' : ''}${
        date ? `date/${date}` : ''
    }?${getParams(params, isSandbox)}`;
    return fetch(url).then(normalizeResp);
};

const getKeyStats = (symbol, stat) => {
    const url = `${getIEXUrl(isSandbox)}/stock/${symbol}/stats/${stat || ''}?${getParams(
        null,
        isSandbox
    )}`;
    return iexFetch(url);
};
module.exports = {
    getRevenueData,
    getPriceData,
    getKeyStats
};
