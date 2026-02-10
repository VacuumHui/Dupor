import { Card } from '../prefabs/Card.js';
import { GameState } from '../state/GameState.js';
import { CardLogic } from '../utils/CardLogic.js';
import { executeAction } from './ActionManager.js';

export class HandManager {
  constructor(scene) {
    this.scene = scene;
    this.drawPile = Phaser.Utils.Array.Shuffle([...GameState.deck]);
    this.discardPile = [];
    this.hand = [];
    this.maxHand = 6;
    this.dragStart = 0;
  }

  reshuffleIfNeeded() {
    if (!this.drawPile.length && this.discardPile.length) {
      this.drawPile = Phaser.Utils.Array.Shuffle(this.discardPile.splice(0));
    }
  }

  draw(count = 1) {
    for (let i = 0; i < count; i += 1) {
      this.reshuffleIfNeeded();
      if (!this.drawPile.length || this.hand.length >= this.maxHand) break;
      const inst = this.drawPile.pop();
      const card = new Card(this.scene, 0, 0, inst);
      this.hand.push(card);
      this.bindCardInput(card);
    }
    this.layoutHand();
  }

  layoutHand() {
    const centerX = this.scene.scale.width * 0.47;
    const baseY = this.scene.scale.height - 120;
    const spacing = 120;
    this.hand.forEach((c, i) => {
      this.scene.tweens.add({ targets: c, x: centerX + (i - (this.hand.length - 1) / 2) * spacing, y: baseY, duration: 150 });
      c.setDepth(20 + i);
    });
  }

  bindCardInput(card) {
    card.on('pointerdown', () => { this.dragStart = Date.now(); });
    card.on('pointerup', () => {
      if (Date.now() - this.dragStart < 180) {
        card.toggleMode(!card.isZoomed);
      }
    });
    this.scene.input.setDraggable(card);

    card.on('drag', (pointer, dragX, dragY) => {
      card.x = dragX; card.y = dragY;
      // магнитный stack drag
      this.hand.forEach((other) => {
        if (other !== card && Phaser.Math.Distance.Between(card.x, card.y, other.x, other.y) < 70) {
          other.x += (card.x - other.x) * 0.08;
          other.y += (card.y - other.y) * 0.08;
        }
      });
    });

    card.on('drop', (pointer, zone) => {
      this.tryPlayStack(card, zone);
    });

    card.on('dragend', (pointer, dragged, dropped) => {
      if (!dropped) this.layoutHand();
    });
  }

  tryPlayStack(mainCard, zone) {
    if (!this.scene.playerTurn) return this.layoutHand();
    const stack = [mainCard, ...this.hand.filter((c) => c !== mainCard && Phaser.Math.Distance.Between(c.x, c.y, mainCard.x, mainCard.y) < 70)];
    const totalCost = stack.reduce((s, c) => s + CardLogic.getComputedCard(c.cardInstance).cost, 0);
    if (totalCost > this.scene.currentMana) { this.scene.effectManager.floatingText(mainCard.x, mainCard.y - 50, 'Not enough mana', '#ffaa55'); return this.layoutHand(); }

    if (zone === this.scene.trashZone) {
      stack.forEach((card) => this.discardCard(card));
      this.layoutHand();
      return;
    }

    const target = this.scene.enemies.find((e) => e.dropZone === zone) || (zone === this.scene.player.dropZone ? this.scene.player : null);
    if (!target) return this.layoutHand();

    this.playCardsSequentially(stack, target);
  }

  playCardsSequentially(stack, target) {
    const queue = [...stack];
    const step = () => {
      if (!queue.length) { this.layoutHand(); return; }
      const card = queue.shift();
      const computed = CardLogic.getComputedCard(card.cardInstance);
      this.scene.currentMana -= computed.cost;
      this.scene.updateBattleUI();
      this.scene.tweens.add({
        targets: card,
        x: target.x,
        y: target.y,
        duration: 180,
        onComplete: () => {
          for (const action of computed.actions) {
            const targetByRule = computed.target === 'self' ? this.scene.player : (computed.target === 'any' ? target : target);
            executeAction(this.scene, action, this.scene.player, targetByRule);
          }
          if (!target.alive) this.scene.relicManager?.trigger('onKill', { source: this.scene.player, target });
          this.discardCard(card, computed.consume);
          if (this.scene.enemies?.every((e) => !e.alive)) return this.scene.winBattle();
          step();
        },
      });
    };
    step();
  }

  discardCard(card, consume = false) {
    this.hand = this.hand.filter((c) => c !== card);
    if (!consume) this.discardPile.push(card.cardInstance);
    card.destroy();
  }

  endTurnDiscard() {
    for (const c of [...this.hand]) this.discardCard(c);
  }
}
