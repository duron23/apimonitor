const monitoredApi = "https://httpstat.us/"; // Replace with the specific API URL

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.url.includes(monitoredApi) && details.statusCode > 299) {
      console.error("API Request Failed:", details);
      sendLogToServer(details);
      // Here you can log the error to your server or handle it as needed
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onErrorOccurred.addListener(
  function (details) {
    if (details.url.includes(monitoredApi)) {
      console.error("API Request Error:", details);
      sendLogToServer(details);
      // Here you can log the error to your server or handle it as needed
    }
  },
  { urls: ["<all_urls>"] }
);

function sendLogToServer(log) {
  fetch("http://localhost:3000/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ log: log, timestamp: new Date().toISOString() }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Log sent successfully");
      } else {
        console.error("Error sending log:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error sending log:", error);
    });
}
