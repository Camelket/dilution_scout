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
) 

CREATE TABLE IF NOT EXISTS net_cash_and_equivalents(
    company_id SERIAL,
    instant DATE,
    amount BIGINT,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
)

CREATE TABLE IF NOT EXISTS net_cash_and_equivalents_excluding_financing(
    company_id SERIAL,
    instant DATE,
    amount BIGINT,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
)

CREATE TABLE IF NOT EXISTS capital_raise(
    company_id SERIAL,
    kind VARCHAR(255),
    amount BIGINT,

    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
)

CREATE TABLE IF NOT EXISTS underwriters(
    underwriter_id SERIAL PRIMARY KEY,
    underwriter_name VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS shelf_filing(
    company_id SERIAL,
    acn_number VARCHAR(255) NOT NULL PRIMARY KEY,
    form_type VARCHAR(255) NOT NULL,
    is_effective BOOLEAN,
    deal_size BIGINT,
    underwritter SERIAL,
      
    CONSTRAINT fk_company_id
        FOREIGN KEY (company_id)
            REFERENCES companies(id),
    CONSTRAINT fk_underwriter_id
        FOREIGN KEY (underwriter_id)
            REFERENCES underwriters(underwriter_id)
)