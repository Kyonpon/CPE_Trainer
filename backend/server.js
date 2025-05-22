import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import open from "open";
import { connectDB } from "./config/db.js";
import { CircuitAPI } from "./routes/circuits.route.js";
import { UserAPI } from "./routes/user.route.js";
import { ULCircuitAPI } from "./routes/universallogic.route.js";
import { CBCircuitAPIv2 } from "./routes/v2.combilogic.route.js";
import { MicroCircuitAPI } from "./routes/micro.route.js";
import { ULCircuitAPIv2 } from "./routes/v2.unversallogic.route.js";
import { CircuitCheckerAPI } from "./routes/circuitchecker.route.js";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { ICCheckerAPI } from "./routes/icChecker.route.js";
//import { testRefreshGatesInterval } from "./controllers/icChecker.controller.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/circuits", CircuitAPI);
app.use("/api/users", UserAPI);
app.use("/api/ulcircuits", ULCircuitAPIv2);
app.use("/api/cbcircuits", CBCircuitAPIv2);
app.use("/api/microcircuits", MicroCircuitAPI);
app.use("/api/circuitchecker", CircuitCheckerAPI);
app.use("/api/ictester", ICCheckerAPI);

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// const wss = new WebSocketServer({ server });
// const clients = new Set();
// wss.on("connection", (ws) => {
//   clients.add(ws); // Add new client to the set
//   console.log(`New client connected. Total clients: ${clients.size}`);

//   ws.on("close", () => {
//     clients.delete(ws); // Remove disconnected client
//     console.log(`Client disconnected. Remaining clients: ${clients.size}`);
//   });
// });

// export const broadcastToClients = (data) => {
//   clients.forEach((client) => {
//     if (client.readyState === 1) {
//       // WebSocket.OPEN = 1
//       client.send(JSON.stringify(data));
//     }
//   });
// };

const circuitCheckerClients = new Set();
const circuitCheckerWss = new WebSocketServer({ noServer: true });
const icTesterClients = new Set();
const icTesterWss = new WebSocketServer({ noServer: true });

const circuitCheckerhandler = (ws) => {
  circuitCheckerClients.add(ws);
  console.log(
    `New circuit checker client connected. Total clients: ${circuitCheckerClients.size}`
  );

  ws.on("close", () => {
    circuitCheckerClients.delete(ws);
    console.log(
      `Circuit checker client disconnected. Remaining clients: ${circuitCheckerClients.size}`
    );
  });
};

const icTesterHandler = (ws) => {
  icTesterClients.add(ws);
  console.log(
    `New IC tester client connected. Total clients: ${icTesterClients.size}`
  );

  ws.on("close", () => {
    icTesterClients.delete(ws);
    console.log(
      `IC tester client disconnected. Remaining clients: ${icTesterClients.size}`
    );
  });
};

circuitCheckerWss.on("connection", circuitCheckerhandler);
icTesterWss.on("connection", icTesterHandler);

server.on("upgrade", (request, socket, head) => {
  if (request.url === "/circuitchecker") {
    circuitCheckerWss.handleUpgrade(request, socket, head, (ws) => {
      circuitCheckerWss.emit("connection", ws, request);
    });
  } else if (request.url === "/ic-tester") {
    icTesterWss.handleUpgrade(request, socket, head, (ws) => {
      icTesterWss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

export const circuitCheckerBroadcastToClients = (data) => {
  circuitCheckerClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

export const icTesterBroadcastToClients = (data) => {
  icTesterClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

server.listen(PORT, () => {
  connectDB();
  console.log("Server started @ http://localhost:5000");
  open(`http://localhost:${PORT}`); // This opens the browser
});
