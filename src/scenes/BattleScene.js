import { GameState } from '../state/GameState.js';
import { Unit } from '../prefabs/Unit.js';
import { EnemyFactory } from '../managers/EnemyFactory.js';
import { HandManager } from '../managers/HandManager.js';
import { EffectManager } from '../managers/EffectManager.js';
import { RelicManager } from '../managers/RelicManager.js';
import { executeAction } from '../managers/ActionManager.js';
import { RewardManager } from '../managers/RewardManager.js';
import { Card } from '../prefabs/Card.js';
import { getResponsiveMetrics } from '../utils/Responsive.js';

export class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  create(data) {
    this.metrics = getResponsiveMetrics(this);
    this.cardScale = this.metrics.isMobile ? 1.15 : 1;

    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x161220).setOrigin(0);
    this.effectManager = new EffectManager(this);
    this.playerTurn = true;
    this.maxMana = GameState.maxMana;
    this.currentMana = this.maxMana;

    this.player = new Unit(this, this.metrics.value(240), this.scale.height * 0.46, { name: 'Hero', hp: GameState.currentHp, isPlayer: true, unitKey: 'hero' });
    this.enemies = EnemyFactory.createEnemies(this, data.boss ? GameState.bosses[GameState.act] : undefined);

    this.relicManager = new RelicManager(this);
    this.relicManager.trigger('onBattleStart', { source: this.player, target: this.player });

    const trashW = this.metrics.value(170);
    const trashH = this.metrics.value(95);
    this.trashZone = this.add.zone(this.scale.width - this.metrics.value(110), this.scale.height - this.metrics.value(90), trashW, trashH).setRectangleDropZone(trashW, trashH);
    this.add.rectangle(this.trashZone.x, this.trashZone.y, trashW, trashH, 0x552222).setStrokeStyle(2, 0xff4444);
    this.add.text(this.trashZone.x, this.trashZone.y, 'TRASH', { fontSize: this.metrics.font(20), color: '#fff' }).setOrigin(0.5);

    this.handManager = new HandManager(this);
    this.input.on('drop', (p, gameObject, dropZone) => gameObject.emit('drop', p, dropZone));

    this.endBtn = this.add.rectangle(this.scale.width - this.metrics.value(120), this.scale.height - this.metrics.value(205), this.metrics.value(190), this.metrics.value(70), 0x2f3640).setInteractive();
    this.add.text(this.endBtn.x, this.endBtn.y, 'END TURN', { fontSize: this.metrics.font(24), color: '#fff' }).setOrigin(0.5);
    this.endBtn.on('pointerdown', () => this.endTurn());

    this.manaText = this.add.text(this.metrics.value(30), this.scale.height - this.metrics.value(205), '', { fontSize: this.metrics.font(26), color: '#8ee' });
    this.updateBattleUI();
    this.startPlayerTurn();
  }

  updateBattleUI() { this.manaText.setText(`Mana ${this.currentMana}/${this.maxMana}`); }

  startPlayerTurn() {
    this.playerTurn = true;
    this.player.resetShield();
    if (this.player.getStatus('poison') > 0) { this.player.takeDamage(this.player.getStatus('poison')); this.player.consumeStatus('poison'); }
    this.relicManager.trigger('onTurnStart', { source: this.player, target: this.player });
    this.currentMana = this.maxMana;
    this.handManager.draw(5);
    this.enemies.filter((e) => e.alive).forEach((e) => e.chooseIntent());
    this.updateBattleUI();
  }

  endTurn() {
    if (!this.playerTurn) return;
    this.playerTurn = false;
    this.handManager.endTurnDiscard();
    this.processEnemyTurns();
  }

  async processEnemyTurns() {
    this.input.enabled = false;
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      await this.wait(300);
      enemy.resetShield();
      if (enemy.getStatus('poison') > 0) { enemy.takeDamage(enemy.getStatus('poison')); enemy.consumeStatus('poison'); }
      if (Math.random() < 0.4 && enemy.getStatus('freeze') > 0) { enemy.consumeStatus('freeze'); continue; }
      await enemy.executeIntent(this.player, executeAction);
      if (!this.player.alive) return this.loseBattle();
    }
    GameState.currentHp = this.player.hp;
    if (this.enemies.every((e) => !e.alive)) return this.winBattle();
    this.input.enabled = true;
    this.startPlayerTurn();
  }

  winBattle() {
    const goldGain = this.enemies.reduce((sum, e) => sum + (12 + e.maxHp * 0.1), 0) + GameState.eventFightBonusGold;
    GameState.eventFightBonusGold = 0;
    GameState.gold += Math.round(goldGain);
    GameState.level += 1;
    this.game.events.emit('UPDATE_UI');

    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000, 0.85);
    this.add.text(this.scale.width / 2, this.metrics.value(70), 'VICTORY - Choose 1 card', { fontSize: this.metrics.font(34), color: '#fff' }).setOrigin(0.5);

    const choices = RewardManager.rollCardChoices();
    const spacing = this.metrics.value(220);
    choices.forEach((ci, idx) => {
      const card = new Card(this, this.scale.width / 2 - spacing + idx * spacing, this.metrics.value(320), ci);
      card.setInteractive().on('pointerdown', () => {
        GameState.deck.push(ci);
        this.scene.start('MapScene');
        this.game.events.emit('UPDATE_UI');
      });
    });

    const skip = this.add.text(this.scale.width / 2, this.metrics.value(590), 'Skip', { fontSize: this.metrics.font(28), color: '#aaa' }).setOrigin(0.5).setInteractive();
    skip.on('pointerdown', () => this.scene.start('MapScene'));
  }

  loseBattle() {
    GameState.currentHp = 0;
    this.game.events.emit('UPDATE_UI');
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000, 0.85);
    this.add.text(this.scale.width / 2, this.scale.height / 2 - this.metrics.value(40), 'YOU DIED', { fontSize: this.metrics.font(72), color: '#ff4d4d' }).setOrigin(0.5);
    const b = this.add.text(this.scale.width / 2, this.scale.height / 2 + this.metrics.value(70), 'Back to Menu', { fontSize: this.metrics.font(32), color: '#fff' }).setOrigin(0.5).setInteractive();
    b.on('pointerdown', () => this.scene.start('MenuScene'));
  }

  wait(ms) { return new Promise((resolve) => this.time.delayedCall(ms, resolve)); }
}
