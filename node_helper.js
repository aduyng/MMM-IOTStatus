var NodeHelper = require("node_helper");
const firebase = require("firebase/app");
require("firebase/database");
// var request = require("request");
// var async = require("async");

module.exports = NodeHelper.create({
	start: function () {
		console.log(this.name + " helper method started...");
	},

	// sendRequest: function (urls) {
	// 	var self = this;

	// 	var results = {};

	// 	async.eachSeries(urls, function(url, done) {
	// 		request({ url: url, method: "GET" }, function (error, response, body) {
	// 			if (!error && response.statusCode == 200) {
	// 				var result = JSON.parse(body);
	// 				if(result["Error Message"]) {
	// 					console.log("No such symbol!");
	// 				} else {
	// 					var meta = result["Meta Data"];
	// 					if(!meta){
	// 						return;
	// 					}
	// 					var data = result["Time Series (Daily)"];
	// 					var compName = meta["2. Symbol"];
	// 					var count = 0;
	// 					for (var key in data) {
	// 						if (!data.hasOwnProperty(key)) {continue;}
	// 						var obj = data[key];
	// 						if(!results[compName]){
	// 							results[compName] = [];
	// 						}
	// 						results[compName].push(obj);
	// 						count++;
	// 						if(count == 2) {
	// 							break;
	// 						}
	// 					}
	// 				}
	// 			}
	// 			done();
	// 		});

	// 	}, function(err) {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		self.sendSocketNotification("STOCK_RESULT", results);
	// 	});
	// },
	listenToChanges: function() {
		firebase.database().ref(this.config.firebaseDatabaseRootRef).on('value', snapshot => {
			const sensorEvents = snapshot.val();
			this.sendSocketNotification('SENSORS_CHANGED', sensorEvents);
		});
	},
	stop: function() {
		firebase.database().ref(this.config.firebaseDatabaseRootRef).off();
	},
	socketNotificationReceived: function(notification, payload) {
		console.log(`[${this.name}] socketNotificationReceived notification: ${notification}`, payload);

		if(notification === 'SEND_CONFIG'){
			this.config = payload;
			firebase.initializeApp(payload.firebaseConfig);
			this.listenToChanges();
			return true;
		}

		return false;
	}
});