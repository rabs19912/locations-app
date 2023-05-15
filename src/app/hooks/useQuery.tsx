import React from "react";

type QueryProps = {
  url: string;
  enabled?: boolean;
  refetchWhenValuesChange?: any[]
};

function useQuery<T>({ url, enabled = true , refetchWhenValuesChange}: QueryProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const [refetchQuery, setRefetchQuery] = React.useState(false)
  const refetchValues = refetchWhenValuesChange || [] as any;

  React.useEffect(() => {
    if (enabled) {
      setIsLoading(true);
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setIsLoading(false);
          setIsSuccess(true);
        })
        .catch((error) => {
          setIsError(true);
          setError(error);
        });
    }
  }, [enabled, ...refetchValues]);

  return {
    isLoading,
    data,
    isSuccess,
    isError,
    error,
  };
}

export default useQuery;
