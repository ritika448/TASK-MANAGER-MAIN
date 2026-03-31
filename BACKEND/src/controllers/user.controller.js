import bcrypt from "bcryptjs";
import { City } from "../models/City.js";
import { Country } from "../models/Country.js";
import { State } from "../models/State.js";
import { User } from "../models/User.js";
import { ensureLocation } from "../utils/location.js";

function isObjectIdLike(value) {
  return typeof value === "string" && /^[a-f0-9]{24}$/i.test(value);
}

function formatUser(user) {
  const countryName = user.countryId?.countryName ?? (isObjectIdLike(user.country) ? "" : user.country ?? "");
  const stateName = user.stateId?.stateName ?? (isObjectIdLike(user.state) ? "" : user.state ?? "");
  const cityName = user.cityId?.cityName ?? (isObjectIdLike(user.city) ? "" : user.city ?? "");
  const managerName =
    user.managerId && typeof user.managerId === "object"
      ? `${user.managerId.firstName ?? ""} ${user.managerId.lastName ?? ""}`.trim()
      : "";
  const managerEmail =
    user.managerId && typeof user.managerId === "object" ? user.managerId.emailId ?? "" : "";

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailId: user.emailId,
    address: user.address ?? "",
    zipCode: user.zipCode ?? "",
    countryId: user.countryId?._id ?? user.countryId ?? null,
    country: countryName,
    stateId: user.stateId?._id ?? user.stateId ?? null,
    state: stateName,
    cityId: user.cityId?._id ?? user.cityId ?? null,
    city: cityName,
    role: user.role ?? "manager",
    managerId: user.managerId?._id ?? user.managerId ?? null,
    managerName,
    managerEmail,
    profileImage: user.profileImage ?? "",
  };
}

export async function getUserList(req, res, next) {
  try {
    const users = await User.find()
      .where({ managerId: req.userId, role: "employee" })
      .populate("countryId")
      .populate("stateId")
      .populate("cityId")
      .populate("managerId")
      .sort({ createdAt: -1 });
    return res.status(200).json(users.map(formatUser));
  } catch (error) {
    return next(error);
  }
}

export async function getUserModel(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
      .populate("countryId")
      .populate("stateId")
      .populate("cityId")
      .populate("managerId");
    if (!user || String(user.managerId?._id ?? user.managerId ?? "") !== String(req.userId)) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(formatUser(user));
  } catch (error) {
    return next(error);
  }
}

export async function getUserLookupList(req, res, next) {
  try {
    const users = await User.find({ managerId: req.userId, role: "employee" }).sort({
      firstName: 1,
      lastName: 1,
    });
    return res.status(200).json(
      users.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
      })),
    );
  } catch (error) {
    return next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      address = "",
      zipCode = "",
      country = "",
      state = "",
      city = "",
      role = "employee",
    } = req.body;

    if (!firstName || !lastName || !emailId || !password) {
      return res.status(400).json({ message: "First name, last name, email, and password are required." });
    }

    const duplicate = await User.findOne({ emailId: emailId.toLowerCase() });
    if (duplicate) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const location = await ensureLocation({ countryName: country, stateName: state, cityName: city });

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      passwordHash,
      address,
      zipCode,
      role: "employee",
      managerId: req.userId,
      ...location,
    });

    const populatedUser = await User.findById(user.id)
      .populate("countryId")
      .populate("stateId")
      .populate("cityId")
      .populate("managerId");

    return res.status(201).json(formatUser(populatedUser));
  } catch (error) {
    return next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      emailId,
      address = "",
      zipCode = "",
      country = "",
      state = "",
      city = "",
      role,
      password,
      updatePassword = false,
    } = req.body;

    if (!firstName || !lastName || !emailId) {
      return res.status(400).json({ message: "First name, last name, and email are required." });
    }

    const duplicate = await User.findOne({
      emailId: emailId.toLowerCase(),
      _id: { $ne: req.params.id },
    });
    if (duplicate) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const existingUser = await User.findById(req.params.id);
    if (!existingUser || String(existingUser.managerId ?? "") !== String(req.userId)) {
      return res.status(404).json({ message: "User not found." });
    }

    const location = await ensureLocation({ countryName: country, stateName: state, cityName: city });
    const payload = {
      firstName,
      lastName,
      emailId,
      address,
      zipCode,
      role: existingUser.role ?? "employee",
      managerId: existingUser.managerId ?? req.userId,
      ...location,
    };

    if (updatePassword && password) {
      payload.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true })
      .populate("countryId")
      .populate("stateId")
      .populate("cityId")
      .populate("managerId");

    return res.status(200).json(formatUser(user));
  } catch (error) {
    return next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, managerId: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.userId)
      .populate("countryId")
      .populate("stateId")
      .populate("cityId")
      .populate("managerId");
    if (!user) {
      return res.status(404).json({ message: "Current user not found." });
    }
    return res.status(200).json(formatUser(user));
  } catch (error) {
    return next(error);
  }
}

export async function updateCurrentUser(req, res, next) {
  req.params.id = req.userId;
  return updateUser(req, res, next);
}

export async function getLocationLookups(_req, res, next) {
  try {
    const [countries, states, cities] = await Promise.all([
      Country.find().sort({ countryName: 1 }),
      State.find().sort({ stateName: 1 }),
      City.find().sort({ cityName: 1 }),
    ]);

    return res.status(200).json({
      countries: countries.map((country) => ({ id: country.id, name: country.countryName })),
      states: states.map((state) => ({
        id: state.id,
        name: state.stateName,
        countryId: String(state.countryId),
      })),
      cities: cities.map((city) => ({
        id: city.id,
        name: city.cityName,
        stateId: String(city.stateId),
      })),
    });
  } catch (error) {
    return next(error);
  }
}
