function init() {
  // Raven.config("https://c29cfde228934090ae376656c09001c5@sentry.io/1820786", {
  //   release: "1-0-0",
  //   environment: "development-test"
  // });
}

function log(error) {
  // Raven.captureException(error);
  console.log(error);
}

export default {
  init,
  log
};
