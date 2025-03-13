import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Delaunay } from "d3-delaunay";
import averageHexColors from "./blendColors";

interface Point {
  coords: [number, number];
  color: string;
}

const VoronoiDiagram: React.FC = () => {
  const width = 500, height = 500;
  const svgRef = useRef<SVGSVGElement | null>(null);

  const originalColors: string[] = [
    "#CB4533", "#E9B3BB", "#9580B5", "#BCC692", "#A4BFDD",
    "#EFD4EA", "#FAD424", "#68A4E7", "#7CB145", "#E9FEFE"
  ];

  const [points, setPoints] = useState<Point[]>(generateRandomPoints(10));
  const [] = useState<string[]>(originalColors);

  function generateRandomPoints(n: number): Point[] {
    return Array.from({ length: n }, (_, i) => ({
      coords: [Math.random() * width, Math.random() * height],
      color: originalColors[i % originalColors.length]
    }));
  }

  const handleCellClick = (index: number, delaunay: Delaunay<number>) => {
    const neighbors = Array.from(delaunay.neighbors(index)) as number[]; 
    
    console.log(`Neighbors of point ${index}:`, neighbors
      .filter(i => i >= 0 && i < points.length) // Ensure valid indices
      .map(i => points[i])
    );
    updatePointColor(index, averageHexColors(neighbors.map(i => points[i].color)));
  };

  const updatePointColor = (index: number, newColor: string) => {
    setPoints(prevPoints => prevPoints.map((p, i) => 
      i === index ? { ...p, color: newColor } : p // Update only the selected point
    ));
  };
  
  const regeneratePoints = () => {
    setPoints(generateRandomPoints(10));  
  }

  const resetColors = () => {
    setPoints(prevPoints => prevPoints.map((p, i) => ({
      ...p,
      color: originalColors[i % originalColors.length]
    })));
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    if (points.length === 0) return;

    const delaunay = Delaunay.from(points.map(p => p.coords));
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    svg.selectAll("path")
      .data(points.map((p, i) => ({ polygon: voronoi.cellPolygon(i), index: i, color: p.color })))
      .join("path")
      .attr("d", d => (d.polygon ? `M${d.polygon.join("L")}Z` : ""))
      .attr("stroke", "black")
      .attr("fill", d => d.color)
      .on("click", (_, d: { index: number }) => handleCellClick(d.index, delaunay)); // Log neighbors on click

  }, [points]);
  
  return (
    <div>
      <h2>Voronoi Diagram</h2>
      <p>Click on a cell to blend its color with its neighbors.</p>
      <svg ref={svgRef} width={width} height={height}></svg>
      <br />
      <button onClick={resetColors}>Reset Colors</button>
      <button onClick={regeneratePoints}>Regenerate diagram</button>
    </div>
  );
};

export default VoronoiDiagram;