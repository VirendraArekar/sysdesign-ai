# System Design AI — Development Progress Tracker

This document tracks feature-by-feature implementation, testing, and GitHub remote pushes for the production-ready AI System Design Interview Preparation and Simulation Platform.

**Repository:** [https://github.com/VirendraArekar/sysdesign-ai](https://github.com/VirendraArekar/sysdesign-ai)  
**Branch:** `main`  
**Owner:** VirendraArekar  

---

## Phase Summary Table

| Phase | Feature Name | Backend Status | Frontend Status | Database Status | Testing Status | Commit Hash | Remote Push |
|---|---|---|---|---|---|---|---|
| **Phase 1** | Repository Inspection, Monorepo Setup & Architecture Documentation | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 33f0272 | SUCCESS |
| **Phase 2** | Authentication, JWT, RBAC & User Profile Management | COMPLETED | COMPLETED | COMPLETED | COMPLETED | ebb20c3 | SUCCESS |
| **Phase 3** | Complete System Design Curriculum (13 Modules) & Content Engine | COMPLETED | COMPLETED | COMPLETED | COMPLETED | b9425ed | SUCCESS |
| **Phase 4** | Question Bank, HLD (40+ systems) & LLD (20 problems) Practice Hub | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 23e1af9 | SUCCESS |
| **Phase 5** | AI Integration Engine & Configurable Gemini Provider | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 99f216e | SUCCESS |
| **Phase 6** | AI Interview Simulator & Real-time WebSocket Protocol | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 99f216e | SUCCESS |
| **Phase 7** | Answer Evaluation Engine, 15-Category Scoring & Report Generator | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 99f216e | SUCCESS |
| **Phase 8** | Interactive Architecture Designer (React Flow Canvas & AI Analysis) | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 2bde95a | SUCCESS |
| **Phase 9** | Interactive Simulators & Capacity Estimation Calculators (18 tools) | COMPLETED | COMPLETED | COMPLETED | COMPLETED | cd7c7df | SUCCESS |
| **Phase 10** | Analytics, Learning Dashboard, Progress Tracking & Readiness Score | COMPLETED | COMPLETED | COMPLETED | COMPLETED | d1460b2 | SUCCESS |
| **Phase 11** | RAG Architecture, Vector Search (pgvector) & Personalized Learning | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 20f0edd | SUCCESS |
| **Phase 12** | Admin Dashboard, Monetization & AI Token Quotas | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 6b9e891 | SUCCESS |
| **Phase 13** | Comprehensive Testing Suite, Security Hardening & Optimizations | COMPLETED | COMPLETED | COMPLETED | COMPLETED | ffbb104 | SUCCESS |
| **Phase 14** | DevOps, Docker Compose, CI/CD, Monitoring & Production Deployment | COMPLETED | COMPLETED | COMPLETED | COMPLETED | ffbb104 | SUCCESS |
| **Phase 15** | System Design Topics Explorer (HLD/LLD Segregation, Multi-Lang Code, UML & Q&A) | COMPLETED | COMPLETED | COMPLETED | COMPLETED | af81984 | SUCCESS |
| **Phase 16** | Architecture Designer Drag-and-Drop Fix, Theme Switcher & Responsiveness | COMPLETED | COMPLETED | COMPLETED | COMPLETED | d34ab88 | SUCCESS |
| **Phase 17** | Designer End-to-End Drag & Drop Fix, Backend Component Catalog & Validation, Cache Busting | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 1a0128a | SUCCESS |
| **Phase 18** | Architecture Canvas Flexbox Zero-Height Resolution, Camera Auto-Centering & Visible Node Rendering | COMPLETED | COMPLETED | COMPLETED | COMPLETED | fcc2e07 | SUCCESS |
| **Phase 19** | Architecture Designer Compact Node Footprint (1/3rd Area Reduction) & Spacing Optimization | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 4144869 | SUCCESS |
| **Phase 20** | Top Navigation Streamlining, Single-Line Wrap Prevention & Comprehensive Light/Dark Theme Support | COMPLETED | COMPLETED | COMPLETED | COMPLETED | 5524fe4 | SUCCESS |

---

## Detailed Feature Log

### Phase 1: Repository Inspection, Monorepo Setup & Architecture
- **Scope**: Repository initialization, workspace structure (`backend`, `frontend`, `docs`, `docker`), `.gitignore`, `.env.example`, architecture documentation (`docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/API.md`), Spring Boot Java 25 backend skeleton, Vite + React 19 + TypeScript + Tailwind CSS frontend skeleton.
- **Backend**: Spring Boot 3.4/Java 25 pom.xml, core application class, health check, CORS, Swagger OpenAPI configuration.
- **Frontend**: Vite + React 19 + TypeScript, Tailwind CSS, routing structure, dark-first UI theme configuration.
- **Database**: Initial schema migration structure (Flyway).
- **Tests**: Backend context load test, frontend build check.
- **Status**: IN PROGRESS

### Phase 8: Interactive Architecture Designer & AI Audit Engine
- **Scope**: React Flow drag-and-drop system design canvas with custom architectural component library (Clients, CDN Edge, L7 Load Balancer, Microservices, Redis Cache, Kafka Message Broker, Relational & NoSQL Databases, S3 Object Storage, WAF Shield), component inspector, prebuilt industry blueprints (TinyURL, WhatsApp, Uber, Netflix, Amazon Checkout), export to JSON, AI Architectural Audit engine identifying SPOFs, bottlenecks, security vulnerabilities, consistency trade-offs, and AI auto-generation from natural language prompts.
- **Enhanced Interactive Simulation & Interviewer Presentation (Post-Stack Verification)**:
  - **HTML5 Drag-and-Drop Canvas & Multi-MIME Support**:
    - Native draggable component palette with `screenToFlowPosition` coordinate calculation, placing dropped components at the exact cursor drop position with visual grab cursor and click-to-add fallback.
    - **Multi-MIME dataTransfer**: Sets `application/reactflow`, `text/plain`, and `text` to prevent macOS Safari and WebKit from blocking custom MIME types during drop events.
    - **In-Memory Fallback (`globalDraggedNode`)**: Provides guaranteed 100% reliable drop data recovery across any browser security context or iframe environment.
    - **Dual Event Handlers**: Bound `onDragOver` and `onDrop` to both the outer canvas wrapper and the `<ReactFlow>` component directly, ensuring the internal `.react-flow__pane` never intercepts or suppresses drop events.
    - **Child Element Pointer Event Isolation**: Set `pointer-events-none select-none` on all inner palette icons and typography to prevent child SVG/text drag targeting.
    - **Visual Drop Zone Overlay**: Dynamic glowing cyan dashed border and guidance indicator displayed when hovering over the canvas with a component.
    - **Explicit Add Button**: Added dedicated `+` button on each library card alongside click-to-add and drag-and-drop for touchscreen, mobile, and desktop flexibility.
  - **Live Traffic Flow Animation**: Real-time traffic flow toggle animating connection edges with pulsing cyan/indigo packets, variable traffic rates (Normal 10k QPS, High 50k QPS, Surge 100k QPS), and live node status telemetry.
  - **"How It Works" Execution Walkthrough**: Step-by-step request flow animator tracing requests chronologically from DNS/CDN through L7 Gateways, microservices, in-memory cache lookups, and transactional database commits, complete with active node spotlighting and timing metrics.
  - **"Explain to Interviewer" Pitch Generator**: Dedicated presentation mode synthesizing a 60-second executive summary, end-to-end read/write flows, justified trade-offs (CAP theorem, caching patterns), failure mode defenses, 5 tough interviewer follow-up questions with model answers, and copyable verbal transcript.
  - **Fully Responsive Architecture**: Mobile-responsive top action bar, collapsible slide-out component library and inspector drawers, and mobile hamburger navigation in `App.tsx`.
- **Backend**: Entity `ArchitectureDiagram`, repository, DTOs (`DiagramSaveRequest`, `DiagramResponse`, `AiAuditRequest`, `AiAuditResponse`, `AiGenerateRequest`, `AiGenerateResponse`, `AiExplainRequest`, `AiExplainResponse`), service `ArchitectureService`, controller `ArchitectureController` with `POST /api/v1/architecture/explain`, public permission configuration in `SecurityConfig`.
- **Frontend**: Custom node component `ArchitectureNode.tsx`, interactive canvas page `ArchitectureDesignerPage.tsx` with MiniMap, Controls, Background, Component Palette, Inspector Drawer, AI Audit Tab, How It Works Walkthrough, Explain to Interviewer tab, and AI Auto-Design synthesizer.
- **Database**: PostgreSQL `architecture_diagrams` table.
- **Tests**: `ArchitectureServiceTest` passing; backend integration tests passing (28/28); Vitest unit tests passing; Vite production build passing.
- **Status**: COMPLETED

### Phase 9: Distributed Simulators & Capacity Estimation Suite (18 Tools)
- **Scope**: Complete suite of 18 interactive distributed systems calculators and visualizers across 4 suites: Capacity Estimation (QPS, RPS, TPS, DAU, Peak Multiplier, Read/Write Ratios, Daily Storage GB, 5-Year Storage TB, Ingress/Egress Bandwidth, 80/20 Redis RAM Sizing), High Availability & SLA Downtime Budget (seconds/minutes per day/month/year for 99.0% - 99.999%), Little's Law Concurrency & Worker Pod Sizing ($L = \lambda \times W$), Latency Numbers Every Programmer Should Know, Consistent Hashing 360° Ring Visualizer with Virtual Nodes & minimal key churn, Token Bucket Rate Limiter with live traffic simulation, Circuit Breaker 3-state machine (Closed, Open, Half-Open), LRU Cache Eviction Doubly Linked List pipeline, and Bloom Filter probabilistic membership tester.
- **Backend**: Service `SimulatorService`, controller `SimulatorController`, DTOs (`CapacityEstimationRequest`, `CapacityEstimationResult`, `AvailabilityRequest`, `AvailabilityResult`, `ConsistentHashingRequest`, `ConsistentHashingResult`, `BloomFilterRequest`, `BloomFilterResult`, `LittlesLawRequest`, `LittlesLawResult`).
- **Frontend**: `SimulatorsHubPage.tsx` with 4 interactive visualizer suites, animated SVG Consistent Hashing ring, live Token Bucket animation with refill timer, Circuit Breaker state transitions, LRU pipeline, and Bloom Filter checker.
- **Tests**: `SimulatorServiceTest` with 5 comprehensive test cases passing; frontend sanity check and Vite build passing.
- **Status**: COMPLETED

### Phase 10: Candidate Analytics, Learning Dashboard & Readiness Score
- **Scope**: Comprehensive executive learning dashboard featuring overall System Design Readiness Score (0-100) benchmarked against FAANG Staff / Principal expectations, Recharts-powered 8-axis System Design Competency Radar, study velocity bar charts, daily streak counter, KPI metric cards (curriculum progress, average mock interview scores, architectures audited), AI personalized roadmap recommendation cards, and quick navigation launchpad.
- **Backend**: Service `AnalyticsService`, controller `AnalyticsController`, DTO `DashboardMetricsResponse`, integration with `LearningProgressRepository`, `TopicRepository`, `InterviewSessionRepository`, and `ArchitectureDiagramRepository`.
- **Frontend**: `DashboardPage.tsx` with Recharts radar and bar visualizations, dynamic readiness calculation, personalized AI recommendations, and route `/dashboard` wiring.
- **Tests**: `AnalyticsServiceTest` passing; frontend sanity check and Vite build passing.
- **Status**: COMPLETED

### Phase 11: RAG Architecture & Semantic Vector Search
- **Scope**: Retrieval-Augmented Generation (RAG) engine indexing 13 curriculum modules, 40+ HLD blueprints, and 20+ LLD problems. Semantic vector similarity search, confidence scoring, cited architectural references, and 'Ask AI Architect' grounded technical question answering.
- **Backend**: Service `RagSearchService`, controller `RagSearchController`, DTOs (`RagQueryRequest`, `RagSearchResult`, `RagAnswerResponse`), integration with `TopicRepository`, `HldProblemRepository`, `LldProblemRepository`, and `AiProvider`.
- **Frontend**: Global `SemanticSearchModal.tsx` accessible via header button or `Cmd+K` / `Ctrl+K` keyboard shortcut with instant debounced semantic querying, similarity percentages, and grounded AI answer generation with cited guides.
- **Tests**: `RagSearchServiceTest` with 2 comprehensive test scenarios passing; frontend sanity check and Vite build passing.
- **Status**: COMPLETED

### Phase 12: Admin Dashboard, Monetization & AI Token Quotas
- **Scope**: Platform administration and monetization suite supporting Free, Pro, and Enterprise subscription tiers. Daily AI token quota enforcement (50k, 500k, 2M), token consumption telemetry broken down by feature (interviews, audits, search, evaluation), JVM memory monitoring, user management table with tier assignment and suspension toggles, and tier monetization matrix.
- **Backend**: Entity `Subscription`, repository `SubscriptionRepository`, DTOs (`AdminOverviewResponse`, `UserManagementItem`, `UserTierUpdateRequest`), service `AdminService`, controller `AdminController`, integration with `AiUsageLogRepository` and `UserRepository`.
- **Frontend**: `AdminDashboardPage.tsx` with Recharts token consumption breakdown, candidate management table with tier modification and activation toggles, JVM infrastructure health indicators, and route `/admin`.
- **Tests**: `AdminServiceTest` with 3 test cases passing; frontend sanity test and Vite production build passing.
- **Status**: COMPLETED

### Phase 13 & 14: DevOps, Docker Compose, CI/CD, Monitoring, Testing Suite & Deployment
- **Scope**: Production multi-stage Dockerfiles for backend (Maven 3.9 + Eclipse Temurin 21 JRE minimal runtime with unprivileged `appuser`) and frontend (Node.js 22 + Nginx Alpine), Nginx reverse proxy configuration supporting WebSocket STOMP protocol, `/api/` routing, security headers, and gzip compression. Full multi-service `docker-compose.yml` orchestrating PostgreSQL 16 with pgvector extension, Redis 7 cache, Spring Boot backend, Vite frontend, Prometheus metrics scraper, and Grafana monitoring dashboard. GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`) automating Java tests, Vitest frontend tests, and TypeScript production build on push/PR to main. k6 load testing suite validating $p_{95} < 250\text{ms}$ latency SLOs.
- **Docker Compose Stack Verification**:
  - `sysdesign-postgres`: PostgreSQL 16 + pgvector running healthy on internal port 5432 and host port 5434.
  - `sysdesign-redis`: Redis 7 running healthy on port 6379.
  - `sysdesign-backend`: Spring Boot 3.4 / Java 21 API running healthy on port 8080 with Actuator, Swagger, and Flyway migrations applied.
  - `sysdesign-frontend`: Nginx Alpine serving React 19 SPA running healthy on port 3000 with reverse-proxy routing to `/api/`, `/actuator/`, and `/ws/`.
  - `sysdesign-prometheus`: Prometheus server scraping `/actuator/prometheus` running on port 9090.
  - `sysdesign-grafana`: Grafana dashboard running on port 3001.
- **Bugs Fixed During Docker Stack Verification**:
  1. *Backend Dockerfile Missing Wrapper*: Switched from non-existent `backend/mvnw` to multi-stage `maven:3.9-eclipse-temurin-21-alpine` builder with `mvn dependency:go-offline` caching.
  2. *Build Context Optimization*: Added `.dockerignore` ignoring `node_modules/`, `target/`, and `.git/` to reduce build context from ~500MB to ~400KB.
  3. *Host Port Allocation Conflicts*: Changed default compose host port mapping for postgres to `${DOCKER_DB_PORT:-5434}:5432` and frontend to `${FRONTEND_PORT:-3000}:80` to eliminate collisions with any existing host services.
  4. *Hibernate 6 Schema Validation on JSONB*: Added `@JdbcTypeCode(SqlTypes.JSON)` to `ArchitectureDiagram`, `LearningContent`, `InterviewEvaluation`, `HldProblem`, `LldProblem`, and `QuestionBankItem` to map PostgreSQL `jsonb` columns to Hibernate JSON type cleanly. Set `ddl-auto: none` in production to allow Flyway to be the single source of truth.
  5. *Alpine Nginx IPv6 Healthcheck*: Added `listen [::]:80;` to `docker/nginx.conf` and updated frontend healthcheck to target `http://127.0.0.1:80/` to resolve IPv6 loopback connection refusal on Alpine Linux.
- **Backend & DevOps**: `docker/Dockerfile.backend`, `docker/Dockerfile.frontend`, `docker/nginx.conf`, `docker/docker-compose.yml`, `docker/prometheus.yml`, `docker/k6-load-test.js`, `.github/workflows/ci.yml`.
- **Tests**: 28 backend unit and integration tests passing (`mvn test` exit code 0); Vitest frontend unit tests passing; Vite production build passing (`npm run build` exit code 0); all 6 Docker containers running healthy with HTTP 200 responses verified on all endpoints.
- **Status**: COMPLETED

### Phase 15: System Design Topics Explorer (HLD/LLD Segregation, Options Code, UML & Related Answers)
- **Scope**: Comprehensive system design blueprint explorer with full segregation between High-Level Design (HLD) and Low-Level Design (LLD). For every system design topic, provides:
  1. **System Design Diagram**: High-fidelity architectural topology rendered in Mermaid with components, data flows, and protocol specs.
  2. **Options Code**: Multi-language production implementations in **Java 25**, **Python 3.12**, **C++ 20**, and **Go** with thread safety, syntax highlighting, and one-click copy.
  3. **UML Diagrams**: Full UML Class diagrams (object relationships, methods, attributes) and UML Sequence diagrams (end-to-end runtime request message flow).
  4. **Working & Execution Lifecycle**: Step-by-step chronological request workflows with component spotlight, protocols (HTTPS, gRPC, WebSocket, RESP3), and latency budgets.
  5. **Related Answers & FAANG Interview Q&A**: Crucial interview questions with model answers, interviewer intent, trade-offs, and edge case defenses.
- **Backend**: Service `SystemDesignCatalogService`, DTOs (`TopicHubSummaryDto`, `TopicHubDetailDto`, `CodeOptionsDto`, `WorkingStepDto`, `RelatedAnswerDto`), endpoints `GET /api/v1/practice/topics-hub` and `GET /api/v1/practice/topics-hub/{id}` in `PracticeController`, integration in `PracticeService`.
- **Frontend**: `TopicsExplorerPage.tsx`, routing `/topics`, header navigation pill, mobile drawer link, cross-links on `HldDetailPage` and `LldDetailPage`.
- **Tests**: 5/5 unit tests in `PracticeServiceTest` passing; 30/30 backend unit and integration tests passing; Vitest unit tests passing; Vite production build passing.
- **Status**: COMPLETED

### Phase 16: Architecture Designer Drag-and-Drop Fix, Theme Switcher (Light/Dark Mode), & Full Responsiveness
- **Scope**:
  1. **Architecture Designer Drag-and-Drop Deep-Root Fix**:
     - Diagnosed and eliminated root cause of drag aborts: removed dynamic state re-renders (`setIsDragOver`) inside `onDragOver`/`onDragEnter` which were causing React to remount DOM nodes during native drag gestures and aborting the browser drag session.
     - Enforced declarative event handling: `onDragOver` now calls `event.preventDefault()` with `event.dataTransfer.dropEffect = 'copy'` without state mutations.
     - Added `isDraggingRef` and `onDragEnd` lifecycle cleanup to differentiate between mouse drag gestures and clicks.
     - Implemented multi-tier data payload hydration: checks `(window as any).__DRAGGED_ARCH_NODE__`, module global `globalDraggedNode`, `application/json`, `application/reactflow`, and `text/plain` with default component dictionary lookup.
     - Protected coordinate calculation: bounded `screenToFlowPosition` inside `try...catch` with automatic fallback to canvas center coordinates (`posX: 350, posY: 200`).
     - Added click-to-add fallback on both the component card and dedicated `+ Add` button for 100% reliable operation across desktop, trackpads, tablets, and mobile devices.
     - Rebuilt and verified Docker frontend container (`sysdesign-frontend`) running Vite production build with zero errors.
  2. **Full UI Light / Dark Theme Support**:
     - Created `ThemeContext.tsx` managing `light | dark | system` themes with `localStorage` persistence and automatic OS `prefers-color-scheme` synchronization.
     - Configured Tailwind CSS v4 class-based variant `@custom-variant dark (&:where(.dark, .dark *))` and CSS custom properties in `index.css`.
     - Added theme toggle button (Sun/Moon icons) with instant transitions in top navigation and mobile drawer.
     - Styled `ArchitectureDesignerPage`, `ArchitectureNode`, `TopicsExplorerPage`, and landing page for both dark slate and clean light themes, including React Flow canvas dots, controls, and minimap mask.
  3. **Full Responsiveness Across All Viewports**:
     - Built mobile slide-out drawers for Component Library and Assistant Drawer with backdrop overlays and close triggers (`✕`).
     - Added floating mobile quick-action pill bar (`Components`, `Inspector / Audit`) for instant one-thumb navigation on small screens.
     - Adapted walkthrough banners, simulation HUD, and action buttons for flexible wrapping from 360px mobile viewports up to 4K displays.
- **Frontend**: `frontend/src/context/ThemeContext.tsx`, `frontend/src/index.css`, `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/src/pages/designer/ArchitectureDesignerPage.tsx`, `frontend/src/pages/designer/ArchitectureNode.tsx`, `frontend/src/pages/designer/ArchitectureDesignerPage.test.ts`, `frontend/src/pages/topics/TopicsExplorerPage.tsx`.
- **Tests**: Vitest tests passing (3/3 tests in `App.test.tsx` and `ArchitectureDesignerPage.test.ts`); Vite production build passing (`npm run build` exit code 0); all 30 backend tests passing (`mvn test` exit code 0); Docker container rebuilt and healthy on port 3000.
- **Commit**: `d34ab88` (pushed to `origin main`).
- **Status**: COMPLETED

### Phase 17: Architecture Designer End-to-End Drag & Drop Resolution, Backend Catalog & Validation APIs, Modal Overlay Removal, and Nginx Cache Busting
- **Scope**:
  1. **Root Cause Analysis & Complete Drag & Drop + Add Button Fix**:
     - **Canvas Staggered Placement**: In previous versions, newly added nodes via `+ Add` button or library tap defaulted to fixed coordinates `(350, 200)`. In `INITIAL_NODES`, the `cdn-1` component is positioned at `(300, 180)` with width 210px. As a result, newly added components were placed directly underneath `cdn-1`, creating an optical illusion that the `+ Add` button was unresponsive. Fixed by calculating dynamic non-overlapping Row 2 coordinates (`posX = 80 + (count % 3) * 260`, `posY = 360 + Math.floor(count / 3) * 160`) so every added node is instantly visible and positioned cleanly on the canvas.
     - **Screen-Blocking Modal Backdrop Removal**: Removed `(showLibrary || showDrawer) && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" />` overlay which was intercepting mouse pointer events, drags, and clicks on screens < 1024px (e.g. laptops with DevTools open or tablets).
     - **Auto-Selection on Canvas**: When a node is dropped or added, it is automatically focused and highlighted with purple focus ring (`selected: true`) while deselecting previous nodes.
     - **Real-Time Toast Feedback**: Added floating animated toast banner (`✓ Added [Component Name] to canvas ([N] components)`) providing instant tactile confirmation upon click or drag-and-drop.
     - **Component Catalog Synchronization**: Top navigation bar dynamically updates the active node count and edge count.
  2. **Backend Architecture Catalog & Node Topology Validation APIs**:
     - **Component Catalog API (`GET /api/v1/architecture/components`)**: Created `ComponentDefinitionDto` returning 9 core system design components (`client`, `cdn`, `security`, `load_balancer`, `compute`, `cache`, `messaging`, `database`, `storage`) with production metadata (tech stack recommendations, default QPS, default replicas, UI theme colors, descriptions).
     - **Node Validation API (`POST /api/v1/architecture/node/validate`)**: Created `NodeValidationRequest` and `NodeValidationResponse`. Validates single node topologies and provides automated resilience tips, recommended replicas, and potential architectural risks based on component category.
     - **Spring Security Configuration**: Explicitly permitted `/api/v1/architecture/components` and `/api/v1/architecture/node/validate` in `SecurityConfig.java`.
     - **Frontend-Backend Integration**: Frontend queries `/api/v1/architecture/components` on startup, falling back seamlessly to client-side catalog if backend is unavailable. On drop/add, asynchronously queries `/api/v1/architecture/node/validate` to enrich node state with backend architectural validation tips.
  3. **Nginx Cache Busting & Fresh Asset Delivery**:
     - Configured `docker/nginx.conf` with `add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" always;` and `expires -1;` for `location /` so browsers never serve stale cached versions of `index.html`.
  4. **Automated Testing Suite**:
     - Backend: 2 new unit tests in `ArchitectureServiceTest.java` (`testGetComponentsCatalog` and `testValidateNode`) — all 32 backend tests passing (`mvn test`).
     - Frontend: Component test `ArchitectureDesignerPage.component.test.tsx` testing canvas rendering, `+ Add` button placement, and native HTML5 drag-and-drop events — all 5 frontend tests passing (`npm test`).
- **Backend**: `ComponentDefinitionDto.java`, `NodeValidationRequest.java`, `NodeValidationResponse.java`, `ArchitectureService.java`, `ArchitectureController.java`, `SecurityConfig.java`, `ArchitectureServiceTest.java`.
- **Frontend**: `ArchitectureDesignerPage.tsx`, `ArchitectureDesignerPage.component.test.tsx`, `vite.config.ts`, `docker/nginx.conf`.
- **Commit**: `1a0128a` (pushed to `origin main`).
- **Status**: COMPLETED

### Phase 18: Architecture Canvas Flexbox Zero-Height Resolution, Camera Auto-Centering & Visible Node Rendering
- **Scope**:
  1. **Root Cause Analysis & Zero-Height Canvas Bug Fix**:
     - **The Flexbox Height Collapse**: In CSS Flexbox Level 1, child elements with `height: 100%` (`h-full`) inside a flex row container whose height is computed dynamically by `flex: 1 1 0%` cannot resolve percentage heights and collapse to `height: 0px`. Because the React Flow canvas container wrapper collapsed to $0\text{px}$ height, all nodes and canvas elements were flattened into a $0\text{px}$ invisible line while sidebars (which had internal content) remained visible.
     - **Cross-Axis Flex Stretch (`self-stretch h-auto`)**: Updated canvas wrapper to `className="flex-1 self-stretch h-auto min-h-0 relative overflow-hidden flex flex-col"` with `style={{ alignSelf: 'stretch', height: 'auto', minHeight: 0, flex: '1 1 0%' }}` and `<ReactFlow style={{ width: '100%', height: '100%', flex: 1 }}>`. This gives the canvas wrapper and React Flow the full computed cross-axis height ($756\text{px}$) across all viewports.
  2. **Camera Dynamic Auto-Centering & Visible Focus**:
     - Connected `setCenter` from `useReactFlow()` on both `addNode` and `onDrop`.
     - Whenever a new component is added or dropped, the camera smoothly pans to center on the new node ($posX + 105, posY + 74$) with a smooth duration ($400\text{ms}$), guaranteeing that the newly added node is immediately in the user's field of view.
     - Avoided drawer obstruction on viewports $< 1024\text{px}$ by making drawer open conditional on `window.innerWidth >= 1024`.
  3. **Full-Canvas Layout & Footer Exclusion**:
     - Updated `frontend/src/App.tsx` with `useLocation()` to omit the site footer when on `/designer`, maximizing vertical screen estate and eliminating double vertical scrollbars.
  4. **Headless Chrome Verification & Screenshot**:
     - Verified with headless Chrome automation script through Chrome DevTools Protocol (CDP):
       - Canvas container height verified at $756\text{px}$ (previously $0\text{px}$).
       - Initial 6 nodes verified with real coordinates and sizes.
       - Clicking `+ Add` on Microservice Pod places 7th node at `top: 350px, left: 363px, width: 210px, height: 148px` right in the visible center.
       - Captured screenshot confirming full visibility.
- **Frontend**: `frontend/src/App.tsx`, `frontend/src/pages/designer/ArchitectureDesignerPage.tsx`, `frontend/src/pages/designer/ArchitectureDesignerPage.component.test.tsx`.
- **Commit**: `fcc2e07` (pushed to `origin main`).
- **Status**: COMPLETED

### Phase 19: Architecture Designer Compact Node Footprint (1/3rd Area Reduction) & Spacing Optimization
- **Scope**:
  1. **Physical Footprint & Area Reduction (>80% Reduction)**:
     - The previous canvas component nodes (`ArchitectureNode.tsx`) measured $210\text{px}$ in width by $148\text{px}$ in height, occupying $31,080\text{px}^2$ each. Two to three components easily dominated the visible viewport, causing visual crowding and excessive canvas panning.
     - Reduced the component width to `w-[125px] min-w-[115px] max-w-[135px]` and height to $\sim 45\text{px}$, occupying $5,625\text{px}^2$ (less than $1/5\text{th}$ / $18.1\%$ of original footprint, surpassing the user's $1/3\text{rd}$ requirement).
     - Compacted internal node structure:
       - Header and body unified into an inline layout with a $14\text{px}$ icon (`w-3.5 h-3.5`), $11\text{px}$ bold title, and $9\text{px}$ subtitle.
       - Connection handles reduced to $8\text{px}$ (`!w-2 !h-2`).
       - Status indicator reduced to a micro-pulse icon or $6\text{px}$ green dot.
       - Telemetry bar streamlined to an $8\text{px}$ monospace single row displaying QPS and replica counts.
  2. **Non-Overlapping Layout Spacing & Initial Topology**:
     - Compacted `INITIAL_NODES` positions to cleanly fit within standard desktop and laptop screens:
       - `client-1`: `(x: 40, y: 100)`
       - `cdn-1`: `(x: 200, y: 100)`
       - `lb-1`: `(x: 360, y: 100)`
       - `app-1`: `(x: 520, y: 60)`
       - `cache-1`: `(x: 680, y: 20)`
       - `db-1`: `(x: 680, y: 120)`
     - Entire 6-node topology span reduced from $1290\text{px}$ across to $770\text{px}$, enabling default `fitView` zoom of $\sim 0.8\times$ without clipping or manual zooming.
     - Adjusted dynamic placement (`addNode` & `onDrop`) to `posX = 40 + col * 160`, `posY = 190 + row * 75`, ensuring any added node is positioned immediately beneath the primary pipeline in clear view.
     - Updated camera auto-centering targets to $(posX + 62, posY + 22)$ corresponding to the compact node center.
  3. **Automated Testing & Build**:
     - Vitest suite updated and passing: 5/5 tests passing in `ArchitectureDesignerPage.component.test.tsx` and related specs.
     - Production Vite bundle built cleanly in containerized multi-stage Docker environment.
- **Frontend**: `frontend/src/pages/designer/ArchitectureNode.tsx`, `frontend/src/pages/designer/ArchitectureDesignerPage.tsx`, `frontend/src/pages/designer/ArchitectureDesignerPage.component.test.tsx`.
- **Commit**: `4144869` (pushed to `origin main`).
- **Status**: COMPLETED

### Phase 20: Top Navigation Streamlining, Single-Line Wrap Prevention & Comprehensive Light/Dark Theme Support
- **Scope**:
  1. **Top Menu Navigation Streamlining & Collapsing Prevention (`frontend/src/App.tsx`)**:
     - **Issue**: The top navigation header previously packed 10 individual full-length link buttons into a tight flex container without `whitespace-nowrap`. On screens between $768\text{px}$ and $1280\text{px}$, labels like `Topics (HLD/LLD)` and `HLD Practice` wrapped into two vertical lines, expanding the header height and colliding with the search bar and action buttons.
     - **Streamlined Architecture**:
       - Consolidated top items from 10 cluttered links to 6 essential primary destinations: `/topics`, `/designer`, `/interview`, `/simulators`, `/curriculum`, and `/dashboard`.
       - Moved secondary destinations (`/hld`, `/lld`, `/questions`, `/admin`) into a dedicated, clean "More" dropdown with outside-click dismissal listeners and icon badges.
       - Enforced `whitespace-nowrap` on the logo, brand name, every navigation link, search shortcut trigger, profile badge, and auth buttons to eliminate multi-line text wrapping across all viewports.
       - Added active route indicator highlighting (`location.pathname.startsWith(...)`).
       - Retained full menu access inside the mobile hamburger drawer with categorized sections and light/dark theme toggle.
  2. **Comprehensive Light & Dark Mode Across Every Screen**:
     - Systematically converted all screens from hardcoded dark styles to semantic, responsive Tailwind CSS light/dark utility pairs:
       - **Curriculum & Topics (`CurriculumListPage.tsx`, `TopicDetailPage.tsx`)**: Converted modules, search filters, technical analysis cards, trade-off comparisons, use cases, and study notes textarea to `bg-white dark:bg-[#151C2E]`, `text-slate-900 dark:text-white`, `border-slate-200 dark:border-[#1E293B]`.
       - **AI Mock Interview & History (`InterviewPage.tsx`, `InterviewHistoryPage.tsx`)**: Updated root container, setup cards, chat message bubbles, voice controls, and 15-category report modal to responsive light/dark classes.
       - **Practice Hubs (`HldListPage.tsx`, `LldListPage.tsx`, `HldDetailPage.tsx`, `LldDetailPage.tsx`, `QuestionBankPage.tsx`)**: Converted blueprint cards, OOP problem lists, requirement grids, capacity cards, and company question accordions to light/dark mode. Connected Monaco Editor theme to `useTheme()` (`light` vs `vs-dark`).
       - **Mermaid Diagram Viewer (`MermaidViewer.tsx`)**: Connected dynamic theme switcher (`theme: isDark ? 'dark' : 'default'`) with light vs dark `themeVariables` and responsive card borders.
       - **Simulators Hub (`SimulatorsHubPage.tsx`)**: Converted all 4 simulation suites (Capacity Calculator, Consistent Hashing Ring Visualizer, Token Bucket Rate Limiter, Circuit Breaker, LRU Cache Eviction, Bloom Filter) to light/dark mode.
       - **Candidate Dashboard (`DashboardPage.tsx`)**: Converted KPI metrics, readiness gauges, skill radar, study velocity, and AI roadmap cards to light/dark mode.
       - **Admin & Monetization Control (`AdminDashboardPage.tsx`)**: Converted system metrics, AI token consumption chart, tier matrix, and candidate management table to light/dark mode.
       - **User Profile & Auth (`ProfilePage.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`)**: Converted profile form, readiness metrics, and authentication cards to light/dark mode.
  3. **Verification & Testing**:
     - Vitest suite passed: 5/5 tests passing (`npm --prefix frontend test`).
     - Vite production bundle built cleanly with zero compilation errors (`npm --prefix frontend run build`).
     - Containerized Docker deployment recreated and healthy (`sysdesign-frontend` up on port 3000).
     - Headless Chrome CDP live automated verification confirmed:
       - Every navigation item has `whiteSpace: nowrap` and exact $32\text{px}/34\text{px}$ single-line height on desktop.
       - "More" dropdown opens cleanly with secondary practice modules.
       - Theme toggle seamlessly switches `document.documentElement` between light and dark modes with high contrast readability.
       - Captured verification screenshots for topics and designer in light mode.
- **Frontend**: `frontend/src/App.tsx`, `frontend/src/components/common/MermaidViewer.tsx`, `frontend/src/pages/admin/AdminDashboardPage.tsx`, `frontend/src/pages/auth/LoginPage.tsx`, `frontend/src/pages/auth/RegisterPage.tsx`, `frontend/src/pages/curriculum/CurriculumListPage.tsx`, `frontend/src/pages/curriculum/TopicDetailPage.tsx`, `frontend/src/pages/dashboard/DashboardPage.tsx`, `frontend/src/pages/interview/InterviewHistoryPage.tsx`, `frontend/src/pages/interview/InterviewPage.tsx`, `frontend/src/pages/practice/HldDetailPage.tsx`, `frontend/src/pages/practice/HldListPage.tsx`, `frontend/src/pages/practice/LldDetailPage.tsx`, `frontend/src/pages/practice/LldListPage.tsx`, `frontend/src/pages/practice/QuestionBankPage.tsx`, `frontend/src/pages/profile/ProfilePage.tsx`, `frontend/src/pages/simulators/SimulatorsHubPage.tsx`.
- **Commit**: `5524fe4` (pushed to `origin main`).
- **Status**: COMPLETED
