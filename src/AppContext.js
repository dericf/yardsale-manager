import { createContext } from "react";

export const defaultAppContext = {
  activePage: "",
  showLoginModal: false,
  showFeedbackModal: false,
  notifications: {
    show: false,
    dismiss: false,
    message: "Testing",
    level: "error",
  },
  sidebar: {
    settingsPortalOpen: false,
  },
  market: null,
  yardsales: {
    searchQuery: "",
    selectedYardsale: null,
  },
};

export const AppContext = createContext(null);
