var NodeHelper = require('node_helper');
const firebase = require('firebase/app');
require('firebase/database');

module.exports = NodeHelper.create({
  listenToChanges: function() {
    firebase
      .database()
      .ref(this.config.firebaseDatabaseRootRef)
      .on('value', snapshot => {
        const sensorEvents = snapshot.val();
        this.sendSocketNotification('SENSORS_CHANGED', sensorEvents);
      });
  },
  stop: function() {
    firebase
      .database()
      .ref(this.config.firebaseDatabaseRootRef)
      .off();
  },
  socketNotificationReceived: function(notification, payload) {
    console.log(
      `[${this.name}] socketNotificationReceived notification: ${notification}`,
      payload,
    );

    if (notification === 'SEND_CONFIG') {
      this.config = payload;
      firebase.initializeApp(payload.firebaseConfig);
      this.listenToChanges();
      return true;
    }

    return false;
  },
});
