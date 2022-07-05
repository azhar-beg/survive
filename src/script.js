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

  moveUp(delta) {
    this.#y -= delta;
  }

  moveRight(delta) {
    this.#x += delta;
  }

  moveLeft(delta) {
    this.#x -= delta;
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

const addNewBrick = (id, bricks) => {
  const x = between(0, 170)
  const brick = new Brick(id, x, 348);
  drawBrick(brick);
  bricks.push(brick);
};

const onTopEdge = (brick) => {
  const { y } = brick.getDetails();
  return y <= 0;
};

const removeBrick = (brick) => {
  const { id } = brick.getDetails();
  console.log(id);
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

const movePersonUp = (person, speed) => {
  person.moveUp(speed);
  const { y, id } = person.getDetails();
  const element = document.getElementById(id);
  element.style.top = y;
};

class Game {
  #bricks;
  #person;
  #speed;
  constructor(bricks, person, speed) {
    this.#bricks = bricks;
    this.#person = person;
    this.#speed = speed;
  }

  isOver() {
    const { y } = this.#person.getDetails();
    return y === 0 || y === 329;
  }

}

const main = () => {
  // const view = { x: 0, y: 0, height: 400, width: 300 };
  const brick = new Brick(1, 10, 348);
  const person = new Person('person', 20, 328);
  const bricks = [brick];
  const game = new Game(bricks, person, 2);

  drawBrick(brick);
  let idCounter = 1;
  let counter = 0;
  let speed = 2;

  setInterval(() => {
    if (game.isOver()) {
      return;
    }
    counter++;
    moveBricks(bricks, speed);
    movePersonUp(person, speed);
    if (counter % 80 === 0) {
      addNewBrick(++idCounter, bricks)
    }
    removeBricksOnEdge(bricks)
  }, 20)
};

window.onload = main;
