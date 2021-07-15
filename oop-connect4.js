class Game {
	constructor(height, width) {
		(this.height = height),
			(this.width = width),
			(this.currPlayer = 1),
			(this.board = []),
			(this.HTMLBoard = document.getElementById('board')),
			(this.click = this.handleClick.bind(this));
		// https://stackoverflow.com/questions/33859113/javascript-removeeventlistener-not-working-inside-a-class
		this.startGame();
	}
	startGame() {
		const startBtn = document.querySelector('button');
		startBtn.addEventListener('click', () => {
			if (!this.board.length && this.HTMLBoard.innerHTML === '') {
				this.makeBoard();
				this.makeHtmlBoard();
			} else {
				this.reset();
			}
		});
	}
	reset() {
		this.board = [];
		this.HTMLBoard.innerHTML = '';
		this.currPlayer = 1;
		this.makeBoard();
		this.makeHtmlBoard();
	}
	endGame(msg) {
		alert(msg);
	}
	makeBoard() {
		for (let y = 0; y < this.height; y++) {
			this.board.push(Array.from({ length: this.width }));
		}
	}
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
	handleClick(evt) {
		// get x from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}
		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		// check for win
		if (this.checkForWin()) {
			this.removeHandleClick();
			return this.endGame(`Player ${this.currPlayer} won!`);
		} else if (this.board.every((row) => row.every((cell) => cell))) {
			return this.endGame(`Tie`);
		} else {
			this.currPlayer = this.currPlayer === 1 ? 2 : 1;
		}
	}
	removeHandleClick() {
		const topRow = document.querySelector('#column-top');
		topRow.removeEventListener('click', this.click, false);
	}
	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}
	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.classList.add(`p${this.currPlayer}`);
		// piece.style.top = -50 * (y + 2); ???

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}
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
