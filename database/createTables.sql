CREATE TABLE portfolio (
    id SERIAL,
    asset_value INT,
    PRIMARY KEY(id)
);

CREATE TABLE postion(
    id INT PRIMARY KEY,
    status VARCHAR(5), -- make an enum
    open_time TIMESTAMP,
    close_time TIMESTAMP,
    quantity DECIMAL(8, 2),
    open_price DECIMAL(8,2),
    close_price DECIMAL(8,2),
    cost_basis DECIMAL(8,2)
);

DROP TABLE portfolio;
DROP TABLE position;

INSERT INTO 


