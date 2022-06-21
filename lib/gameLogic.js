import { Meteor } from 'meteor/meteor';
import { Games } from "./games";

class GameLogic {
	/**
	 * Creates a new RPS-Game
	 */
	newGame() {
		//TODO: insert new game object (player1 = Meteor.userid, status = "waiting")
	}

	/**
	 * Checks if the user is already playing
	 * @returns {boolean}
	 */
	userIsAlreadyPlaying() {
		//TODO: check if user is already in a game
	}

	/**
	 * Join a game as player 2
	 * @param game The game to join
	 */
	joinGame(game) {
		//TODO: implement logic to join a game
	}

	/**
	 * adds action to the game
	 * @param {*} action (rock, paper, scissor, wizard, spock)
	 */
	addNewAction(action) {
		// TODO: implement logic to add action to a game
	}

	/**
	 * sets the result of the Game
	 * @param {*} gameId 
	 * @param {*} result 
	 */
	setGameResult(gameId, result) {
		//TODO: set result to the game
	}

	resetActions(gameId) {
		Games.update(
			{_id: gameId},
			{
				$set: {
					"actions": []
				}
			}
		);
	}

	resetRound() {
		let game = Games.findOne(
			{
				status: "end"
			}
		);
		if (typeof game === "undefined") {
                return;
            }
		let gameId = game._id;
		this.resetActions(gameId);
		this.updateTurn(game);
		Games.update(
			{_id: gameId},
			{
				$set: {
					"result": ""
				}
			}
		);
	}

	updateTurn(game) {
		let nextPlayer;

		if(game.player1 === Meteor.userId())
			nextPlayer = game.player2;
		else
			nextPlayer = game.player1;

		Games.update(
			{_id: game._id},
			{
				$set: {
					"status": nextPlayer
				}
			}
		);
	}

	setResultMessageCode(gameId, resultMessageCode) {
		Games.update(
			{_id: gameId},
			{
				$set: {
					"resultMessageCode": resultMessageCode
				}
			}
		);
	}

	getWinner() {
		const game = Games.findOne({
			status: Meteor.userId()
		});

		let winner = "";
		let resultMessageCode;
		let firstAction = game.actions[0].action
		let secondAction = game.actions[1].action

		if (firstAction === "Schere") {
			if (secondAction === "Stein" || secondAction === "Spock") {
				winner = game.actions[1].playerID;
			}
			else if (secondAction === "Papier" || secondAction === "Echse") {
				winner =  game.actions[0].playerID;
			}
		}
		else if (firstAction === "Stein") {
			if (secondAction === "Papier" || secondAction === "Spock") {
				winner = game.actions[1].playerID;
			}
			else if (secondAction === "Schere" || secondAction === "Echse") {
				winner = game.actions[0].playerID;
			}
		}
		else if (firstAction === "Papier") {
			if (secondAction === "Schere" || secondAction === "Echse") {
				winner = game.actions[1].playerID;
			}

			else if (secondAction === "Stein" || secondAction === "Spock") {
				winner = game.actions[0].playerID;
			}
		}
		else if (firstAction === "Echse") {
			if (secondAction === "Schere" || secondAction === "Stein") {
				winner = game.actions[1].playerID;
			}
			else if (secondAction === "Spock" || secondAction === "Papier") {
				winner = game.actions[0].playerID;
			}
		}
		else if (firstAction === "Spock") {
			if (secondAction === "Schere" || secondAction === "Stein") {
				winner = game.actions[1].playerID;
			}
			else if (secondAction === "Echse" || secondAction === "Papier") {
				winner = game.actions[0].playerID;
			}
		}

		resultMessageCode = firstAction + ";" + secondAction;
		this.setResultMessageCode(game._id, resultMessageCode)

		return winner;
	}

	/**
	 * schere, stein, papier
	 * @returns {boolean}
	 */
	checkIfGameWasWon() {
		const game = Games.findOne({
			status: Meteor.userId()
		});

		return !(game.actions.length < 2 || game.actions[0].action === game.actions[1].action);
	}
}


export const gameLogic = new GameLogic();