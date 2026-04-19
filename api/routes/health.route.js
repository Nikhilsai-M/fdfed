import express from "express";
import mongoose from "mongoose";
import { getRedisHealth } from "../config/redis.js";
import { getSearchHealth } from "../services/search.service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Service availability and deployment health APIs
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API, MongoDB, Redis, and search infrastructure health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health snapshot fetched successfully
 */
router.get("/", async (req, res) => {
  const redis = await getRedisHealth();
  const search = await getSearchHealth();

  res.status(200).json({
    success: true,
    service: "api",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      state: mongoose.connection.readyState,
      connected: mongoose.connection.readyState === 1,
    },
    redis,
    search,
  });
});

export default router;
