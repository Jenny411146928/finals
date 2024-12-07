const board = document.getElementById("board");
const resetBtn = document.getElementById("resetBtn");

let currentPlayer = "X"; // "X" 開始
let gameBoard = ["", "", "", "", "", "", "", "", ""]; // 儲存遊戲格子的狀態

// 設定遊戲格子
function createBoard() {
  board.innerHTML = "";
  gameBoard.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.textContent = cell;
    cellElement.addEventListener("click", () => handleCellClick(index));
    board.appendChild(cellElement);
  });
}

// 處理格子點擊事件
function handleCellClick(index) {
  if (gameBoard[index] === "") {
    gameBoard[index] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    createBoard();
    checkWinner();
  }
}

// 檢查遊戲是否結束或有贏家
function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      alert(`${gameBoard[a]} wins!`);
      resetGame();
      return;
    }
  }

  // 檢查平局
  if (!gameBoard.includes("")) {
    alert("It's a tie!");
    resetGame();
  }
}

// 重設遊戲
function resetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  createBoard();
}

// 初始化遊戲板
createBoard();

// 重設按鈕事件
resetBtn.addEventListener("click", resetGame);
