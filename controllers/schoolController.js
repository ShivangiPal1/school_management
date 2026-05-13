import pool from "../config/db.js";
import { calculateDistance } from "../utils/distanceCalculator.js";

const isEmptyString = (value) => typeof value !== "string" || value.trim().length === 0;

const isValidNumber = (value) => typeof value === "number" && Number.isFinite(value);

const hasValidQueryValue = (value) => value !== undefined && value !== null && value !== "";

export const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (isEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "School name is required and must not be empty"
      });
    }

    if (isEmptyString(address)) {
      return res.status(400).json({
        success: false,
        message: "School address is required and must not be empty"
      });
    }

    if (!isValidNumber(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be a number between -90 and 90"
      });
    }

    if (!isValidNumber(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be a number between -180 and 180"
      });
    }

    // Parameterized queries protect the API from SQL injection.
    const query = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      name.trim(),
      address.trim(),
      latitude,
      longitude
    ]);

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude,
        longitude
      }
    });
  } catch (error) {
    next(error);
  }
};

export const listSchools = async (req, res, next) => {
  try {
    const { latitude: latitudeQuery, longitude: longitudeQuery } = req.query;
    const latitude = Number(latitudeQuery);
    const longitude = Number(longitudeQuery);

    if (!hasValidQueryValue(latitudeQuery) || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: "Query parameter latitude must be a number between -90 and 90"
      });
    }

    if (!hasValidQueryValue(longitudeQuery) || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Query parameter longitude must be a number between -180 and 180"
      });
    }

    const [schools] = await pool.execute(
      "SELECT id, name, address, latitude, longitude FROM schools"
    );

    // Add distance to every school, then sort from nearest to farthest.
    const schoolsWithDistance = schools
      .map((school) => ({
        id: school.id,
        name: school.name,
        address: school.address,
        latitude: Number(school.latitude),
        longitude: Number(school.longitude),
        distance: calculateDistance(
          latitude,
          longitude,
          Number(school.latitude),
          Number(school.longitude)
        )
      }))
      .sort((firstSchool, secondSchool) => firstSchool.distance - secondSchool.distance);

    return res.status(200).json({
      success: true,
      message: "Schools fetched successfully",
      count: schoolsWithDistance.length,
      data: schoolsWithDistance
    });
  } catch (error) {
    next(error);
  }
};
