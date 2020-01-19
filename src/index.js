import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button >
    );
}

class Board extends React.Component {
    renderSquare(row, cow) {
        return (
            <Square
                key={`${row}${cow}`}
                value={this.props.squares[row][cow]}
                onClick={() => this.props.onClick(row, cow)} />
        );
    }

    renderBoard() {
        const dimensions = [0, 1, 2];
        return dimensions.map((row) => {
            return (
                <div key={row} className="board-row">
                    {dimensions.map((col) => this.renderSquare(row, col))}
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                {this.renderBoard()}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)]
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(row, cow) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const square = this.generateNewSquare(current.squares.slice());
        if (calculateWinner(square) || square[row][cow]) {
            return;
        }
        square[row][cow] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: square
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    generateNewSquare(current) {
        const squares = [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                squares[i][j] = current[i][j]
            }
        }

        return squares
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(row, cow) => this.handleClick(row, cow)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const row = [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2],
        [0, 1, 2],
        [0, 1, 2],
        [0, 1, 2],
        [0, 1, 2],
        [2, 1, 0],
    ];
    const col = [
        [0, 1, 2],
        [0, 1, 2],
        [0, 1, 2],
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2],
        [0, 1, 2],
        [0, 1, 2],
    ]
    for (let i = 0; i < row.length; i++) {
        const [a, b, c] = row[i];
        const [d, e, f] = col[i];
        if (squares[a][d] && squares[a][d] === squares[b][e] && squares[a][d] === squares[c][f]) {
            return squares[a][d];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
