/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = "red"; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //creating array of rows and nesting them in board array
  for (let y = 0; y < HEIGHT; y++){
    row = [];
    board.push(row);
    //pushing null into row representing each cell. 
    for (let x = 0; x < WIDTH; x++){
      row.push(null);
    }
  }
  return board
}


/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // getting "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board")
  // creating the top row (dashed row)with click event
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // creating indivual cells (total of 7)for the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // creating rest of the rows and 7 cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
  return htmlBoard;
}
/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = 5; y >= 0; y--){
    if(board[y][x] === null){
      return y;
    }
  }
return y = null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // making a div and insert into correct table cell
  const piece = document.createElement("div")
  piece.setAttribute("class", "piece");
  //deciding whose turn it is. 
  if (currPlayer === "red"){
    piece.classList.add("red");
  } else {
    piece.classList.remove("red");
    piece.classList.add("yellow");
  }
  //dropping the piece in the correct cell. 
  const correctCell = document.getElementById(`${y}-${x}`)
  correctCell.append(piece);
  //assigning the spot on the arrow
  board[y][x] = piece.classList[1]

}

/** endGame: announce game end */

function endGame(msg) {
  const displayBoard = document.querySelector("#display-board")
  displayBoard.innerHTML = msg;
  const top = document.getElementById("column-top");
  top.removeEventListener("click", handleClick);
  setTimeout(function(){location.reload()}, 5000);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  
  // place piece in board and add to HTML table
  placeInTable(y, x);
  
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie  
  if(board.every(row => row.every(val=> val !== null))){
    return endGame("Everybody wins!")
  }
  // switch players
  if(currPlayer === "red"){
    currPlayer = "yellow";
  } else {
    currPlayer = "red";
  }
  playerDisplay(currPlayer);
  
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //  
  //Here we are outlining how the wins look, horinzontally, vertically, daignol right adn diagnol left. With the help of for loops, we are scanning the every cell for possible match.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function playerDisplay (playersColor){
  //displaying whose turn it is
  const gamerDisplay = document.querySelector("#display");
  gamerDisplay.setAttribute("class", playersColor);
  const displayBoard = document.querySelector("#display-board")
  displayBoard.innerHTML = "Player " + playersColor + "'s turn"
  return 
}

const restartButton = document.querySelector('#restart-button');
restartButton.addEventListener("click", restartGame);
function restartGame (){
  location.reload();
}


makeBoard();
makeHtmlBoard();
