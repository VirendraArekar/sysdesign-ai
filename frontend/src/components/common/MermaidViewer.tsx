import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../../context/ThemeContext';

interface MermaidViewerProps {
  chart: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = resolvedTheme === 'dark';
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: isDark ? {
        primaryColor: '#6366F1',
        primaryTextColor: '#F8FAFC',
        primaryBorderColor: '#4F46E5',
        lineColor: '#06B6D4',
        secondaryColor: '#1E293B',
        tertiaryColor: '#151C2E',
        background: '#0B1020',
        mainBkg: '#151C2E',
        nodeBorder: '#6366F1',
        clusterBkg: '#151C2E',
        clusterBorder: '#334155',
        edgeLabelBackground: '#1E293B',
      } : {
        primaryColor: '#6366F1',
        primaryTextColor: '#0F172A',
        primaryBorderColor: '#6366F1',
        lineColor: '#0891B2',
        secondaryColor: '#F8FAFC',
        tertiaryColor: '#FFFFFF',
        background: '#F8FAFC',
        mainBkg: '#FFFFFF',
        nodeBorder: '#CBD5E1',
        clusterBkg: '#F1F5F9',
        clusterBorder: '#CBD5E1',
        edgeLabelBackground: '#FFFFFF',
      },
      fontFamily: 'Inter, sans-serif',
    });

    const renderChart = async () => {
      if (!chart.trim()) return;
      try {
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        setError('Failed to render diagram syntax');
      }
    };

    renderChart();
  }, [chart, resolvedTheme]);

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono">
        {error}
        <pre className="mt-2 text-slate-600 dark:text-slate-400 overflow-x-auto">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="p-6 rounded-2xl bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] shadow-sm overflow-x-auto flex justify-center items-center [&>svg]:max-w-full [&>svg]:h-auto transition-colors"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default MermaidViewer;
