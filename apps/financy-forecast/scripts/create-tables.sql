-- FinanceForecast Database Schema
-- This file creates all necessary tables for the FinanceForecast application

-- Set schema search path
SET search_path TO financy_forecast, public;

-- 1. Accounts table (Konten)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (
        category IN ('LIQUID', 'RETIREMENT')
    ),
    current_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. AssetSnapshots table (Monatliche Ist-Stände)
-- Updated: Now supports last day of month instead of first day
CREATE TABLE IF NOT EXISTS asset_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    date DATE NOT NULL CHECK (
        -- Allow any day, but application logic ensures it's the last day of the month
        EXTRACT(
            DAY
            FROM date
        ) BETWEEN 1 AND 31
    ),
    total_liquidity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. AccountBalanceDetails table (Verknüpfungstabelle)
CREATE TABLE IF NOT EXISTS account_balance_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    snapshot_id UUID NOT NULL REFERENCES asset_snapshots (id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    amount INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (snapshot_id, account_id)
);

-- 4. RecurringItems table (Fixkosten & Regelmäßige Einnahmen)
CREATE TABLE IF NOT EXISTS recurring_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    interval VARCHAR(20) NOT NULL CHECK (
        interval IN (
            'MONTHLY',
            'QUARTERLY',
            'YEARLY'
        )
    ),
    due_month INTEGER CHECK (
        due_month IS NULL
        OR (
            due_month >= 1
            AND due_month <= 12
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT quarterly_yearly_due_month_required CHECK (
        (interval = 'MONTHLY')
        OR (
            interval IN ('QUARTERLY', 'YEARLY')
            AND due_month IS NOT NULL
        )
    )
);

-- 5. ScenarioItems table (Szenarien / Einmalzahlungen)
CREATE TABLE IF NOT EXISTS scenario_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Settings table (Globale Einstellungen - Singleton)
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000',
    estimated_monthly_variable_costs INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_category ON accounts (category);

CREATE INDEX IF NOT EXISTS idx_accounts_name ON accounts (name);

CREATE INDEX IF NOT EXISTS idx_asset_snapshots_date ON asset_snapshots (date);

CREATE INDEX IF NOT EXISTS idx_account_balance_details_snapshot ON account_balance_details (snapshot_id);

CREATE INDEX IF NOT EXISTS idx_account_balance_details_account ON account_balance_details (account_id);

CREATE INDEX IF NOT EXISTS idx_recurring_items_interval ON recurring_items (interval);

CREATE INDEX IF NOT EXISTS idx_recurring_items_due_month ON recurring_items (due_month);

CREATE INDEX IF NOT EXISTS idx_scenario_items_date ON scenario_items (date);

CREATE INDEX IF NOT EXISTS idx_scenario_items_active ON scenario_items (is_active);

CREATE INDEX IF NOT EXISTS idx_scenario_items_date_active ON scenario_items (date, is_active);

-- Insert default settings
INSERT INTO
    settings (
        estimated_monthly_variable_costs
    )
VALUES (0)
ON CONFLICT (id) DO NOTHING;