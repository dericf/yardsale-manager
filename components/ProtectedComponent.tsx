import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { Segment } from "semantic-ui-react";
import { Layout } from "./Layout/Layout";

export const ProtectedComponent = (props) => {
  const { isAuthenticated, loadAuthStateFromLocalStorage } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth status.");
      const userIsStillAuth = await loadAuthStateFromLocalStorage();
      console.log("Session still valid? ", userIsStillAuth);

      if (userIsStillAuth === false) {
        router.push("/login");
      }
    };

    if (isAuthenticated === false) {
      // Check if there is a saved token in localstorage
      checkAuth();
    }
  }, []);

  if (isAuthenticated === true) {
    return props.children;
  }
  return (
    <Layout>
      <></>
    </Layout>
  );
};
