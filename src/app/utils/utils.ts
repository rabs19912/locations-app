import { FromTypes } from "../locations/[id]/page";
import { Country, Locations } from "../types";

const buildPayload = (formData: FromTypes) => {
  const payload = {
    ...formData,
    countryId: Number(formData.countryId),
  };
  return payload;
};

const getCountryName = (location: Locations, countries: Country[]) => {
  return countries?.find((country) => country.id === location.countryId)?.name;
};

const getErrorRequestResponse = (response: Response) => {
  return {
    error: {
      status: response.status,
      error: true,
      message: response.statusText,
    },
    data:null
  };
};

const getSuccessRequestResponse = async (response: Response) => {
  const data = await response.json();
  return {
    data: {
      status: response.status,
      error: false,
      message: response.statusText,
      data: data,
    },
    error:null
  };
};

export {
  buildPayload,
  getCountryName,
  getErrorRequestResponse,
  getSuccessRequestResponse,
};
