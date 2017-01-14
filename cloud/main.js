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

		query = new Parse.Query("User");
		query.equalTo("objectId", req.params.user2);
		query.first().then(function(friend){
			//User friend of Friend
			var relation = user.relation("friends");
			relation.add(friend);
			user.save(null, {useMasterKey: true});
			//Friend friend of User
			relation = friend.relation("friends");
			relation.add(user);
			friend.save(null, {useMasterKey: true});

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
	//query.include("user");
	query.first()
	.then(function(goal){
		return Parse.Promise.when([goal.get("user").fetch()]);
	})
	.then(function(fetched){
		var goal = fetched.get("parent");
		goal.set("status", 3);
		goal.increment("confirmed");
		goal.save(null, {useMasterKey: true});
		query = new Parse.Query("User");
		query.equalTo("objectId", req.params.userid);
		query.first().then(function(user){
			query = new Parse.Query("Installation");
			query.equalTo("user", fetched);
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