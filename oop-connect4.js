// creates a Player class
class Player {
	constructor(color, num) {
		this.color = color;
		this.num = num;
	}
}

// creates a Game class
class Game {
	constructor(height, width) {
		(this.height = height),
			(this.width = width),
			(this.board = []),
			(this.HTMLBoard = document.getElementById('board')),
			(this.currPlayer = undefined);
		this.keyframeObj = {};
		this.click = this.handleClick.bind(this);
		this.startGame();
	}
	// start game
	startGame() {
		const form = document.querySelector('form');
		// add event listener to form
		form.addEventListener('submit', (e) => {
			// prevent browser from automatically refreshing
			e.preventDefault();

			// creates 2 player class
			// the input.value will be passed into the player's color
			// and the player's number will be hard-coded
			this.p1 = new Player(document.querySelector('#P1').value, 1);
			this.p2 = new Player(document.querySelector('#P2').value, 2);

			// checks for no inputs and for invalid colors
			if (!(this.p1.color && this.p2.color)) return alert('Please enter a color for Player1 or Player2');
			if (!(CSS.supports('color', this.p1.color) && CSS.supports('color', this.p2.color)))
				return alert('Invalid color, please try again');

			// start game
			this.resetGame();
		});
	}
	// clear game and creates new html board and in-game memory board
	resetGame() {
		this.board = [];
		this.HTMLBoard.innerHTML = '';
		this.currPlayer = this.p1;
		this.keyframeObj = {};
		this.makeBoard();
		this.makeHtmlBoard();
	}
	// end game
	endGame(msg) {
		alert(msg);
	}
	// make in-game memory board
	makeBoard() {
		for (let y = 0; y < this.height; y++) {
			this.board.push(Array.from({ length: this.width }));
		}
	}
	// make html board
	makeHtmlBoard() {
		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');
		top.addEventListener('click', this.click);

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}

		this.HTMLBoard.append(top);

		// make main part of board
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}

			this.HTMLBoard.append(row);
		}
	}
	// handle click event
	handleClick(evt) {
		// get x from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// keep track of number of times click event occurs at position 'x'
		if (this.keyframeObj[x]) {
			this.keyframeObj[x]++;
		} else {
			this.keyframeObj[x] = 1;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		// check for win or tie
		const piece = document.getElementById(`${y}-${x}`).firstChild;
		if (this.checkForWin()) {
			this.removeHandleClick();

			// will display alert message after the animation ends
			piece.addEventListener('animationend', () => this.endGame(`Player ${this.currPlayer.num} won!`));
		} else if (this.board.every((row) => row.every((cell) => cell))) {
			// will display alert message after the animation ends
			piece.addEventListener('animationend', () => this.endGame('Tie!'));
		} else {
			this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
		}
	}
	// remove click event
	removeHandleClick() {
		const topRow = document.querySelector('#column-top');
		topRow.removeEventListener('click', this.click, false);
	}
	// find an empty cell and returns the y position of that cell
	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}
	// create a piece and put in table
	placeInTable(y, x) {
		// looks up the number of times a click event occurred at position x
		// the number should range from 1-6 clicks
		// each number will correspond to a unique CSS keyFrame
		const num = this.keyframeObj[x];

		// add class, animation, and background color
		const piece = document.createElement('div');
		piece.classList.add('piece', `slide${num}`);
		piece.style.backgroundColor = `${this.currPlayer.color}`;
		// piece.style.top = -50 * (y + 2); ???

		// append the piece to the cell
		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}
	// check for win
	checkForWin() {
		const _win = (cells) => {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer

			return cells.every(
				([ y, x ]) =>
					y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayer
			);
		};

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
				const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}
}

new Game(6, 7);
