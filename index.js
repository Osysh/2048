// colorList
const lighestTextColor = '#f9f6f2';
const darkestTextColor = '#776e65';
const defaultCellColor = 'rgba(238, 228, 218, 0.35)';
const cellColors = {
  '1': '#eee4da',
  '2': '#eee1c9',
  '3': '#f3b27a',
  '4': '#f69664',
  '5': '#f77c5f',
  '6': '#f75f3b',
  '7': '#edd073',
  '8': '#edcc62',
  '9': '#e4c02a',
  '10': '#4d4d43',
  '11': '#25bb65'
};

class Game {
  board;
  gridDimension;
  executiveGrid;
  endGame;
  
  constructor(
    board,
    gridDimension
  ) {
    this.board = board;
    this.endGame = false;
    this.gridDimension = gridDimension;
    this.executiveGrid =  Array(this.gridDimension).fill().map(
      () => Array(this.gridDimension).fill(0)
    );
  }

  //
  // Board management methods
  // 

  deleteChild() {
    while (this.board.firstChild) {
      this.board.removeChild(this.board.firstChild);
    }
  }

  updateBoard() {
    this.deleteChild();
  
    for (const line of this.executiveGrid) {
      for (const cell of line) {
        const newCell = document.createElement("div");
        newCell.innerText = (cell !== 0) ? Math.pow(2, cell).toString() : ' ';
        newCell.className = "Cell";
        newCell.style.backgroundColor = (cell !== 0) ? cellColors[cell.toString()] : defaultCellColor;
        newCell.style.color = (cell === 1 || cell === 2) ? darkestTextColor : lighestTextColor;
        this.board.appendChild(newCell);
      }
    }
  };

  //
  // Game management methods
  //

  generateRandomPosition(gridSize) {
    const randomNumber = Math.floor(Math.random() * (gridSize * gridSize - 1) + 1);
    const y = Math.trunc(randomNumber / gridSize);
    const x = (randomNumber / gridSize % 1) * gridSize === 0 ? 3 : (randomNumber / gridSize % 1) * gridSize - 1;
    return [x, y];
  }
  
  isAvailablePosition(position) {
    return this.executiveGrid[position[0]][position[1]] === 0;
  }
  
  fillGridWithRamdomNumber() {
    if (!this.endGame) {
      let newPosition = this.generateRandomPosition(this.gridDimension);
      
      while (!this.isAvailablePosition(newPosition)) {
        newPosition = this.generateRandomPosition(this.gridDimension);
      }
      
      this.executiveGrid[newPosition[0]][newPosition[1]] = 1;
    } else {
      console.log('finish');
    }
  }

  initGame() {
    this.fillGridWithRamdomNumber();
    this.fillGridWithRamdomNumber();
    this.updateBoard();
  }

  checkEndGame() {
    let occupiedCells = 0;
  
    for (let i = 0; i < this.executiveGrid.length; i++) {
      for (let j = 0; j < this.executiveGrid[i].length; j++) {
        if (this.executiveGrid[i][j] !== 0) {
          occupiedCells = occupiedCells + 1;
        }
  
        if (this.executiveGrid[i][j] === 11) {
          this.endGame = true;
        }
      }
    }
  
    console.log(occupiedCells);
    if (occupiedCells === this.gridDimension * this.gridDimension) {
      this.endGame = true;
    }
  }

  //
  // Command methods
  //

  moveColumn(direction, reverseColumn) {
    for (let i = 0; i < this.executiveGrid.length; i++) {
      const activeColumn = [];
      
      for (let j = 0; j < this.executiveGrid[i].length; j++) {  
        if (this.executiveGrid[direction === 'x' ? i : j][direction === 'x' ? j : i] !== 0) activeColumn.push(this.executiveGrid[direction === 'x' ? i : j][direction === 'x' ? j : i]);
      }

      if (reverseColumn) activeColumn.reverse();

      for (let k = 0; k < activeColumn.length - 1; k++) {
        if (activeColumn[k] === activeColumn[k + 1]) {
          activeColumn[k] = activeColumn[k] + 1;
          activeColumn.splice(k + 1, 1);
        }
      }

      let _newColumn;

      if (reverseColumn) {
        _newColumn = [...activeColumn, ...new Array(this.gridDimension - activeColumn.length).fill(0)].reverse();
      } else {
        _newColumn = [...activeColumn, ...new Array(this.gridDimension - activeColumn.length).fill(0)];
      }
      
      for (let j = 0; j < this.executiveGrid[i].length; j++) {  
        this.executiveGrid[direction === 'x' ? i : j][direction === 'x' ? j : i] = _newColumn[j];
      }
    }

    this.checkEndGame();
    this.fillGridWithRamdomNumber();
    this.updateBoard();
  }
}

const game = new Game(
  document.querySelector(".Board"),
  4
);

game.initGame();

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.key) {
    case "ArrowUp": {
      game.moveColumn('y', false);
      break;
    }
    case "ArrowDown": {
      game.moveColumn('y', true);
      break;
    }
    case "ArrowLeft": {
      game.moveColumn('x', false);
      break;
    }
    case "ArrowRight": {
      game.moveColumn('x', true);
      break;
    }
    case "Enter":
      // Faire quelque chose pour les touches "enter" ou "return" pressées.
      break;
    case "Escape":
      // Faire quelque chose pour la touche "esc" pressée.
      break;
    default:
      return;
  }

  event.preventDefault();
}, true);
