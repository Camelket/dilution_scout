DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
--  TODO: add primary keys to most tables 
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    cik BIGINT NOT NULL,
    sic INT,
    symbol VARCHAR(10) UNIQUE,
    company_name VARCHAR(255),
    
    CONSTRAINT fk_sic
        FOREIGN KEY (sic)
            REFERENCES sics(sic));

CREATE TABLE IF NOT EXISTS sics (
    sic INT PRIMARY KEY,
    sic_name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS outstanding_shares(
    company_id SERIAL,
    instant DATE,
    amount BIGINT,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
); 

CREATE TABLE IF NOT EXISTS net_cash_and_equivalents(
    company_id SERIAL,
    instant DATE,
    amount BIGINT,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS net_cash_and_equivalents_excluding_financing(
    company_id SERIAL,
    instant DATE,
    amount BIGINT,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
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

CREATE TABLE IF NOT EXISTS shelf(
    shelf_id SERIAL PRIMARY KEY,
    company_id SERIAL,
    acn_number VARCHAR(255) NOT NULL,
    form_type VARCHAR(255) NOT NULL,
    shelf_capacity BIGINT,
    underwriter_id SERIAL,
    total_amount_raised BIGINT,
    total_amount_raised_unit VARCHAR(255) DEFAULT USD,
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

CREATE TABLE IF NOT EXISTS securit



CREATE TABLE IF NOT EXISTS offerings(
    offering_id SERIAL PRIMARY KEY,
    company_id SERIAL,
    acn_number VARCHAR(255) NOT NULL,
    inital_form_type VARCHAR(255) NOT NULL,
    underwriter_id SERIAL,
    final_offering_amount_usd BIGINT,
    anticipated_offering_amount_usd BIGINT,
    expiry DATE,
    filing_date DATE,
      
    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id),
    CONSTRAINT fk_underwriter_id
        FOREIGN KEY (underwriter_id)
            REFERENCES underwriters(underwriter_id),
    CONSTRAINT fk_filing_status_id
        FOREIGN KEY (filing_status_id)
            REFERENCES filing_status(filing_status_id)
);

CREATE TABLE IF NOT EXISTS filing_status(
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS warrants(
    company_id SERIAL,
    filing_id SERIAL,
    unit_per_warrant INT,
    unit VARCHAR(255) DEFAULT shares,

)