const Pusher = require("pusher-js");

const listenToPrintEvent = (callback) => {
  const pusher = new Pusher("70240cc28cad0aa7c535", {
    cluster: "eu",
    encrypted: true,
  });

  const channel = pusher.subscribe("print-invoice");
  channel.bind("print-invoice-event", (data) => {
    callback(data);
  });
};

module.exports = listenToPrintEvent;
