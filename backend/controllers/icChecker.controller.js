import { icTesterBroadcastToClients } from "../server.js";

let receivedMCUData = {
  gatesStates: [],
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
  proxyResultMCUData.gatesStates = newGateStates;
};

export const testRefreshGatesInterval = setInterval(() => {
  testRefreshGates();
}, 2000);
