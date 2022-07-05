const between = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

class Person {
  #id;
  #x;
  #y;
  constructor(id, x, y) {
    this.#id = id;
    this.#x = x;
    this.#y = y;
  }

  movePerson(dx, dy) {
    this.#x += dx;
    this.#y += dy;
  }

  getDetails() {
    return { x: this.#x, y: this.#y, id: this.#id };
  }
}

class Brick {
  #id;
  #y;
  #x;
  #width;
  constructor(id, x, y, width) {
    this.#id = id;
    this.#x = x;
    this.#y = y;
    this.#width = 30;
  }

  moveUp(delta) {
    this.#y -= delta;
  }

  getDetails() {
    return { x: this.#x, y: this.#y, id: this.#id };
  }
}

const px = x => x + 'px';

const moveBrickUp = (brick, delta) => {
  brick.moveUp(delta);
  const { y, id } = brick.getDetails();
  const element = document.getElementById(id);
  element.style.top = y;
};

const drawBrick = (brick) => {
  const tag = document.createElement('div');
  const { x, y, id } = brick.getDetails();
  tag.id = id;
  tag.style.top = px(y);
  tag.style.left = px(x);
  tag.className = 'brick';
  const element = document.getElementById('view');
  element.appendChild(tag);
};

const moveBricks = (bricks, speed) => {
  bricks.forEach((brick) => {
    moveBrickUp(brick, speed)
  })
};

const addNewBrick = (id, bricks, x, y) => {
  const brick = new Brick(id, x, y);
  drawBrick(brick);
  bricks.push(brick);
};

const onTopEdge = (brick) => {
  const { y } = brick.getDetails();
  return y <= 0;
};

const removeBrick = (brick) => {
  const { id } = brick.getDetails();
  const element = document.getElementById(id);
  element.remove()
};

const removeBricksOnEdge = bricks => {
  bricks.forEach(brick => {
    if (onTopEdge(brick)) {
      removeBrick(brick)
      bricks.shift()
    }
  })
};

class Game {
  #bricks;
  #person;
  #view;
  constructor(bricks, person, speed, view) {
    this.#bricks = bricks;
    this.#person = person;
    this.#view = view;
  }

  isOver() {
    const { y } = this.#person.getDetails();
    return y <= 0 || y >= 329;
  }

  isPersonOnBrick() {
    return this.#bricks.some(brick => {
      const person = this.#person.getDetails();
      const { x, y } = brick.getDetails();
      return y === person.y + 25 && (person.x + 18 >= x && person.x <= (x + 25));
    })
  }

  personDetails() {
    return this.#person.getDetails();
  };

  updatePerson(dx, dy, present) {
    this.#person.movePerson(dx, dy);
    present(this.#person);
  }

  isPersonInScreen() {

  }
}

const updatePosition = person => {
  const { y, x, id } = person.getDetails();
  const element = document.getElementById(id);
  element.style.top = y;
  element.style.left = x;
};

function movePerson(game) {
  return (event) => {
    if (event.key == 'ArrowLeft') {
      game.updatePerson(-3, 0, updatePosition);
    }
    else if (event.key == 'ArrowRight') {
      game.updatePerson(3, 0, updatePosition)
    }
  };
}

const main = () => {
  const view = { x: 0, y: 0, height: 352, width: 180 };
  const brick = new Brick(1, 12, 350);
  const person = new Person('person', 30, 325);
  const bricks = [brick];
  const game = new Game(bricks, person, view);
  drawBrick(brick);

  const speed = 1;
  let idCounter = 1;
  let counter = 0;

  setInterval(() => {
    if (game.isOver()) {
      return;
    }
    counter++;

    if (game.isPersonOnBrick()) {
      person.movePerson(0, -speed);
    } else { person.movePerson(0, speed) }
    updatePosition(person)

    moveBricks(bricks, speed);
    if (counter % 70 === 0) {
      const x = between(0, 150)
      addNewBrick(++idCounter, bricks, x, 348)
    }
    removeBricksOnEdge(bricks)
  }, 20);

  document.addEventListener('keydown', movePerson(game));
};

window.onload = main;
