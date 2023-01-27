let intervalId;
let end;
let timeLeft;
let time;
let session;
let brake;
let state;

onmessage = function (message) {
  if (message.data.status === "start") {
    time = message.data;
    session = time.session * 60 * 1000;
    brake = time.break * 60 * 1000;
    state = message.data.state;
    end = performance.now() + session;
  }

  if (message.data === "stop") {
    console.log("Interval Cleared");
    // console.log(end);
    // this.postMessage({ signal: "stop"});
    this.clearInterval(intervalId);
    return;
  }

  if (message.data === "continue") {
    end = this.performance.now() + timeLeft;
  }

  // console.time("1 minute");
  intervalId = setInterval(() => {
    if (end - performance.now() <= 0) {
      state = state == "Session" ? "Break" : "Session";
      end += state == "Session" ? session + 1000 : brake + 1000;
      // console.timeEnd("1 minute");
      this.postMessage("End of period");
      // this.clearInterval(intervalId);
      // this.postMessage("terminate");
    }
    timeLeft = end - performance.now();
    this.postMessage(end - performance.now());
    // console.log(end - this.performance.now());
  }, 100);

  // console.log(intervalId);
  // console.log(message.data);
  //   this.postMessage(time);
};
