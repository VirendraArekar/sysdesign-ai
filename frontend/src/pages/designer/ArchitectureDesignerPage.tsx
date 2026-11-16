import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  MarkerType,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ArchitectureNode, { ArchitectureNodeData } from './ArchitectureNode';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { 
  Bot, 
  Sparkles, 
  Save, 
  Download, 
  Trash2, 
  Plus, 
  Layers, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  FileCode,
  Share2,
  RefreshCw,
  Search,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Database,
  Radio,
  Network,
  Globe,
  Smartphone,
  HardDrive,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  GripVertical,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ExternalLink,
  X
} from 'lucide-react';

const API_BASE = '/api/v1';

// Global reference for dragged node data - guarantees 100% reliable drag-and-drop across Safari/WebKit, Chrome, Firefox
let globalDraggedNode: { category: ArchitectureNodeData['category']; defaultLabel: string; defaultTech: string } | null = null;

const nodeTypes = {
  archNode: ArchitectureNode
};

export const COMPONENT_DEFINITIONS: Record<string, { label: string; tech: string; category: ArchitectureNodeData['category'] }> = {
  client: { label: 'Web & Mobile Apps', tech: 'React / Next.js / Swift', category: 'client' },
  cdn: { label: 'Edge CDN / Anycast', tech: 'Cloudflare / CloudFront', category: 'cdn' },
  security: { label: 'Web App Firewall', tech: 'Cloudflare WAF / AWS Shield', category: 'security' },
  load_balancer: { label: 'L7 Load Balancer', tech: 'Envoy / NGINX / ALB', category: 'load_balancer' },
  compute: { label: 'Microservice Pod', tech: 'Spring Boot 3.4 / Java 21', category: 'compute' },
  cache: { label: 'Redis Distributed Cache', tech: 'Redis 7.2 Cluster', category: 'cache' },
  messaging: { label: 'Kafka Event Bus', tech: 'Apache Kafka 3.7', category: 'messaging' },
  database: { label: 'Relational Database', tech: 'PostgreSQL 16 Multi-AZ', category: 'database' },
  storage: { label: 'Object Storage', tech: 'AWS S3 Multi-Region', category: 'storage' },
};

const COMPONENT_LIBRARY_ITEMS = [
  { category: 'client', label: 'Web & Mobile Apps', tech: 'React / Next.js / Swift', sub: 'Clients', icon: Smartphone, color: '#06B6D4' },
  { category: 'cdn', label: 'Edge CDN / Anycast', tech: 'Cloudflare / CloudFront', sub: 'CDN & Edge', icon: Globe, color: '#6366F1' },
  { category: 'security', label: 'Web App Firewall', tech: 'Cloudflare WAF / AWS Shield', sub: 'WAF & Anti-DDoS', icon: ShieldAlert, color: '#EF4444' },
  { category: 'load_balancer', label: 'L7 Load Balancer', tech: 'Envoy / NGINX / ALB', sub: 'Load Balancer', icon: Network, color: '#8B5CF6' },
  { category: 'compute', label: 'Microservice Pod', tech: 'Spring Boot 3.4 / Java 21', sub: 'App Service', icon: Cpu, color: '#3B82F6' },
  { category: 'cache', label: 'Redis Distributed Cache', tech: 'Redis 7.2 Cluster', sub: 'In-Memory Cache', icon: Layers, color: '#10B981' },
  { category: 'messaging', label: 'Kafka Event Bus', tech: 'Apache Kafka 3.7', sub: 'Message Queue', icon: Radio, color: '#F59E0B' },
  { category: 'database', label: 'Relational Database', tech: 'PostgreSQL 16 Multi-AZ', sub: 'SQL Database', icon: Database, color: '#F43F5E' },
  { category: 'storage', label: 'Object Storage', tech: 'AWS S3 Multi-Region', sub: 'S3 Blob Storage', icon: HardDrive, color: '#F97316' },
];

const INITIAL_NODES: Node[] = [
  {
    id: 'client-1',
    type: 'archNode',
    position: { x: 50, y: 180 },
    data: { label: 'Web & Mobile Clients', category: 'client', techStack: 'React / Next.js', qps: '50k QPS', replicas: 'Global' }
  },
  {
    id: 'cdn-1',
    type: 'archNode',
    position: { x: 300, y: 180 },
    data: { label: 'Cloudflare CDN Edge', category: 'cdn', techStack: 'Anycast DNS + Cache', qps: '50k QPS', replicas: '250+ PoPs' }
  },
  {
    id: 'lb-1',
    type: 'archNode',
    position: { x: 550, y: 180 },
    data: { label: 'API Gateway & L7 LB', category: 'load_balancer', techStack: 'Kong / Envoy', qps: '30k QPS', replicas: '4 Replicas' }
  },
  {
    id: 'app-1',
    type: 'archNode',
    position: { x: 800, y: 100 },
    data: { label: 'Core Application Service', category: 'compute', techStack: 'Spring Boot 3.4 / Java 21', qps: '25k QPS', replicas: '12 Pods' }
  },
  {
    id: 'cache-1',
    type: 'archNode',
    position: { x: 1080, y: 50 },
    data: { label: 'Redis LRU Cache', category: 'cache', techStack: 'Redis 7.2 Cluster', qps: '40k Ops/sec', replicas: '6 Shards' }
  },
  {
    id: 'db-1',
    type: 'archNode',
    position: { x: 1080, y: 220 },
    data: { label: 'PostgreSQL Database', category: 'database', techStack: 'Postgres 16 Multi-AZ', qps: '5k Write TPS', replicas: '1 Primary + 3 Replicas' }
  }
];

const INITIAL_EDGES: Edge[] = [
  { id: 'e1', source: 'client-1', target: 'cdn-1', label: 'HTTPS', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2', source: 'cdn-1', target: 'lb-1', label: 'Cache Miss', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3', source: 'lb-1', target: 'app-1', label: 'REST / JSON', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4', source: 'app-1', target: 'cache-1', label: 'Cache-Aside Check', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5', source: 'app-1', target: 'db-1', label: 'Read/Write Fallback', markerEnd: { type: MarkerType.ArrowClosed } }
];

interface WalkthroughStep {
  stepNumber: number;
  nodeId?: string;
  component: string;
  action: string;
  protocol: string;
  latency: string;
  interviewerTalkingPoint: string;
}

const DEFAULT_WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    stepNumber: 1,
    nodeId: 'client-1',
    component: 'Client Ingress & Anycast DNS',
    action: 'User initiates HTTP action on client application. Geo-DNS resolves request to closest Point of Presence.',
    protocol: 'HTTPS / HTTP/3',
    latency: '< 15ms',
    interviewerTalkingPoint: 'Explain how Anycast BGP routing terminates TCP/TLS handshakes at the edge, reducing round-trip latency.'
  },
  {
    stepNumber: 2,
    nodeId: 'cdn-1',
    component: 'Edge CDN & WAF Filtering',
    action: 'CDN inspects cache. Static cache hit returns in < 5ms. On cache miss, WAF inspects for DDoS and SQL injection.',
    protocol: 'TLS 1.3 / mTLS',
    latency: '< 5ms',
    interviewerTalkingPoint: 'Mention that absorbing 80% of read traffic at CDN edge shields origin servers from flash crowd bursts.'
  },
  {
    stepNumber: 3,
    nodeId: 'lb-1',
    component: 'L7 Load Balancer & API Gateway',
    action: 'Envoy / Kong enforces token-bucket rate limiting (100 req/sec), validates JWT tokens, and routes traffic.',
    protocol: 'gRPC / HTTP/2',
    latency: '< 3ms',
    interviewerTalkingPoint: 'Point out stateless JWT validation allows zero-shared-state horizontal scaling across gateway instances.'
  },
  {
    stepNumber: 4,
    nodeId: 'app-1',
    component: 'Core Microservices Compute',
    action: 'Stateless Spring Boot worker pods execute business logic, payload validation, and concurrency orchestration.',
    protocol: 'Internal RPC',
    latency: '< 10ms',
    interviewerTalkingPoint: 'Explain Kubernetes Horizontal Pod Autoscaler (HPA) scaling pods dynamically based on CPU/p99 latency.'
  },
  {
    stepNumber: 5,
    nodeId: 'cache-1',
    component: 'Cache-Aside Lookup (Redis Cluster)',
    action: 'Microservice queries Redis cluster using partition key. Cache hits return in < 2ms without touching primary database.',
    protocol: 'Redis RESP3',
    latency: '< 2ms',
    interviewerTalkingPoint: 'Detail the 80/20 rule: 20% of hot keys generate 80% of traffic. Mention jittered TTL to avoid cache stampede.'
  },
  {
    stepNumber: 6,
    nodeId: 'db-1',
    component: 'Database Persistence (PostgreSQL Multi-AZ)',
    action: 'On cache miss or write mutation, transaction commits to primary PostgreSQL with WAL logging and replication to standby.',
    protocol: 'JDBC Connection Pool',
    latency: '< 8ms',
    interviewerTalkingPoint: 'Clarify isolation levels (Read Committed) and explain why read replicas absorb read-heavy analytics/queries.'
  }
];

const ArchitectureDesignerCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeTab, setActiveTab] = useState<'inspector' | 'audit' | 'generate' | 'walkthrough' | 'explain'>('audit');

  // Responsive Drawer Visibility
  const [showLibrary, setShowLibrary] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // Auto-open library on desktop on mount
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setShowLibrary(true);
      setShowDrawer(true);
    }
  }, []);

  // Diagram metadata
  const [diagramTitle, setDiagramTitle] = useState('Production Microservices Topology');
  const [diagramDescription, setDiagramDescription] = useState('High-throughput distributed architecture with CDN edge, API gateway, and Redis caching');

  // Traffic Flow Simulation State
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(false);
  const [trafficRate, setTrafficRate] = useState<'normal' | 'high' | 'surge'>('normal');

  // How It Works Step-by-Step Walkthrough State
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingWalkthrough, setIsPlayingWalkthrough] = useState(false);
  const [walkthroughSteps, setWalkthroughSteps] = useState<WalkthroughStep[]>(DEFAULT_WALKTHROUGH_STEPS);

  // Explain to Interviewer State
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationData, setExplanationData] = useState<any>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // AI Audit State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  // AI Auto-Generate State
  const [genPrompt, setGenPrompt] = useState('');
  const [genScale, setGenScale] = useState('100k QPS');
  const [isGenerating, setIsGenerating] = useState(false);

  // Templates
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/architecture/templates`);
      if (res.data?.data) {
        setTemplates(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load templates from backend', err);
    }
  };

  // Sync edge animation and styling with traffic simulation
  useEffect(() => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: isSimulatingTraffic || e.animated,
        style: {
          ...e.style,
          stroke: isSimulatingTraffic ? '#06B6D4' : (isDark ? '#6366F1' : '#4F46E5'),
          strokeWidth: isSimulatingTraffic ? (trafficRate === 'surge' ? 4 : 3) : 2,
          filter: isSimulatingTraffic ? 'drop-shadow(0 0 6px #06B6D4)' : undefined
        }
      }))
    );

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...(n.data as unknown as ArchitectureNodeData),
          isSimulatingTraffic,
          qps: isSimulatingTraffic 
            ? (trafficRate === 'surge' ? '120k QPS' : trafficRate === 'high' ? '60k QPS' : '25k QPS')
            : (n.data as unknown as ArchitectureNodeData).qps
        }
      }))
    );
  }, [isSimulatingTraffic, trafficRate, isDark, setEdges, setNodes]);

  // Handle Walkthrough Step progression
  useEffect(() => {
    if (!isWalkthroughActive) {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...(n.data as unknown as ArchitectureNodeData),
            isActiveWalkthrough: false,
            stepBadge: undefined
          }
        }))
      );
      return;
    }

    const currentStep = walkthroughSteps[currentStepIndex];
    if (!currentStep) return;

    setNodes((nds) =>
      nds.map((n, idx) => {
        const isCurrent = currentStep.nodeId ? n.id === currentStep.nodeId : idx === currentStepIndex % nds.length;
        return {
          ...n,
          data: {
            ...(n.data as unknown as ArchitectureNodeData),
            isActiveWalkthrough: isCurrent,
            stepBadge: isCurrent ? currentStep.stepNumber : undefined
          }
        };
      })
    );
  }, [isWalkthroughActive, currentStepIndex, walkthroughSteps, setNodes]);

  // Auto-play walkthrough timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingWalkthrough && isWalkthroughActive) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= walkthroughSteps.length - 1) {
            setIsPlayingWalkthrough(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlayingWalkthrough, isWalkthroughActive, walkthroughSteps.length]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: isSimulatingTraffic ? '#06B6D4' : (isDark ? '#6366F1' : '#4F46E5'), strokeWidth: 2 }
    }, eds)),
    [setEdges, isSimulatingTraffic, isDark]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setActiveTab('inspector');
    setShowDrawer(true);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  // Drag and Drop implementation - rock solid and stable without re-render loops
  const isDraggingRef = useRef(false);
  const lastDropTimeRef = useRef<number>(0);

  const onDragStart = (
    event: React.DragEvent,
    category: ArchitectureNodeData['category'],
    defaultLabel: string,
    defaultTech: string
  ) => {
    isDraggingRef.current = true;
    const cat = category || 'compute';
    const payload = JSON.stringify({ category: cat, defaultLabel, defaultTech });
    globalDraggedNode = { category: cat, defaultLabel, defaultTech };
    (window as any).__DRAGGED_ARCH_NODE__ = { category: cat, defaultLabel, defaultTech };

    try {
      event.dataTransfer.setData('application/reactflow', cat);
      event.dataTransfer.setData('text/plain', cat);
      event.dataTransfer.setData('application/json', payload);
    } catch (_) {}

    event.dataTransfer.effectAllowed = 'all';
  };

  const onDragEnd = () => {
    setTimeout(() => {
      isDraggingRef.current = false;
      (window as any).__DRAGGED_ARCH_NODE__ = null;
      globalDraggedNode = null;
    }, 200);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const now = Date.now();
      if (now - lastDropTimeRef.current < 250) {
        return;
      }
      lastDropTimeRef.current = now;

      let category: ArchitectureNodeData['category'] | undefined;
      let label: string | undefined;
      let tech: string | undefined;

      // Source 1: Window global
      const winObj = (window as any).__DRAGGED_ARCH_NODE__;
      if (winObj && winObj.category) {
        category = winObj.category;
        label = winObj.defaultLabel;
        tech = winObj.defaultTech;
      }

      // Source 2: Module global
      if (!category && globalDraggedNode) {
        category = globalDraggedNode.category;
        label = globalDraggedNode.defaultLabel;
        tech = globalDraggedNode.defaultTech;
      }

      // Source 3: DataTransfer
      if (!category && event.dataTransfer) {
        try {
          const jsonStr = event.dataTransfer.getData('application/json');
          if (jsonStr) {
            const parsed = JSON.parse(jsonStr);
            category = parsed.category;
            label = parsed.defaultLabel;
            tech = parsed.defaultTech;
          }
        } catch (_) {}

        if (!category) {
          const raw =
            event.dataTransfer.getData('application/reactflow') ||
            event.dataTransfer.getData('text/plain') ||
            event.dataTransfer.getData('text');
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              category = parsed.category;
              label = parsed.defaultLabel;
              tech = parsed.defaultTech;
            } catch (_) {
              category = raw as any;
            }
          }
        }
      }

      // Lookup defaults if needed
      if (category && COMPONENT_DEFINITIONS[category]) {
        const def = COMPONENT_DEFINITIONS[category];
        label = label || def.label;
        tech = tech || def.tech;
      }

      if (!category) {
        console.warn('Drop event received with no component data');
        return;
      }

      // Calculate position using screenToFlowPosition with error bounds
      let posX = 350;
      let posY = 200;
      try {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        if (position && typeof position.x === 'number' && !isNaN(position.x)) {
          posX = position.x;
          posY = position.y;
        } else {
          const bounds = reactFlowWrapper.current?.getBoundingClientRect();
          if (bounds) {
            const centerPos = screenToFlowPosition({
              x: bounds.left + bounds.width / 2,
              y: bounds.top + bounds.height / 2,
            });
            if (centerPos && typeof centerPos.x === 'number' && !isNaN(centerPos.x)) {
              posX = centerPos.x;
              posY = centerPos.y;
            }
          }
        }
      } catch (err) {
        console.warn('screenToFlowPosition error fallback', err);
      }

      const id = `${category}-${Date.now()}`;
      const newNode: Node = {
        id,
        type: 'archNode',
        position: { x: posX, y: posY },
        data: {
          label: label || 'Component',
          category,
          techStack: tech || '',
          qps: '15k QPS',
          replicas: '3 Replicas',
          isSimulatingTraffic
        }
      };

      setNodes((nds) => [...nds, newNode]);
      setSelectedNode(newNode);
      setActiveTab('inspector');
      setShowDrawer(true);

      isDraggingRef.current = false;
      (window as any).__DRAGGED_ARCH_NODE__ = null;
      globalDraggedNode = null;
    },
    [screenToFlowPosition, setNodes, isSimulatingTraffic]
  );

  // Click / Tap to Add (Guaranteed reliable on mobile/tablets and desktop)
  const addNode = (category: ArchitectureNodeData['category'], defaultLabel: string, defaultTech: string) => {
    const wrapperBounds = reactFlowWrapper.current?.getBoundingClientRect();
    let posX = 350;
    let posY = 200;

    if (wrapperBounds) {
      const centerPos = screenToFlowPosition({
        x: wrapperBounds.left + wrapperBounds.width / 2 + (Math.random() - 0.5) * 80,
        y: wrapperBounds.top + wrapperBounds.height / 2 + (Math.random() - 0.5) * 80
      });
      if (centerPos && typeof centerPos.x === 'number' && !isNaN(centerPos.x)) {
        posX = centerPos.x;
        posY = centerPos.y;
      }
    }

    const id = `${category}-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'archNode',
      position: { x: posX, y: posY },
      data: {
        label: defaultLabel,
        category,
        techStack: defaultTech,
        qps: '15k QPS',
        replicas: '3 Replicas',
        isSimulatingTraffic
      }
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
    setActiveTab('inspector');
    setShowDrawer(true);
  };

  // Update selected node data
  const updateSelectedNodeData = (field: keyof ArchitectureNodeData, value: string) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          const updated = {
            ...n,
            data: {
              ...(n.data as unknown as ArchitectureNodeData),
              [field]: value
            }
          };
          setSelectedNode(updated);
          return updated;
        }
        return n;
      })
    );
  };

  // Delete selected node
  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
  };

  // Load Template
  const loadTemplate = (template: any) => {
    try {
      const parsed = JSON.parse(template.canvasData);
      if (parsed.nodes && parsed.edges) {
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
        setDiagramTitle(template.title);
        setDiagramDescription(template.description || '');
        setAuditResult(null);
        setExplanationData(null);
        setIsWalkthroughActive(false);
      }
    } catch (err) {
      console.error('Failed to parse template canvas data', err);
    }
  };

  // Run AI Architecture Audit
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setActiveTab('audit');
    setShowDrawer(true);
    try {
      const payload = {
        title: diagramTitle,
        systemGoal: diagramDescription,
        targetQps: '100k QPS',
        canvasData: JSON.stringify({ nodes, edges })
      };

      const res = await axios.post(`${API_BASE}/architecture/audit`, payload);
      setAuditResult(res.data.data);
    } catch (err) {
      console.error('Audit API fallback', err);
      setAuditResult({
        healthScore: 89,
        scalabilityRating: 'Staff Software Architect',
        architectureSummary: 'Robust distributed topology with edge CDN caching, multi-tier load balancing, and segregated query/mutation data paths.',
        singlePointsOfFailure: [
          {
            component: 'Relational Database Primary',
            risk: 'Single primary node write contention under sudden traffic bursts.',
            severity: 'HIGH',
            remediation: 'Configure automated failover with PostgreSQL Patroni or AWS Aurora Multi-AZ.'
          }
        ],
        bottlenecks: [
          {
            component: 'Synchronous Database Writes',
            issue: 'ACID transaction locks limit throughput to ~5,000 TPS.',
            maxQps: '5,000 Write QPS',
            remediation: 'Buffer write transactions through Apache Kafka topics using Transactional Outbox pattern.'
          }
        ],
        securityRisks: [
          {
            area: 'Edge Ingress',
            risk: 'Missing Web Application Firewall rules for Layer 7 DDoS mitigation.',
            recommendation: 'Enable Cloudflare WAF or AWS Shield on edge ingress points.'
          }
        ],
        recommendations: [
          'Add read replicas for database scaling',
          'Deploy Kafka topic for asynchronous event processing',
          'Implement Circuit Breaker patterns with Resilience4j',
          'Enforce mTLS across internal pod-to-pod communications'
        ]
      });
    } finally {
      setIsAuditing(false);
    }
  };

  // Run Explain to Interviewer
  const handleRunExplain = async () => {
    setIsExplaining(true);
    setActiveTab('explain');
    setShowDrawer(true);
    try {
      const payload = {
        title: diagramTitle,
        systemGoal: diagramDescription,
        targetScale: genScale,
        canvasData: JSON.stringify({ nodes, edges })
      };

      const res = await axios.post(`${API_BASE}/architecture/explain`, payload);
      if (res.data?.data) {
        setExplanationData(res.data.data);
        if (res.data.data.stepByStepFlow?.length > 0) {
          setWalkthroughSteps(res.data.data.stepByStepFlow);
        }
      }
    } catch (err) {
      console.error('Explain API fallback', err);
      setExplanationData({
        elevatorPitch: `This architecture for ${diagramTitle} is engineered to reliably sustain ${genScale} with sub-25ms p99 latency targets. User traffic is accelerated at the edge through Anycast DNS and CDN caching, absorbing up to 80% of read traffic. Behind our L7 gateway, stateless Spring Boot microservices scale horizontally, leveraging a Cache-Aside Redis cluster for sub-2ms lookups backed by multi-AZ PostgreSQL with read replicas.`,
        stepByStepFlow: DEFAULT_WALKTHROUGH_STEPS,
        tradeOffs: [
          {
            decision: 'Caching Pattern',
            chosenOption: 'Cache-Aside (Lazy Loading)',
            alternativeOption: 'Write-Through',
            whyChosen: 'Resilient to cache outages; only requested data is cached, preserving memory efficiency.',
            capPerspective: 'Accepts eventual consistency window to prioritize high availability (AP).'
          },
          {
            decision: 'Storage Engine',
            chosenOption: 'PostgreSQL Multi-AZ + Read Replicas',
            alternativeOption: 'Pure NoSQL Key-Value Store',
            whyChosen: 'Relational ACID transactions required for state consistency and foreign key relations.',
            capPerspective: 'CP oriented on primary writes; AP oriented on read replica queries.'
          }
        ],
        failureModes: [
          {
            component: 'Primary Database',
            failureScenario: 'Host hardware failure in primary Availability Zone',
            mitigation: 'Automated Patroni/Aurora failover promotes standby replica in Zone B in under 20 seconds.',
            blastRadius: 'Brief ~20s write pause; read traffic proceeds uninterrupted via read replicas.'
          },
          {
            component: 'Redis Cluster',
            failureScenario: 'Cache shard OOM or master crash during flash sale',
            mitigation: 'Resilience4j Circuit Breaker throttles database fallback queries; Redis Sentinel promotes replica in < 3s.',
            blastRadius: 'Temporary minor latency increase without database cascade failure.'
          }
        ],
        interviewerQuestions: [
          {
            question: 'How do you prevent a cache stampede if a hot product cache key expires?',
            interviewerIntent: 'Testing concurrency control, distributed locks, and probabilistic early expiration.',
            suggestedAnswer: 'We use probabilistic early expiration (XFetch algorithm) combined with a Redis distributed lock (Redlock) so only 1 worker rebuilds the cache while others read the stale value.'
          },
          {
            question: 'How do you guarantee that a database write and a Kafka event publish succeed atomically?',
            interviewerIntent: 'Testing distributed transaction avoidance, dual-write vulnerabilities, and messaging patterns.',
            suggestedAnswer: 'We implement the Transactional Outbox pattern. Inside the exact same ACID database transaction, we write the event into an outbox table. Debezium CDC reads the WAL log and streams events to Kafka reliably.'
          }
        ],
        fullPresentationScript: `=== SYSTEM DESIGN INTERVIEW PRESENTATION SCRIPT ===\n\n1. EXECUTIVE SUMMARY:\n"Hi, today I'll walk you through the system architecture for ${diagramTitle}..."`
      });
    } finally {
      setIsExplaining(false);
    }
  };

  // AI Auto-Generate
  const handleGenerate = async () => {
    if (!genPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await axios.post(`${API_BASE}/architecture/generate`, {
        prompt: genPrompt,
        targetScale: genScale,
        style: 'MICROSERVICES'
      });

      const data = res.data.data;
      if (data && data.canvasData) {
        const parsed = JSON.parse(data.canvasData);
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
        setDiagramTitle(data.title);
        setDiagramDescription(data.description);
        setAuditResult(null);
        setExplanationData(null);
      }
    } catch (err) {
      console.error('Auto generate failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Pitch to Clipboard
  const handleCopyPitch = () => {
    if (!explanationData) return;
    const text = explanationData.fullPresentationScript || explanationData.elevatorPitch;
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  // Export JSON
  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ title: diagramTitle, description: diagramDescription, nodes, edges }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${diagramTitle.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-100 dark:bg-[#0B1020] text-slate-900 dark:text-white transition-colors duration-200">
      {/* Top Action Bar */}
      <div className="h-14 border-b border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#151C2E] px-3 sm:px-4 flex items-center justify-between z-10 gap-2 shadow-xs">
        {/* Left: Title & Drawer Toggles */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title={showLibrary ? 'Hide Component Library' : 'Show Component Library'}
          >
            {showLibrary ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4 text-cyan-600 dark:text-[#06B6D4]" />}
          </button>

          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-[#6366F1]/10 text-indigo-600 dark:text-[#6366F1] hidden sm:block">
            <Network className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <input
              type="text"
              value={diagramTitle}
              onChange={(e) => setDiagramTitle(e.target.value)}
              className="bg-transparent font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-b focus:border-indigo-500 truncate max-w-[120px] sm:max-w-xs"
              title="Click to rename diagram"
            />
            <div className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {nodes.length} Components • {edges.length} Connections
            </div>
          </div>
        </div>

        {/* Center / Right: Interactive Simulation & Pitch Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Traffic Simulation Toggle */}
          <button
            onClick={() => setIsSimulatingTraffic(!isSimulatingTraffic)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              isSimulatingTraffic
                ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-400/50 shadow-md shadow-cyan-500/20'
                : 'bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-slate-300'
            }`}
            title="Simulate Real-time Network Traffic Flow on Edges"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingTraffic ? 'text-cyan-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden md:inline">Traffic:</span>
            <span>{isSimulatingTraffic ? 'ACTIVE' : 'OFF'}</span>
          </button>

          {/* How It Works Button */}
          <button
            onClick={() => {
              setIsWalkthroughActive(true);
              setActiveTab('walkthrough');
              setShowDrawer(true);
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'walkthrough' && isWalkthroughActive
                ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-400/50'
                : 'bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-slate-300'
            }`}
            title="Interactive Step-by-Step Request Lifecycle Walkthrough"
          >
            <Play className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span className="hidden sm:inline">How It Works</span>
          </button>

          {/* Explain to Interviewer Pitch Button */}
          <button
            onClick={handleRunExplain}
            disabled={isExplaining}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
            title="Generate FAANG Interviewer Presentation Script"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden sm:inline">{isExplaining ? 'Preparing...' : 'Explain to Interviewer'}</span>
            <span className="sm:hidden">Explain</span>
          </button>

          {/* AI Audit Button */}
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-[#6366F1]/20 flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">{isAuditing ? 'Auditing...' : 'AI Audit'}</span>
          </button>

          {/* Blueprint Templates */}
          <div className="relative group hidden lg:block">
            <select
              onChange={(e) => {
                const selected = templates.find((t) => t.title === e.target.value);
                if (selected) loadTemplate(selected);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none hover:bg-slate-200 dark:hover:bg-[#334155] transition-all cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>Blueprints...</option>
              {templates.map((tpl, idx) => (
                <option key={idx} value={tpl.title}>{tpl.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={exportJson}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
            title="Export Architecture JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Export</span>
          </button>

          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title={showDrawer ? 'Hide Inspector Drawer' : 'Show Inspector Drawer'}
          >
            {showDrawer ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4 text-indigo-500 dark:text-[#A78BFA]" />}
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Palette + Canvas + Right Inspector/Audit Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay for Drawers */}
        {(showLibrary || showDrawer) && (
          <div
            onClick={() => {
              setShowLibrary(false);
              setShowDrawer(false);
            }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Left Component Tray (Responsive Drawer) */}
        {showLibrary && (
          <aside className="w-72 lg:w-64 border-r border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-[#151C2E] p-3 flex flex-col gap-2 overflow-y-auto z-40 fixed lg:relative inset-y-0 left-0 h-full shadow-2xl lg:shadow-none">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-[#1E293B]">
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Component Library</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1E293B] text-cyan-700 dark:text-[#06B6D4] font-mono">
                  Drag / Add
                </span>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="lg:hidden p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#1E293B]/50 p-2 rounded-lg border border-slate-200 dark:border-[#334155]/40 shadow-xs">
              Drag components directly onto the canvas, or click <strong className="text-indigo-600 dark:text-indigo-400">+ Add</strong> to place immediately.
            </div>

            {COMPONENT_LIBRARY_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  draggable={true}
                  onDragStart={(e) => onDragStart(e, item.category as any, item.label, item.tech)}
                  onDragEnd={onDragEnd}
                  onClick={() => {
                    if (isDraggingRef.current) return;
                    addNode(item.category as any, item.label, item.tech);
                  }}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1E293B]/80 hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-[#334155]/60 hover:border-[#6366F1] cursor-grab active:cursor-grabbing text-left flex items-center justify-between transition-all group shadow-xs select-none"
                  title="Drag onto canvas or tap to add"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pointer-events-none select-none">
                    <div 
                      className="p-1.5 rounded-lg transition-transform group-hover:scale-110 flex-shrink-0"
                      style={{ backgroundColor: `${item.color}18`, color: item.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white truncate">
                        {item.sub}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {item.tech}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addNode(item.category as any, item.label, item.tech);
                      }}
                      className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer pointer-events-auto shadow-xs"
                      title="Add component to canvas center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Add</span>
                    </button>
                    <GripVertical className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400 flex-shrink-0 cursor-grab pointer-events-none" />
                  </div>
                </div>
              );
            })}

            <div className="mt-auto p-3 rounded-xl bg-white dark:bg-[#1E293B]/50 border border-slate-200 dark:border-[#334155]/50 text-[11px] text-slate-500 dark:text-slate-400 shadow-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-300">💡 Pro-Tip:</span> Connect any two components by dragging between node anchor handles.
            </div>
          </aside>
        )}

        {/* Center Canvas */}
        <div 
          ref={reactFlowWrapper} 
          className="flex-1 h-full relative"
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            className={isDark ? 'bg-[#0B1020]' : 'bg-slate-100'}
          >
            <Background 
              color={isDark ? '#1E293B' : '#cbd5e1'} 
              gap={20} 
              size={1.5} 
              variant={BackgroundVariant.Dots} 
            />
            <Controls className="!bg-white dark:!bg-[#151C2E] !border-slate-300 dark:!border-[#1E293B] !text-slate-800 dark:!text-white !rounded-xl overflow-hidden shadow-xl" />
            <MiniMap 
              nodeColor="#6366F1"
              maskColor={isDark ? 'rgba(11, 16, 32, 0.7)' : 'rgba(241, 245, 249, 0.7)'}
              className="!bg-white dark:!bg-[#151C2E] !border-slate-300 dark:!border-[#1E293B] !rounded-xl overflow-hidden shadow-2xl hidden md:block" 
            />
          </ReactFlow>

          {/* Floating Traffic Simulation HUD Badge */}
          {isSimulatingTraffic && (
            <div className="absolute top-4 left-4 z-10 px-3 py-2 rounded-xl bg-white/90 dark:bg-[#151C2E]/90 border border-cyan-400 dark:border-cyan-500/40 backdrop-blur-md shadow-2xl flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
                <span>Simulated Traffic:</span>
              </div>
              <div className="flex items-center gap-1">
                {(['normal', 'high', 'surge'] as const).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setTrafficRate(rate)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-all cursor-pointer ${
                      trafficRate === rate
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Quick Action Pill Bar */}
          <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#151C2E]/95 border border-slate-200 dark:border-[#1E293B] shadow-2xl backdrop-blur-md">
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showLibrary
                  ? 'bg-[#6366F1] text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Components</span>
            </button>
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showDrawer
                  ? 'bg-[#06B6D4] text-black shadow-md font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Inspector</span>
            </button>
          </div>

          {/* Floating Walkthrough Controller Overlay */}
          {isWalkthroughActive && (
            <div className="absolute bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-xl p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#151C2E]/95 border-2 border-amber-400 dark:border-amber-500/50 backdrop-blur-xl shadow-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-black text-xs shrink-0">
                    Step {walkthroughSteps[currentStepIndex]?.stepNumber || 1} of {walkthroughSteps.length}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {walkthroughSteps[currentStepIndex]?.component}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
                    disabled={currentStepIndex === 0}
                    className="p-1 rounded-lg bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlayingWalkthrough(!isPlayingWalkthrough)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {isPlayingWalkthrough ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{isPlayingWalkthrough ? 'Pause' : 'Auto'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentStepIndex((p) => Math.min(walkthroughSteps.length - 1, p + 1))}
                    disabled={currentStepIndex >= walkthroughSteps.length - 1}
                    className="p-1 rounded-lg bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setIsWalkthroughActive(false);
                      setIsPlayingWalkthrough(false);
                      setCurrentStepIndex(0);
                    }}
                    className="p-1 rounded-lg bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-rose-500 cursor-pointer"
                    title="Close Walkthrough"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {walkthroughSteps[currentStepIndex]?.action}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-[#1E293B] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Protocol: <strong className="text-slate-800 dark:text-slate-200">{walkthroughSteps[currentStepIndex]?.protocol}</strong></span>
                <span>Latency: <strong className="text-emerald-600 dark:text-emerald-400">{walkthroughSteps[currentStepIndex]?.latency}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Right Drawer: Inspector / AI Audit / Walkthrough / Explain Pitch / Auto-Design */}
        {showDrawer && (
          <aside className="w-80 sm:w-96 border-l border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#151C2E] flex flex-col z-40 fixed lg:relative right-0 inset-y-0 h-full shadow-2xl lg:shadow-none">
            {/* Header on mobile */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-[#1E293B] lg:hidden">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Architecture Assistant
              </span>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex items-center border-b border-slate-200 dark:border-[#1E293B] px-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('explain')}
                className={`py-3 px-2 text-xs font-semibold border-b-2 flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'explain'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-300'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> Explain
              </button>
              <button
                onClick={() => setActiveTab('walkthrough')}
                className={`py-3 px-2 text-xs font-semibold border-b-2 flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'walkthrough'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-300'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-amber-500" /> Walkthrough
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-3 px-2 text-xs font-semibold border-b-2 flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'audit'
                    ? 'border-[#6366F1] text-indigo-600 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-cyan-500" /> Audit
              </button>
              <button
                onClick={() => setActiveTab('inspector')}
                className={`py-3 px-2 text-xs font-semibold border-b-2 flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'inspector'
                    ? 'border-[#6366F1] text-indigo-600 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Inspect
              </button>
              <button
                onClick={() => setActiveTab('generate')}
                className={`py-3 px-2 text-xs font-semibold border-b-2 flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'generate'
                    ? 'border-[#6366F1] text-indigo-600 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Auto
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Tab: Explain to Interviewer */}
              {activeTab === 'explain' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> FAANG Interviewer Pitch
                      </div>
                      <button
                        onClick={handleCopyPitch}
                        className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedPitch ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPitch ? 'Copied!' : 'Copy Script'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Step-by-step verbal narrative, explicit architectural trade-offs, and defense questions to present to your interviewer.
                    </p>
                  </div>

                  {explanationData ? (
                    <div className="space-y-4">
                      {/* Elevator Pitch */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] space-y-2">
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                          <span>1. 60-Second Opening Pitch</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">Executive Summary</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
                          {explanationData.elevatorPitch}
                        </p>
                      </div>

                      {/* Trade-Offs Section */}
                      {explanationData.tradeOffs?.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-amber-600 dark:text-amber-300 uppercase tracking-wider">
                            2. Justified Trade-Offs & Decisions
                          </div>
                          {explanationData.tradeOffs.map((to: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#1E293B]/70 border border-slate-200 dark:border-[#334155]/60 space-y-1.5 text-xs">
                              <div className="font-semibold text-slate-900 dark:text-white">{to.decision}</div>
                              <div className="flex items-center gap-1.5 text-[11px]">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Chose:</span>
                                <span className="text-slate-800 dark:text-slate-200">{to.chosenOption}</span>
                                <span className="text-slate-400">vs</span>
                                <span className="text-slate-400 line-through">{to.alternativeOption}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 text-[11px]">{to.whyChosen}</p>
                              {to.capPerspective && (
                                <div className="text-[10px] text-indigo-600 dark:text-[#A78BFA] font-mono pt-1">
                                  CAP Alignment: {to.capPerspective}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Failure Modes & SPOF Defense */}
                      {explanationData.failureModes?.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                            3. Failure Modes & Recovery Defense
                          </div>
                          {explanationData.failureModes.map((fm: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 space-y-1 text-xs">
                              <div className="font-semibold text-slate-900 dark:text-white">{fm.component} Failure</div>
                              <p className="text-slate-600 dark:text-slate-300 text-[11px]">{fm.failureScenario}</p>
                              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium pt-1">
                                <strong>Mitigation:</strong> {fm.mitigation}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Probing Interviewer Questions */}
                      {explanationData.interviewerQuestions?.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-cyan-600 dark:text-[#06B6D4] uppercase tracking-wider">
                            4. Anticipated Interviewer Questions
                          </div>
                          {explanationData.interviewerQuestions.map((q: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] space-y-1.5 text-xs">
                              <div className="font-bold text-slate-900 dark:text-white flex items-start gap-1.5">
                                <span className="text-cyan-600 dark:text-[#06B6D4]">Q{idx + 1}:</span>
                                <span>{q.question}</span>
                              </div>
                              <div className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">
                                <strong>Interviewer Intent:</strong> {q.interviewerIntent}
                              </div>
                              <div className="p-2 rounded bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#334155]/40 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                                <strong className="text-emerald-600 dark:text-emerald-400">Model Answer: </strong>
                                {q.suggestedAnswer}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <Volume2 className="w-6 h-6" />
                      </div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">Generate Interview Walkthrough</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Click below to synthesize a complete verbal walkthrough script calibrated to your exact components, technologies, and scale.
                      </p>
                      <button
                        onClick={handleRunExplain}
                        disabled={isExplaining}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Generate Interview Pitch
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: How It Works Walkthrough */}
              {activeTab === 'walkthrough' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <Play className="w-4 h-4 text-amber-500 fill-current" /> Interactive Request Flow
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Step through each layer of your topology in chronological order. Watch the active component highlight on the canvas.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {walkthroughSteps.map((step, idx) => {
                      const isCurrent = currentStepIndex === idx && isWalkthroughActive;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setIsWalkthroughActive(true);
                            setCurrentStepIndex(idx);
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                              : 'bg-slate-50 dark:bg-[#1E293B]/70 border-slate-200 dark:border-[#334155]/60 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200 dark:border-[#334155]/40">
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                isCurrent ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-[#151C2E] text-slate-700 dark:text-slate-300'
                              }`}>
                                {step.stepNumber}
                              </span>
                              <span>{step.component}</span>
                            </span>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">{step.latency}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed mb-2">
                            {step.action}
                          </p>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-[#151C2E] p-2 rounded-lg border border-slate-200 dark:border-[#334155]/30">
                            <strong className="text-amber-700 dark:text-amber-300">Interviewer Talking Point: </strong>
                            {step.interviewerTalkingPoint}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab: AI Audit */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  {auditResult ? (
                    <>
                      {/* Score Gauge */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] flex items-center justify-between">
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Architecture Health Score</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                            {auditResult.healthScore} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ 100</span>
                          </div>
                          <div className="text-xs text-cyan-600 dark:text-[#06B6D4] font-medium mt-1">
                            {auditResult.scalabilityRating}
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-full border-4 border-[#6366F1] flex items-center justify-center font-bold text-lg text-slate-900 dark:text-white shadow-lg shadow-[#6366F1]/30">
                          {auditResult.healthScore}%
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-200 dark:border-[#334155]/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {auditResult.architectureSummary}
                      </div>

                      {/* Single Points of Failure */}
                      {auditResult.singlePointsOfFailure?.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" /> Single Points of Failure ({auditResult.singlePointsOfFailure.length})
                          </div>
                          {auditResult.singlePointsOfFailure.map((spof: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 space-y-1">
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                                <span>{spof.component}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300">{spof.severity}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300">{spof.risk}</p>
                              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 pt-1">
                                <strong>Fix:</strong> {spof.remediation}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Bottlenecks */}
                      {auditResult.bottlenecks?.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Activity className="w-3.5 h-3.5" /> Throughput Bottlenecks
                          </div>
                          {auditResult.bottlenecks.map((bn: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-1">
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                                <span>{bn.component}</span>
                                <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300">{bn.maxQps}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300">{bn.issue}</p>
                              <div className="text-[11px] text-amber-800 dark:text-amber-200/90 pt-1">
                                <strong>Scale:</strong> {bn.remediation}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommendations */}
                      {auditResult.recommendations?.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-cyan-600 dark:text-[#06B6D4] flex items-center gap-1.5 uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Actionable Upgrades
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {auditResult.recommendations.map((rec: string, idx: number) => (
                              <li key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-[#1E293B]/50 border border-slate-200 dark:border-[#334155]/40 flex items-start gap-2">
                                <span className="text-[#6366F1] font-bold">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-[#6366F1]/10 text-indigo-600 dark:text-[#6366F1] flex items-center justify-center mx-auto">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">No Audit Run Yet</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Click the "AI Architecture Audit" button to evaluate your diagram for SPOFs, scalability limits, and security vulnerabilities.
                      </p>
                      <button
                        onClick={handleRunAudit}
                        disabled={isAuditing}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-xs font-semibold shadow-md shadow-[#6366F1]/20 inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Start AI Audit
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Node Inspector */}
              {activeTab === 'inspector' && (
                <div>
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1E293B]">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Configure Node
                        </span>
                        <button
                          onClick={deleteSelectedNode}
                          className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Component Name</label>
                          <input
                            type="text"
                            value={(selectedNode.data as unknown as ArchitectureNodeData).label || ''}
                            onChange={(e) => updateSelectedNodeData('label', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tech Stack / Engine</label>
                          <input
                            type="text"
                            value={(selectedNode.data as unknown as ArchitectureNodeData).techStack || ''}
                            onChange={(e) => updateSelectedNodeData('techStack', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                            placeholder="e.g. Redis 7.2 / PostgreSQL 16"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">QPS / Capacity</label>
                            <input
                              type="text"
                              value={(selectedNode.data as unknown as ArchitectureNodeData).qps || ''}
                              onChange={(e) => updateSelectedNodeData('qps', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                              placeholder="e.g. 50k QPS"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Replication / Pods</label>
                            <input
                              type="text"
                              value={(selectedNode.data as unknown as ArchitectureNodeData).replicas || ''}
                              onChange={(e) => updateSelectedNodeData('replicas', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                              placeholder="e.g. 4 Replicas"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Architecture Notes</label>
                          <textarea
                            rows={3}
                            value={(selectedNode.data as unknown as ArchitectureNodeData).notes || ''}
                            onChange={(e) => updateSelectedNodeData('notes', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                            placeholder="Add failover policy, partition strategy or SLA requirements..."
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-xs text-slate-500 dark:text-slate-400">
                      Click any component on the canvas to inspect its configuration and properties.
                    </div>
                  )}
                </div>
              )}

              {/* Tab: AI Auto-Design */}
              {activeTab === 'generate' && (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">AI Architecture Generator</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Describe your system requirements and scale. AI will design and layout the complete topology with nodes and connections.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">System Prompt</label>
                      <textarea
                        rows={4}
                        value={genPrompt}
                        onChange={(e) => setGenPrompt(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                        placeholder="e.g. Design a real-time collaborative whiteboarding system like Figma with WebSockets and CRDT synchronization..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Target Scale</label>
                      <select
                        value={genScale}
                        onChange={(e) => setGenScale(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                      >
                        <option value="10k QPS">Mid Scale (10,000 QPS)</option>
                        <option value="100k QPS">Large Scale (100,000 QPS)</option>
                        <option value="1M+ QPS">Hyperscale (1,000,000+ QPS)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !genPrompt.trim()}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-[#6366F1]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      {isGenerating ? 'Synthesizing Architecture...' : 'Generate Architecture'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export const ArchitectureDesignerPage: React.FC = () => {
  return (
    <ReactFlowProvider>
      <ArchitectureDesignerCanvas />
    </ReactFlowProvider>
  );
};

export default ArchitectureDesignerPage;
