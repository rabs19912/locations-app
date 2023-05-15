"use client";
import React from "react";
import useQuery from "./hooks/useQuery";
import { Country, Locations } from "./types";
import { useRouter } from "next/navigation";
import api from "./utils/api";
import { useTimeoutRef } from "./utils/hooks";
import { BASE_PATH, REFETCH_SEARCH_INTERVAL } from "./utils/constants";
import { Box, Button, Container, Grid, GridItem, Input } from "@chakra-ui/react";
import { getCountryName } from "./utils/utils";
import PageBase from "./components/PageBase/PageBaseComponent";

export default function Home() {
  const router = useRouter();
  const [searchInput, setSearchInput] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const refetchTimeout = useTimeoutRef();
  const params = Boolean(searchInput) ? `name_like=${searchInput}` : "";
  const { isLoading, data, isSuccess } = useQuery<Locations[]>({
    url: api.ENDPOINTS.locations(params),
    refetchWhenValuesChange: [searchInput],
  });

  const {
    data: countries,
    isSuccess: isSuccessCountries,
  } = useQuery<Country[]>({
    url: api.ENDPOINTS.countries(),
  });

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSearching(true);
      refetchTimeout.current = setTimeout(() => {
        setSearchInput(e.target.value);
      }, REFETCH_SEARCH_INTERVAL);
    },
    [refetchTimeout]
  );

  React.useEffect(() => {
    if (!isLoading) {
      setIsSearching(isLoading);
    }
  }, [isLoading]);

  const loadingSearch = isLoading || isSearching;

  const showContent =
    !isLoading && isSuccess && !isSearching && isSuccessCountries;

  return (
    <PageBase>
      <Box margin="0 auto" maxWidth={{ base: "90%", xl: "1280px" }}>
        <Input
          placeholder="Search location..."
          onChange={handleChange}
          size="md"
          marginBottom="50px"
          w="100%"
          maxWidth="250px"
        />
        <>
          {loadingSearch && (
            <div>
              <>Loading results...</>
            </div>
          )}
          {showContent && (
            <>
              <Grid
                gap={4}
                templateColumns={
                  Boolean(data?.length)
                    ? [
                        "repeat(1, 1fr)",
                        "repeat(2, 1fr)",
                        "repeat(2, 1fr)",
                        "repeat(3, 1fr)",
                        "repeat(4, 1fr)",
                      ]
                    : "repeat(1, 1fr)"
                }
                marginBottom="20px"
              >
                {Boolean(data?.length) ? (
                  data?.map((location, index) => {
                    return (
                      <GridItem
                        key={index}
                        w="100%"
                        bg="blue.500"
                        cursor="pointer"
                        padding="20px"
                        borderRadius="5px"
                        _hover={{
                          border: "1px solid black",
                          bg: "tomato",
                          color: 'white'
                        }}
                        onClick={() =>
                          router.push(`${BASE_PATH}/locations/${location.id}`)
                        }
                      >
                        <Box
                          fontSize="21px"
                          fontStyle="italic"
                          fontWeight="bold"
                        >
                          {location.name}
                        </Box>
                        {/* <p>{getCountryName(location, countries as Country[])}</p> */}

                        <Box display="flex" justifyContent="space-around">
                          <Box w={"50%"}>
                            <b>Country: </b>
                          </Box>
                          <Box w={"50%"}>
                            {getCountryName(location, countries as Country[])}
                          </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-around">
                          <Box w={"50%"}>
                            <b>lat: </b>
                            {location.latitude}
                          </Box>
                          <Box w={"50%"}>
                            <b>lng: </b>
                            {location.longitude}
                          </Box>
                        </Box>
                      </GridItem>
                    );
                  })
                ) : (
                  <>
                    No se encontraron resultados para: <b>{searchInput}</b>{" "}
                  </>
                )}
              </Grid>
              <Box>
                <Button
                  onClick={()=> router.push(`${BASE_PATH}/locations/create`)}
                  marginBottom="20px"
                  bg="blue.500"
                  color="#fff"
                  w={{ base: "100%", md: "auto" }}
                  _hover={{
                    bg: "tomato",
                    color: 'white'
                  }}
                >Create Location</Button>
              </Box>
            </>
          )}
        </>
      </Box>
    </PageBase>
  );
}
