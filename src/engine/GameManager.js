import { Party } from './Party.js';
import { MovementType } from './MovementTypes.js';
import { LightSources } from '../lighting/LightSources.js';

/**
 * Coordinates game state and updates between components
 */
export class GameManager {
    constructor(map, mainRenderer, minimapRenderer) {
        this.map = map;
        this.mainRenderer = mainRenderer;
        this.minimapRenderer = minimapRenderer;
        this.party = {
            x: map.start.x,
            y: map.start.y,
            facing: map.start.facing || 0,
            lightSource: LightSources.Torch  // Default light source
        };
        this.coordsDisplay = document.getElementById('PartyCoords');
    }

    initialize() {
        this.updateDisplays();
    }

    updateDisplays() {
        // Update both renderers
        this.mainRenderer.render(this.party.x, this.party.y, this.party.facing);
        this.minimapRenderer.render(this.party.x, this.party.y, this.party.facing);
        // Update coordinates display
        this.coordsDisplay.textContent = this.party.toString();
    }

    canMoveTo(x, y) {
        return this.map.isWalkable(x, y);
    }

    handleMovement(dx, dy) {
        const newX = this.party.x + dx;
        const newY = this.party.y + dy;
        
        if (this.canMoveTo(newX, newY)) {
            this.party.x = newX;
            this.party.y = newY;
            this.updateDisplays();
        }
    }

    handleTurn(direction) {
        // direction: 1 for right, -1 for left
        this.party.facing = (this.party.facing + direction + 4) % 4;
        this.updateDisplays();
    }

    moveParty(movementType) {
        switch (movementType) {
            case MovementType.MOVE_FORWARD:
                const [dx, dy] = this.getMovementVector(this.party.facing);
                this.tryMoveParty(dx, dy);
                break;
            case MovementType.MOVE_BACKWARD:
                const [bdx, bdy] = this.getMovementVector((this.party.facing + 2) % 4);
                this.tryMoveParty(bdx, bdy);
                break;
            case MovementType.STRAFE_LEFT:
                const [ldx, ldy] = this.getMovementVector((this.party.facing + 3) % 4);
                this.tryMoveParty(ldx, ldy);
                break;
            case MovementType.STRAFE_RIGHT:
                const [rdx, rdy] = this.getMovementVector((this.party.facing + 1) % 4);
                this.tryMoveParty(rdx, rdy);
                break;
            case MovementType.TURN_LEFT:
                this.party.facing = (this.party.facing + 3) % 4;
                this.updateDisplays();
                break;
            case MovementType.TURN_RIGHT:
                this.party.facing = (this.party.facing + 1) % 4;
                this.updateDisplays();
                break;
        }
    }

    getMovementVector(facing) {
        const moves = [
            [0, -1],  // North
            [1, 0],   // East
            [0, 1],   // South
            [-1, 0]   // West
        ];
        return moves[facing];
    }

    tryMoveParty(dx, dy) {
        const newX = this.party.x + dx;
        const newY = this.party.y + dy;
        
        if (this.map.isWalkable(newX, newY)) {
            this.party.x = newX;
            this.party.y = newY;
            this.updateDisplays();
        }
    }

    // Movement command handlers
    moveForward() {
        const moves = [[0,-1], [1,0], [0,1], [-1,0]];
        const [dx, dy] = moves[this.party.facing];
        this.handleMovement(dx, dy);
    }

    moveBackward() {
        const moves = [[0,1], [-1,0], [0,-1], [1,0]];
        const [dx, dy] = moves[this.party.facing];
        this.handleMovement(dx, dy);
    }

    strafeLeft() {
        const moves = [[-1,0], [0,-1], [1,0], [0,1]];
        const [dx, dy] = moves[this.party.facing];
        this.handleMovement(dx, dy);
    }

    strafeRight() {
        const moves = [[1,0], [0,1], [-1,0], [0,-1]];
        const [dx, dy] = moves[this.party.facing];
        this.handleMovement(dx, dy);
    }

    turnLeft() {
        this.handleTurn(-1);
    }

    turnRight() {
        this.handleTurn(1);
    }

    moveEntity(entity, movementType) {
        switch (movementType) {
            case MovementType.MOVE_FORWARD:
                const [dx, dy] = this.getMovementVector(entity.facing);
                this.tryMoveEntity(entity, dx, dy);
                break;
            case MovementType.MOVE_BACKWARD:
                const [bdx, bdy] = this.getMovementVector((entity.facing + 2) % 4);
                this.tryMoveEntity(entity, bdx, bdy);
                break;
            case MovementType.STRAFE_LEFT:
                const [ldx, ldy] = this.getMovementVector((entity.facing + 3) % 4);
                this.tryMoveEntity(entity, ldx, ldy);
                break;
            case MovementType.STRAFE_RIGHT:
                const [rdx, rdy] = this.getMovementVector((entity.facing + 1) % 4);
                this.tryMoveEntity(entity, rdx, rdy);
                break;
            case MovementType.TURN_LEFT:
                entity.facing = (entity.facing + 3) % 4;
                this.updateDisplays();
                break;
            case MovementType.TURN_RIGHT:
                entity.facing = (entity.facing + 1) % 4;
                this.updateDisplays();
                break;
        }
    }

    tryMoveEntity(entity, dx, dy) {
        const newX = entity.x + dx;
        const newY = entity.y + dy;
        
        if (this.map.isWalkable(newX, newY)) {
            entity.x = newX;
            entity.y = newY;
            this.updateDisplays();
        }
    }

    setPartyLightSource(sourceName) {
        const newSource = LightSources[sourceName];
        if (!newSource) {
            console.warn(`Light source "${sourceName}" not found`);
            return;
        }
        this.party.lightSource = newSource;
        // Update renderer's light source and trigger a new render
        this.mainRenderer.updateLightSource(newSource);

        const party = this.party;
        this.mainRenderer.render(party.x, party.y, party.facing); // Force immediate re-render
    }
}