import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { CircuitAPI } from "./routes/circuits.route.js";
import { UserAPI } from "./routes/user.route.js";
import { ULCircuitAPI } from "./routes/universallogic.route.js";
import { CBCircuitAPIv2 } from "./routes/v2.combilogic.route.js";
import { MicroCircuitAPI } from "./routes/micro.route.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is ready!");
});

app.use("/api/circuits", CircuitAPI);
app.use("/api/users", UserAPI);
app.use("/api/ulcircuits", ULCircuitAPI);
app.use("/api/cbcircuits", CBCircuitAPIv2);
app.use("/api/microcircuits", MicroCircuitAPI);

app.listen(5000, () => {
  connectDB();
  console.log("Server started @ http://localhost:5000");
});
