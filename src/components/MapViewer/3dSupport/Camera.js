import * as THREE from 'three';

/**
 * Camera Controller
 * Manages the player's point of view within the map
 * 
 * Responsibilities:
 * - Track position and viewing angle
 * - Handle movement calculations
 * - Provide collision detection with map walls
 * 
 * Dependencies:
 * - ../../engine/Vector.js - For position/movement calculations
 * - ../../engine/Map.js - For collision detection
 */

export class Camera {
    constructor(options = {}) {
        // Create the THREE.PerspectiveCamera instance
        this.camera = new THREE.PerspectiveCamera(
            100,    // FOV
            4/3,    // aspect ratio
            0.1,    // near clip
            100     // far clip
        );
    }

    // Getter to access the THREE.Camera instance directly
    getCamera() {
        return this.camera;
    }

    setPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    getRotation() {
        return this.camera.rotation.y;
    }

    setRotation(y) {
        this.camera.rotation.y = y;
    }

    lookAt(x, y, z) {
        this.camera.lookAt(x, y, z);
    }

    updateRotation(facing, worldX, worldZ) {
        let lookX = worldX;
        let lookZ = worldZ;
        
        switch (facing) {
            case 0: lookZ = worldZ - 10; break; // North
            case 1: lookX = worldX + 10; break; // East
            case 2: lookZ = worldZ + 10; break; // South
            case 3: lookX = worldX - 10; break; // West
        }
        
        this.camera.lookAt(lookX, 5, lookZ);
    }
}