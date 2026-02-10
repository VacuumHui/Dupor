const state = {
  deck: [],
  relics: [],
  maxHp: 50,
  currentHp: 50,
  gold: 100,
  maxMana: 3,
  eventFightBonusGold: 0,
  mapData: null,
  currentFloor: 0,
  currentNode: null,
  mapGenerated: false,
  level: 1,
  act: 1,
  bosses: { 1: 'boss_dragon', 2: 'boss_knight', 3: 'boss_slime' },
};

let uidCounter = 0;

export function createCardInstance(cardId) {
  uidCounter += 1;
  return { id: cardId, uid: `${cardId}_${uidCounter}_${Date.now()}`, enchants: [] };
}

export const GameState = {
  ...state,
  reset() {
    uidCounter = 0;
    this.deck = [
      createCardInstance('strike'), createCardInstance('strike'), createCardInstance('strike'),
      createCardInstance('defend'), createCardInstance('defend'), createCardInstance('defend'),
    ];
    this.relics = [];
    this.maxHp = 50;
    this.currentHp = 50;
    this.gold = 100;
    this.maxMana = 3;
    this.eventFightBonusGold = 0;
    this.mapData = null;
    this.currentFloor = 0;
    this.currentNode = null;
    this.mapGenerated = false;
    this.level = 1;
    this.act = 1;
  },
};
