import express from "express";
import cors from "cors";
// import { mqttRouter } from "./src/routes/mqtt.routes.js";
import { devices } from "./src/routes/devices.routes.js";
import { BE_IP, PORT } from "./src/config.js";
import { overview } from "./src/routes/overview.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

// app.use(mqttRouter);
app.use(devices);
app.use(overview);

app.listen(PORT, () => {
  console.log(`Connection open on http://${BE_IP}:${PORT}`);
});