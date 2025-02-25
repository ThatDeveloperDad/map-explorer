export class WallSegment {
    constructor(start, end, distance, color = null) {
        this.start = start;      // Screen X coordinate
        this.end = end;          // Screen X coordinate
        this.distance = distance;
        this.color = color;      // Optional override color
    }
}