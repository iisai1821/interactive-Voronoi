import React from "react";
import VoronoiDiagram from "./VoronoiDiagram";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Interactive Voronoi Diagram</h1>
      <VoronoiDiagram />
    </div>
  );
}

export default App;
