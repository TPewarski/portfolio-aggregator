require('isomorphic-fetch');
const express = require('express');
const { getFinancialsURL, getRevenueData } = require('../helpers/IEXHelpers');
const heatMapChart = require('./tools/heatMapChart');
const spyNormilization = require('./tools/spyNormilization');
const app = express();
const port = 1337;

module.exports = {
    heatMapChart
};

// app.get('/', (req, res) => res.send('Hello World!'));

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));
