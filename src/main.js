import './style.css'
import { Map } from './engine/Map.js'
import { testMap20x20 } from './maps/testMap.js'
import { testMap5x5 } from './maps/testMap.js'
import { TopDownMapRenderer } from './components/MapViewer/TopDownMapRenderer.js'
import { MovementControls } from './components/Controls/MovementControls.js'
import { GameManager } from './engine/GameManager.js'
import { MinimapControls } from './components/Controls/MinimapControls.js'
import { MovementType } from './engine/MovementTypes.js'
import { ThreeJsRenderer } from './components/MapViewer/ThreeJsRenderer.js'

document.querySelector('#app').innerHTML = `
  <div class="layout">
    <div class="layout-header">
      <h3>Map rendering experiment</h3>
    </div>
    <div class="layout-content">
      <div id="map-container" class="map-container">
        <div id="MapViewport" class="map-viewport"></div>
        <div id="minimap" class="minimap"></div>
      </div>
    </div>
    <div class="layout-footer">
      <span>Move around the map using the arrow buttons. Current position:</span>
      <span id="PartyCoords"></span>
      <select id="LightSourceSelect">
        <option value="Candle">Candle</option>
        <option value="Torch">Torch</option>
        <option value="Lantern">Lantern</option>
        <option value="LightSpell">LightSpell</option>
      </select>
    </div>
  </div>
`

const map = new Map(testMap20x20);
const renderer = new ThreeJsRenderer('MapViewport', map, {
    wallColor: '#666',
    floorColor: '#222',
    ceilingColor: '#444'
});
const minimapRenderer = new TopDownMapRenderer('minimap', map, {
    wallColor: '#888',
    floorColor: '#333',
    playerColor: '#0f0',
    centerOnPlayer: true
});

const game = new GameManager(map, renderer, minimapRenderer);
const controls = new MovementControls();

controls.attach('MapViewport');
controls.on('moveForward', () => game.moveEntity(game.party, MovementType.MOVE_FORWARD));
controls.on('moveBackward', () => game.moveEntity(game.party, MovementType.MOVE_BACKWARD));
controls.on('turnLeft', () => game.moveEntity(game.party, MovementType.TURN_LEFT));
controls.on('turnRight', () => game.moveEntity(game.party, MovementType.TURN_RIGHT));
controls.on('strafeLeft', () => game.moveEntity(game.party, MovementType.STRAFE_LEFT));
controls.on('strafeRight', () => game.moveEntity(game.party, MovementType.STRAFE_RIGHT));

const minimapControls = new MinimapControls();
minimapControls.attach('minimap');

minimapControls.on('minimapZoomIn', () => {
    const currentZoom = minimapRenderer.viewState.zoomLevel;
    minimapRenderer.setZoom(currentZoom * 1.2);
    minimapRenderer.render(game.party.x, game.party.y, game.party.facing);
});

minimapControls.on('minimapZoomOut', () => {
    const currentZoom = minimapRenderer.viewState.zoomLevel;
    minimapRenderer.setZoom(currentZoom / 1.2);
    minimapRenderer.render(game.party.x, game.party.y, game.party.facing);
});

minimapControls.on('minimapRecenter', () => {
    minimapRenderer.recenterOnPlayer();
    minimapRenderer.render(game.party.x, game.party.y, game.party.facing);
});

document.getElementById('LightSourceSelect').addEventListener('change', (e) => {
    game.setPartyLightSource(e.target.value);
});

game.setPartyLightSource('Candle');
game.initialize();
