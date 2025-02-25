import * as THREE from 'three';

export class MaterialSet {
    constructor(name, wallProps, floorProps, ceilingProps) {
        this.name = name;
        this.wallMaterial = new THREE.MeshStandardMaterial(wallProps);
        this.floorMaterial = new THREE.MeshStandardMaterial(floorProps);
        this.ceilingMaterial = new THREE.MeshStandardMaterial(ceilingProps);
    }
}

export const MaterialSets = {
    WorkedStone: new MaterialSet(
        'Worked Stone',
        {
            color: 0x888888,
            roughness: 0.8,
            metalness: 0.1
        },
        {
            color: 0x666666,
            roughness: 0.7,
            metalness: 0.2,
            side: THREE.DoubleSide
        },
        {
            color: 0x444444,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide
        }
    ),
    
    RoughStone: new MaterialSet(
        'Rough Stone',
        {
            color: 0x555555,
            roughness: 0.9,
            metalness: 0.0
        },
        {
            color: 0x333333,
            roughness: 0.95,
            metalness: 0.0,
            side: THREE.DoubleSide
        },
        {
            color: 0x222222,
            roughness: 0.95,
            metalness: 0.0,
            side: THREE.DoubleSide
        }
    )
};