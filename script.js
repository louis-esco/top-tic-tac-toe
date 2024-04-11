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

        if (board[row][column].getValue() !== 0) return "error";

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
    let value = 0;

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

    const playRound = (row, column) => {
        if (board.playToken(row, column, getActivePlayer().token) === "error") {
            console.log("This cell is not available, please play in another cell")
        } else {
            console.log(`${getActivePlayer().name} plays a "${getActivePlayer().token}" in row:${row + 1} and column:${column + 1}`);

            board.playToken(row, column, getActivePlayer().token);

            switchPlayerTurn();
            printNewRound();
        }
    }

    printNewRound();

    return {
        getActivePlayer,
        printNewRound,
        playRound
    }
}

const newGame = gameController('Louis', 'Juliette');
