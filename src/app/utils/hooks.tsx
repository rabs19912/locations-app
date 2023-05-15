import React from "react";

function useTimeoutRef() {
  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout>>();

  const resetTimeout = React.useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      resetTimeout();
    };
  }, [resetTimeout]);

  return timeoutIdRef;
}

export { useTimeoutRef };
