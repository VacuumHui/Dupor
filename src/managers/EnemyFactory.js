import { ENEMIES_DB } from '../data/enemies.js';
import { Unit } from '../prefabs/Unit.js';
import { GameState } from '../state/GameState.js';

export const EnemyFactory = {
  createEnemies(scene, enemyKey) {
    const enemies = [];
    if (enemyKey) {
      const e = ENEMIES_DB[enemyKey] || ENEMIES_DB.slime;
      enemies.push(e);
    } else {
      let budget = 2 + Math.floor(GameState.currentFloor / 2) + GameState.act + Phaser.Math.Between(0, 2);
      const pool = Object.values(ENEMIES_DB).filter((e) => e.tier !== 'boss');
      while (budget > 0 && enemies.length < 4) {
        const affordable = pool.filter((p) => p.cost <= budget);
        const pick = affordable.length ? Phaser.Utils.Array.GetRandom(affordable) : ENEMIES_DB.slime;
        enemies.push(pick);
        budget -= pick.cost;
      }
      if (!enemies.length) enemies.push(ENEMIES_DB.slime);
    }
    const baseX = scene.scale.width * 0.72;
    const startY = scene.scale.height * 0.35;
    return enemies.map((e, i) => {
      const hpScaled = Math.round(e.hp * (1 + GameState.currentFloor * 0.03));
      return new Unit(scene, baseX + (i % 2) * 110, startY + i * 105 + ((i % 2) * 16), { ...e, hp: hpScaled, isPlayer: false, unitKey: e.key });
    });
  },
};
