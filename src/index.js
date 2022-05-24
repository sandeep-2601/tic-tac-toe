import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
		return (
			<button className="square" onClick={() => props.onClick()}>
				{props.value}
			</button>
		);
}

class Board extends React.Component {

	renderSquare(i) {
		return (<Square 
						value   = {this.props.squares[i]}
						onClick = {() => this.props.onClick(i)} />);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			history:[{
				squares : Array(9).fill(null),
			}],
			stepNumber:0,
			player : true,
		}
	}

	jumpTo(move) {
		this.setState({
			stepNumber:move,
			player:move&1 == 0
		});
	}

	checkWinner(squares) {
		const lines = [
			[0,1,2],
			[3,4,5],
			[6,7,8],
			[0,3,6],
			[1,4,7],
			[2,5,8],
			[0,4,8],
			[2,4,6]
		]
		for(let i=0;i<lines.length;i++) {
			const [a,b,c] = lines[i];
			if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return squares[a];
			}
		}
		return null;
	}

	handleClick(i) {
		const history = this.state.history.slice(0,this.state.stepNumber+1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(squares[i] || this.checkWinner(squares)) return;
		
		squares[i] = this.state.player?'X':'O';

		this.setState({
			history: history.concat([{
						squares:squares
					}]),
			player : !this.state.player,
			stepNumber:history.length
		});

	}

	render() {
		
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = this.checkWinner(current.squares);

		const moves = history.map((current,move)=>{
			const display = move?'Go to move #'+move:'Go to start of the game';
			return(<li key={move}><button onClick={()=>this.jumpTo(move)}>{display}</button></li>)
		});

		let status;
		if(winner)
			status = `player ${winner} wins`; 
		else
			status = "player " + (this.state.player?'X':'0') +"`s turn";
		 
		return (
			<div className="game">
				<div className="game-board">
					<div>{status}</div>
					<br/>
					<Board squares = {current.squares}
			onClick = {(i) => this.handleClick(i)}/>
				</div>
				<div className="game-info">
					<ol id ="moves-list">{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
