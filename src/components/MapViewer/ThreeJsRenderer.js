import { Renderer2D } from './Renderer2D';
import * as THREE from 'three';
import { MaterialSets } from '../../materials/MaterialSets';
import { LightSources } from '../../lighting/LightSources';

export class ThreeJsRenderer extends Renderer2D {
    setupLighting() {
        // Main torch light - bright outer radius
        this.torchLight = new THREE.PointLight(0xffa95c, 10.0, 60);  // Doubled intensity
        this.torchLight.position.set(0, 5, 0);
        this.torchLight.decay = 1;     // Reduced decay for better visibility
        this.torchLight.distance = 60;

        // Bright close-range light
        this.brightLight = new THREE.PointLight(0xffc1a0, 20.0, 30); // Doubled intensity
        this.brightLight.position.set(0, 5, 0);
        this.brightLight.decay = 1.5;
        this.brightLight.distance = 30;

        // Add very dim ambient light to prevent total darkness
        this.ambientLight = new THREE.AmbientLight(0xfafaff, 0.01);

        this.scene.add(this.torchLight);
        this.scene.add(this.brightLight);
        this.scene.add(this.ambientLight);
    }

    setupMaterials() {

        // roughness:  0 = smooth, 1 = rough.
        // metalness:  0 = non metallic, 1 = metallic.

        this.wallMaterial = new THREE.MeshStandardMaterial({
            color: this.options.wallColor,
            roughness: 0.8,      // Reduced for more reflectivity
            metalness: 0.8,      // Slight metalness for better light response
            //emissive: 0x111111   // Very slight self-illumination
        });

        this.floorMaterial = new THREE.MeshStandardMaterial({
            color: this.options.floorColor,
            roughness: .7,
            metalness: 0,
            side: THREE.DoubleSide,
            //emissive: 0x111111
        });

        this.ceilingMaterial = new THREE.MeshStandardMaterial({
            color: this.options.ceilingColor,
            roughness: 0.1,
            metalness: 0.5,
            side: THREE.DoubleSide,
            //emissive: 0x111111
        });
    }

    constructor(containerId, map, options = {}) {
        console.log('Initializing ThreeJsRenderer...');
        super(containerId, {
            backgroundColor: options.backgroundColor || '#000'
        });
        
        this.map = map;
        this.options = {
            blockSize: 10,  // 10 feet per map block
            floorColor: options.floorColor || 0x666666,
            ceilingColor: options.ceilingColor || 0x444444,
            wallColor: options.wallColor || 0x888888
        };
        
        // Calculate total floor dimensions
        this.worldWidth = this.map.width * this.options.blockSize;   // 50 feet
        this.worldDepth = this.map.height * this.options.blockSize;  // 50 feet
        
        console.log(`Creating world ${this.worldWidth}'×${this.worldDepth}'`);
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Set scene background to pure black
        this.scene.background = new THREE.Color(0x000000);

        // Create camera with reasonable FPS view settings
        this.camera = new THREE.PerspectiveCamera(
            100,     // 60-degree FOV
            4/3,    // 4:3 aspect ratio
            0.1,    // Near clip
            100    // Far clip
        );

        // Create WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        
        // Replace existing canvas with Three.js canvas
        this.canvas.replaceWith(this.renderer.domElement);
        this.canvas = this.renderer.domElement;

        // Use material set from map or default to WorkedStone
        const materialSet = MaterialSets[map.materialSet || 'WorkedStone'];
        this.wallMaterial = materialSet.wallMaterial;
        this.floorMaterial = materialSet.floorMaterial;
        this.ceilingMaterial = materialSet.ceilingMaterial;
        
        // Create torch light source
        this.lightSource = LightSources.Torch;
        this.lightSource.lights.forEach(light => this.scene.add(light));

        this.setupMaterials();
        this.setupLighting();

        // Create floor plane matching map dimensions
        const floorGeometry = new THREE.PlaneGeometry(
            this.worldWidth,
            this.worldDepth
        );
        const floor = new THREE.Mesh(floorGeometry, this.floorMaterial);
        floor.rotation.x = Math.PI / 2;  // Rotate to be horizontal
        floor.position.y = 0;            // At ground level
        
        // Center floor at world origin
        floor.position.x = this.worldWidth / 2;
        floor.position.z = this.worldDepth / 2;
        
        this.scene.add(floor);

        const ceilingGeometry = new THREE.PlaneGeometry(
            this.worldWidth,
            this.worldDepth
        );
        const ceiling = new THREE.Mesh(ceilingGeometry, this.ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;  // Rotate to be horizontal
        ceiling.position.y = 10;            // At ceiling level
        //Center the ceiling with the floor.
        ceiling.position.x = floor.position.x;
        ceiling.position.z = floor.position.z;

        this.scene.add(ceiling);

        // Add this after adding the ceiling but before the grid helpers

        // Create walls from map grid
        console.log('Creating walls from map grid...');
        this.wallGeometry = new THREE.BoxGeometry(
            this.options.blockSize,  // 10' wide
            10,                      // 10' tall (floor to ceiling)
            this.options.blockSize   // 10' deep
        );

        // Iterate through map grid to place walls
        for (let row = 0; row < this.map.height; row++) {
            for (let col = 0; col < this.map.width; col++) {
                if (this.map.grid[row][col] === 1) {
                    const wall = this.createWallWithEdges(row, col);
                    this.scene.add(wall);
                }
            }
        }

        // Add debug grid matching map dimensions and position
        /* const gridHelper = new THREE.GridHelper(
            Math.max(this.worldWidth, this.worldDepth),
            Math.max(this.map.width, this.map.height),
            0xff0000,
            0x444444
        );
        // Position grid to match floor plane
        gridHelper.position.x = this.worldWidth / 2;
        gridHelper.position.z = this.worldDepth / 2;

        this.scene.add(gridHelper);

        const ceilingGridHelper = gridHelper.clone();
        ceilingGridHelper.position.y = 10;
        this.scene.add(ceilingGridHelper);
 */
        console.log(`Floor and grid positioned at (${this.worldWidth/2}, 0, ${this.worldDepth/2})`);

        // Position camera at start position
        const startX = (this.map.start.x + 0.5) * this.options.blockSize;
        const startZ = (this.map.start.y + 0.5) * this.options.blockSize;
        
        this.camera.position.set(startX, 5, startZ);
        this.camera.lookAt(startX, 5, startZ - 10); // Look 10' north

        console.log(`Camera positioned at (${startX}, 5, ${startZ})`);
        this.renderer.render(this.scene, this.camera);

        // Initialize with default light source
        this.currentLightSource = null;  // Store the full LightSource object
        this.updateLightSource(LightSources.Torch);

        this.lastFlickerTime = 0;
        this.flickerInterval = 100; // 10 times per second (100ms)
        this.startFlickerAnimation();
    }

    startFlickerAnimation = () => {
        const currentTime = performance.now();
        
        if (currentTime - this.lastFlickerTime > this.flickerInterval) {
            this.lastFlickerTime = currentTime;
            
            // Use the flickerAmount from the LightSource object
            if (this.currentLightSource && this.currentLightSource.flickerAmount > 0) {
                this.currentLightSource.lights.forEach(light => {
                    const flicker = 1.0 + (Math.random() - 0.5) * this.currentLightSource.flickerAmount;
                    light.power = light.baseIntensity * flicker;
                });
            }
            
            this.renderer.render(this.scene, this.camera);
        }
        
        requestAnimationFrame(this.startFlickerAnimation);
    }

    updateLightSource(newSource) {
        // Remove old lights if they exist
        if (this.currentLightSource) {
            this.currentLightSource.lights.forEach(light => this.scene.remove(light));
            this.currentLightSource.lights.forEach(light => light.dispose());
        }
        
        // Store the complete LightSource object
        this.currentLightSource = newSource;
        
        // Add new lights to scene
        this.currentLightSource.lights.forEach(light => {
            const worldX = (this.lastX + 0.5) * this.options.blockSize;
            const worldZ = (this.lastY + 0.5) * this.options.blockSize;
            light.position.set(worldX, 5, worldZ);
            light.baseIntensity = light.intensity;  // Store initial intensity
            this.scene.add(light);
        });
        
        // Force a render update
        this.renderer.render(this.scene, this.camera);
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

    getEdgePoints(faces) {
        const points = [];
        const size = this.options.blockSize / 2;

        // Helper to add a vertical edge line
        const addVerticalEdge = (x, z) => {
            points.push(
                new THREE.Vector3(x, -size, z),
                new THREE.Vector3(x, size, z)
            );
        };

        // 1. Add vertical edges for visible faces that meet
        if (faces.north.visible && faces.east.visible) {
            addVerticalEdge(size, -size); // NE corner
        }
        if (faces.north.visible && faces.west.visible) {
            addVerticalEdge(-size, -size); // NW corner
        }
        if (faces.south.visible && faces.east.visible) {
            addVerticalEdge(size, size); // SE corner
        }
        if (faces.south.visible && faces.west.visible) {
            addVerticalEdge(-size, size); // SW corner
        }

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

        // 4. Always add ceiling edges
        points.push(
            // Front edge (north)
            new THREE.Vector3(-size, size, -size), new THREE.Vector3(size, size, -size),
            // Back edge (south)
            new THREE.Vector3(-size, size, size), new THREE.Vector3(size, size, size),
            // Left edge (west)
            new THREE.Vector3(-size, size, -size), new THREE.Vector3(-size, size, size),
            // Right edge (east)
            new THREE.Vector3(size, size, -size), new THREE.Vector3(size, size, size)
        );

        return points;
    }

    createWallWithEdges(row, col) {
        const wall = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
        wall.position.x = (col + 0.5) * this.options.blockSize;
        wall.position.y = 5;
        wall.position.z = (row + 0.5) * this.options.blockSize;

        const faces = this.checkVisibleFaces(row, col);
        const edgePoints = this.getEdgePoints(faces);
        
        const edgeGeometry = new THREE.BufferGeometry().setFromPoints(edgePoints);
        const edgeLines = new THREE.LineSegments(
            edgeGeometry,
            new THREE.LineBasicMaterial({ 
                color: 0x000000,
                linewidth: 3,  // Increased from 2
                opacity: 1.0,
                transparent: false
            })
        );

        wall.add(edgeLines);
        return wall;
    }

    render(playerX, playerY, facing) {
        // Store last position for light source updates
        this.lastX = playerX;
        this.lastY = playerY;

        // Convert map grid position to world coordinates
        const worldX = (playerX + 0.5) * this.options.blockSize;
        const worldZ = (playerY + 0.5) * this.options.blockSize;
        
        // Update camera position
        this.camera.position.set(worldX, 5, worldZ);
        
        // Calculate look target based on cardinal directions
        let lookX = worldX;
        let lookZ = worldZ;
        
        // facing values: 0=North, 1=East, 2=South, 3=West
        switch (facing) {
            case 0: lookZ = worldZ - 10; break; // North
            case 1: lookX = worldX + 10; break; // East
            case 2: lookZ = worldZ + 10; break; // South
            case 3: lookX = worldX - 10; break; // West
        }
        
        this.camera.lookAt(lookX, 5, lookZ);

        // Move lights to camera position
        this.torchLight.position.set(worldX, 5, worldZ);
        this.brightLight.position.set(worldX, 5, worldZ);
        
        // Update light positions
        this.lightSource.setPosition(worldX, 5, worldZ);
        
        const directions = ['North', 'East', 'South', 'West'];
        console.log(`Looking from (${worldX}, 5, ${worldZ}) toward (${lookX}, 5, ${lookZ}) - ${directions[facing]}`);
        
        // Update all current lights to follow player
        if (this.currentLightSource) {
            const worldX = (playerX + 0.5) * this.options.blockSize;
            const worldZ = (playerY + 0.5) * this.options.blockSize;
            this.currentLightSource.lights.forEach(light => {
                light.position.set(worldX, 5, worldZ);
            });
        }

        this.renderer.render(this.scene, this.camera);
    }
}