import { useState, useContext, createContext } from "react";
import { useToasts } from "react-toast-notifications";

export const initialAlertValue = {
  alerts: [],
  activeAlert: null,
  consumeAlert: () => {},
  setAlert: (_) => {},
  sendAlert: (_) => {},
  sendError: (_) => {},
  resetAlert: () => {},
};

export const AlertContext = createContext(initialAlertValue);

import React from "react";

export default function AlertProvider({ children }) {
  const [alerts, setAlert] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const { addToast } = useToasts();

  const resetAlert = () => {
    setAlert([]);
  };

  const sendAlert = (text) => {
    addToast(text, { appearance: "success", autoDismiss: true });
    // setAlert([
    //   ...alerts,
    //   {
    //     text,
    //     type: "success",
    //     active: true,
    //   },
    // ]);
  };

  const sendError = (text) => {
    addToast(text, { appearance: "error", autoDismiss: true });
    // setAlert([
    //   ...alerts,
    //   {
    //     text,
    //     type: "error",
    //     active: true,
    //   },
    // ]);
  };

  const sendInfo = (text) => {
    addToast(text, { appearance: "info", autoDismiss: true });
  };

  const consumeAlert = () => {
    if (alerts.length === 0) {
      setActiveAlert(null);
    }
    const consumed = alerts[0];
    setAlert(alerts.slice(1));
    setActiveAlert(consumeAlert);
  };

  return (
    <AlertContext.Provider
      value={{
        activeAlert,
        alerts,
        setAlert,
        sendAlert,
        sendError,
        resetAlert,
        consumeAlert,
        sendInfo,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const {
    activeAlert,
    alerts,
    resetAlert,
    sendAlert,
    sendError,
    consumeAlert,
    sendInfo,
  } = useContext(AlertContext);
  return {
    activeAlert,
    alerts,
    consumeAlert,
    resetAlert,
    sendAlert,
    sendError,
    sendInfo,
  };
};