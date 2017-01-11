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
			 	data: {title: user.get("username")+" accept your invitation!"}
			}, { useMasterKey: true })
			.then(function() {
			 	res.success({status: true});
			}, function(error) {
				res.success({status: false});
			});
		});
	});
});
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
			 		title: user.get("username")+" want to be your friend!",
			 		userId: user.get("objectId")
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