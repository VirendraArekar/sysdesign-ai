import { describe, it, expect } from 'vitest';
import { COMPONENT_DEFINITIONS } from './ArchitectureDesignerPage';

describe('Architecture Designer Component Definitions', () => {
  it('should define all 9 core system design components', () => {
    const requiredCategories = [
      'client',
      'cdn',
      'security',
      'load_balancer',
      'compute',
      'cache',
      'messaging',
      'database',
      'storage'
    ];

    requiredCategories.forEach((cat) => {
      expect(COMPONENT_DEFINITIONS[cat]).toBeDefined();
      expect(COMPONENT_DEFINITIONS[cat].label).toBeTruthy();
      expect(COMPONENT_DEFINITIONS[cat].tech).toBeTruthy();
      expect(COMPONENT_DEFINITIONS[cat].category).toBe(cat);
    });
  });

  it('should have production tech stacks mapped for each component', () => {
    expect(COMPONENT_DEFINITIONS['client'].tech).toContain('React');
    expect(COMPONENT_DEFINITIONS['cdn'].tech).toContain('Cloudflare');
    expect(COMPONENT_DEFINITIONS['security'].tech).toContain('WAF');
    expect(COMPONENT_DEFINITIONS['load_balancer'].tech).toContain('NGINX');
    expect(COMPONENT_DEFINITIONS['compute'].tech).toContain('Spring Boot');
    expect(COMPONENT_DEFINITIONS['cache'].tech).toContain('Redis');
    expect(COMPONENT_DEFINITIONS['messaging'].tech).toContain('Kafka');
    expect(COMPONENT_DEFINITIONS['database'].tech).toContain('PostgreSQL');
    expect(COMPONENT_DEFINITIONS['storage'].tech).toContain('S3');
  });
});
