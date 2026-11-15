-- System Design AI Initial Schema Migration
-- PostgreSQL 16+ compatible with vector search extension

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    avatar_url VARCHAR(512),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 3. User Roles Join Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Seed Initial Default Roles
INSERT INTO roles (name, description) VALUES
('ROLE_USER', 'Standard User with access to learning, simulators and basic interviews'),
('ROLE_PRO', 'Pro Tier with unlimited AI interviews, deep architecture reviews and custom roadmaps'),
('ROLE_ADMIN', 'Platform Administrator with system monitoring, user management and token analytics')
ON CONFLICT (name) DO NOTHING;

-- 4. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    target_role VARCHAR(100) DEFAULT 'Senior Software Engineer',
    experience_years INT DEFAULT 3,
    target_companies TEXT[] DEFAULT ARRAY['Google', 'Amazon', 'Meta', 'Netflix', 'Uber'],
    preferred_level VARCHAR(50) DEFAULT 'INTERMEDIATE',
    interview_readiness_score NUMERIC(5,2) DEFAULT 0.00,
    daily_streak INT DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- 5. Learning Modules Table
CREATE TABLE IF NOT EXISTS learning_modules (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100),
    sequence_order INT NOT NULL,
    estimated_hours INT DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Topics Table
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(100) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'INTERMEDIATE',
    sequence_order INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_topics_module_id ON topics(module_id);

-- 7. Subtopics Table
CREATE TABLE IF NOT EXISTS subtopics (
    id VARCHAR(120) PRIMARY KEY,
    topic_id VARCHAR(100) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sequence_order INT NOT NULL
);

-- 8. Learning Content Table
CREATE TABLE IF NOT EXISTS learning_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id VARCHAR(100) NOT NULL UNIQUE REFERENCES topics(id) ON DELETE CASCADE,
    beginner_explanation TEXT NOT NULL,
    deep_technical_explanation TEXT NOT NULL,
    architecture_diagram_mermaid TEXT,
    advantages JSONB DEFAULT '[]'::jsonb,
    disadvantages JSONB DEFAULT '[]'::jsonb,
    real_world_use_cases JSONB DEFAULT '[]'::jsonb,
    interview_questions JSONB DEFAULT '[]'::jsonb,
    practical_exercises JSONB DEFAULT '[]'::jsonb,
    embedding vector(768),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Learning Progress Table
CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(100) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    time_spent_seconds INT DEFAULT 0,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);

-- 10. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- TOPIC, HLD_PROBLEM, LLD_PROBLEM, QUESTION
    item_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, item_type, item_id)
);

-- 11. Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. HLD Problems Table
CREATE TABLE IF NOT EXISTS hld_problems (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    functional_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    non_functional_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    capacity_estimation JSONB NOT NULL DEFAULT '{}'::jsonb,
    api_design JSONB NOT NULL DEFAULT '[]'::jsonb,
    database_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    architecture_diagram_mermaid TEXT NOT NULL,
    deep_dive_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    trade_offs JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. LLD Problems Table
CREATE TABLE IF NOT EXISTS lld_problems (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    problem_statement TEXT NOT NULL,
    solid_principles_applied JSONB NOT NULL DEFAULT '[]'::jsonb,
    design_patterns_used JSONB NOT NULL DEFAULT '[]'::jsonb,
    class_diagram_mermaid TEXT NOT NULL,
    java_solution_code TEXT NOT NULL,
    unit_tests_code TEXT NOT NULL,
    extensibility_notes TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. Question Bank Table
CREATE TABLE IF NOT EXISTS question_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    company_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_verified_public BOOLEAN DEFAULT TRUE,
    question_text TEXT NOT NULL,
    model_answer TEXT NOT NULL,
    key_points JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    target_level VARCHAR(50) NOT NULL,
    interviewer_persona VARCHAR(50) NOT NULL DEFAULT 'STAFF_ENGINEER',
    problem_title VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS',
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    duration_seconds INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON interview_sessions(user_id);

-- 16. Interview Questions & Answers Table
CREATE TABLE IF NOT EXISTS interview_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) NOT NULL, -- INTERVIEWER, CANDIDATE
    step_stage VARCHAR(50) NOT NULL,  -- REQUIREMENTS, ESTIMATION, API_DESIGN, DB_DESIGN, HIGH_LEVEL_ARCH, DEEP_DIVE, TRADE_OFFS
    content TEXT NOT NULL,
    sequence_order INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interview_messages_session ON interview_messages(session_id);

-- 17. Interview Evaluations Table
CREATE TABLE IF NOT EXISTS interview_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL UNIQUE REFERENCES interview_sessions(id) ON DELETE CASCADE,
    overall_score NUMERIC(5,2) NOT NULL,
    category_scores JSONB NOT NULL, -- 15 categories with individual breakdown
    strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
    weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
    missing_concepts JSONB NOT NULL DEFAULT '[]'::jsonb,
    incorrect_assumptions JSONB NOT NULL DEFAULT '[]'::jsonb,
    suggested_improvements JSONB NOT NULL DEFAULT '[]'::jsonb,
    ideal_answer_outline TEXT NOT NULL,
    recommended_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 18. Architecture Diagrams Table
CREATE TABLE IF NOT EXISTS architecture_diagrams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    canvas_data JSONB NOT NULL,
    ai_review JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_architecture_diagrams_user ON architecture_diagrams(user_id);

-- 19. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'FREE', -- FREE, PRO, ENTERPRISE
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    valid_until TIMESTAMPTZ,
    daily_ai_token_quota INT NOT NULL DEFAULT 50000,
    daily_interview_quota INT NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 20. AI Usage Logs Table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feature VARCHAR(50) NOT NULL, -- INTERVIEW, ARCHITECTURE_REVIEW, RAG_QUERY, EVALUATION
    model_name VARCHAR(100) NOT NULL,
    prompt_tokens INT NOT NULL DEFAULT 0,
    completion_tokens INT NOT NULL DEFAULT 0,
    total_tokens INT NOT NULL DEFAULT 0,
    latency_ms INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON ai_usage_logs(user_id);
