CREATE TABLE portfolio (
    id SERIAL,
    asset_value DECIMAL(8, 2),
    cash_value DECIMAL(8, 2),
    total_value DECIMAL(8, 2),
    type VARCHAR(10),
    positions INT [],
    PRIMARY KEY(id)
);

CREATE TABLE postion(
    id SERIAL,
    status VARCHAR(5), -- make an enum
    open_time TIMESTAMP,
    close_time TIMESTAMP,
    quantity DECIMAL(8, 2),
    open_price DECIMAL(8,2),
    close_price DECIMAL(8,2),
    cost_basis DECIMAL(8,2),
    PRIMARY KEY(id)
);

DROP TABLE portfolio;
DROP TABLE position;


SELECT * from portfolio;

INSERT INTO portfolio (type, asset_value) VALUES ('Roth', 38000);


