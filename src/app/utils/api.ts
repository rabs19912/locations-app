import { FromTypes } from "../locations/[id]/page";
import { REQUEST_METHODS, RESPONSE_STATUSES } from "../types";
import { BASE_URL } from "./constants";
import { getErrorRequestResponse, getSuccessRequestResponse } from "./utils";

const ENDPOINTS = {
  location: (locationId = "") => `${BASE_URL}/locations/${locationId}`,
  locations: (params = "") => `${BASE_URL}/locations?${params}`,
  countries: () => `${BASE_URL}/countries`,
};
async function saveOrUpdateLocation(data: FromTypes, id: string, isCreation:boolean) {
  const locationId = !isCreation ? id : "";
  const method = isCreation
    ? REQUEST_METHODS.post
    : REQUEST_METHODS.patch;

  const response = await fetch(ENDPOINTS.location(locationId), {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.status === RESPONSE_STATUSES.notFound
    ? getErrorRequestResponse(response)
    : getSuccessRequestResponse(response);
}

const api = {
  saveOrUpdateLocation,
  ENDPOINTS,
};

export default api;
