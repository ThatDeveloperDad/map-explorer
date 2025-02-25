import { Renderer2D } from './Renderer2D.js';
import { Vector2D } from './Vector2D.js';
import { WallSegment } from './WallSegment.js';

export class FirstPersonRenderer extends Renderer2D {
    constructor(containerId, map, options = {}) {
        super(containerId, {
            backgroundColor: options.backgroundColor || '#000'
        });
        
        this.map = map;  // Now this will work because super() was called first
        this.options = {
            wallColor: options.wallColor || '#666',
            floorColor: options.floorColor || '#222',
            ceilingColor: options.ceilingColor || '#444',
            fov: options.fov || 60,        // Field of view in degrees
            viewDistance: 6,               // 60 feet / 10 feet per block
            blockSize: 10,                 // 10 feet per block
            wallHeight: 10,                // 10 feet high walls
            eyeHeight: 5,                  // Eye level at 5 feet
            minWallHeightPercent: 0.80,    // Wall takes 80% at closest (10% floor, 10% ceiling)
            maxWallHeightPercent: 0.20     // Wall takes 20% at furthest
        };

        this.aspectRatio = 4/3;
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        const rect = this.container.getBoundingClientRect();
        
        // Calculate size maintaining 4:3 aspect ratio
        const height = rect.height;
        const width = height * this.aspectRatio;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Center the canvas horizontally if container is wider
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0 auto';
        
        const existingCanvas = this.container.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.replaceWith(this.canvas);
        } else {
            this.container.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
    }

    calculateWallHeight(distance) {
        const h = this.canvas.height;
        
        // If we're at or beyond view distance, return minimum height
        if (distance >= this.options.viewDistance) {
            return h * this.options.maxWallHeightPercent;  // 20% of viewport height
        }
        
        // Linear interpolation between max and min height based on distance
        const heightPercent = Math.max(0, 
            this.options.minWallHeightPercent - 
            (distance / this.options.viewDistance) * 
            (this.options.minWallHeightPercent - this.options.maxWallHeightPercent)
        );
        
        return h * heightPercent;
    }

    render(playerX, playerY, facing) {
        this.clear();
        const h = this.canvas.height;
        const w = this.canvas.width;

        // Draw background
        this.ctx.fillStyle = this.options.ceilingColor;
        this.ctx.fillRect(0, 0, w, h/2);
        this.ctx.fillStyle = this.options.floorColor;
        this.ctx.fillRect(0, h/2, w, h/2);

        const { segments, centerDist } = this.findWallSegments(playerX, playerY, facing);
        
        segments.forEach((segment, index) => {
            let leftHeight, rightHeight;
            
            switch(index) {
                case 0: // Left wall
                    leftHeight = this.calculateWallHeight(segment.distance);
                    rightHeight = this.calculateWallHeight(centerDist);
                    break;
                case 1: // Center wall (square)
                    // Always 20% of viewport height
                    leftHeight = rightHeight = h * this.options.maxWallHeightPercent;
                    break;
                case 2: // Right wall
                    leftHeight = this.calculateWallHeight(centerDist);
                    rightHeight = this.calculateWallHeight(segment.distance);
                    break;
            }
            
            // Draw wall segment
            this.ctx.beginPath();
            this.ctx.moveTo(segment.start, (h - leftHeight) / 2);
            this.ctx.lineTo(segment.end, (h - rightHeight) / 2);
            this.ctx.lineTo(segment.end, (h + rightHeight) / 2);
            this.ctx.lineTo(segment.start, (h + leftHeight) / 2);
            this.ctx.closePath();
            
            this.ctx.fillStyle = segment.color || this.options.wallColor;
            this.ctx.fill();
        });
    }

    findWallSegments(playerX, playerY, facing) {
        const segments = [];
        const position = new Vector2D(playerX + 0.5, playerY + 0.5);
        
        // Define our view frustum
        const halfFOV = (this.options.fov / 2) * (Math.PI / 180);
        const leftAngle = facing - halfFOV;
        const centerAngle = facing;
        const rightAngle = facing + halfFOV;
        
        // Cast rays for walls
        const leftDist = this.castRay(position.x, position.y, leftAngle);
        const centerDist = this.castRay(position.x, position.y, centerAngle);
        const rightDist = this.castRay(position.x, position.y, rightAngle);
        
        // Center square width calculation (20% of viewport width)
        const centerWidth = this.canvas.width * 0.2;
        const centerStart = (this.canvas.width - centerWidth) / 2;
        const centerEnd = centerStart + centerWidth;
        
        return {
            segments: [
                // Left wall segment
                new WallSegment(0, centerStart, leftDist),
                // Center distance square (always at max distance)
                new WallSegment(
                    centerStart,
                    centerEnd,
                    this.options.viewDistance,
                    centerDist >= this.options.viewDistance ? '#000' : this.options.wallColor
                ),
                // Right wall segment
                new WallSegment(centerEnd, this.canvas.width, rightDist)
            ],
            centerDist: this.options.viewDistance
        };
    }

    angleToScreenX(angle, facing) {
        const normalizedAngle = (angle - facing) / (this.options.fov * Math.PI / 180);
        return (normalizedAngle + 0.5) * this.canvas.width;
    }

    castRay(x, y, angle) {
        // Convert game angle to mathematical angle
        // Game: 0 = North, π/2 = East, π = South, 3π/2 = West
        const mathAngle = (Math.PI/2) - angle;
        
        const dx = Math.cos(mathAngle);
        const dy = -Math.sin(mathAngle);
        
        console.log(`Casting ray: angle=${(angle * 180 / Math.PI).toFixed(1)}°, dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)}`);
        
        let distance = 0;
        const step = 0.1;
        
        while (distance < this.options.viewDistance) {
            const checkX = Math.floor(x + dx * distance);
            const checkY = Math.floor(y + dy * distance);
            
            // Add bounds checking
            if (checkX < 0 || checkX >= this.map.width || 
                checkY < 0 || checkY >= this.map.height) {
                console.log(`Ray hit boundary at distance ${distance.toFixed(2)}`);
                return this.options.viewDistance;
            }
            
            if (this.map.grid[checkY][checkX] === 1) {
                console.log(`Ray hit wall at (${checkX}, ${checkY}), distance ${distance.toFixed(2)}`);
                return distance;
            }
            
            distance += step;
        }
        
        console.log(`Ray reached max distance ${this.options.viewDistance}`);
        return this.options.viewDistance;
    }
}