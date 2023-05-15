"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Country, Locations } from "@/app/types";
import useQuery from "@/app/hooks/useQuery";
import { useForm } from "react-hook-form";
import { buildPayload } from "@/app/utils/utils";
import api from "@/app/utils/api";
import {
  BASE_PATH,
  CREATE_STRING,
  REQUEST_TIMEOUT,
} from "@/app/utils/constants";
import { Box, Button, Container, Input, Select } from "@chakra-ui/react";
import PageBase from "@/app/components/PageBase/PageBaseComponent";
import { useTimeoutRef } from "@/app/utils/hooks";

enum FORM_NAMES {
  name = "name",
  countryId = "countryId",
  latitude = "latitude",
  longitude = "longitude",
}

export type FromTypes = {
  [FORM_NAMES.countryId]: number;
  [FORM_NAMES.name]: string;
  [FORM_NAMES.latitude]: string;
  [FORM_NAMES.longitude]: string;
};

export default function EditLocation() {
  const { id } = useParams();
  const [isCreating, setIsCreating] = React.useState(false);
  const [isErrorSaving, setIsErrorSaving] = React.useState(false);
  const [requestMessage, setRequestMessage] = React.useState("");
  const requestTimeout = useTimeoutRef();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FromTypes>();
  const isCreation = id === CREATE_STRING;

  const {
    isLoading: isLoadingLocation,
    data: location,
    isSuccess: isSuccessLocation,
  } = useQuery<Locations>({
    url: api.ENDPOINTS.location(id),
    enabled: !isCreation,
  });

  const {
    isLoading: isLoadingCountries,
    data: countries,
    isSuccess: isSuccessCountries,
  } = useQuery<Country[]>({
    url: api.ENDPOINTS.countries(),
  });

  const isLoading =
    (!isCreation && isLoadingLocation) || (isCreation && isLoadingCountries);
  const showForm = (isCreation && isSuccessCountries) || isSuccessLocation;

  React.useLayoutEffect(() => {
    if (!isCreation) {
      reset(location);
    }
  }, [location]);

  const onSubmit = React.useCallback(
    async (formData: FromTypes) => {
      setIsCreating(true);
      const payload = buildPayload(formData);
      const { error, data } = await api.saveOrUpdateLocation(
        payload,
        id,
        isCreation
      );
      setIsCreating(false);
      if (data) {
        setRequestMessage(data.message);
      }
      if (error) {
        setRequestMessage(error.message);
        setIsErrorSaving(true);
      }
      requestTimeout.current = setTimeout(() => {
        if (data) {
          setRequestMessage("");
          router.push(BASE_PATH);
        }
      }, REQUEST_TIMEOUT);
      console.log({ error, data });
    },
    [id]
  );

  return (
    <PageBase>
      <Container maxW="md">
        {isLoading && <>Loading...</>}
        {showForm && (
          <>
            <Box>
              <label>Country: </label>
              <Select
                {...register(FORM_NAMES.countryId, {
                  required: "select one option",
                })}
                marginBottom="20px"
                disabled={isCreating || isLoadingCountries}
              >
                <option value="" disabled selected>
                  Select country...
                </option>
                {countries &&
                  countries.map((country, index) => {
                    return (
                      <option value={country.id} key={index}>
                        {country.name}
                      </option>
                    );
                  })}
              </Select>
              {errors.countryId && <p className="error">required.</p>}
            </Box>
            <Box>
              <label>Location Name: </label>
              <Input
                {...register(FORM_NAMES.name, { required: true })}
                placeholder="Name"
                marginBottom="20px"
                disabled={isCreating}
              />
              {errors.name && <span className="error">required.</span>}
            </Box>
            <Box>
              <label>Latitude: </label>
              <Input
                {...register(FORM_NAMES.latitude, { required: true })}
                placeholder="Latitude"
                marginBottom="20px"
                type="number"
                disabled={isCreating}
              />
              {errors.latitude && <p className="error">required.</p>}
            </Box>
            <Box>
              <label>Longitude: </label>
              <Input
                {...register(FORM_NAMES.longitude, { required: true })}
                placeholder="Longitude"
                marginBottom="20px"
                disabled={isCreating}
                type="number"
              />
              {errors.longitude && <p className="error">required.</p>}
            </Box>
            <Button
              onClick={handleSubmit(onSubmit)}
              marginBottom="20px"
              bg={isCreating ? "#E2E8F0" : "blue.500"}
              pointerEvents={isCreating ? "none" : "all"}
              color="#fff"
              _hover={{
                bg: "tomato",
                color: "white",
              }}
            >
              {isCreation ? "Create Location" : "Edit Location"}
            </Button>
            {Boolean(requestMessage) && (
              <Box color={isErrorSaving ? "tomato" : "green"}>
                {isErrorSaving
                  ? `Error creating a location,  ${requestMessage}`
                  : "Location saved SuccessFully :)!!"}
              </Box>
            )}
          </>
        )}
      </Container>
    </PageBase>
  );
}
