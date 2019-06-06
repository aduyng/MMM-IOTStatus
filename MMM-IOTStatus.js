Module.register("MMM-IOTStatus", {
	sensorEvents: null,
	defaults: {
		firebaseDatabaseRootRef: '/iot',
		title: 'Home Status'
	},
	getScripts: function(){
		return [
			'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js'
		];
	},
	getStyles: function() {
		return [
			"https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css",
			"MMM-IOTStatus.css"
		];
	},

	getTranslations: function() {
		return false;
	},

	start: function() {
		console.log(`[${this.name}] started`);
		this.sendConfig();
		// this.getStocks();
		// if(this.config.currency.toLowerCase() != "usd"){
		// 	this.getExchangeRate();
		// }
		// this.scheduleUpdate();
	},

	sendConfig: function() {
		Log.info(`[${this.name}]: SEND_CONFIG`, this.config);
		this.sendSocketNotification("SEND_CONFIG", this.config);
	},

	getDom: function() {
		const wrapper = document.createElement("div");
		if( this.sensorEvents === null){
			wrapper.innerHTML = '<div class="loading"><span class="zmdi zmdi-rotate-right zmdi-hc-spin"></span> Loading...</div>';
			return wrapper;
		}
		wrapper.innerHTML = `
		<h2 class="title">${this.config.title}</h2>
		<ul class="sensors">
			${_.map(this.sensorEvents, sensor => {
				let iconClass = 'zmdi';
				let rowClass = '';
				if( sensor.value === 'locked' || sensor.value === 'closed'){
					iconClass = `${iconClass} zmdi-lock`;
					rowClass = `${rowClass} ok`;
				} else if( sensor.value === 'unlocked' || sensor.value === 'open'){
					iconClass = `${iconClass} zmdi-lock-open`;
					rowClass = `${rowClass} error`;
				}

				return `
					<li class="sensor ${rowClass}">
						<span class="sensor-icon ${_.kebabCase(sensor.deviceType)}"></span>
						<span class="sensor-name">${sensor.deviceName}</span>
						<span class="sensor-status-icon ${iconClass}"></span>
						<span class="sensor-status-name">${sensor.value}</span>
					</li>
				`;
			}).join('')}
		</ul>
		`;
		return wrapper;
	},

	// scheduleUpdate: function(delay) {
	// 	var loadTime = this.config.updateInterval;
	// 	if (typeof delay !== "undefined" && delay >= 0) {
	// 		loadTime = delay;
	// 	}

	// 	var that = this;
	// 	setInterval(function() {
	// 		that.getStocks();
	// 		if(this.config.currency.toLowerCase() != "usd"){
	// 			that.getExchangeRate();
	// 		}
	// 	}, loadTime);
	// },

	// getStocks: function () {
	// 	var allCompanies = this.config.companies;
	// 	var urls = [];
	// 	for(var company in allCompanies){
	// 		var url = this.config.baseURL + "query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=" + allCompanies[company] + "&apikey=" + this.config.apikey;
	// 		urls.push(url);
	// 	}
	// 	this.sendSocketNotification("GET_STOCKS", urls);
	// },

	// getExchangeRate: function () {
	// 	var url = this.config.baseURL + "?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20('USD" + this.config.currency + "')&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
	// 	this.sendSocketNotification("GET_EXCHANGE_RATE", url);
	// },
	socketNotificationReceived: function(notification, payload) {
		Log.info(`[${this.name}] socketNotificationReceived notification ${notification}`, payload);

		if (notification === "SENSORS_CHANGED") {
			this.sensorEvents = payload;
			return this.updateDom();
		}

		return false;
	}
});