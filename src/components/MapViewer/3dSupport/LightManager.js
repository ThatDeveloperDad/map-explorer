import * as THREE from 'three';

export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.currentLightSource = null;
    }

    setLightSource(newSource) {
        // Remove old lights if they exist
        if (this.currentLightSource) {
            this.currentLightSource.lights.forEach(light => {
                this.scene.remove(light);
                light.dispose();
            });
        }
        
        this.currentLightSource = newSource;
        
        // Add new lights
        this.currentLightSource.lights.forEach(light => {
            this.scene.add(light);
        });
    }

    updatePosition(worldX, worldZ) {
        if (this.currentLightSource) {
            this.currentLightSource.lights.forEach(light => {
                light.position.set(worldX, 5, worldZ);
            });
        }
    }
}