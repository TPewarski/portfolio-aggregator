import React from 'react';
import AddRowLink from './AddRowLink';
import Row from './Row';
import AddRowForm from './AddRowForm';

const PortfolioTable = ({ portfolio: { positions }, isAddingRow, onAddRow }) => (
    <div>
        {positions.map(position => <Row {...{ position }} />)}
        {isAddingRow ? <AddRowForm /> : <AddRowLink {...{ onClick: onAddRow }} />}
    </div>
);

export default PortfolioTable;
