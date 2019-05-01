const get = require('lodash.get');

const getStandardDeviation = (arr, path) => {
    var total = 0;

    arr.forEach(val => {
        let data = val;
        if (path) {
            data = get(val, path);
        }
        total += data;
    });
    const avg = total / arr.length;

    var total = 0;
    arr.forEach(val => {
        let data = val;
        if (path) {
            data = get(val, path);
        }
        total += Math.pow(data - avg, 2);
    });

    var s = total / arr.length;
    return Math.pow(s, 0.5);
};

module.exports = {
    getStandardDeviation
};
