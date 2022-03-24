-- DO $$ DECLARE
--     r RECORD;
-- BEGIN
--     FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
--         EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
--     END LOOP;
-- END $$;
-- 
-- ----Add WHERE databasename == currentdatabase

--  TODO: add primary keys to most tables
CREATE TABLE IF NOT EXISTS sics (
    sic INT PRIMARY KEY,
    sector VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,

    UNIQUE(sector, industry)
);

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    cik BIGINT NOT NULL,
    sic INT,
    symbol VARCHAR(10) UNIQUE,
    name_ VARCHAR(255),
    description_ VARCHAR(3000),
    
    CONSTRAINT fk_sic
        FOREIGN KEY (sic)
            REFERENCES sics(sic)
);




CREATE TABLE IF NOT EXISTS outstanding_shares(
    company_id SERIAL,
    instant DATE,
    amount BIGINT,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id),
    UNIQUE(company_id, instant)
); 

CREATE TABLE IF NOT EXISTS net_cash_and_equivalents(
    company_id SERIAL,
    instant DATE,
    amount BIGINT,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id),
    UNIQUE(company_id, instant)
);

CREATE TABLE IF NOT EXISTS net_cash_and_equivalents_excluding_financing(
    company_id SERIAL,
    instant DATE,
    amount BIGINT,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id),
    UNIQUE(company_id, instant)
);

CREATE TABLE IF NOT EXISTS capital_raise(
    company_id SERIAL,
    shelf_id SERIAL,
    kind VARCHAR(255),
    amount_usd BIGINT,
    form_type VARCHAR(255),
    form_acn VARCHAR(255),
    

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS underwriters(
    underwriter_id SERIAL PRIMARY KEY,
    underwriter_name VARCHAR(255)
);

-- s-3, f-3 or f-6
CREATE TABLE IF NOT EXISTS shelfs(
    shelf_id SERIAL PRIMARY KEY,
    company_id SERIAL,
    acn_number VARCHAR(255) NOT NULL,
    form_type VARCHAR(255) NOT NULL,
    shelf_capacity BIGINT,
    underwriter_id SERIAL,
    total_amount_raised BIGINT,
    total_amount_raised_unit VARCHAR(255),
    effect_date DATE,
    last_update DATE,
    expiry DATE,
    filing_date DATE,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id),
    CONSTRAINT fk_underwriter_id
        FOREIGN KEY (underwriter_id)
            REFERENCES underwriters(underwriter_id)
);



-- general category: offering is part of a registration filings like a shelsn, s-1, f-1.
-- Details are either specified in the registration statement or in an ammendment pursuant to 424,
-- A "POS AM", or ?
-- describes a single security type being offered and its details and references the registration_filing
-- it is specified or incorporated by reference into
CREATE TABLE IF NOT EXISTS filing_status(
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS offerings(
    offering_id SERIAL PRIMARY KEY,
    company_id SERIAL,
    acn_number VARCHAR(255) NOT NULL,
    inital_form_type VARCHAR(255) NOT NULL,
    underwriter_id SERIAL,
    final_offering_amount_usd BIGINT,
    anticipated_offering_amount_usd BIGINT,
    filing_status SERIAL,
    filing_date DATE,
      
    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id),
    CONSTRAINT fk_underwriter_id
        FOREIGN KEY (underwriter_id)
            REFERENCES underwriters(underwriter_id),
    CONSTRAINT fk_filing_status_id
        FOREIGN KEY (filing_status)
            REFERENCES filing_status(id)
);

---------------------------------

CREATE TABLE IF NOT EXISTS warrants(
    id SERIAL PRIMARY KEY,
    warrant_name VARCHAR(255),
    offering_id SERIAL,
    shelf_id SERIAL,
    acn_number VARCHAR(255),
    amount_usd_equivalent BIGINT,
    amount_issued BIGINT,
    shares_per_unit FLOAT,
    exercise_price FLOAT,
    expiration_date DATE,
    
    -- CHECK (shelf_id or offering_id),

    CONSTRAINT fk_offering_id
        FOREIGN KEY (offering_id)
            REFERENCES offerings(offering_id),
    CONSTRAINT fk_shelf_id
        FOREIGN KEY (shelf_id)
            REFERENCES shelfs(shelf_id)
);


CREATE TABLE IF NOT EXISTS convertible_note_warrants(
    id SERIAL PRIMARY KEY,
    note_warrant_name VARCHAR(255),
    offering_id SERIAL,
    shelf_id SERIAL,
    exercise_price FLOAT,
    amount_issued BIGINT,
    price_protection INT,
    issue_date DATE,
    exercisable_date DATE,
    last_update DATE,
    additional_notes VARCHAR(1000),

    -- CHECK (shelf_id or offering_id),

    CONSTRAINT fk_offering_id
        FOREIGN KEY (offering_id)
            REFERENCES offerings(offering_id),
    CONSTRAINT fk_shelf_id
        FOREIGN KEY (shelf_id)
            REFERENCES shelfs(shelf_id)
);

CREATE TABLE IF NOT EXISTS convertible_notes(
    id SERIAL PRIMARY KEY,
    offering_id SERIAL,
    shelf_id SERIAL,

    -- CHECK (shelf_id or offering_id),

    CONSTRAINT fk_offering_id
        FOREIGN KEY (offering_id)
            REFERENCES offerings(offering_id),
    CONSTRAINT fk_shelf_id
        FOREIGN KEY (shelf_id)
            REFERENCES shelfs(shelf_id)

);

CREATE TABLE IF NOT EXISTS atm(
    id SERIAL PRIMARY KEY,
    offering_id SERIAL,
    shelf_id SERIAL,
    total_capacity BIGINT,
    underwriter_id SERIAL,
    agreement_start_date DATE,

    -- CHECK (shelf_id or offering_id),

    CONSTRAINT fk_offering_id
        FOREIGN KEY (offering_id)
            REFERENCES offerings(offering_id),
    CONSTRAINT fk_shelf_id
        FOREIGN KEY (shelf_id)
            REFERENCES shelfs(shelf_id),
    CONSTRAINT fk_underwriter_id
      FOREIGN KEY (underwriter_id)
        REFERENCES underwriters(underwriter_id)

);

-- to get all offerings from a certain company, I..
-- select all shelfs/ offerings that have wanted company_id (SELECT WHERE)
-- then SELECT * JOIN on each securities table with shelf/offerings id
-- convertible_notes, atm

-- maybe I should add company_id top securities just to make queries less complex

