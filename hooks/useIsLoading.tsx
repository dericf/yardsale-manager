import React, { useState, useContext, createContext } from "react";
import { LoadingContextInterface, LoadingState } from "../types/Context";

export const initialLoadingState: LoadingState = {
  isLoading: false,
  text: "Loading",
  overlay: false,
} as LoadingState;

export const LoadingContext = createContext<LoadingContextInterface>(null);

export default function LoadingProvider({ children }) {
  const [loadingState, setLoadingState] = useState(initialLoadingState);
  const [quickLoad, setQuickLoad] = useState<boolean>(false);

  const clearLoadingState = () => {
    setLoadingState(initialLoadingState);
  };

  return (
    <LoadingContext.Provider
      value={
        {
          loadingState,
          setLoadingState,
          clearLoadingState,
          quickLoad, 
          setQuickLoad
        } as LoadingContextInterface
      }
    >
      {children}
    </LoadingContext.Provider>
  );
}

export const useIsLoading = () => {
  const ctx = useContext<LoadingContextInterface>(LoadingContext);
  return ctx;
};
