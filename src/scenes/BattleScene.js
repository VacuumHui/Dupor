import { GameState } from '../state/GameState.js';
import { Unit } from '../prefabs/Unit.js';
import { EnemyFactory } from '../managers/EnemyFactory.js';
import { HandManager } from '../managers/HandManager.js';
import { EffectManager } from '../managers/EffectManager.js';
import { RelicManager } from '../managers/RelicManager.js';
import { executeAction } from '../managers/ActionManager.js';
import { RewardManager } from '../managers/RewardManager.js';
import { Card } from '../prefabs/Card.js';

export class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  create(data) {
    this.add.rectangle(0,0,this.scale.width,this.scale.height,0x161220).setOrigin(0);
    this.effectManager = new EffectManager(this);
    this.playerTurn = true;
    this.maxMana = GameState.maxMana;
    this.currentMana = this.maxMana;
    this.player = new Unit(this, 220, this.scale.height * 0.48, { name: 'Hero', hp: GameState.currentHp, isPlayer: true, unitKey: 'hero' });
    this.enemies = EnemyFactory.createEnemies(this, data.boss ? GameState.bosses[GameState.act] : undefined);

    this.relicManager = new RelicManager(this);
    this.relicManager.trigger('onBattleStart', { source: this.player, target: this.player });

    this.trashZone = this.add.zone(this.scale.width - 90, this.scale.height - 80, 140, 90).setRectangleDropZone(140,90);
    this.add.rectangle(this.scale.width - 90, this.scale.height - 80, 140, 90, 0x552222).setStrokeStyle(2,0xff4444);
    this.add.text(this.scale.width - 90, this.scale.height - 80, 'TRASH', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    this.handManager = new HandManager(this);
    this.input.on('drop', (p, gameObject, dropZone) => gameObject.emit('drop', p, dropZone));

    this.endBtn = this.add.rectangle(this.scale.width - 120, this.scale.height - 180, 170, 52, 0x2f3640).setInteractive();
    this.add.text(this.endBtn.x, this.endBtn.y, 'END TURN', { fontSize: '22px', color: '#fff' }).setOrigin(0.5);
    this.endBtn.on('pointerdown', () => this.endTurn());

    this.manaText = this.add.text(30, this.scale.height - 180, '', { fontSize: '24px', color: '#8ee' });
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

    const overlay = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, 0x000, 0.85);
    this.add.text(this.scale.width/2, 60, 'VICTORY - Choose 1 card', { fontSize: '34px', color: '#fff' }).setOrigin(0.5);
    const choices = RewardManager.rollCardChoices();
    choices.forEach((ci, idx) => {
      const card = new Card(this, this.scale.width/2 - 180 + idx * 180, 280, ci);
      card.setInteractive().on('pointerdown', () => {
        GameState.deck.push(ci);
        this.scene.start('MapScene');
        this.game.events.emit('UPDATE_UI');
      });
    });
    const skip = this.add.text(this.scale.width/2, 520, 'Skip', { fontSize: '24px', color: '#aaa' }).setOrigin(0.5).setInteractive();
    skip.on('pointerdown', () => this.scene.start('MapScene'));
  }

  loseBattle() {
    GameState.currentHp = 0;
    this.game.events.emit('UPDATE_UI');
    const overlay = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, 0x000, 0.85);
    this.add.text(this.scale.width/2, this.scale.height/2 - 40, 'YOU DIED', { fontSize: '72px', color: '#ff4d4d' }).setOrigin(0.5);
    const b = this.add.text(this.scale.width/2, this.scale.height/2 + 60, 'Back to Menu', { fontSize: '28px', color: '#fff' }).setOrigin(0.5).setInteractive();
    b.on('pointerdown', () => this.scene.start('MenuScene'));
  }

  wait(ms) { return new Promise((resolve) => this.time.delayedCall(ms, resolve)); }
}
