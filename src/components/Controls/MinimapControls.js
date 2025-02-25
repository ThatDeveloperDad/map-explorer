import { ControlBox } from './ControlBox.js';

export class MinimapControls extends ControlBox {
    constructor() {
        super({
            rows: [
                [
                    { id: 'minimapZoomIn', symbol: '+' },
                    { id: 'minimapZoomOut', symbol: '−' },  // Using an en dash for better appearance
                    { id: 'minimapRecenter', symbol: '⌖' }
                ]
            ]
        });
    }
}