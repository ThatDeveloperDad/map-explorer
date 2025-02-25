import { Renderer2D } from './Renderer2D';
import * as THREE from 'three';
import { LightSources } from '../../lighting/LightSources';
import { Camera } from './3dSupport/Camera';
import { StageBuilder } from './3dSupport/StageBuilder';
import { LightManager } from './3dSupport/LightManager';

export class ThreeJsRenderer extends Renderer2D {
    constructor(containerId, map, options = {}) {
        super(containerId, { backgroundColor: options.backgroundColor || '#000' });
        
        this.map = map;
        this.options = this.initializeOptions(options);
        
        // Store initial position values
        this.lastX = map.start.x;
        this.lastY = map.start.y;
        this.lastFacing = map.start.facing;
        
        this.setupScene();
        this.setupRenderer();
        this.camera = new Camera();
        
        // Build the 3D stage
        this.stageBuilder = new StageBuilder(this.scene, this.options);
        this.stageBuilder.buildFromMap(this.map);
        
        // Initialize lighting
        this.lightManager = new LightManager(this.scene);
        this.lightManager.setLightSource(LightSources.Torch);
        
        // Position camera and force initial render
        this.positionCameraAtStart();
        
        // Force an immediate render with stored position values
        requestAnimationFrame(() => {
            this.render(this.lastX, this.lastY, this.lastFacing);
        });
    }

    initializeOptions(options) {
        return {
            blockSize: 10,
            floorColor: options.floorColor || 0x666666,
            ceilingColor: options.ceilingColor || 0x444444,
            wallColor: options.wallColor || 0x888888
        };
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.canvas.replaceWith(this.renderer.domElement);
        this.canvas = this.renderer.domElement;
    }

    gridToWorldPosition(x, y) {
        return {
            x: (x + 0.5) * this.options.blockSize,
            z: (y + 0.5) * this.options.blockSize
        };
    }

    positionCameraAtStart() {
        const { x: startX, z: startZ } = this.gridToWorldPosition(this.map.start.x, this.map.start.y);
        this.camera.setPosition(startX, 5, startZ);
        this.camera.updateRotation(0, startX, startZ);
    }

    render(playerX, playerY, facing) {
        const { x: worldX, z: worldZ } = this.gridToWorldPosition(playerX, playerY);
        
        this.camera.setPosition(worldX, 5, worldZ);
        this.camera.updateRotation(facing, worldX, worldZ);
        
        this.lightManager.updatePosition(worldX, worldZ);
        this.renderer.render(this.scene, this.camera.getCamera());
    }

    updateLightSource(newSource) {
        this.lightManager.setLightSource(newSource);
        this.render(this.lastX, this.lastY, this.camera.getRotation());
    }
}