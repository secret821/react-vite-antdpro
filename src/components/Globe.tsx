import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import dotSvg from '@/assets/dot.svg';

interface GlobeProps {
  onCountrySelect: (name: string, id: string) => void;
  selectedId: string | null;
}

const Globe: React.FC<GlobeProps> = ({ onCountrySelect, selectedId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const rotationRef = useRef<[number, number, number]>([-105, -25, 0]);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((res) => res.json())
      .then((data) => {
        setWorldData(feature(data, data.objects.countries));
      });
  }, []);

  const renderGlobe = useCallback(() => {
    if (!worldData || !svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const projection = d3.geoOrthographic()
      .scale(Math.min(width, height) / 2.2)
      .translate([width / 2, height / 2])
      .rotate(rotationRef.current);

    const path = d3.geoPath().projection(projection);
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', projection.scale())
      .attr('fill', '#0F45A4')
      .attr('stroke', 'none');

    svg.append('g')
      .selectAll('path')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        // Highlight China: #92B4F1, Others: #366BC7
        const isChina = d.properties.name === 'China' || d.id === '156';
        if (isChina) return '#92B4F1';
        return d.id === selectedId ? '#4b85e0' : '#366BC7';
      })
      .attr('stroke', 'none')
      .style('cursor', 'pointer')
      .on('mouseenter', function() {
        d3.select(this).attr('opacity', 0.8);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('opacity', 1);
      })
      .on('click', (_event: any, d: any) => {
        onCountrySelect(d.properties.name, d.id);
      });

    const scale = projection.scale();
    
    // 检查中国是否在可视区域内
    const chinaFeature = worldData.features.find((d: any) => d.properties.name === 'China' || d.id === '156');
    let chinaVisible = false;
    
    if (chinaFeature) {
      // 检查中国的边界框是否有部分在可视区域内
      const chinaBounds = d3.geoBounds(chinaFeature as any);
      const testPoints = [
        [chinaBounds[0][0], chinaBounds[0][1]], // 西南角
        [chinaBounds[1][0], chinaBounds[0][1]], // 东南角
        [chinaBounds[0][0], chinaBounds[1][1]], // 西北角
        [chinaBounds[1][0], chinaBounds[1][1]], // 东北角
        [(chinaBounds[0][0] + chinaBounds[1][0]) / 2, (chinaBounds[0][1] + chinaBounds[1][1]) / 2], // 中心点
      ];
      
      // 检查至少有一个点在可视半球内
      chinaVisible = testPoints.some(point => {
        const projected = projection(point as [number, number]);
        if (!projected) return false;
        const [px, py] = projected;
        const dist = Math.sqrt(Math.pow(px - width / 2, 2) + Math.pow(py - height / 2, 2));
        return dist <= scale;
      });
    }
    
    const hangzhouCoords: [number, number] = [120.1551, 30.2741];
    const hangzhouProjected = projection(hangzhouCoords);
    
    // 只有在标记点可见且中国区域可见时才显示标记
    if (hangzhouProjected && chinaVisible) {
      const [x, y] = hangzhouProjected;
      const distance = Math.sqrt(Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2));
      
      // 检查标记点是否在地球圆圈内，且标记和标签不会超出视口
      const margin = 150; // 留出边距，确保标签不被裁切
      if (distance <= scale && 
          x >= margin && x <= width - margin && 
          y >= margin && y <= height - margin) {
        // ========== 位置调整参数 ==========
        // 图标参数
        const iconSize = 36; // 图标大小（宽度和高度）
        const iconOffsetX = -10; // 图标水平偏移：正数向右，负数向左（0 = 坐标点正上方）
        const iconOffsetY = iconSize/2; // 图标垂直偏移：正数向下，负数向上（-iconSize = 图标底部在坐标点）
        
        // 标签参数
        const labelGap = 8; // 图标和标签之间的间距（像素）
        const labelPaddingX = 12; // 标签内部左右内边距（像素）
        const labelPaddingY = 8; // 标签内部上下内边距（像素）
        const labelWidth = 80 + labelPaddingX * 2; // 标签背景宽度（含内边距）
        const labelHeight = 28 + labelPaddingY; // 标签背景高度（含内边距）
        const labelOffsetY = 10; // 标签垂直偏移：正数向下，负数向上（用于微调标签相对于图标的垂直位置）
        
        // Create marker group
        const markerGroup = svg.append('g')
          .attr('class', 'hangzhou-marker')
          .attr('transform', `translate(${x}, ${y})`);
        
        // Add SVG marker (使用 SVG 文件，避免闪烁)
        markerGroup.append('image')
          .attr('href', dotSvg)
          .attr('x', iconOffsetX - iconSize / 2) // 图标左边缘位置（相对于坐标点）
          .attr('y', iconOffsetY - iconSize) // 图标顶部位置（相对于坐标点）
          .attr('width', iconSize)
          .attr('height', iconSize)
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('pointer-events', 'none');
        
        // Add label background (标签背景位置)
        markerGroup.append('rect')
          .attr('x', iconOffsetX + iconSize / 2 + labelGap) // 标签左边缘位置（图标右侧 + 间距）
          .attr('y', iconOffsetY - iconSize / 2 - labelHeight / 2 + labelOffsetY) // 标签顶部位置（整体下移）
          .attr('width', labelWidth)
          .attr('height', labelHeight)
          .attr('rx', 18)
          .attr('fill', 'white')
          .attr('pointer-events', 'none');
        
        // Add label text (文字位置，垂直居中)
        markerGroup.append('text')
          .attr('x', iconOffsetX + iconSize / 2 + labelGap + labelWidth / 2) // 文字水平居中在标签内
          // 文字垂直位置：等于标签顶部 + 一半高度 => 在标签内部垂直居中
          .attr('y', iconOffsetY - iconSize / 2 + labelOffsetY)
          .attr('dy', '0.35em') // 文字垂直微调（用于更好的视觉居中）
          .attr('text-anchor', 'middle')
          .attr('fill', '#333')
          .attr('font-size', '12px')
          .attr('font-weight', '400')
          .attr('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif')
          .attr('pointer-events', 'none')
          .text('中国 • 杭州');
      }
    }

    // Interaction handling for rotation
    const drag = d3.drag()
      .on('drag', (event) => {
        const k = 75 / projection.scale();
        rotationRef.current = [
          rotationRef.current[0] + event.dx * k,
          rotationRef.current[1] - event.dy * k,
          rotationRef.current[2]
        ];
        renderGlobe();
      });

    svg.call(drag as any);
  }, [worldData, selectedId, onCountrySelect]);

  useEffect(() => {
    renderGlobe();
    window.addEventListener('resize', renderGlobe);
    return () => window.removeEventListener('resize', renderGlobe);
  }, [renderGlobe]);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-50">
      <svg ref={svgRef} className="w-full h-full touch-none" />
      <div className="absolute bottom-6 left-6 text-slate-400 text-xs font-medium uppercase tracking-widest pointer-events-none">
        Drag to Rotate Globe
      </div>
    </div>
  );
};

export default Globe;
