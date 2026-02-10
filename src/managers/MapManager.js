const NODE_TYPES = ['battle', 'battle', 'battle', 'event', 'event', 'shop', 'rest'];

export const MapManager = {
  generateMap() {
    const floors = [];
    let id = 0;
    for (let f = 0; f < 12; f += 1) {
      let count = 1;
      if (f === 0 || f === 11 || f === 10) count = 1;
      else count = Phaser.Math.Between(3, 5);
      const nodes = [];
      for (let n = 0; n < count; n += 1) {
        id += 1;
        const type = f === 0 ? 'start' : (f === 11 ? 'boss' : (f === 10 ? 'rest' : Phaser.Utils.Array.GetRandom(NODE_TYPES)));
        nodes.push({ id, floor: f, idx: n, type, links: [], visible: f === 0, available: f === 0, completed: false, locked: false });
      }
      floors.push(nodes);
    }
    for (let f = 0; f < floors.length - 1; f += 1) {
      for (const node of floors[f]) {
        const nextFloor = floors[f + 1];
        const t1 = nextFloor[Math.min(nextFloor.length - 1, Math.max(0, node.idx + Phaser.Math.Between(-1, 1)))];
        node.links.push(t1.id);
      }
    }
    // устранение orphan нод
    for (let f = 1; f < floors.length; f += 1) {
      for (const node of floors[f]) {
        const hasIncoming = floors[f - 1].some((n) => n.links.includes(node.id));
        if (!hasIncoming) floors[f - 1][Phaser.Math.Between(0, floors[f - 1].length - 1)].links.push(node.id);
      }
    }
    return { floors };
  },

  unlockNextLayer(mapData, currentNodeId) {
    for (const floor of mapData.floors) {
      for (const node of floor) {
        if (node.id === currentNodeId) {
          node.completed = true;
          node.available = false;
          const nextFloor = mapData.floors[node.floor + 1] || [];
          for (const nn of nextFloor) {
            if (node.links.includes(nn.id)) {
              nn.visible = true;
              nn.available = true;
            }
          }
          for (const sibling of floor) if (sibling.id !== currentNodeId) sibling.locked = true;
          return;
        }
      }
    }
  },
};
