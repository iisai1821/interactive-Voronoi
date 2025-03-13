# Interactive Voronoi Diagram

This project is an interactive Voronoi diagram built with React and D3.js. Users can click on cells to blend their colors with their neighbors, reset the colors to their original state, and regenerate the diagram with new random points.

## Features

- Interactive Voronoi diagram
- Click on cells to blend their colors with neighbors
- Reset colors to original state
- Regenerate diagram with new random points

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/interactiveVoronoi.git
    cd interactiveVoronoi/voronoi-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Usage

1. Start the development server:
    ```bash
    npm start
    ```

2. Open your browser and navigate to `http://localhost:3000` to view the interactive Voronoi diagram.

## Project Structure

- `src/`
  - `VoronoiDiagram.tsx`: Main component for the Voronoi diagram
  - `blendColors.tsx`: Utility functions for blending colors

## Components

### VoronoiDiagram

This component renders the interactive Voronoi diagram. It includes functions to handle cell clicks, update point colors, reset colors, and regenerate points.

### blendColors

This module provides utility functions for blending hex colors.

## Functions

### generateRandomPoints

Generates an array of random points with coordinates and colors.

### handleCellClick

Handles cell click events, blends the color of the clicked cell with its neighbors, and updates the state.

### updatePointColor

Updates the color of a specific point in the state.

### resetColors

Resets the colors of all points to their original state.

### regeneratePoints

Generates a new set of random points and updates the state.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
