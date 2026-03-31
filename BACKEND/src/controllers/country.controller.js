import mongoose from "mongoose";
import { Country } from "../models/Country.js";
import { State } from "../models/State.js";
import { User } from "../models/User.js";

function serializeCountry(country) {
  return {
    id: country.id,
    countryName: country.countryName,
  };
}

export async function getCountryList(_req, res, next) {
  try {
    const countries = await Country.find().sort({ countryName: 1 });
    return res.status(200).json(countries.map(serializeCountry));
  } catch (error) {
    return next(error);
  }
}

export async function getCountryModel(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid country id." });
    }

    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found." });
    }
    return res.status(200).json(serializeCountry(country));
  } catch (error) {
    return next(error);
  }
}

export async function getCountryLookupList(_req, res, next) {
  try {
    const countries = await Country.find().sort({ countryName: 1 });
    return res.status(200).json(
      countries.map((country) => ({
        id: country.id,
        name: country.countryName,
      })),
    );
  } catch (error) {
    return next(error);
  }
}

export async function createCountry(req, res, next) {
  try {
    const { countryName } = req.body;
    if (!countryName?.trim()) {
      return res.status(400).json({ message: "Country name is required." });
    }

    const existing = await Country.findOne({ countryName: countryName.trim() });
    if (existing) {
      return res.status(409).json({ message: "Country already exists." });
    }

    const country = await Country.create({ countryName: countryName.trim() });
    return res.status(201).json(serializeCountry(country));
  } catch (error) {
    return next(error);
  }
}

export async function updateCountry(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid country id." });
    }

    const { countryName } = req.body;
    if (!countryName?.trim()) {
      return res.status(400).json({ message: "Country name is required." });
    }

    const duplicate = await Country.findOne({
      countryName: countryName.trim(),
      _id: { $ne: req.params.id },
    });
    if (duplicate) {
      return res.status(409).json({ message: "Country already exists." });
    }

    const existingCountry = await Country.findById(req.params.id);
    if (!existingCountry) {
      return res.status(404).json({ message: "Country not found." });
    }

    const previousCountryName = existingCountry.countryName;
    const nextCountryName = countryName.trim();
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      { countryName: nextCountryName },
      { new: true },
    );

    if (previousCountryName !== nextCountryName) {
      await User.updateMany(
        { countryId: existingCountry.id },
        { $set: { country: nextCountryName } },
      );
    }

    return res.status(200).json(updatedCountry ? serializeCountry(updatedCountry) : null);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCountry(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid country id." });
    }

    const [linkedStatesCount, linkedUsersCount] = await Promise.all([
      State.countDocuments({ countryId: req.params.id }),
      User.countDocuments({ countryId: req.params.id }),
    ]);

    if (linkedStatesCount > 0 || linkedUsersCount > 0) {
      return res.status(409).json({
        message: "Country is in use. Remove linked states and user mappings before deleting it.",
      });
    }

    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found." });
    }
    return res.status(200).json({ message: "Country deleted successfully." });
  } catch (error) {
    return next(error);
  }
}
