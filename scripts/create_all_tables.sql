-- Table pour les audits analytics
CREATE TABLE IF NOT EXISTS analytics_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    platforms_data JSONB NOT NULL,
    overall_score INTEGER,
    audit_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les analyses de funnel
CREATE TABLE IF NOT EXISTS funnel_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    funnel_data JSONB NOT NULL,
    overall_conversion DECIMAL(5,2),
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les analyses de cohortes
CREATE TABLE IF NOT EXISTS cohort_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    cohort_data JSONB NOT NULL,
    ltv_cac_ratio DECIMAL(5,2),
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les analyses concurrentielles
CREATE TABLE IF NOT EXISTS competitive_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    competitive_data JSONB NOT NULL,
    threat_level VARCHAR(20),
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les audits SEO
CREATE TABLE IF NOT EXISTS seo_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    audit_data JSONB NOT NULL,
    technical_score INTEGER,
    audited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_analytics_audits_client_id ON analytics_audits(client_id);
CREATE INDEX IF NOT EXISTS idx_funnel_analyses_client_id ON funnel_analyses(client_id);
CREATE INDEX IF NOT EXISTS idx_cohort_analyses_client_id ON cohort_analyses(client_id);
CREATE INDEX IF NOT EXISTS idx_competitive_analyses_client_id ON competitive_analyses(client_id);
CREATE INDEX IF NOT EXISTS idx_seo_audits_client_id ON seo_audits(client_id);
