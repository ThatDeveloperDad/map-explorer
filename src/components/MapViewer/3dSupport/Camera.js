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
        this.camera = new THREE.PerspectiveCamera(
            100,     // 60-degree FOV
            4/3,    // 4:3 aspect ratio
            0.1,    // Near clip
            100    // Far clip
        );
    }

    setPosition(x, y, z) {
        this.camera.position.set(x, y, z);
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
        
        this.lookAt(lookX, 5, lookZ);
    }
}