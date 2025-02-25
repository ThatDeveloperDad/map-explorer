/**
 * Map Class
 * Represents a dungeon map as a grid of 5' squares
 * 0 = passable space
 * 1 = wall/impassable
 */
export class Map {
    constructor(data) {
        this.width = data.width;
        this.height = data.height;
        this.grid = data.grid;
        this.start = {
            x: data.start.x,
            y: data.start.y,
            facing: data.start.facing
        };
        this.validateGrid();
    }

    validateGrid() {
        // Ensure grid matches specified dimensions
        if (this.grid.length !== this.height) {
            throw new Error('Grid height does not match specified height');
        }
        
        // Ensure all rows have the same width
        if (!this.grid.every(row => row.length === this.width)) {
            throw new Error('Grid rows must all have the same width');
        }

        // Ensure grid only contains 0s and 1s
        if (!this.grid.every(row => row.every(cell => cell === 0 || cell === 1))) {
            throw new Error('Grid cells must be 0 or 1');
        }

        // Validate start position
        if (!this.isWalkable(this.start.x, this.start.y)) {
            throw new Error('Start position must be in a walkable cell');
        }
    }

    isWalkable(x, y) {
        // Check bounds
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        return this.grid[y][x] === 0;
    }
}