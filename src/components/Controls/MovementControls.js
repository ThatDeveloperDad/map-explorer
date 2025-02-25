import { ControlBox } from './ControlBox.js';

export class MovementControls extends ControlBox {
    constructor() {
        super({
            rows: [
                [
                    { id: 'turnLeft', symbol: '↰' },
                    { id: 'moveForward', symbol: '↑' },
                    { id: 'turnRight', symbol: '↱' }
                ],
                [
                    { id: 'strafeLeft', symbol: '←' },
                    { id: 'moveBackward', symbol: '↓' },
                    { id: 'strafeRight', symbol: '→' }
                ]
            ]
        });
    }
}