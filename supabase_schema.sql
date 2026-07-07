-- ==========================================
-- SUPABASE POSTGRESQL SCHEMA GENERATION
-- AI Contract Generator & Company Approval
-- ==========================================

-- 1. Enable UUID Extension (Supabase provides this by default, but it's good practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. CUSTOM TYPES / ENUMS
-- ==========================================
CREATE TYPE user_role AS ENUM ('user', 'company_admin', 'super_admin');
CREATE TYPE company_status AS ENUM ('pending', 'approved', 'suspended');
CREATE TYPE contract_status AS ENUM ('Draft', 'Pending Review', 'Needs Changes', 'Approved', 'Rejected', 'Archived');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- ==========================================
-- 3. HELPER FUNCTIONS
-- ==========================================
-- Function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';



-- ==========================================
-- 4. TABLES DEFINITIONS
-- ==========================================

-- Companies Table (Created first so Profiles can reference it)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    company_email TEXT,
    company_logo TEXT,
    website TEXT,
    industry TEXT,
    description TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    address TEXT,
    status company_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (Extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    country TEXT,
    state TEXT,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4.5 HELPER FUNCTIONS (Dependent on profiles)
-- ==========================================
-- Functions to simplify RLS policies
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Company Admins Mapping
CREATE TABLE company_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    designation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- Contract Categories
CREATE TABLE contract_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Categories
INSERT INTO contract_categories (name) VALUES 
('Employment'), ('Internship'), ('NDA'), ('Freelancing'), 
('Software Development'), ('Vendor Agreement'), ('Rental Agreement'), 
('Partnership'), ('Consultancy'), ('Custom')
ON CONFLICT (name) DO NOTHING;

-- Contract Templates
CREATE TABLE contract_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES contract_categories(id) ON DELETE SET NULL,
    template_name TEXT NOT NULL,
    template_content TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Generated Contracts
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    template_id UUID REFERENCES contract_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    purpose TEXT,
    generated_content TEXT NOT NULL,
    ai_summary TEXT,
    risk_score NUMERIC(5,2),
    status contract_status DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approval Workflow
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    assigned_admin UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status approval_status DEFAULT 'pending',
    review_comments TEXT,
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Digital Signatures
CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    signed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    signature_image TEXT, -- URL to Supabase Storage
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    signature_type TEXT -- 'draw', 'type', 'upload'
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    notification_type TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Chat History
CREATE TABLE ai_chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'user' or 'ai'
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uploaded Documents
CREATE TABLE uploaded_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_url TEXT NOT NULL, -- URL to Supabase Storage
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contract Timeline (Events)
CREATE TABLE contract_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'Created', 'Submitted', 'Approved', 'Rejected', 'Signed', 'Expired', 'Renewed'
    event_date TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Contract Versions (Comparison)
CREATE TABLE contract_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    module TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. TIMESTAMPS TRIGGERS
-- ==========================================
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contract_templates_updated_at BEFORE UPDATE ON contract_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 6. INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_profiles_company_id ON profiles(company_id);
CREATE INDEX idx_contracts_user_id ON contracts(user_id);
CREATE INDEX idx_contracts_company_id ON contracts(company_id);
CREATE INDEX idx_approval_requests_contract_id ON approval_requests(contract_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_contract_events_contract_id ON contract_events(contract_id);

-- ==========================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Dynamic Role Policies

-- Super Admins can do everything
DO $$ 
DECLARE 
    t_name text;
BEGIN 
    FOR t_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE format('
            CREATE POLICY super_admin_all ON %I 
            FOR ALL USING (get_user_role() = ''super_admin'');
        ', t_name);
    END LOOP;
END $$;

-- PROFILES
CREATE POLICY self_read_profile ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY self_update_profile ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY company_admin_read_profile ON profiles FOR SELECT USING (company_id = get_user_company_id() AND get_user_role() = 'company_admin');

-- COMPANIES
CREATE POLICY read_own_company ON companies FOR SELECT USING (id = get_user_company_id());
CREATE POLICY admin_update_company ON companies FOR UPDATE USING (id = get_user_company_id() AND get_user_role() = 'company_admin');

-- CONTRACT CATEGORIES
CREATE POLICY public_read_categories ON contract_categories FOR SELECT USING (true);

-- CONTRACT TEMPLATES
CREATE POLICY read_company_templates ON contract_templates FOR SELECT USING (company_id = get_user_company_id());
CREATE POLICY admin_all_templates ON contract_templates FOR ALL USING (company_id = get_user_company_id() AND get_user_role() = 'company_admin');

-- CONTRACTS
CREATE POLICY self_all_contracts ON contracts FOR ALL USING (user_id = auth.uid());
CREATE POLICY admin_all_contracts ON contracts FOR ALL USING (company_id = get_user_company_id() AND get_user_role() = 'company_admin');

-- APPROVAL REQUESTS
CREATE POLICY self_read_approvals ON approval_requests FOR SELECT USING (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));
CREATE POLICY admin_all_approvals ON approval_requests FOR ALL USING (company_id = get_user_company_id() AND get_user_role() = 'company_admin');

-- SIGNATURES, NOTIFICATIONS, CHAT, DOCUMENTS, EVENTS, VERSIONS
CREATE POLICY self_all_signatures ON signatures FOR ALL USING (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));
CREATE POLICY admin_all_signatures ON signatures FOR ALL USING (contract_id IN (SELECT id FROM contracts WHERE company_id = get_user_company_id() AND get_user_role() = 'company_admin'));

CREATE POLICY self_all_notifications ON notifications FOR ALL USING (user_id = auth.uid());

CREATE POLICY self_all_chat ON ai_chat_history FOR ALL USING (user_id = auth.uid());
CREATE POLICY admin_all_chat ON ai_chat_history FOR ALL USING (contract_id IN (SELECT id FROM contracts WHERE company_id = get_user_company_id() AND get_user_role() = 'company_admin'));

CREATE POLICY self_all_docs ON uploaded_documents FOR ALL USING (user_id = auth.uid());
CREATE POLICY admin_all_docs ON uploaded_documents FOR ALL USING (contract_id IN (SELECT id FROM contracts WHERE company_id = get_user_company_id() AND get_user_role() = 'company_admin'));

CREATE POLICY self_all_events ON contract_events FOR ALL USING (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));
CREATE POLICY admin_all_events ON contract_events FOR ALL USING (contract_id IN (SELECT id FROM contracts WHERE company_id = get_user_company_id() AND get_user_role() = 'company_admin'));

CREATE POLICY self_all_versions ON contract_versions FOR ALL USING (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));
CREATE POLICY admin_all_versions ON contract_versions FOR ALL USING (contract_id IN (SELECT id FROM contracts WHERE company_id = get_user_company_id() AND get_user_role() = 'company_admin'));

-- ==========================================
-- 8. DASHBOARD ANALYTICS VIEWS
-- ==========================================
CREATE OR REPLACE VIEW dashboard_analytics AS
SELECT 
    c.company_id,
    COUNT(c.id) AS total_contracts_created,
    COUNT(CASE WHEN c.status = 'Approved' THEN 1 END) AS total_contracts_approved,
    COUNT(CASE WHEN c.status = 'Rejected' THEN 1 END) AS total_contracts_rejected,
    COUNT(CASE WHEN c.status = 'Pending Review' THEN 1 END) AS pending_reviews,
    ROUND(AVG(c.risk_score), 2) AS average_risk_score
FROM contracts c
GROUP BY c.company_id;

-- ==========================================
-- 9. SUPABASE STORAGE BUCKETS
-- ==========================================
-- Note: Must be run with elevated privileges or directly via dashboard if using REST
INSERT INTO storage.buckets (id, name, public) VALUES 
('company-logos', 'company-logos', true),
('contract-templates', 'contract-templates', false),
('generated-contracts', 'generated-contracts', false),
('uploaded-documents', 'uploaded-documents', false),
('digital-signatures', 'digital-signatures', false),
('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Open read access to public buckets
CREATE POLICY "Public avatars access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public logos access" ON storage.objects FOR SELECT USING (bucket_id = 'company-logos');
