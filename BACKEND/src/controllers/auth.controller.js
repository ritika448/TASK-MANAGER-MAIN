import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { City } from "../models/City.js";
import { Country } from "../models/Country.js";
import { State } from "../models/State.js";
import { User } from "../models/User.js";
import { ensureLocation } from "../utils/location.js";

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function signup(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      emailId,
      country,
      state,
      city,
      password,
      address = "",
      zipCode = "",
    } = req.body;

    if (!firstName || !lastName || !emailId || !country || !state || !city || !password) {
      return res.status(400).json({ message: "All signup fields are required." });
    }

    const normalizedEmail = emailId.toLowerCase().trim();
    const existingUser = await User.findOne({ emailId: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const location = await ensureLocation({
      countryName: country,
      stateName: state,
      cityName: city,
    });

    await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailId: normalizedEmail,
      address: address.trim(),
      zipCode: zipCode.trim(),
      country,
      state,
      city,
      role: "manager",
      managerId: null,
      passwordHash,
      ...location,
    });

    return res.status(201).json({ message: "Account created successfully. Please login." });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ emailId: emailId.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const authToken = createToken(user.id);

    return res.status(200).json({
      authToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role ?? "manager",
        managerId: user.managerId ?? null,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ message: "Email address is required." });
    }

    return res.status(200).json({
      message: "If this email is registered, reset instructions have been sent.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function getSignupLocationLookups(_req, res, next) {
  try {
    const [countries, states, cities] = await Promise.all([
      Country.find().sort({ countryName: 1 }),
      State.find().sort({ stateName: 1 }),
      City.find().sort({ cityName: 1 }),
    ]);

    return res.status(200).json({
      countries: countries.map((country) => ({
        id: country.id,
        name: country.countryName,
      })),
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
