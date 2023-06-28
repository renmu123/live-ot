let intervalID: any;

onmessage = function (e) {
  console.log(e);
  const data = e.data;
  if (data.cmd === "start") {
    intervalID = setInterval(() => {
      postMessage({ cmd: "save", data: "save" });
    }, 1000);
    console.log("intervalID", intervalID);
  } else if (data.cmd === "stop") {
    console.log(intervalID);

    if (intervalID) {
      clearInterval(intervalID);
    }
  }
};
