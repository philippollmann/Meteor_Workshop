import { Meteor } from 'meteor/meteor';
import { check } from "meteor/check";
import { gameLogic } from "./gameLogic";

export const Games = new Mongo.Collection("games");

Meteor.methods({
	"games.play"() {
		// TODO: create game or join game

		// if no game exists ->  create new game
	
		// else (you are not player 1 and there is still need for a player 2= -> join game	
	},
	"games.delete"() {
		Games.remove({});
	},
	"games.resetRound"() {
		gameLogic.resetRound()
	},
	"games.makeMove"(action) {
		check(action, String);

		let game = Games.findOne(
			{
				status: this.userId
			}
		);

		if (game !== undefined) {
			gameLogic.addNewAction(action);

			if (gameLogic.checkIfGameWasWon()) {
				let winner = gameLogic.getWinner();
				gameLogic.setGameResult(game._id, winner);
			} else {
				if (game.actions.length === 1) {
					gameLogic.setGameResult(game._id, "tie");
				}
				else {
					gameLogic.updateTurn(game);
				}
			}

		}
	}
});