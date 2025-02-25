import * as THREE from 'three';

export class TextureManager {
    constructor() {
        this.loader = new THREE.TextureLoader();
        this.cache = new Map();
    }

    loadTexture(path) {
        console.log('Loading texture:', path);
        
        if (this.cache.has(path)) {
            console.log('Found in cache:', path);
            return this.cache.get(path);
        }

        const texture = this.loader.load(
            path,
            (loaded) => console.log('Texture loaded successfully:', path),
            undefined,
            (error) => console.error('Error loading texture:', path, error)
        );
        
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        this.cache.set(path, texture);
        return texture;
    }
}