const updateScore = score => {
  const scoreElement = document.getElementById('score');
  scoreElement.innerText = `Your Score: ${score}`
};

const between = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

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

const withinBrickWidth = (person, { x, width }) =>
  person.x + person.width >= x && person.x <= (x + width);

const isOnTopOffBrick = (person, { y }) =>
  y <= person.y + person.height + 1 && y >= person.y + person.height - 1;


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

const onTopEdge = (brick) => {
  const { y } = brick.getDetails();
  return y <= 0;
};

const removeBrick = (brick) => {
  const { id } = brick.getDetails();
  const element = document.getElementById(id);
  element.remove()
};

class Game {
  #bricks;
  #person;
  #view;
  #gameConfig;
  constructor(bricks, person, view, gameConfig) {
    this.#bricks = bricks;
    this.#person = person;
    this.#view = view;
    this.#gameConfig = gameConfig;
  }

  isOver() {
    const { y } = this.#person.getDetails();
    return y <= 0 || y >= 329;
  }

  isPersonOnBrick() {
    return this.#bricks.some(brick => {
      const person = this.#person.getDetails();
      return isOnTopOffBrick(person, brick.getDetails())
        && (withinBrickWidth(person, brick.getDetails()));
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

  moveBricks(present) {
    this.#bricks.forEach((brick) => {
      present(brick, this.#gameConfig.gameSpeed)
    })
  };

  addNewBrick(x, y, present) {
    const id = ++this.#gameConfig.lastId;
    const brick = new Brick(id, x, y);
    present(brick);
    this.#bricks.push(brick);
  };

  removeBricksOnEdge(presentationRemover) {
    const brick = this.#bricks.find(brick => onTopEdge(brick));
    if (brick) {
      presentationRemover(brick);
      this.#bricks.shift();
    }
  };

  getScore() {
    return this.#gameConfig.lastId;
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

const changePersonPosition = game => {
  if (game.isPersonOnBrick()) {
    game.updatePerson(0, -1.5, updatePosition);
  } else { game.updatePerson(0, 1, updatePosition) }
};

const runGame = (game, rounds,) => {
  changePersonPosition(game);
  game.moveBricks(moveBrickUp);

  if (rounds % 70 === 0) {
    const x = between(0, 150)
    game.addNewBrick(x, 348, drawBrick)
  }

  game.removeBricksOnEdge(removeBrick);
  updateScore(game.getScore());
};

const createGame = () => {
  const gameConfig = { gameSpeed: 1.5, fallingSpeed: 1, lastId: 1 };
  const view = { x: 0, y: 0, height: 352, width: 180 };
  const brick = new Brick(1, 12, 350);
  const person = new Person('person', 30, 325, 18, 25);
  const bricks = [brick];
  const game = new Game(bricks, person, view, gameConfig);
  drawBrick(brick);

  return game;
};

const main = () => {
  const game = createGame();
  const playGame = movePerson(game);

  let intervalCount = 0;
  const intervalId = setInterval(() => {
    if (game.isOver()) {
      document.removeEventListener('keydown', playGame);
      clearInterval(intervalId);
      return;
    }

    intervalCount++;
    runGame(game, intervalCount);
  }, 20);

  document.addEventListener('keydown', playGame);
};

window.onload = main;
