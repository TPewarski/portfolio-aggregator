import React from 'react';

const Row = ({ position }) => {
    return (
        <div>
            <div>
                <span>{position.ticker}</span>
                <span>{position.displayname}</span>
            </div>
            <div>{position.quantity}</div>
            <div>{position.marketValue}</div>
            <div>{position.costBasis}</div>
        </div>
    );
};

export default Row;
