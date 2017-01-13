Parse.Cloud.define('sendFriendRequest', function(req, res){
	var query = new Parse.Query("User");
	query.equalTo("objectId", req.params.user1);
	query.first().then(function(user){
		
		query = new Parse.Query("User");
		query.equalTo("objectId", req.params.user2);
		query.first().then(function(friend){
			query = new Parse.Query("Installation");
			query.equalTo("user", friend);

			Parse.Push.send({
			 	where: query,
			 	data: {
			 		title: "Friend Request",
			 		message: user.get("username")+" want to be your friend!",
			 		userId: user.id,
			 		type: 1,
			 		goalId: ""
			 	}
			}, { useMasterKey: true })
			.then(function() {
			 	res.success({status: true});
			}, function(error) {
				res.success({status: false});
			});
		});
	});
});
Parse.Cloud.define('makeFriends', function(req, res){
	var query = new Parse.Query("User");
	query.equalTo("objectId", req.params.user1);
	query.first().then(function(user){
		var relation = user.relation("friends");

		query = new Parse.Query("User");
		query.equalTo("objectId", req.params.user2);
		query.first().then(function(friend){
			relation.add(friend);
			user.save();
			query = new Parse.Query("Installation");
			query.equalTo("user", friend);

			Parse.Push.send({
			 	where: query,
			 	data: {
			 		title: user.get("username")+" accept your invitation!",
			 		message: user.get("username")+" and you are friends now.",
			 		type: 2,
			 		userId: req.params.user2,
			 		goalId: ""
			 	}
			}, { useMasterKey: true })
			.then(function() {
			 	res.success({status: true});
			}, function(error) {
				res.success({status: false});
			});
		});
	});
});
Parse.Cloud.define('sendConfirmRequest', function(req, res){
	var query = new Parse.Query("User");
	query.equalTo("objectId", req.params.userid);
	query.first().then(function(user){
		query = new Parse.Query("User");
		query.equalTo("friends", user);
		query.find({
			success: function(results){
				query = new Parse.Query("Installation");
				query.containedIn("user", results);
				Parse.Push.send({
				 	where: query,
				 	data: {
				 		title: user.get("username")+" want you to confirm a goal",
				 		userId: user.id,
				 		message: req.params.goaldesc,
				 		goalId: req.params.goalid,
				 		type: 3
				 	}
				}, { useMasterKey: true })
				.then(function() {
				 	res.success({status: true});
				}, function(error) {
					res.success({status: false});
				});
			},
			error: function(){

			}
		});
	});
});
Parse.Cloud.define('confirmGoal', function(req, res){
	var query = new Parse.Query("Goal");
	query.equalTo("objectId", req.params.goalid);

	query.first().then(function(goal){
		goal.set("status", 3);
		goal.increment("confirmed");
		goal.save();
		query = new Parse.Query("User");
		query.equalTo("objectId", req.params.userid);
		query.first().then(function(user){
			query = new Parse.Query("Installation");
			query.equalTo("userId", goal.get("userId"));
			Parse.Push.send({
			 	where: query,
			 	data: {
			 		title: user.get("username")+" has confirmed your goal",
			 		userId: user.id,
			 		message: goal.get("description"),
			 		goalId: req.params.goalid,
			 		type: 4
			 	}
			}, { useMasterKey: true })
			.then(function() {
			 	res.success({status: true});
			}, function(error) {
				res.success({status: false});
			});
		});
	});
});