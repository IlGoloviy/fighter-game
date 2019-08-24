import View from './view';

class FighterView extends View {
  constructor(fighter, handleClick, deleteClick) {
    super();

    this.createFighter(fighter, handleClick, deleteClick);
  }

  createFighter(fighter, handleClick, deleteClick) {
    const { name, source } = fighter;
    const nameElement = this.createName(name);
    const imageElement = this.createImage(source);
    const delElement = this.createDelete();

    delElement.addEventListener('click', event => deleteClick(event, fighter), false);
    imageElement.addEventListener('click', event => handleClick(event, fighter), false);
    
    this.element = this.createElement({ tagName: 'div', className: 'fighter' });
    this.element.append(imageElement, nameElement, delElement);
  }

  createName(name) {
    const nameElement = this.createElement({ tagName: 'span', className: 'name' });
    nameElement.innerText = name;

    return nameElement;
  }

  createDelete() {
    const delElement = this.createElement({tagName: 'div', className: 'delete-fighter'});
    delElement.innerHTML = '<p>x</p>';

    return delElement;
  }

  createImage(source) {
    const attributes = { src: source };
    const imgElement = this.createElement({
      tagName: 'img',
      className: 'fighter-image',
      attributes
    });

    return imgElement;
  }
}

export default FighterView;