import { Renderer2D } from './Renderer2D';
import * as THREE from 'three';
import { MaterialSets } from '../../materials/MaterialSets';
import { LightSources } from '../../lighting/LightSources';
import { Camera } from './3dSupport/Camera';
import { StageBuilder } from './3dSupport/StageBuilder';

export class ThreeJsRenderer extends Renderer2D {
    constructor(containerId, map, options = {}) {
        super(containerId, { backgroundColor: options.backgroundColor || '#000' });
        
        this.initializeProperties(map, options);
        this.setupScene();
        this.camera = new Camera();
        this.setupRenderer();
        
        // Setup materials first
        this.setupMaterials();
        
        // Build the 3D stage
        this.stageBuilder = new StageBuilder(this.scene, this.options);
        this.stageBuilder.buildFromMap(this.map, {
            wallMaterial: this.wallMaterial,
            floorMaterial: this.floorMaterial,
            ceilingMaterial: this.ceilingMaterial
        });
        
        this.setupLighting();
        this.positionCameraAtStart();
    }

    initializeProperties(map, options) {
        this.map = map;
        this.options = {
            blockSize: 10,
            floorColor: options.floorColor || 0x666666,
            ceilingColor: options.ceilingColor || 0x444444,
            wallColor: options.wallColor || 0x888888
        };
        this.worldWidth = this.map.width * this.options.blockSize;
        this.worldDepth = this.map.height * this.options.blockSize;
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

    setupMaterials() {
        const materialSet = MaterialSets[this.map.materialSet || 'WorkedStone'];
        this.wallMaterial = materialSet.wallMaterial;
        this.floorMaterial = materialSet.floorMaterial;
        this.ceilingMaterial = materialSet.ceilingMaterial;
    }

    setupLighting() {
        this.currentLightSource = null;
        this.updateLightSource(LightSources.Torch);
        
        this.lastFlickerTime = 0;
        this.flickerInterval = 100; // 10 times per second
        
        this.startFlickerAnimation = this.startFlickerAnimation.bind(this);
        this.startFlickerAnimation();
    }

    startFlickerAnimation() {
        const currentTime = performance.now();
        
        if (currentTime - this.lastFlickerTime > this.flickerInterval) {
            this.lastFlickerTime = currentTime;
            
            if (this.currentLightSource && this.currentLightSource.flickerAmount > 0) {
                this.currentLightSource.lights.forEach(light => {
                    const flicker = 1.0 + (Math.random() - 0.5) * this.currentLightSource.flickerAmount;
                    light.intensity = light.baseIntensity * flicker;
                });
            }
            
            this.renderer.render(this.scene, this.camera.getCamera());
        }
        
        requestAnimationFrame(this.startFlickerAnimation);
    }

    positionCameraAtStart() {
        const startX = (this.map.start.x + 0.5) * this.options.blockSize;
        const startZ = (this.map.start.y + 0.5) * this.options.blockSize;
        this.camera.setPosition(startX, 5, startZ);
        this.camera.updateRotation(0, startX, startZ);
    }

    render(playerX, playerY, facing) {
        const worldX = (playerX + 0.5) * this.options.blockSize;
        const worldZ = (playerY + 0.5) * this.options.blockSize;
        
        this.camera.setPosition(worldX, 5, worldZ);
        this.camera.updateRotation(facing, worldX, worldZ);
        
        if (this.currentLightSource) {
            this.currentLightSource.lights.forEach(light => {
                light.position.set(worldX, 5, worldZ);
            });
        }

        this.renderer.render(this.scene, this.camera.getCamera());
    }

    updateLightSource(newSource) {
        if (this.currentLightSource) {
            this.currentLightSource.lights.forEach(light => {
                this.scene.remove(light);
                light.dispose();
            });
        }
        
        this.currentLightSource = newSource;
        
        this.currentLightSource.lights.forEach(light => {
            light.baseIntensity = light.intensity;
            this.scene.add(light);
        });
        
        this.render(this.lastX, this.lastY, this.camera.getRotation());
    }
}