import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import { CircuitAPI } from "./routes/circuits.route.js";
import { UserAPI } from "./routes/user.route.js";
import { ULCircuitAPI } from "./routes/universallogic.route.js";
import { CBCircuitAPIv2 } from "./routes/v2.combilogic.route.js";
import { MicroCircuitAPI } from "./routes/micro.route.js";
import { CircuitCheckerAPI } from "./routes/circuitchecker.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/circuits", CircuitAPI);
app.use("/api/users", UserAPI);
app.use("/api/ulcircuits", ULCircuitAPI);
app.use("/api/cbcircuits", CBCircuitAPIv2);
app.use("/api/microcircuits", MicroCircuitAPI);
app.use("/api/circuitchecker", CircuitCheckerAPI);

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server started @ http://localhost:5000");
});
