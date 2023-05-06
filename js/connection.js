const ipAddressDiv = document.querySelector("#ip-address");
const waitBtn = document.querySelector("#wait-btn");
const connectBtn = document.querySelector("#connect-btn");
const otherIpInput = document.querySelector("#other-ip-input");
const logTextarea = document.querySelector("#log");
const sendBtn = document.querySelector("#send-btn");
const dataInput = document.querySelector("#data-input");
const disconnectBtn = document.querySelector("#disconnect-btn");

let ws;

function getLocalIpAddress() {
  return new Promise((resolve, reject) => {
    const RTCPeerConnection =
      window.RTCPeerConnection || window.webkitRTCPeerConnection;
    if (!RTCPeerConnection) {
      reject("WebRTC not supported");
    }
    const pc = new RTCPeerConnection({
      iceServers: [],
    });
    pc.createDataChannel("");
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(reject);
    pc.onicecandidate = function (e) {
      if (e.candidate) {
        const ipRegex = /\d+\.\d+\.\d+\.\d+/;
        const ipMatch = e.candidate.candidate.match(ipRegex);
        const ip = ipMatch ? ipMatch[0] : "";
        resolve(ip);
      }
    };
  });
}

waitBtn.addEventListener("click", async function () {
  const ipAddress = await getLocalIpAddress();
  ipAddressDiv.textContent = `Your IP address is ${ipAddress}`;

  const WebSocketServer = require("ws").Server;
  const wss = new WebSocketServer({ port: 8080 });

  wss.on("connection", function connection(socket) {
    console.log("Incoming connection");
    logTextarea.value += "Incoming connection\n";

    socket.on("message", function incoming(data) {
      console.log("Received data:", data);
      logTextarea.value += `Received data: ${data}\n`;
    });

    socket.on("close", function () {
      console.log("Connection closed");
      logTextarea.value += "Connection closed\n";
    });

    ws = socket;
  });

  setTimeout(function () {
    if (!ws) {
      console.log("No connection made");
      logTextarea.value += "No connection made\n";
      wss.close();
    }
  }, 30000);
});

connectBtn.addEventListener("click", function () {
  const otherIp = otherIpInput.value;

  ws = new WebSocket(`ws://${otherIp}:8080`);

  ws.onopen = function () {
    console.log("Connection established");
    logTextarea.value += "Connection established\n";
  };

  ws.onmessage = function (event) {
    console.log("Received data:", event.data);
    logTextarea.value += `Received data: ${event.data}\n`;
  };

  ws.onclose = function () {
    console.log("Connection closed");
    logTextarea.value += "Connection closed\n";
  };
});

sendBtn.addEventListener("click", function () {
  const id = 1; // Replace with your own ID
  const name = "Player 1"; // Replace with your own name
  const action = dataInput.value;
  const data = { id, name, action };

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
    console.log("Sent data:", data);
    logTextarea.value += `Sent data: ${JSON.stringify(data)}\n`;
  } else {
    console.log("Not connected");
    logTextarea.value += "Not connected\n";
  }
});

disconnectBtn.addEventListener("click", function () {
  if (ws) {
    ws.close();
    console.log("Connection closed");
    logTextarea.value += "Connection closed\n";
  } else {
    console.log("Not connected");
    logTextarea.value += "Not connected\n";
  }
});
