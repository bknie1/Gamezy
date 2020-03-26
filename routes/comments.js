const express = require("express");
const router = express.Router({mergeParams: true});
// Note: We allow merging of game and comment params.
const Game = require("../models/game");
const Comment = require("../models/comment");

// /games/:_id/comments/new/
router.get("/new",isLoggedIn, (req, res) => {
	Game.findById(req.params.id, (err, game) => {
		if(err) { console.log(`Error: ${err}`)}
		else {
			res.render("comments/new", {ViewModel: game });
		}
	});
});

// /games/:_id/comments/
router.post("/", isLoggedIn, (req, res) => {
	/// Get game and create a comment on it.
	Game.findById(req.params.id, (err, game) => {
		if(err) { console.log(`Error: ${err}`)}
		else {
			Comment.create({
				text: req.body.comment,
				author: {
					id: req.user._id,
					username: req.user.username
				}
			}, (err, comment) => {
				comment.save((err, comment) => {
					if(err) { console.log(`Error: ${err}`) }
					else {
						game.comments.push(comment);
						game.save((err, game) => {
							if(err) { console.log(`Error: ${err}`) }
							else {
								res.redirect(`/games/${game._id}`)
							}
						});
					}
				});
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;