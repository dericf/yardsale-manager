import React, { useState, useContext, createContext } from "react";

interface LoadingState {
  isLoading: boolean;
  text: string;
  overlay: boolean;
}

export const initialLoadingState: LoadingState = {
  isLoading: false,
  text: "Loading",
  overlay: false,
};

export const LoadingContext = createContext(initialLoadingState);

export default function LoadingProvider({ children }) {
  const [loadingState, setLoadingState] = useState(initialLoadingState);

  const clearLoadingState = () => {
    setLoadingState(initialLoadingState);
  };

  return (
    <LoadingContext.Provider
      value={{
        loadingState,
        setLoadingState,
        initialLoadingState,
        clearLoadingState,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export const useIsLoading = () => {
  const {
    loadingState,
    setLoadingState,
    initialLoadingState,
    clearLoadingState,
  } = useContext(LoadingContext);
  return {
    loadingState,
    setLoadingState,
    initialLoadingState,
    clearLoadingState,
  };
};
