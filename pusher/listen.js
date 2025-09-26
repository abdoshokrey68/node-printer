const Pusher = require("pusher-js");
const dotenv = require("dotenv");
dotenv.config();
/**
 * الاستماع لأحداث الطباعة من Pusher
 * @param {Function} callback - دالة معالجة البيانات المستلمة
 */
const listenToPrintEvent = (callback, channel_name) => {
  const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: true,
  });

  const channel = pusher.subscribe(channel_name);
  channel.bind(process.env.EVENT_NAME, (data) => {
    console.log("Received print event from Pusher");
    callback(data);
  });

  console.log(`Listening to Pusher events on channel: ${channel_name}`);
};

module.exports = listenToPrintEvent;
