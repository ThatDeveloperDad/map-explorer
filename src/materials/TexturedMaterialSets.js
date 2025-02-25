import * as THREE from 'three';
import { TextureManager } from './TextureManager';

const textureManager = new TextureManager();

export const createTexturedMaterialSet = (definition) => {
    const textures = {};
    
    for (const [key, path] of Object.entries(definition.textures)) {
        textures[key] = textureManager.loadTexture(path);
    }
    
    const materials = {
        wallMaterial: new THREE.MeshStandardMaterial({ 
            map: textures.wall,
            side: THREE.DoubleSide,
            roughness: 0.95,    // Increased roughness
            metalness: 0     // non-metallic
        }),
        floorMaterial: new THREE.MeshStandardMaterial({ 
            map: textures.floor,
            side: THREE.DoubleSide,
            roughness: 0.9,
            metalness: 0.01     // Nearly non-metallic
        }),
        ceilingMaterial: new THREE.MeshStandardMaterial({ 
            map: textures.ceiling,
            side: THREE.DoubleSide,
            roughness: 0.95,    // Increased roughness
            metalness: 0.01     // Nearly non-metallic
        })
    };
    
    return materials;
};

export const TexturedMaterialSets = {
    Dungeon: {
        textures: {
            wall: './assets/textures/dungeon/stone_wall.png',
            floor: './assets/textures/dungeon/stone_floor.png',
            ceiling: './assets/textures/dungeon/stone_floor.png'  // Using floor for now
        }
    }
};