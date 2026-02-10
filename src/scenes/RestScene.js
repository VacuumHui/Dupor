import { GameState } from '../state/GameState.js';
import { ENCHANTS_DB } from '../data/enchants.js';

export class RestScene extends Phaser.Scene {
  constructor() { super('RestScene'); }

  create() {
    this.add.rectangle(0,0,this.scale.width,this.scale.height,0x1a120f).setOrigin(0);
    this.add.text(this.scale.width/2,80,'Campfire 🔥',{fontSize:'46px',color:'#fff'}).setOrigin(0.5);
    const rest = this.button(this.scale.width/2-180, 260, 'REST', () => {
      const heal = Math.round(GameState.maxHp * 0.3);
      GameState.currentHp = Math.min(GameState.maxHp, GameState.currentHp + heal);
      this.game.events.emit('UPDATE_UI');
      this.scene.start('MapScene');
    });
    const smith = this.button(this.scale.width/2+180,260, 'SMITH', () => this.openSmith());
  }

  openSmith() {
    const bg = this.add.rectangle(this.scale.width/2,this.scale.height/2,this.scale.width,this.scale.height,0x000,0.8).setInteractive();
    this.add.text(this.scale.width/2, 80, 'Choose card to enchant', { fontSize: '28px', color: '#fff' }).setOrigin(0.5);
    GameState.deck.slice(0,8).forEach((card, i) => {
      const t = this.add.text(160 + (i%2)*420, 150 + Math.floor(i/2)*70, `${card.id} (${card.enchants.length})`, { fontSize: '22px', color: '#ddd' }).setInteractive();
      t.on('pointerdown', () => {
        const pool = [...ENCHANTS_DB.common, ...ENCHANTS_DB.rare, ...ENCHANTS_DB.legendary];
        card.enchants.push(Phaser.Utils.Array.GetRandom(pool));
        this.scene.start('MapScene');
        this.game.events.emit('UPDATE_UI');
      });
    });
  }

  button(x,y,label,cb){
    const b = this.add.rectangle(x,y,220,80,0x2d1f14).setStrokeStyle(2,0xffa).setInteractive();
    this.add.text(x,y,label,{fontSize:'32px',color:'#fff'}).setOrigin(0.5);
    b.on('pointerdown',cb); b.on('pointerover',()=>this.tweens.add({targets:b,scale:1.06,duration:100})); b.on('pointerout',()=>this.tweens.add({targets:b,scale:1,duration:100}));
    return b;
  }
}
