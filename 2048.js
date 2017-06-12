var board = {};
var score = 0;
var bestScore = 0;
var status = "";
var input = document.querySelector("#submit-text");

var startGame = function () {
  createBoard();
  addRandomTile();
  addRandomTile();
  updateBoard();
};

var resetGame = function () {
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var key = tileKey(col,row);
      if (board[key] != undefined) {
        board[key] = undefined;
      }
    }
  }
  score = 0;
  addRandomTile();
  addRandomTile();
  updateBoard();
};

var getAllRowsAndCols = function () { // Gets all the rows and cols.
  var list = [];
  for (var i = 0; i < 4; i++) {
    list.push(getNumbersForRow(i));
    list.push(getNumbersForCol(i));
  }
  return list;
};

var checkGameOver = function () { // checks for game over. Not functional.
  var gameOver = false;
  var rowsAndCols = getAllRowsAndCols();
  counter = 0;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (rowsAndCols[i][j] != rowsAndCols[i][j + 1]) {
        counter++;
      }
    }
  }
  if (counter === 24) {
    gameOver = true;
  }
  return gameOver;
};

var tileKey = function (col, row) { // Makes tile key.
  return "tile" + col + "-" + row;
};

var updateScore = function(add) { // Updates the score.
  score += add;
};

var createBoard = function () { // Creates the html and some css for the board.
  var boardDiv = document.querySelector("#board");

  for (var row = 0; row < 4; row++) {
    var rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    boardDiv.appendChild(rowDiv);

    for (var col = 0; col < 4; col++) {
      var tileDiv = document.createElement("div");
      var key = tileKey(col, row);
      tileDiv.id = key;
      tileDiv.classList.add("tile");
      rowDiv.appendChild(tileDiv);
    }
  }
};

var updateBoard = function () { // Makes javascript data match the DOM.
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var key = tileKey(col, row);
      var value = board[key];
      var tileDiv = document.querySelector("#" + key);
      tileDiv.className = "tile";
      if (value) {
        tileDiv.innerHTML = value;
        tileDiv.classList.add("tile-" + value);
      } else {
        tileDiv.innerHTML = "";
      }
    }
    if (score > bestScore) {
      bestScore = score;
    }
    if (checkGameOver()) {
      alert("Game Over! You can no longer make a move.")
    }
  }

  document.querySelector("#score").innerHTML = score;
  document.querySelector("#best-score").innerHTML = bestScore;
};

var getNumbersForRow = function (row) { // Gets numbers on any given row.
  var numbers = [];
  for (var col = 0; col < 4; col++) {
    var key = tileKey(col, row);
    var value = board[key];
    if (value) {
      numbers.push(value);
    }
  }
  return numbers;
};

var getNumbersForCol = function (col) { // Gets numbers on any given column.
  var numbers = [];
  for (var row = 0; row < 4; row++) {
    var key = tileKey(col, row);
    var value = board[key];
    if (value) {
      numbers.push(value);
    }
  }
  return numbers;
};

var setNumbersForRow = function (row, numbers) { // Changes numbers on any given row.
  for (var col = 0; col < 4; col++) {
    var key = tileKey(col, row);
    board[key] = numbers[col];
  }
};

var setNumbersForCol = function (col, numbers) { // Changes numbers on any given column.
  for (var row = 0; row < 4; row++) {
    var key = tileKey(col, row);
    board[key] = numbers[row];
  }
};

var combineNumbers = function (numbers) { // Different version of commented code. In use currently.
  var newNumbers = [];                    // Handles collapse of numbers.
  while (numbers.length > 0) {
    if (numbers[0] === numbers[1]) {
      var sum = numbers[0] + numbers[1];
      updateScore(sum);
      newNumbers.push(sum);
      numbers.shift();
      numbers.shift();
    } else {
      newNumbers.push(numbers[0]);
      numbers.shift();
    }
  }
  while (newNumbers.length < 4) {
    newNumbers.push(undefined);
  }
  return newNumbers;
};

var combineRowLeft = function (row) { // Combines a given row to the left.
  var oldNumbers = getNumbersForRow(row);
  var newNumbers = combineNumbers(oldNumbers);
  setNumbersForRow(row, newNumbers);
};
var combineRowRight = function (row) { // Combines a given row to the right.
  var oldNumbers = getNumbersForRow(row).reverse();
  var newNumbers = combineNumbers(oldNumbers).reverse();
  setNumbersForRow(row, newNumbers);
};
var combineColUp = function (col) { // Combines a given column up.
  var oldNumbers = getNumbersForCol(col);
  var newNumbers = combineNumbers(oldNumbers);
  setNumbersForCol(col, newNumbers);
};
var combineColDown = function (col) { // Combines a given column down.
  var oldNumbers = getNumbersForCol(col).reverse();
  var newNumbers = combineNumbers(oldNumbers).reverse();
  setNumbersForCol(col, newNumbers);
};

var combineDirection = function (direction) { // Uses helper functions above to make moves happen
  var oldBoard = Object.assign({}, board);    // in any given direction.

  for (var n = 0; n < 4; n++) {
    if (direction === "left") {
      combineRowLeft(n);
    } else if (direction === "right") {
      combineRowRight(n);
    } else if (direction === "up") {
      combineColUp(n);
    } else if (direction === "down") {
      combineColDown(n);
    }
  }
  if (didBoardChange(oldBoard)) {
    addRandomTile();
    updateBoard();
  }
};

var didBoardChange = function (oldBoard) { // Finds out if the board changed, if it did it returns
  var notSame = false;                     // true.
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var key = tileKey(col,row);
      var value = board[key];
      var oldValue = oldBoard[key];
      if (value != oldValue) {
        notSame = true;
        break;
      }
    }
  }
  return notSame;
};

var getEmptyTiles = function () { // Finds all empty tiles and gathers them into an array.
  var empty = [];
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var key = tileKey(col,row);
      var value = board[key];
      if (value === undefined) {
        empty.push(key);
      }
    }
  }
  return empty;
};

var addRandomTile = function () { // Add random tile that equals 2 or 4 in a random empty position.
  var emptyTiles = getEmptyTiles();

  var randomIndex = Math.floor(Math.random() * emptyTiles.length);
  var randomEmptyTile = emptyTiles[randomIndex];

  if (Math.random() > 0.9) {
    board[randomEmptyTile] = 4;
  } else {
    board[randomEmptyTile] = 2;
  }
};

var submitScore = function () { // Submits score to test server.
  var input = document.querySelector("#submit-text");
  var value = input.value;
  //var initials = prompt("Enter your name.")
  fetch("https://highscoreapi.herokuapp.com/scores", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({
      name: value,
      score: bestScore
    })
  }).then(function (response) {
    console.log("Score submitted. Status:", response.status);
    status = response.status;
  });
};

var getHighScores = function () { // Gets the high scores.
  fetch("https://highscoreapi.herokuapp.com/scores").then(function (response) {
    console.log("Scores received. Status", response.status);
    return response.json();
  }).then(function (data) {
    var i = 1;
    data.forEach(function (entry) {
      var current = document.querySelector("#score-" + i)
      current.innerHTML = entry.name + ": " + entry.score;
      i++
    });
  });
};

              // Starts game with function call.
startGame();
getHighScores();

document.querySelector("#submit-button").onclick = function () { // Handles submit button event.
  alert("Score submitted!")
  submitScore();
};

document.onkeydown = function(event) { // Handles the key events. Up arrow pressed, down arrow pressed ext.
  if (event.which === 37) { // left arrow
    combineDirection("left");
  } else if (event.which === 38) { // up arrow
    combineDirection("up");
  } else if (event.which === 39) { // right arrow
    combineDirection("right");
  } else if (event.which === 40) { // down arrow
    combineDirection("down");
  }
};

var buttonDiv = document.querySelector("#reset-button");
buttonDiv.onclick = resetGame; // Handles reset button event.




/* function that handles the collapse of numbers. Does not handle direction of collapse. Not in use.
var collapseNumbers = function (numbers) { // numbers is an array of numbers.
	var newList = [];
	for (var j = 0; j < numbers.length; j++) {
		if (numbers[j] != 0) {
			newList.push(numbers[j])
		}
	}

	var newArray = [];

	for (var i = 0; i < newList.length; i++) {
		if (newList[i] === newList[i+1]) {
			newArray.push(newList[i]+newList[i+1]);
			i++;
		} else {
			newArray.push(newList[i]);
		}
	}
	return newArray;
}; */




