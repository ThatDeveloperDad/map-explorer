# MapRunner Design Document

## Overview

A simple first-person grid-based dungeon viewer with discrete movement and rotation.

## Core Features

- [x] Grid-based movement (5' × 5' squares)
- [x] 90-degree rotations
- [x] Simple controls (Forward, Back, Left, Right, Turn Left, Turn Right)
- [ ] Basic 3D visualization using raycasting
- [ ] Solid colors for walls/floor/ceiling

## Map Structure

```javascript
{
  width: 10,
  height: 10,
  grid: [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1]
  ],
  start: {
    x: 1,
    y: 1,
    facing: 0  // 0 = North, 1 = East, 2 = South, 3 = West
  }
}
```

## Development Phases

### Phase 1: Top-Down View

- [x] Create test map
- [x] Draw simple 2D grid (walls in grey, spaces in black)
- [x] Add player marker (triangle showing position/facing)
- [ ] Implement keyboard controls (button controls now)
- [x] Add collision detection
- [x] Test movement and rotation

### Phase 2: First-Person View

- [ ] Add canvas for 3D view
- [ ] Implement basic raycasting
- [ ] Draw walls with distance shading
- [x] Convert top-down view into minimap
- [ ] Add floor/ceiling colors

### Future Enhancements

- Texture mapping
- Improved lighting
- Additional map features (doors, etc)
- UI improvements
- Entity class / array for populating the map with "other things"

## Components

### Map

- [x] Define grid structure
- [x] Load map data
- [x] Provide collision checking

### Player

- [x] Position and facing direction
- [x] Movement validation
- [x] Grid-based movement

### 2D Renderer

- [x] Draw grid
- [x] Draw player marker
- [x] Update on movement

### Controls

- [x] WASD keys for movement (button grid for now)
- [x] Q/E for rotation
- [x] Prevent invalid moves

### 3D Renderer

- [x] Define Viewport rules.
- [x] Determine best method for calculating what's in the Field of View.
- [x] Render a basic, undecorated first person view using basic solid surfaces.
- [x] Introduce basic lighting controls and effects.
