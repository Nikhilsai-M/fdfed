import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import { connectRedis } from "./config/redis.js";
import { queueSolrSync } from "./services/search.service.js";
import { initChargers } from "./crud/chargers.js";
import { initEarphones } from "./crud/earphones.js";
import { initMouses } from "./crud/mouses.js";
import { initSmartwatches } from "./crud/smartwatches.js";
import { initializeSupervisors } from "./crud/supervisors.js";
import { initializeAdmins } from "./crud/admins.js";
import { initializeApplications } from "./crud/applications.js";
import { initPhones } from "./crud/phones.js";
import { initLaptops } from "./crud/laptops.js";

dotenv.config({ path: "../.env" });

async function bootstrapDatabase() {
  await mongoose.connect(process.env.MONGO);
  console.log("Connected to MongoDB successfully");

  await initPhones();
  await initLaptops();
  await initChargers();
  await initEarphones();
  await initMouses();
  await initSmartwatches();
  await initializeSupervisors();
  await initializeAdmins();
  await initializeApplications();
}

async function startServer() {
  try {
    await bootstrapDatabase();
    await connectRedis();
    queueSolrSync();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

startServer();

