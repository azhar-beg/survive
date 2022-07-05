const between = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

class Person {
  #id;
  #x;
  #y;
  #width;
  #height;
  constructor(id, x, y, width, height) {
    this.#id = id;
    this.#x = x;
    this.#y = y;
    this.#width = width;
    this.#height = height;
  }

  movePerson(dx, dy) {
    this.#x += dx;
    this.#y += dy;
  }

  getDetails() {
    return { x: this.#x, y: this.#y, id: this.#id, width: this.#width, height: this.#height };
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
    return { x: this.#x, y: this.#y, id: this.#id, width: this.#width };
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
  constructor(bricks, person, view) {
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
      const { x, y, width } = brick.getDetails();
      return (y <= person.y + person.height + 1 && y >= person.y + person.height - 1)
        && (person.x + person.width >= x && person.x <= (x + width));
    })
  }

  updatePerson(dx, dy, present) {
    this.#person.movePerson(dx, dy);
    if (!this.#isPersonInView()) {
      this.#person.movePerson(-dx, -dy);
      return;
    }
    present(this.#person);
  }

  #isPersonInView() {
    const { x, width } = this.#person.getDetails();
    return (x >= this.#view.x && x + width <= this.#view.width);
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
    if (game.isOver()) {
      return;
    }
    if (event.key == 'ArrowLeft') {
      game.updatePerson(-3, 0, updatePosition);
    }
    else if (event.key == 'ArrowRight') {
      game.updatePerson(3, 0, updatePosition)
    }
  };
}

const updateScore = score => {
  const scoreElement = document.getElementById('score');
  scoreElement.innerText = `Your Score: ${score}`
};

const main = () => {
  const view = { x: 0, y: 0, height: 352, width: 180 };
  const brick = new Brick(1, 12, 350);
  const person = new Person('person', 30, 325, 18, 25);
  const bricks = [brick];
  const game = new Game(bricks, person, view);
  drawBrick(brick);

  const speed = 1.5;
  let idCounter = 1;
  let counter = 0;

  setInterval(() => {
    if (game.isOver()) {
      return;
    }
    counter++;

    if (game.isPersonOnBrick()) {
      game.updatePerson(0, -speed, updatePosition);
    } else { game.updatePerson(0, 1, updatePosition) }

    moveBricks(bricks, speed);
    if (counter % 70 === 0) {
      const x = between(0, 150)
      addNewBrick(++idCounter, bricks, x, 348)
    }
    removeBricksOnEdge(bricks)
    updateScore(idCounter);
  }, 20);

  document.addEventListener('keydown', movePerson(game));
};

window.onload = main;
