import { City } from "../models/City.js";
import { State } from "../models/State.js";
import { User } from "../models/User.js";

export async function getCityList(_req, res, next) {
  try {
    const cities = await City.find().populate({
      path: "stateId",
      populate: { path: "countryId" },
    });
    return res.status(200).json(
      cities.map((city) => ({
        id: city.id,
        cityName: city.cityName,
        stateId: city.stateId?._id ?? null,
        stateName: city.stateId?.stateName ?? "",
        countryId: city.stateId?.countryId?._id ?? null,
        countryName: city.stateId?.countryId?.countryName ?? "",
        zipCodes: city.zipCodes ?? [],
      })),
    );
  } catch (error) {
    return next(error);
  }
}

export async function getCityModel(req, res, next) {
  try {
    const city = await City.findById(req.params.id).populate({
      path: "stateId",
      populate: { path: "countryId" },
    });
    if (!city) {
      return res.status(404).json({ message: "City not found." });
    }

    return res.status(200).json({
      id: city.id,
      cityName: city.cityName,
      stateId: city.stateId?._id ?? null,
      stateName: city.stateId?.stateName ?? "",
      countryId: city.stateId?.countryId?._id ?? null,
      countryName: city.stateId?.countryId?.countryName ?? "",
      zipCodes: city.zipCodes ?? [],
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCityLookupList(req, res, next) {
  try {
    const query = req.query.stateId ? { stateId: req.query.stateId } : {};
    const cities = await City.find(query)
      .sort({ cityName: 1 })
      .populate({
        path: "stateId",
        populate: { path: "countryId" },
      });
    return res.status(200).json(
      cities.map((city) => ({
        id: city.id,
        name: city.cityName,
        stateId: city.stateId?._id ? String(city.stateId._id) : String(city.stateId),
        countryId: city.stateId?.countryId?._id
          ? String(city.stateId.countryId._id)
          : city.stateId?.countryId
            ? String(city.stateId.countryId)
            : null,
      })),
    );
  } catch (error) {
    return next(error);
  }
}

export async function createCity(req, res, next) {
  try {
    const { cityName, stateId, zipCodes = [] } = req.body;
    if (!cityName?.trim() || !stateId) {
      return res.status(400).json({ message: "City name and state are required." });
    }

    const duplicate = await City.findOne({ cityName: cityName.trim(), stateId });
    if (duplicate) {
      return res.status(409).json({ message: "City already exists for this state." });
    }

    const state = await State.findById(stateId).populate("countryId");
    if (!state) {
      return res.status(404).json({ message: "State not found." });
    }

    const city = await City.create({
      cityName: cityName.trim(),
      stateId,
      zipCodes: Array.isArray(zipCodes)
        ? zipCodes.map((zipCode) => String(zipCode).trim()).filter(Boolean)
        : [],
    });

    return res.status(201).json(city);
  } catch (error) {
    return next(error);
  }
}

export async function updateCity(req, res, next) {
  try {
    const { cityName, stateId, zipCodes = [] } = req.body;
    if (!cityName?.trim() || !stateId) {
      return res.status(400).json({ message: "City name and state are required." });
    }

    const duplicate = await City.findOne({
      cityName: cityName.trim(),
      stateId,
      _id: { $ne: req.params.id },
    });
    if (duplicate) {
      return res.status(409).json({ message: "City already exists for this state." });
    }

    const state = await State.findById(stateId);
    if (!state) {
      return res.status(404).json({ message: "State not found." });
    }

    const existingCity = await City.findById(req.params.id);
    if (!existingCity) {
      return res.status(404).json({ message: "City not found." });
    }

    const previousCityName = existingCity.cityName;
    const nextCityName = cityName.trim();
    const city = await City.findByIdAndUpdate(
      req.params.id,
      {
        cityName: nextCityName,
        stateId,
        zipCodes: Array.isArray(zipCodes)
          ? zipCodes.map((zipCode) => String(zipCode).trim()).filter(Boolean)
          : [],
      },
      { new: true },
    );

    if (String(existingCity.stateId) !== String(state.id) || previousCityName !== nextCityName) {
      await User.updateMany(
        { cityId: existingCity.id },
        {
          $set: {
            countryId: state.countryId?._id ?? state.countryId ?? null,
            country: state.countryId?.countryName ?? "",
            stateId: state.id,
            state: state.stateName,
            city: nextCityName,
          },
        },
      );
    }

    return res.status(200).json(city);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCity(req, res, next) {
  try {
    const linkedUsersCount = await User.countDocuments({ cityId: req.params.id });
    if (linkedUsersCount > 0) {
      return res.status(409).json({
        message: "City is in use. Remove linked user mappings before deleting it.",
      });
    }

    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found." });
    }
    return res.status(200).json({ message: "City deleted successfully." });
  } catch (error) {
    return next(error);
  }
}
