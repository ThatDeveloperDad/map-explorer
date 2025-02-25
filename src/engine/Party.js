/**
 * Represents the player party's state
 */
export class Party {
    constructor(x, y, facing) {
        this.x = x;
        this.y = y;
        this.facing = facing; // 0=North, 1=East, 2=South, 3=West
    }

    toString() {
        return `(${this.x}, ${this.y}) facing ${['N','E','S','W'][this.facing]}`;
    }
}