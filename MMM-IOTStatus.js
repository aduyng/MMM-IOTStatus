Module.register('MMM-IOTStatus', {
  sensorEvents: null,
  defaults: {
    firebaseDatabaseRootRef: '/iot',
    title: 'Home Status',
  },
  getScripts: function() {
    return [
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js',
    ];
  },
  getStyles: function() {
    return [
      'https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css',
      'MMM-IOTStatus.css',
    ];
  },

  getTranslations: function() {
    return false;
  },

  start: function() {
    console.log(`[${this.name}] started`);
    this.sendConfig();
  },

  sendConfig: function() {
    Log.info(`[${this.name}]: SEND_CONFIG`, this.config);
    this.sendSocketNotification('SEND_CONFIG', this.config);
  },

  getDom: function() {
    const wrapper = document.createElement('div');
    if (this.sensorEvents === null) {
      wrapper.innerHTML =
        '<div class="loading"><span class="zmdi zmdi-rotate-right zmdi-hc-spin"></span> Loading...</div>';
      return wrapper;
    }
    const sensorKeys = Object.keys(this.sensorEvents) || [];
    wrapper.innerHTML = `
      <h2 class="title">${this.config.title}</h2>
      <ul class="sensors">
        ${sensorKeys
          .map(sensorKey => {
            const sensor = this.sensorEvents[sensorKey];
            let iconClass = 'zmdi';
            let rowClass = '';
            if (sensor.value === 'locked' || sensor.value === 'closed') {
              iconClass = `${iconClass} zmdi-lock`;
              rowClass = `${rowClass} ok`;
            } else if (sensor.value === 'unlocked' || sensor.value === 'open') {
              iconClass = `${iconClass} zmdi-lock-open`;
              rowClass = `${rowClass} error`;
            } else if (sensor.value === 'on') {
              iconClass = `${iconClass} zmdi-power`;
              rowClass = `${rowClass} error`;
            } else if (sensor.value === 'off') {
              iconClass = `${iconClass} zmdi-minus-circle-outline`;
              rowClass = `${rowClass} ok`;
            }

            return `
                <li class="sensor ${rowClass}">
                  <span class="sensor-icon ${sensor.deviceType}"></span>
                  <span class="sensor-name">${sensor.deviceName}</span>
                  <span class="sensor-status-icon ${iconClass}"></span>
                  <span class="sensor-status-name">${sensor.value}</span>
                </li>
            `;
          })
          .join('')}
		  </ul>
		`;
    return wrapper;
  },

  socketNotificationReceived: function(notification, payload) {
    Log.info(
      `[${this.name}] socketNotificationReceived notification ${notification}`,
      payload,
    );

    if (notification === 'SENSORS_CHANGED') {
      this.sensorEvents = payload;
      return this.updateDom();
    }

    return false;
  },
});
