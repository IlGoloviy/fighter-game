import View from './view';
import FightersView from './fightersView';

class Fighter {
  constructor(fighter) {

    this.attack;
    this.defense;
    this.health;
    this.name = fighter.name;
    this.id = fighter._id;
    this.source = fighter.source;
  }
}

export default Fighter;
