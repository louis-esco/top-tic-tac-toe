function gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i].push(cell());
        }
    }
    const getBoard = () => board;

    const playToken = (row, column, player) => {

        if (board[row][column].getValue() !== "") return "error";

        board[row][column].addToken(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return {
        getBoard,
        playToken,
        printBoard
    }
}

function cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {
        addToken,
        getValue
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

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn !'`);
    }

    const checkResult = () => {
        for (let i = 0; i < 3; i++) {
            // Check winning columns
            if (board.getBoard()[0][i].getValue() === board.getBoard()[1][i].getValue() &&
                board.getBoard()[1][i].getValue() === board.getBoard()[2][i].getValue() &&
                board.getBoard()[0][i].getValue() !== "") {
                return board.getBoard()[0][i].getValue();
            }
            // Check winning rows
            if (board.getBoard()[i][0].getValue() === board.getBoard()[i][1].getValue() &&
                board.getBoard()[i][1].getValue() === board.getBoard()[i][2].getValue() &&
                board.getBoard()[i][0].getValue() !== "") {
                return board.getBoard()[i][0].getValue();
            }
        }
        // Check diagonal win
        if (board.getBoard()[0][0].getValue() === board.getBoard()[1][1].getValue() &&
            board.getBoard()[1][1].getValue() === board.getBoard()[2][2].getValue() &&
            board.getBoard()[0][0].getValue() !== "") {
            return board.getBoard()[0][0].getValue();
        }
        if (board.getBoard()[0][2].getValue() === board.getBoard()[1][1].getValue() &&
            board.getBoard()[1][1].getValue() === board.getBoard()[2][0].getValue() &&
            board.getBoard()[0][2].getValue() !== "") {
            return board.getBoard()[0][2].getValue();
        }
    }

    const playRound = (row, column) => {
        if (board.playToken(row, column, getActivePlayer().token) === "error") {
            console.log("This cell is not available, please play in another cell")
        } else {
            console.log(`${getActivePlayer().name} plays a "${getActivePlayer().token}" in row:${parseInt(row) + 1} and column:${parseInt(column) + 1}`);

            board.playToken(row, column, getActivePlayer().token);

            if (checkResult() === "x" || checkResult() === "o") return;

            switchPlayerTurn();
            printNewRound();
        }
    }

    printNewRound();

    return {
        getActivePlayer,
        printNewRound,
        playRound,
        getBoard: board.getBoard,
        checkResult
    }
}

function screenController() {
    const game = gameController('Louis', 'Juliette');
    const playerTurnDiv = document.querySelector('.player-turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        if (game.checkResult() === "x" || game.checkResult() === "o") {
            playerTurnDiv.textContent = `${activePlayer.name} wins !`;
        } else {
            playerTurnDiv.textContent = `It's ${activePlayer.name}'s turn !`;
        }

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cellButton = document.createElement('button')
                cellButton.classList.add('cell');
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = board[i][j].getValue();

                if (game.checkResult() === "x" || game.checkResult() === "o") {
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

    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
}

screenController();
