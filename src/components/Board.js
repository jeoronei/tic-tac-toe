import React from 'react';
import Square from './Square'
import '../index.css';

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
        const dimensions = [...Array(this.props.dimension).keys()]
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

export default Board;