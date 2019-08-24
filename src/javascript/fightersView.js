import View from './view';
import FighterView from './fighterView';
import { fighterService } from './services/fighterService';
import Fighter from './fighter';

class FightersView extends View {
  constructor(fighters) {
    super();
    
    this.handleClick = this.handleFighterClick.bind(this);
    this.createFighters(fighters);
    this.createStartGame();
    this.readyFighters = [];
  }

  fightersDetailsMap = new Map();

  createFighters(fighters) {
    const fighterElements = fighters.map(fighter => {
      const fighterView = new FighterView(fighter, this.handleClick);
      return fighterView.element;
    });

    this.element = this.createElement({ tagName: 'div', className: 'fighters' });
    this.element.append(...fighterElements);
  }

  handleFighterClick(event, fighter) {
    if (this.readyFighters.length < 2) {
      // const fighter = await fighterService.getFighterDetails(fighter._id);
      // this.fightersDetailsMap.set(fighter._id, fighter);
      // this.editFighterSkills(fighter._id);
      fighterService.getFighterDetails(fighter._id)
        .then((res) => this.fightersDetailsMap.set(fighter._id, res));
      setTimeout(this.editFightersSkills.bind(this), 100, fighter._id);
      const readyFighter = new Fighter(fighter);
      this.readyFighters.push(readyFighter);
      this.selectedPlayers(fighter);
    }
  }

  selectedPlayers(fighter) {
    const selectedDiv = this.createElement({ tagName: 'div', className: 'selected-fighter' });
    selectedDiv.innerHTML = `<p>PLAYER ${this.readyFighters.length} &#8594;</p> <img class="selected-fighter_img" src="${fighter.source}">`;
    this.element.append(selectedDiv);
    if (this.readyFighters.length === 2) {
      document.querySelector('.start-game').innerText = 'Start Game';
    }
  }

  editFightersSkills(id) {
    const modal = this.createElement({ tagName: 'div', className: 'fighter-details' });
    const nameFighters = this.createElement({ tagName: 'h3', className: 'fighter-details_name'});
    const healthFighters = this.createElement({ tagName: 'div', className: 'fighter-details_health'});
    const attackFighters = this.createElement({ tagName: 'div', className: 'fighter-details_attack'});
    const defenseFighters = this.createElement({ tagName: 'div', className: 'fighter-details_defense'});
    this.fightersDetailsMap.forEach( (value, key, map) => {
      if (key === id) {
        nameFighters.innerText = value.name;
        healthFighters.innerHTML = `<p>Health</p> <input type="text" class="edit-health" value="${value.health}">`;
        attackFighters.innerHTML = `<p>Attack</p> <input type="text" class="edit-attack" value="${value.attack}">`;
        defenseFighters.innerHTML = `<p>Defense</p> <input type="text" class="edit-defense" value="${value.defense}">`;
      }
    });
    const saves = this.createElement({ tagName: 'button', className: 'saves'});
    saves.innerText = 'SAVES';
    saves.addEventListener('click', () => this.editFighterSkills(id, modal), false);
    modal.append(nameFighters, healthFighters, attackFighters, defenseFighters, saves);
    this.element.append(modal);
  }

  editFighterSkills(id, modal) {
    this.fightersDetailsMap.forEach( (value, key, map) => {
      if (key === id) {
        value.health = (document.querySelectorAll('.edit-health').length < 1) ? value.health : document.querySelector('.edit-health').value;
        value.attack = (document.querySelectorAll('.edit-attack').length < 1) ? value.attack : document.querySelector('.edit-attack').value;
        value.defense = (document.querySelectorAll('.edit-defense').length < 1) ? value.defense : document.querySelector('.edit-defense').value;
      }
    });
    this.element.removeChild(modal);
  }

  createStartGame() {
    const startGame = this.createElement({tagName: 'button', className: 'start-game'});
    startGame.innerText = 'Choose fighters (two) and wait a few seconds';
    startGame.addEventListener('click', () => this.chooseFighter(), false);
    this.element.append(startGame);
  }

  chooseFighter() {
    if (this.fightersDetailsMap.size === 2) {
      for(let amount of this.fightersDetailsMap.values()) {
        for(let i = 0; i < this.readyFighters.length; i++) {
          if (this.readyFighters[i].name === amount.name) {
            this.readyFighters[i].attack = amount.attack;
            this.readyFighters[i].health = amount.health;
            this.readyFighters[i].defense = amount.defense;
          }
        }
      }
      this.fight();
    }
  }

  fight() {
    const gameWindow = this.createElement({ tagName: 'div', className: 'game-window' });
    const gameInstruction = this.createElement({ tagName: 'h3', className: 'game-instruction' });
    gameInstruction.innerText = 'сlick on the fighter you want to hit';
    const fighterLeft = this.createElement({ tagName: 'div', className: 'fighter-left' });
    const fighterRight = this.createElement({ tagName: 'div', className: 'fighter-right' });
    fighterLeft.innerHTML = `<h2>${this.readyFighters[0].name}</h2>
                            <img class="ready-fighters" src="${this.readyFighters[0].source}">
                            <div> <p>Attack</p> <p>${this.readyFighters[0].attack}</p> </div>
                            <div> <p>Defense</p> <p>${this.readyFighters[0].defense}</p> </div>
                            <div class="level-health"> <p>Health</p> <p id="left-fighter-health">${this.readyFighters[0].health}</p> </div>`;
    fighterRight.innerHTML = `<h2>${this.readyFighters[1].name}</h2>
                            <img class="ready-fighters" src="${this.readyFighters[1].source}">
                            <div> <p>Attack</p> <p>${this.readyFighters[1].attack}</p> </div>
                            <div> <p>Defense</p> <p>${this.readyFighters[1].defense}</p> </div>
                            <div class="level-health"> <p>Health</p> <p id="right-fighter-health">${this.readyFighters[1].health}</p> </div>`;
    gameWindow.append(gameInstruction, fighterLeft, fighterRight);
    this.element.append(gameWindow);
    fighterLeft.addEventListener('click', () => this.strikeTheEnemy(0, 'left', gameWindow), false);
    fighterRight.addEventListener('click', () => this.strikeTheEnemy(1, 'right', gameWindow), false);
  }

  strikeTheEnemy(num, side, gameWindow) {
    const criticalHitChance = 1 + Math.random();
    const dodgeChance = 1 + Math.random();
    this.readyFighters[num].health -= ((this.readyFighters[num].attack*criticalHitChance - this.readyFighters[num].defense*dodgeChance) > 0
      ? (this.readyFighters[num].attack*criticalHitChance - this.readyFighters[num].defense*dodgeChance) 
      : 0);
    document.getElementById(`${side}-fighter-health`).innerText = this.readyFighters[num].health;
    if (this.readyFighters[num].health < 0) {
      gameWindow.innerHTML = `<h2>Game over</h2>
                              <img id="close" class="ready-fighters" src="${this.readyFighters[Number(!num)].source}">
                              <p>WON ${this.readyFighters[Number(!num)].name}</p>`;
      document.getElementById('close').addEventListener('click', () => this.close(gameWindow), false);
    }
  }

  close(gameWindow) {
    this.element.removeChild(gameWindow);
    this.fightersDetailsMap.clear();
    this.readyFighters.length = 0;
    document.querySelector('.start-game').innerText = 'Choose fighters (two) and wait a few seconds';
    this.element.removeChild(document.querySelector('.selected-fighter'));
    this.element.removeChild(document.querySelector('.selected-fighter'));
  }
}

export default FightersView;
