import { locationSeedData } from "../data/location-seed.data.js";
import { City } from "../models/City.js";
import { Country } from "../models/Country.js";
import { State } from "../models/State.js";

export async function seedLocations() {
  for (const countryEntry of locationSeedData) {
    let country = await Country.findOne({ countryName: countryEntry.countryName });

    if (!country) {
      country = await Country.create({ countryName: countryEntry.countryName });
    }

    for (const stateEntry of countryEntry.states) {
      let state = await State.findOne({
        stateName: stateEntry.stateName,
        countryId: country._id,
      });

      if (!state) {
        state = await State.create({
          stateName: stateEntry.stateName,
          countryId: country._id,
        });
      }

      for (const cityEntry of stateEntry.cities) {
        const existingCity = await City.findOne({
          cityName: cityEntry.cityName,
          stateId: state._id,
        });

        if (!existingCity) {
          await City.create({
            cityName: cityEntry.cityName,
            stateId: state._id,
            zipCodes: cityEntry.zipCodes,
          });
          continue;
        }

        const normalizedZipCodes = Array.from(
          new Set([...(existingCity.zipCodes ?? []), ...cityEntry.zipCodes]),
        );

        if (normalizedZipCodes.length !== (existingCity.zipCodes ?? []).length) {
          existingCity.zipCodes = normalizedZipCodes;
          await existingCity.save();
        }
      }
    }
  }
}
