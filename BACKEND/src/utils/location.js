import { City } from "../models/City.js";
import { Country } from "../models/Country.js";
import { State } from "../models/State.js";

function isObjectIdLike(value) {
  return typeof value === "string" && /^[a-f0-9]{24}$/i.test(value.trim());
}

async function resolveCountry(input) {
  if (!input?.trim()) {
    return null;
  }

  const value = input.trim();
  if (isObjectIdLike(value)) {
    return Country.findById(value);
  }

  return Country.findOne({ countryName: value });
}

async function resolveState(input, countryId) {
  if (!input?.trim()) {
    return null;
  }

  const value = input.trim();
  if (isObjectIdLike(value)) {
    const state = await State.findById(value);
    if (!state) {
      return null;
    }

    if (countryId && String(state.countryId) !== String(countryId)) {
      return null;
    }

    return state;
  }

  return State.findOne({ stateName: value, countryId });
}

async function resolveCity(input, stateId) {
  if (!input?.trim()) {
    return null;
  }

  const value = input.trim();
  if (isObjectIdLike(value)) {
    const city = await City.findById(value);
    if (!city) {
      return null;
    }

    if (stateId && String(city.stateId) !== String(stateId)) {
      return null;
    }

    return city;
  }

  return City.findOne({ cityName: value, stateId });
}

function createLocationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

export async function ensureLocation({ countryName, stateName, cityName }) {
  if (!countryName || !stateName || !cityName) {
    return {
      countryId: null,
      stateId: null,
      cityId: null,
      country: countryName ?? "",
      state: stateName ?? "",
      city: cityName ?? "",
    };
  }

  const normalizedCountry = countryName.trim();
  const normalizedState = stateName.trim();
  const normalizedCity = cityName.trim();

  let country = await resolveCountry(normalizedCountry);
  if (!country) {
    if (isObjectIdLike(normalizedCountry)) {
      throw createLocationError("Selected country was not found.");
    }

    country = await Country.create({ countryName: normalizedCountry });
  }

  let state = await resolveState(normalizedState, country.id);
  if (!state) {
    if (isObjectIdLike(normalizedState)) {
      throw createLocationError("Selected state does not belong to the selected country.");
    }

    state = await State.create({ stateName: normalizedState, countryId: country.id });
  }

  let city = await resolveCity(normalizedCity, state.id);
  if (!city) {
    if (isObjectIdLike(normalizedCity)) {
      throw createLocationError("Selected city does not belong to the selected state.");
    }

    city = await City.create({ cityName: normalizedCity, stateId: state.id, zipCodes: [] });
  }

  return {
    countryId: country.id,
    stateId: state.id,
    cityId: city.id,
    country: country.countryName,
    state: state.stateName,
    city: city.cityName,
  };
}
