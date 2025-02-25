/**
 * ControlBox Component
 * Reusable control panel with configurable buttons and layout
 */
export class ControlBox {
    constructor(config) {
        this.config = config;
        this.handlers = new Map();
    }

    createHTML() {
        return `
            <div class="control-panel">
                ${this.config.rows.map(row => `
                    <div class="control-row">
                        ${row.map(button => `
                            <button class="control-btn" id="${button.id}">
                                ${button.symbol}
                            </button>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    attach(containerId) {
        const container = document.getElementById(containerId);
        container.insertAdjacentHTML('beforeend', this.createHTML());
        this.attachHandlers();
    }

    on(buttonId, handler) {
        this.handlers.set(buttonId, handler);
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', handler);
        }
    }

    attachHandlers() {
        this.handlers.forEach((handler, buttonId) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }
}