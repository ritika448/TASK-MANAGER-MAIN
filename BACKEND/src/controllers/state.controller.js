import { State } from "../models/State.js";
import { City } from "../models/City.js";
import { Country } from "../models/Country.js";
import { User } from "../models/User.js";

export async function getStateList(_req, res, next) {
  try {
    const states = await State.find().populate("countryId").sort({ stateName: 1 });
    return res.status(200).json(
      states.map((state) => ({
        id: state.id,
        stateName: state.stateName,
        countryId: state.countryId?._id ?? null,
        countryName: state.countryId?.countryName ?? "",
      })),
    );
  } catch (error) {
    return next(error);
  }
}

export async function getStateModel(req, res, next) {
  try {
    const state = await State.findById(req.params.id).populate("countryId");
    if (!state) {
      return res.status(404).json({ message: "State not found." });
    }
    return res.status(200).json({
      id: state.id,
      stateName: state.stateName,
      countryId: state.countryId?._id ?? null,
      countryName: state.countryId?.countryName ?? "",
    });
  } catch (error) {
    return next(error);
  }
}

export async function getStateLookupList(req, res, next) {
  try {
    const query = req.query.countryId ? { countryId: req.query.countryId } : {};
    const states = await State.find(query).sort({ stateName: 1 });
    return res.status(200).json(
      states.map((state) => ({
        id: state.id,
        name: state.stateName,
        countryId: String(state.countryId),
      })),
    );
  } catch (error) {
    return next(error);
  }
}

export async function createState(req, res, next) {
  try {
    const { stateName, countryId } = req.body;
    if (!stateName?.trim() || !countryId) {
      return res.status(400).json({ message: "State name and country are required." });
    }

    const country = await Country.findById(countryId);
    if (!country) {
      return res.status(404).json({ message: "Country not found." });
    }

    const existing = await State.findOne({ stateName: stateName.trim(), countryId });
    if (existing) {
      return res.status(409).json({ message: "State already exists for this country." });
    }

    const state = await State.create({ stateName: stateName.trim(), countryId });
    return res.status(201).json(state);
  } catch (error) {
    return next(error);
  }
}

export async function updateState(req, res, next) {
  try {
    const { stateName, countryId } = req.body;
    if (!stateName?.trim() || !countryId) {
      return res.status(400).json({ message: "State name and country are required." });
    }

    const country = await Country.findById(countryId);
    if (!country) {
      return res.status(404).json({ message: "Country not found." });
    }

    const duplicate = await State.findOne({
      stateName: stateName.trim(),
      countryId,
      _id: { $ne: req.params.id },
    });
    if (duplicate) {
      return res.status(409).json({ message: "State already exists for this country." });
    }

    const existingState = await State.findById(req.params.id);
    if (!existingState) {
      return res.status(404).json({ message: "State not found." });
    }

    const previousStateName = existingState.stateName;
    const nextStateName = stateName.trim();
    const state = await State.findByIdAndUpdate(
      req.params.id,
      { stateName: nextStateName, countryId },
      { new: true },
    );

    if (String(existingState.countryId) !== String(country.id) || previousStateName !== nextStateName) {
      await User.updateMany(
        { stateId: existingState.id },
        {
          $set: {
            countryId: country.id,
            country: country.countryName,
            state: nextStateName,
          },
        },
      );
    }

    return res.status(200).json(state);
  } catch (error) {
    return next(error);
  }
}

export async function deleteState(req, res, next) {
  try {
    const [linkedCitiesCount, linkedUsersCount] = await Promise.all([
      City.countDocuments({ stateId: req.params.id }),
      User.countDocuments({ stateId: req.params.id }),
    ]);

    if (linkedCitiesCount > 0 || linkedUsersCount > 0) {
      return res.status(409).json({
        message: "State is in use. Remove linked cities and user mappings before deleting it.",
      });
    }

    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) {
      return res.status(404).json({ message: "State not found." });
    }
    return res.status(200).json({ message: "State deleted successfully." });
  } catch (error) {
    return next(error);
  }
}
