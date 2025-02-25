import * as THREE from 'three';
import { MaterialSets } from '../../../materials/MaterialSets';
import { CellBuilder } from './CellBuilder';

export class StageBuilder {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = this.initializeOptions(options);
        this.materials = null;
    }

    initializeOptions(options) {
        return {
            blockSize: options.blockSize || 10,
            wallHeight: options.wallHeight || 10,
            edgeColor: options.edgeColor || 0x000000,
            showEdges: options.showEdges !== undefined ? options.showEdges : true
        };
    }

    buildFromMap(map) {
        this.map = map;
        this.materials = this.setupMaterials();
        this.worldWidth = map.width * this.options.blockSize;
        this.worldDepth = map.height * this.options.blockSize;
        
        this.cellBuilder = new CellBuilder(this.options, this.materials);
        
        // Build each cell
        for (let row = 0; row < map.height; row++) {
            for (let col = 0; col < map.width; col++) {
                const cellType = map.grid[row][col];
                const position = {
                    x: (col + 0.5) * this.options.blockSize,
                    y: this.options.wallHeight / 2,
                    z: (row + 0.5) * this.options.blockSize
                };
                const neighbors = this.getNeighbors(row, col);
                
                const cell = this.cellBuilder.buildCell(
                    cellType,
                    position,
                    neighbors
                );
                
                this.scene.add(cell);
            }
        }
    }

    getNeighbors(row, col) {
        return {
            north: row > 0 ? this.map.grid[row-1][col] : null,
            south: row < this.map.height-1 ? this.map.grid[row+1][col] : null,
            east: col < this.map.width-1 ? this.map.grid[row][col+1] : null,
            west: col > 0 ? this.map.grid[row][col-1] : null
        };
    }

    setupMaterials() {
        const materialSet = MaterialSets[this.map.materialSet || 'WorkedStone'];
        if (!materialSet) {
            throw new Error(`Material set '${this.map.materialSet}' not found`);
        }

        return {
            wallMaterial: materialSet.wallMaterial,
            floorMaterial: materialSet.floorMaterial,
            ceilingMaterial: materialSet.ceilingMaterial
        };
    }
}