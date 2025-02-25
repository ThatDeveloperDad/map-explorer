import * as THREE from 'three';
import { CellTypes } from './CellTypes';

export class CellBuilder {
    constructor(options, materials) {
        this.options = options;
        this.materials = materials;
    }

    buildCell(type, position, neighbors) {
        const cell = new THREE.Group();
        
        switch(type) {
            case CellTypes.EMPTY.id:
                this.buildEmptyCell(cell, position);
                break;
            case CellTypes.WALL.id:
                this.buildWallCell(cell, position, neighbors);
                break;
        }

        return cell;
    }

    buildEmptyCell(cell, position) {
        const floor = this.createFloor(position);
        const ceiling = this.createCeiling(position);
        cell.add(floor);
        cell.add(ceiling);
    }

    buildWallCell(cell, position, neighbors) {
        // Only create visible wall faces
        const visibleFaces = this.determineVisibleFaces(neighbors);
        const wallGeometry = this.createVisibleWallFaces(position, visibleFaces);
        cell.add(wallGeometry);

        if (this.options.showEdges) {
            const edges = this.createEdges(position, visibleFaces);
            cell.add(edges);
        }
    }

    createFloor(position) {
        const geometry = new THREE.PlaneGeometry(
            this.options.blockSize,
            this.options.blockSize
        );
        const floor = new THREE.Mesh(geometry, this.materials.floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(position.x, 0, position.z);
        return floor;
    }

    createCeiling(position) {
        const geometry = new THREE.PlaneGeometry(
            this.options.blockSize,
            this.options.blockSize
        );
        const ceiling = new THREE.Mesh(geometry, this.materials.ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(position.x, this.options.wallHeight, position.z);
        return ceiling;
    }

    determineVisibleFaces(neighbors) {
        return {
            north: neighbors.north === CellTypes.EMPTY.id,
            south: neighbors.south === CellTypes.EMPTY.id,
            east: neighbors.east === CellTypes.EMPTY.id,
            west: neighbors.west === CellTypes.EMPTY.id
        };
    }

    createVisibleWallFaces(position, visibleFaces) {
        const wallGroup = new THREE.Group();
        const halfSize = this.options.blockSize / 2;
        const halfHeight = this.options.wallHeight / 2;

        if (visibleFaces.north) {
            const face = this.createWallFace();
            face.position.set(0, halfHeight, -halfSize);
            face.rotation.y = Math.PI;
            wallGroup.add(face);
        }

        if (visibleFaces.south) {
            const face = this.createWallFace();
            face.position.set(0, halfHeight, halfSize);
            wallGroup.add(face);
        }

        if (visibleFaces.east) {
            const face = this.createWallFace();
            face.position.set(halfSize, halfHeight, 0);
            face.rotation.y = Math.PI / 2;
            wallGroup.add(face);
        }

        if (visibleFaces.west) {
            const face = this.createWallFace();
            face.position.set(-halfSize, halfHeight, 0);
            face.rotation.y = -Math.PI / 2;
            wallGroup.add(face);
        }

        wallGroup.position.set(position.x, 0, position.z);
        return wallGroup;
    }

    createWallFace() {
        const geometry = new THREE.PlaneGeometry(
            this.options.blockSize,
            this.options.wallHeight
        );
        return new THREE.Mesh(geometry, this.materials.wallMaterial);
    }

    createEdges(position, visibleFaces) {
        const edges = new THREE.Group();
        const halfSize = this.options.blockSize / 2;
        const height = this.options.ceilingOffset - this.options.floorOffset;

        // Create edge geometry
        const points = [];
        
        // Vertical edges - now extending from floor to ceiling
        if (visibleFaces.north && visibleFaces.east) {
            points.push(
                new THREE.Vector3(halfSize, this.options.floorOffset, -halfSize),
                new THREE.Vector3(halfSize, this.options.ceilingOffset, -halfSize)
            );
        }
        if (visibleFaces.north && visibleFaces.west) {
            points.push(
                new THREE.Vector3(-halfSize, this.options.floorOffset, -halfSize),
                new THREE.Vector3(-halfSize, this.options.ceilingOffset, -halfSize)
            );
        }
        if (visibleFaces.south && visibleFaces.east) {
            points.push(
                new THREE.Vector3(halfSize, this.options.floorOffset, halfSize),
                new THREE.Vector3(halfSize, this.options.ceilingOffset, halfSize)
            );
        }
        if (visibleFaces.south && visibleFaces.west) {
            points.push(
                new THREE.Vector3(-halfSize, this.options.floorOffset, halfSize),
                new THREE.Vector3(-halfSize, this.options.ceilingOffset, halfSize)
            );
        }

        const edgeGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: this.options.edgeColor
        });
        
        const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        edgeLines.position.set(position.x, 0, position.z);
        
        return edgeLines;
    }
}