require('isomorphic-fetch');
const express = require('express');
const { getRevenueData } = require('../helpers/IEXHelpers');
const heatMapChart = require('./tools/heatMapChart');
const normalization = require('./tools/normalization');
const app = express();

module.exports = app;

app.get('/', (req, res) => res.send('Hello World from analysis!'));
