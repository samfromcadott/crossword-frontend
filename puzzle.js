const EMPTY_CELL = 0;

var grid = [];
var puzzle = {};
var answers = []; // Array of answer squares

var score = 0;
var max_score = 0;

function add_words_to_grid(words, dx, dy) {
	// Adds words to the grid (duh). (dx, dy) is the direction the words are oriented
	for (w in words) {
		var word = words[w]
		// Add each letter to the grid
		for (var i = 0; i < word.answer.length; i++) {
			// If the letter is the first in a word there should be a number label
			var n = 0;
			var col = word.x + i*dx, row = word.y + i*dy;
			if (i == 0) n = Number(w) + 1;

			grid[row][col] = {text: word.answer[i], number: n, input: ''};

		}
	}
}

function make_list(words, list) {
	// Adds words to ol element list
	for (w in words) {
		var li = document.createElement('li');
		li.innerText = words[w].clue;
		list.appendChild(li);
	}
}

function load_data(file, callback) {
	var raw_file = new XMLHttpRequest();
	raw_file.overrideMimeType("application/json");
	raw_file.open("GET", file, true);
	raw_file.responseType = 'json';

	raw_file.onreadystatechange = function() {
		if (raw_file.readyState === 4 && raw_file.status == "200")
			callback(raw_file.response);
	}

	raw_file.send(null);

}

function make_puzzle(puzzle) {
	// Create a 2D array of the letters
	grid = new Array(puzzle.height);

	for (var row = 0; row < grid.length; row++) {
		grid[row] = new Array(puzzle.width);

		// Start all cells empty
		for (var col = 0; col < puzzle.width; col++)
			grid[row][col] = EMPTY_CELL;

	}

	add_words_to_grid(puzzle.across, 1, 0);
	add_words_to_grid(puzzle.down, 0, 1);

	make_list( puzzle.across, document.getElementById("across-list") );
	make_list( puzzle.down, document.getElementById("down-list") );

	make_table(grid);

	max_score = answers.length;

}

function make_table(data) {
	const table = document.getElementById("puzzle-table");

	for (i in data) {
		const tr = table.insertRow();
		for (j in data[i]) {
			const td = tr.insertCell();
			if (data[i][j] == EMPTY_CELL) continue; // Skip empty squares
			make_cell(td, data[i][j]);

		}
	}

}

function make_cell(cell, data) {
	// Makes a td node into an answer sqaure
	cell.classList.add("answer-square");

	const text = document.createElement('span');
	text.innerText = data.text;
	text.classList.add("answer-text");
	text.style.display = "none";

	const number = document.createElement('span');
	number.innerText = data.number;
	number.classList.add("answer-number");

	const input = document.createElement('input');
	input.classList.add("answer-input");
	input.setAttribute("maxlength", 1);

	var cell_data = {}; // Data about this cell
	cell_data.answer = data.text;
	cell_data.text = text;
	cell_data.input = input;
	cell_data.input_text = "";

	input.oninput = (event) => {
		if ( event.target.value.toUpperCase() == cell_data.answer ) {
			cell_data.input_text = event.target.value.toUpperCase();
			add_score();
		}
	};

	cell.appendChild(text);
	cell.appendChild(input);
	if (data.number > 0) cell.appendChild(number);
	answers.push(cell_data);

}

function add_score() {
	// Increments the score and checks if the puzzle is completed
	score++;
	if (score == max_score) {
		check_answers();
		console.log("You win.");
	}

}

function check_answers() {
	// Removes input on correct cells
	for (var cell of answers) {
		if ( cell.input_text == cell.answer ) { // Input and answer match
			cell.text.style.display = ""; // Show text
			cell.input.remove(); // Remove input
		}

	}

}

load_data("20221009072505.json", make_puzzle);
