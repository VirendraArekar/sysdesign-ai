import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArchitectureDesignerPage } from './ArchitectureDesignerPage';
import { ThemeProvider } from '../../context/ThemeContext';
import axios from 'axios';

vi.mock('axios');

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ArchitectureDesignerPage Interactive Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (axios.get as any).mockResolvedValue({ data: { data: [] } });
    (axios.post as any).mockResolvedValue({ data: { data: {} } });
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 });
  });

  it('renders the designer and handles clicking + Add to append a node', async () => {
    render(
      <ThemeProvider>
        <ArchitectureDesignerPage />
      </ThemeProvider>
    );

    const titleInput = screen.getByDisplayValue('Production Microservices Topology');
    expect(titleInput).toBeDefined();
    expect(screen.getByText('Component Library')).toBeDefined();

    const addButtons = screen.getAllByTitle('Add component to canvas center');
    expect(addButtons.length).toBe(9);

    const initialNodes = document.querySelectorAll('.react-flow__node');
    console.log('Nodes before click:', initialNodes.length);

    fireEvent.click(addButtons[0]);
    expect(screen.getByText('Configure Node')).toBeDefined();

    const afterNodes = document.querySelectorAll('.react-flow__node');
    console.log('Nodes after click:', afterNodes.length);
    afterNodes.forEach((node, idx) => {
      console.log(`Node ${idx}: text="${node.textContent?.slice(0, 30)}", style=${(node as HTMLElement).style.cssText}`);
    });
  });

  it('handles native drag and drop onto canvas', async () => {
    render(
      <ThemeProvider>
        <ArchitectureDesignerPage />
      </ThemeProvider>
    );

    const clientCards = screen.getAllByTitle('Drag onto canvas or tap to add');
    expect(clientCards.length).toBe(9);
    const clientCard = clientCards[0];

    // Mock dataTransfer
    const dataStore: Record<string, string> = {};
    const mockDataTransfer = {
      setData: vi.fn((key: string, val: string) => {
        dataStore[key] = val;
      }),
      getData: vi.fn((key: string) => dataStore[key] || ''),
      effectAllowed: 'all',
      dropEffect: 'none',
      types: ['application/reactflow', 'text/plain', 'application/json']
    };

    // 1. Drag start on card
    fireEvent.dragStart(clientCard, { dataTransfer: mockDataTransfer });
    expect(mockDataTransfer.setData).toHaveBeenCalledWith('application/reactflow', 'client');

    // 2. Locate canvas container
    const canvas = document.querySelector('.react-flow');
    expect(canvas).toBeDefined();

    // 3. Drag over canvas
    fireEvent.dragOver(canvas!, { dataTransfer: mockDataTransfer });

    // 4. Drop on canvas
    fireEvent.drop(canvas!, {
      clientX: 500,
      clientY: 300,
      dataTransfer: mockDataTransfer
    });

    // Node inspector should now be visible for the newly dropped node
    expect(screen.getByText('Configure Node')).toBeDefined();
  });
});
