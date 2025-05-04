import { icTesterBroadcastToClients } from "../server.js";

let receivedMCUData = {
  icName: "",
  gateStates: []
};

const proxyHandler = {
  set(target, key, value) {
    target[key] = value;
    icTesterBroadcastToClients(target);
    console.log("Updated target: ", target);
    return true;
  },
};
const proxyResultMCUData = new Proxy(receivedMCUData, proxyHandler);


export const icGetResults = (req, res) => {
  try {
    const { icName, gateStates } = req.body;
    console.log("IC Name: ", icName);
    console.log("Gate States: ", gateStates);

    if (!icName || !gateStates) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    proxyResultMCUData.icName = icName;
    proxyResultMCUData.gateStates = gateStates;

    console.log("Sent to Frontend: ", proxyResultMCUData);
    res.json({ success: true, data: proxyResultMCUData });
    
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
    
  }
}

//Debug functions
const randomGateStateGenerator = () => {
  let randomGatesState = [];

  for (let i = 0; i < 4; i++) {
    randomGatesState.push(Math.floor(Math.random() * 2)); // Random 0 or 1
  }
  return randomGatesState;
};

const testRefreshGates = () => {
  const newGateStates = randomGateStateGenerator();
  proxyResultMCUData.gateStates = newGateStates;
};

// export const testRefreshGatesInterval = setInterval(() => {
//   testRefreshGates();
// }, 2000);
