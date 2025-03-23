const express = require("express");
const { dbConnect } = require("./config/database");
const app = express();
const uploadRoutes = require("./routes/upload");
const userNameSearchRoutes = require("./routes/userNameSearch");
const policyAggregationRoutes = require("./routes/policyAggregation");
const schedulesMessageRoutes = require("./routes/scheduler");
const monitorCPU = require("./utils/monitorCpu");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

dbConnect();

app.use(express.json());
app.use("/api/v1", uploadRoutes);
app.use("/api/v1", userNameSearchRoutes);
app.use("/api/v1", policyAggregationRoutes);
app.use("/api/v1", schedulesMessageRoutes);

monitorCPU(70); // passing threshold

app.listen(PORT, () => {
  console.log(`Server Started Successfully at ${PORT}`);
});
