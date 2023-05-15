type Country = {
  id: number;
  name: string;
};

type Locations = {
  id: number;
  countryId: number;
  name: string;
  latitude: string;
  longitude: string;
};

enum REQUEST_METHODS {
  post = "POST",
  patch = "PATCH",
}

enum RESPONSE_STATUSES {
  notFound = 404,
  success = 200
}

export {REQUEST_METHODS, RESPONSE_STATUSES}
export type {Country, Locations}