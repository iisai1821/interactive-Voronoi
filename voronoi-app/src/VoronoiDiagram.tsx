import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Delaunay } from "d3-delaunay";
import { averageHexColors, colorsAreSimilar } from "./blendColors";

interface Point {
  coords: [number, number];
  color: string;
}

const VoronoiDiagram: React.FC = () => {
  const width = 500, height = 500;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const numPoints = 30;

  const colorPallet: string[] = [
  "#CB4533", "#E9B3BB", "#9580B5", "#BCC692", "#A4BFDD",
  "#EFD4EA", "#FAD424", "#68A4E7", "#7CB145", "#E9FEFE"
  ];

  // Set each point to a random color from the colorpallet array:
  const originalColors = Array.from({ length: numPoints }, () => colorPallet[Math.floor(Math.random() * colorPallet.length)]);

  const [points, setPoints] = useState<Point[]>(generateRandomPoints(numPoints));
  const [] = useState<string[]>(originalColors);

  function generateRandomPoints(n: number): Point[] {
    return Array.from({ length: n }, (_, i) => ({
      coords: [Math.random() * width, Math.random() * height],
      color: originalColors[i % originalColors.length]
    }));
  }

  const handleCellClick = (index: number, delaunay: Delaunay<number>) => {
    const neighbors = Array.from(delaunay.neighbors(index)) as number[]; 
    const updatePointColor = (index: number, newColor: string) => {
      setPoints(prevPoints => prevPoints.map((p, i) => 
        i === index ? { ...p, color: newColor } : p 
      ));
    };
    
    console.log(`Neighbors of point ${index}:`, neighbors
      .filter(i => i >= 0 && i < points.length) // Ensure valid indices
      .map(i => points[i])
    );

    // For each neighbor point, get its color and blend it with the clicked point's color
    for (const neighborIndex of neighbors) {
      if (neighborIndex >= 0 && neighborIndex < points.length) {
        const neighborPoint = points[neighborIndex];
        const blendedColor = averageHexColors([points[index].color, neighborPoint.color]);
        updatePointColor(neighborIndex, blendedColor);

        // If the blended color is close to the clicked point's color, remove both cells
        if (colorsAreSimilar(blendedColor, points[index].color)) {
          setPoints(prevPoints => prevPoints.filter((_, i) => i !== index && i !== neighborIndex));
          return;
        }
      }
    };
  };
  
  const regeneratePoints = () => {
    setPoints(generateRandomPoints(numPoints));  
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
    
    const defs = svg.append("defs");
    // Create radial gradients for each cell  
    points.forEach((p, i) => {
      const gradient = defs.append("radialGradient")
        .attr("id", `gradient-${i}`)
        .attr("cx", "50%").attr("cy", "50%")
        .attr("r", "50%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", p.color)
        .attr("stop-opacity", 1);

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.color(p.color)?.darker(1).toString() || "#000000")
        .attr("stop-opacity", 0.8);
    });
    
    svg.selectAll("path")
      .data(points.map((p, i) => ({ polygon: voronoi.cellPolygon(i), index: i, color: p.color })))
      .join("path")
      .attr("d", d => (d.polygon ? `M${d.polygon.join("L")}Z` : ""))
      .attr("stroke", "black")
      .attr("fill", d => `url(#gradient-${d.index})`)
      .on("click", (_, d: { index: number }) => handleCellClick(d.index, delaunay)); 

  }, [points]);
  
  return (
    <div>
      <h2>Voronoi Diagram</h2>
      <p>Click on a cell to blend its color with its neighbors.</p>
      <p>If the blended color is similar to the color of the clicked cell, they will be removed.</p>
      <svg ref={svgRef} width={width} height={height}></svg>
      <br />
      <button onClick={resetColors}>Reset Colors</button>
      <button onClick={regeneratePoints}>Regenerate diagram</button>
    </div>
  );
};

export default VoronoiDiagram;