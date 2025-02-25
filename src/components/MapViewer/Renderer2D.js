/**
 * Renderer2D
 * Base class for 2D canvas rendering operations
 */
export class Renderer2D {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || null,
            height: options.height || null,
            backgroundColor: options.backgroundColor || '#000'
        };
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        const rect = this.container.getBoundingClientRect();
        
        // Use specified dimensions or container size
        this.canvas.width = this.options.width || rect.width;
        this.canvas.height = this.options.height || rect.height;
        
        // Don't clear container, just add/replace canvas
        const existingCanvas = this.container.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.replaceWith(this.canvas);
        } else {
            this.container.prepend(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
    }

    clear() {
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    withTransform(callback) {
        this.ctx.save();
        callback(this.ctx);
        this.ctx.restore();
    }

    setViewport(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    getCanvasSize() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    getContext() {
        return this.ctx;
    }
}