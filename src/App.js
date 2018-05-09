import React, { Component } from 'react';
import { portfolio } from './mockData.json';
import PortfolioTable from './portfolioTable/PortfolioTable';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                Portfolio Aggregator
                <PortfolioTable {...{ portfolio }} />
            </div>
        );
    }
}

export default App;
