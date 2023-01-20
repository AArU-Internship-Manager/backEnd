const cron = require("node-cron");
const { updateOfferStatus, beginOffer, finishOffer } = require("../offerApi"); // import the function that updates the status

// schedule the cron job to run every day at midnight
cron.schedule("0 0 * * *", () => {
  updateOfferStatus();
  beginOffer();
  finishOffer();
});
