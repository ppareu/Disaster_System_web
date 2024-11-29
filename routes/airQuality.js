const express = require("express");
const { AirQuality } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

router.post("/save", async (req, res) => {
  const { sidoName, pm10, pm25 } = req.body;

  try {
    await AirQuality.create({
      sidoName,
      pm10,
      pm25,
    });
    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save data" });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const data = await AirQuality.findAll({
      limit: 10,
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve data" });
  }
});

router.get("/search", async (req, res, next) => {
  const { startDate, startTime, endDate, endTime } = req.query;
  try {
    const startTimestamp = new Date(`${startDate}T${startTime}:00`);
    const endTimestamp = new Date(`${endDate}T${endTime}:00`);

    const records = await AirQuality.findAll({
      where: {
        timestamp: {
          [Op.gte]: startTimestamp,
          [Op.lte]: endTimestamp,
        },
      },
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
