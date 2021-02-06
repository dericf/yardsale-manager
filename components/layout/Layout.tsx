import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import {
  Button,
  Container,
  Divider,
  Header,
  Menu,
  Segment,
} from "semantic-ui-react";
import { useAuth } from "../../hooks/useAuth";
import { useIsLoading } from "../../hooks/useIsLoading";
import { ActivePage } from "../../types/General";
import { NavBar } from "../NavBar/NavBar";


interface Props  {
  activePage: ActivePage
}

export const Layout = (props: PropsWithChildren<Props>) => {
  const { loadingState } = useIsLoading();
  const { isAuthenticated, user, loadAuthStateFromLocalStorage } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth status.");
      await loadAuthStateFromLocalStorage();
    };

    if (isAuthenticated === false) {
      // Check if there is a saved token in localstorage
      checkAuth();
    }
  }, []);
  return (
    <Container>
      <Segment
        raised
        loading={loadingState && loadingState.isLoading}
        style={{ height: "100vh" }}
        padded
      >
        <div className="flex row justify-between align-center wrap">
          <div className="flex col">
            <Link href="/" as="/">
              <Header as="h1" textAlign="center" className="hover-pointer">
                {" "}
                Yard Sale Manager
              </Header>
            </Link>
          </div>
          <div className="flex col">
            <NavBar activePage={props.activePage} />
          </div>
        </div>
        <Divider />

        {props.children}
      </Segment>
    </Container>
  );
};
