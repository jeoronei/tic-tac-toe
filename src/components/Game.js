import React from 'react';
import Board from './Board'
import '../index.css';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: this.generateNewSquare(3)
                }
            ],
            dimension: "3",
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(row, cow) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const square = this.copySquare(current.squares.slice());
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

    copySquare(current) {
        const squares = this.generateNewSquare(this.state.dimension);
        for (let i = 0; i < this.state.dimension; i++) {
            for (let j = 0; j < this.state.dimension; j++) {
                squares[i][j] = current[i][j]
            }
        }

        return squares
    }

    generateNewSquare(dimensions) {
        return Array.from({ length: dimensions }, () => new Array(dimensions).fill(null));
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    handleOptionChange = (changeEvent) => {
        const dimension = changeEvent.target.value
        this.setState({
            history: [
                {
                    squares: this.generateNewSquare(parseInt(dimension))
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            dimension: dimension
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const dimension = parseInt(this.state.dimension);

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
                <div className="box-radio">
                    <label>
                        <input type="radio" value="3"
                            checked={this.state.dimension === "3"}
                            onChange={this.handleOptionChange} />
                        3
                    </label>
                    <label>
                        <input type="radio" value="4"
                            checked={this.state.dimension === "4"}
                            onChange={this.handleOptionChange} />
                        4
                    </label>
                    <label>
                        <input type="radio" value="5"
                            checked={this.state.dimension === "5"}
                            onChange={this.handleOptionChange} />
                        5
                    </label>
                </div>
                <div className="board">
                    <div className="game-board">
                        <Board
                            dimension={dimension}
                            squares={current.squares}
                            onClick={(row, cow) => this.handleClick(row, cow)}
                        />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const linha = validarLinha(squares)
    if (linha) return linha

    const coluna = validarColuna(squares)
    if (coluna) return coluna

    const diagonal = validarDiagonal(squares)
    if (diagonal) return diagonal

    return null;
}

function validarLinha(squares) {
    for (let i = 0; i < squares.length; i++) {
        const value = squares[i][0]
        for (let j = squares.length - 1; j >= 0; j--) {
            if (!value || value !== squares[i][j]) break;
            else if (j === 0) return value;
        }
    }

    return null;
}

function validarColuna(squares) {
    for (let i = 0; i < squares.length; i++) {
        const value = squares[0][i]
        for (let j = squares.length - 1; j >= 0; j--) {
            if (!value || value !== squares[j][i]) break;
            else if (j === 0) return value;
        }
    }

    return null;
}

function validarDiagonal(squares) {
    const finalArray = squares.length - 1;
    const diagonal1 = squares[finalArray][finalArray]
    const diagonal2 = squares[0][finalArray]

    for (let i = finalArray; i >= 0; i--) {
        if (!diagonal1 || diagonal1 !== squares[i][i]) break;
        else if (i === 0) return diagonal1;
    }

    for (let i = 1; i < squares.length; i++) {
        if (!diagonal2 || diagonal2 !== squares[i][finalArray - i]) break;
        else if (i === finalArray) return diagonal2;
    }

    return null;
}

export default Game;