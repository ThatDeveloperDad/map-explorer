import { Renderer2D } from './Renderer2D.js';

/**
 * TopDownMapRenderer
 * Specialized renderer for top-down map view with player position
 */
export class TopDownMapRenderer extends Renderer2D {
    constructor(containerId, map, options = {}) {
        super(containerId, {
            backgroundColor: options.floorColor || '#222'
        });
        
        this.map = map;
        this.options = {
            cellSize: options.cellSize || 40,
            playerColor: options.playerColor || '#0f0',
            wallColor: options.wallColor || '#666',
            floorColor: options.floorColor || '#222',
            centerOnPlayer: options.centerOnPlayer || false
        };
        
        this.viewState = {
            panX: 0,
            panY: 0,
            zoomLevel: 1,
            baseCell: this.options.cellSize
        };
        
        this.initializeMapView();
    }

    initializeMapView() {
        if (this.options.centerOnPlayer) {
            const rect = this.getCanvasSize();
            this.options.cellSize = Math.min(
                Math.floor(rect.width / 5),
                Math.floor(rect.height / 5)
            );
            this.viewState.baseCell = this.options.cellSize;
        } else {
            this.setViewport(
                this.map.width * this.options.cellSize,
                this.map.height * this.options.cellSize
            );
        }
    }

    setZoom(level) {
        this.viewState.zoomLevel = Math.max(0.5, Math.min(2, level));
        this.options.cellSize = this.viewState.baseCell * this.viewState.zoomLevel;
    }

    setPan(x, y) {
        this.viewState.panX = x;
        this.viewState.panY = y;
    }

    recenterOnPlayer() {
        this.viewState.panX = 0;
        this.viewState.panY = 0;
    }

    getViewportOffset(playerX, playerY) {
        if (!this.options.centerOnPlayer) return { x: 0, y: 0 };

        const { width, height } = this.getCanvasSize();
        return {
            x: width/2 - ((playerX + 0.5) * this.options.cellSize) + this.viewState.panX,
            y: height/2 - ((playerY + 0.5) * this.options.cellSize) + this.viewState.panY
        };
    }

    drawGrid(offset) {
        const ctx = this.getContext();
        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const cell = this.map.grid[y][x];
                ctx.fillStyle = cell === 1 ? this.options.wallColor : this.options.floorColor;
                ctx.fillRect(
                    x * this.options.cellSize,
                    y * this.options.cellSize,
                    this.options.cellSize - 1,  // Always maintain 1px border
                    this.options.cellSize - 1   // Always maintain 1px border
                );
            }
        }
    }

    drawPlayer(playerX, playerY, facing) {
        this.withTransform(ctx => {
            ctx.translate(
                playerX * this.options.cellSize + this.options.cellSize/2,
                playerY * this.options.cellSize + this.options.cellSize/2
            );
            ctx.rotate(facing * Math.PI/2);
            
            const size = this.options.cellSize;
            ctx.beginPath();
            ctx.moveTo(0, -size/3);
            ctx.lineTo(-size/4, size/4);
            ctx.lineTo(size/4, size/4);
            ctx.closePath();
            ctx.fillStyle = this.options.playerColor;
            ctx.fill();
        });
    }

    render(playerX, playerY, facing) {
        this.clear();
        const offset = this.getViewportOffset(playerX, playerY);
        
        this.withTransform(ctx => {
            ctx.translate(offset.x, offset.y);
            this.drawGrid(offset);
            this.drawPlayer(playerX, playerY, facing);
        });
    }
}