function gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    const initBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i].push(cell());
            }
        }
    }

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                board[i][j].resetCell();
            }
        }
    }

    const getBoard = () => board;

    const playToken = (row, column, player) => {
        // Prevents player from playing token in a cell that already has token
        if (board[row][column].getValue() !== "") return "error";

        board[row][column].addToken(player);
    }

    initBoard();

    return {
        getBoard,
        playToken,
        resetBoard
    }
}

function cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    const resetCell = () => {
        value = "";
    }

    return {
        addToken,
        getValue,
        resetCell
    };
}

function createPlayer(playerName, playerToken) {
    const name = playerName;
    const token = playerToken;

    return {
        name,
        token
    }
}

function gameController(playerOneName, playerTwoName) {
    const board = gameboard();

    const playerOne = createPlayer(playerOneName, "x");
    const playerTwo = createPlayer(playerTwoName, "o");
    const players = [playerOne, playerTwo];

    let result = {
        win: false,
        token: "",
        resetResult() {
            this.win = false;
            this.token = ""
        }
    }

    let activePlayer = players[0];

    const resetGame = () => {
        board.resetBoard();
        activePlayer = players[0];
        result.resetResult();
    }

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const checkResult = () => {
        for (let i = 0; i < 3; i++) {
            // Check winning columns
            if (board.getBoard()[0][i].getValue() === board.getBoard()[1][i].getValue() &&
                board.getBoard()[1][i].getValue() === board.getBoard()[2][i].getValue() &&
                board.getBoard()[0][i].getValue() !== "") {
                result.win = true;
                result.token = board.getBoard()[0][i].getValue();
            }
            // Check winning rows
            if (board.getBoard()[i][0].getValue() === board.getBoard()[i][1].getValue() &&
                board.getBoard()[i][1].getValue() === board.getBoard()[i][2].getValue() &&
                board.getBoard()[i][0].getValue() !== "") {
                result.win = true;
                result.token = board.getBoard()[i][0].getValue();
            }
        }
        // Check diagonal win
        if (board.getBoard()[0][0].getValue() === board.getBoard()[1][1].getValue() &&
            board.getBoard()[1][1].getValue() === board.getBoard()[2][2].getValue() &&
            board.getBoard()[0][0].getValue() !== "") {
            result.win = true;
            result.token = board.getBoard()[0][0].getValue();
        }
        if (board.getBoard()[0][2].getValue() === board.getBoard()[1][1].getValue() &&
            board.getBoard()[1][1].getValue() === board.getBoard()[2][0].getValue() &&
            board.getBoard()[0][2].getValue() !== "") {
            result.win = true;
            result.token = board.getBoard()[0][2].getValue();
        }

        // Check tie game
        if (board.getBoard().every(row => row.every(cell => cell.getValue() !== ""))) {
            result.win = true;
            result.token = "tie";
            console.log("tie");
        }
        return result;
    }

    const playRound = (row, column) => {
        if (board.playToken(row, column, getActivePlayer().token) !== "error") {
            board.playToken(row, column, getActivePlayer().token);

            if (checkResult().win === true) return;

            switchPlayerTurn();
        }
    }

    return {
        getActivePlayer,
        playRound,
        getBoard: board.getBoard,
        checkResult,
        resetGame,
    }
}

function screenController() {
    const game = gameController('Louis', 'Juliette');
    const playerTurnDiv = document.querySelector('.player-turn');
    const boardDiv = document.querySelector('.board');
    const resetBtn = document.querySelector('.reset');
    let result;

    const updateScreen = () => {
        result = game.checkResult()
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        // Displays winner or active player
        if (result.win === true) {
            if (result.token === "tie") {
                playerTurnDiv.textContent = "It's a tie game, no one wins !"
            } else {
                playerTurnDiv.textContent = `${activePlayer.name} wins !`;
            }
        } else {
            playerTurnDiv.textContent = `It's ${activePlayer.name}'s turn !`;
        }
        // Creates board button display
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cellButton = document.createElement('button')
                cellButton.classList.add('cell');
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = board[i][j].getValue();

                // Ajouter les conditions de victoire ici
                if (result.win === true) {
                    cellButton.disabled = true
                }

                boardDiv.appendChild(cellButton);
            }
        }
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn) return;
        if (!selectedRow) return;

        game.playRound(selectedRow, selectedColumn)
        updateScreen();
    }

    function resetDisplay() {
        game.resetGame();
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);
    resetBtn.addEventListener('click', resetDisplay)


    updateScreen();
}

screenController();

// Ajouter un booleen de valeur de victoire
// Ajouter une condition en cas de match nul
// Ajouter un input pour le nom des joueurs, avec une valeur par défaut
// Faire un design un peu plus sympa
// Changer la couleur de la ligne qui gagne