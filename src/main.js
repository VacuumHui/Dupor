import { MenuScene } from './scenes/MenuScene.js';
import { MapScene } from './scenes/MapScene.js';
import { BattleScene } from './scenes/BattleScene.js';
import { RestScene } from './scenes/RestScene.js';
import { EventScene } from './scenes/EventScene.js';
import { ShopScene } from './scenes/ShopScene.js';
import { UIScene } from './scenes/UIScene.js';

const debugConsole = document.getElementById('debug-console');
const logError = (msg) => {
  const div = document.createElement('div');
  div.textContent = msg;
  debugConsole.appendChild(div);
  debugConsole.scrollTop = debugConsole.scrollHeight;
};
window.onerror = (msg, src, line, col) => logError(`${msg} @${line}:${col}`);
window.onunhandledrejection = (e) => logError(`Promise: ${e.reason}`);

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#0f1220',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MenuScene, MapScene, BattleScene, RestScene, EventScene, ShopScene, UIScene],
};

const game = new Phaser.Game(config);
window.game = game;

const startOverlay = document.getElementById('start-overlay');
const rotateOverlay = document.getElementById('rotate-overlay');

document.getElementById('start-btn').addEventListener('click', async () => {
  const el = document.documentElement;
  if (el.requestFullscreen) await el.requestFullscreen().catch(() => {});
  if (screen.orientation?.lock) await screen.orientation.lock('landscape').catch(() => {});
  startOverlay.classList.add('hidden');
});

function updateRotateHint() {
  const portrait = window.innerHeight > window.innerWidth;
  rotateOverlay.classList.toggle('hidden', !portrait);
}

window.addEventListener('resize', updateRotateHint);
updateRotateHint();
