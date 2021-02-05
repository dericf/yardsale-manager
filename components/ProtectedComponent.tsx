import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { Segment } from "semantic-ui-react";
import { Layout } from "./layout/Layout";

export const ProtectedComponent = (props) => {
  const { isAuthenticated, loadAuthStateFromLocalStorage } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth status.");
      const userIsStillAuth = await loadAuthStateFromLocalStorage();
      console.log("Auth still?? ");
      console.log(userIsStillAuth);
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
