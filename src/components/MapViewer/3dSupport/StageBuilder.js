import * as THREE from 'three';

export class StageBuilder {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = {
            blockSize: options.blockSize || 10,
            wallHeight: options.wallHeight || 10
        };
    }

    buildFromMap(map, materials) {
        this.map = map;
        this.materials = materials;
        this.worldWidth = map.width * this.options.blockSize;
        this.worldDepth = map.height * this.options.blockSize;

        this.setupBaseGeometry();
        this.createWalls();
    }

    setupBaseGeometry() {
        // Create floor
        const floorGeometry = new THREE.PlaneGeometry(this.worldWidth, this.worldDepth);
        const floor = new THREE.Mesh(floorGeometry, this.materials.floorMaterial);
        floor.rotation.x = Math.PI / 2;
        floor.position.set(this.worldWidth / 2, 0, this.worldDepth / 2);
        this.scene.add(floor);

        // Create ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(this.worldWidth, this.worldDepth);
        const ceiling = new THREE.Mesh(ceilingGeometry, this.materials.ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(this.worldWidth / 2, 10, this.worldDepth / 2);
        this.scene.add(ceiling);
    }

    createWalls() {
        for (let row = 0; row < this.map.height; row++) {
            for (let col = 0; col < this.map.width; col++) {
                if (this.map.grid[row][col] === 1) {
                    const wall = this.createWallWithEdges(row, col);
                    this.scene.add(wall);
                }
            }
        }
    }

    createWallWithEdges(row, col) {
        const size = this.options.blockSize / 2;
        const wallHeight = this.options.wallHeight;
        const x = (col + 0.5) * this.options.blockSize;
        const z = (row + 0.5) * this.options.blockSize;

        const faces = this.checkVisibleFaces(row, col);
        const points = this.getEdgePoints(faces, size);
        
        // Create edge geometry
        const edgeGeometry = new THREE.BufferGeometry();
        edgeGeometry.setFromPoints(points);
        const edges = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0x000000 }));

        // Create wall geometry
        const wallGeometry = new THREE.BoxGeometry(this.options.blockSize, wallHeight, this.options.blockSize);
        const wall = new THREE.Mesh(wallGeometry, this.materials.wallMaterial);

        // Position wall and edges
        wall.position.set(x, wallHeight/2, z);
        edges.position.set(x, wallHeight/2, z);

        // Create a group to hold both wall and edges
        const group = new THREE.Group();
        group.add(wall);
        group.add(edges);

        return group;
    }

    checkVisibleFaces(row, col) {
        return {
            north: { 
                visible: row > 0 && this.map.grid[row-1][col] !== 1,
                diagonals: {
                    east: row > 0 && col < this.map.width-1 && this.map.grid[row-1][col+1] === 1,
                    west: row > 0 && col > 0 && this.map.grid[row-1][col-1] === 1
                }
            },
            south: { 
                visible: row < this.map.height-1 && this.map.grid[row+1][col] !== 1,
                diagonals: {
                    east: row < this.map.height-1 && col < this.map.width-1 && this.map.grid[row+1][col+1] === 1,
                    west: row < this.map.height-1 && col > 0 && this.map.grid[row+1][col-1] === 1
                }
            },
            east: { 
                visible: col < this.map.width-1 && this.map.grid[row][col+1] !== 1,
                diagonals: {
                    north: row > 0 && col < this.map.width-1 && this.map.grid[row-1][col+1] === 1,
                    south: row < this.map.height-1 && col < this.map.width-1 && this.map.grid[row+1][col+1] === 1
                }
            },
            west: { 
                visible: col > 0 && this.map.grid[row][col-1] !== 1,
                diagonals: {
                    north: row > 0 && col > 0 && this.map.grid[row-1][col-1] === 1,
                    south: row < this.map.height-1 && col > 0 && this.map.grid[row+1][col-1] === 1
                }
            }
        };
    }

    getEdgePoints(faces, size) {
        const points = [];
        const wallHeight = this.options.wallHeight;

        const addVerticalEdge = (x, z) => {
            points.push(
                new THREE.Vector3(x, -size, z),
                new THREE.Vector3(x, size, z)
            );
        };

        // 1. Add vertical edges for visible faces that meet
        if (faces.north.visible && faces.east.visible) addVerticalEdge(size, -size);
        if (faces.north.visible && faces.west.visible) addVerticalEdge(-size, -size);
        if (faces.south.visible && faces.east.visible) addVerticalEdge(size, size);
        if (faces.south.visible && faces.west.visible) addVerticalEdge(-size, size);

        // 2. Add vertical edges for non-visible faces with diagonal neighbors
        if (!faces.north.visible) {
            if (faces.north.diagonals.east) addVerticalEdge(size, -size);
            if (faces.north.diagonals.west) addVerticalEdge(-size, -size);
        }
        if (!faces.south.visible) {
            if (faces.south.diagonals.east) addVerticalEdge(size, size);
            if (faces.south.diagonals.west) addVerticalEdge(-size, size);
        }
        if (!faces.east.visible) {
            if (faces.east.diagonals.north) addVerticalEdge(size, -size);
            if (faces.east.diagonals.south) addVerticalEdge(size, size);
        }
        if (!faces.west.visible) {
            if (faces.west.diagonals.north) addVerticalEdge(-size, -size);
            if (faces.west.diagonals.south) addVerticalEdge(-size, size);
        }

        // 3. Always add floor edges
        points.push(
            // Front edge (north)
            new THREE.Vector3(-size, -size, -size), new THREE.Vector3(size, -size, -size),
            // Back edge (south)
            new THREE.Vector3(-size, -size, size), new THREE.Vector3(size, -size, size),
            // Left edge (west)
            new THREE.Vector3(-size, -size, -size), new THREE.Vector3(-size, -size, size),
            // Right edge (east)
            new THREE.Vector3(size, -size, -size), new THREE.Vector3(size, -size, size)
        );

        return points;
    }
}