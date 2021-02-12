import Link from "next/link";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect } from "react";
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

interface Props {
  activePage: ActivePage;
}

export const Layout: FC<PropsWithChildren<Props>> = (props) => {
  const { loadingState, quickLoad } = useIsLoading();
  const { isAuthenticated, user, loadAuthStateFromLocalStorage } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      await loadAuthStateFromLocalStorage();
    };

    if (isAuthenticated === false) {
      // Check if there is a saved token in localstorage
      checkAuth();
    }
  }, [isAuthenticated]);
  return (
    <Container>
      <Segment
        raised
        loading={(loadingState && loadingState.isLoading)}
        style={{ minHeight: "100vh" }}
        padded
      >
        <div className="flex row justify-between align-center wrap">
          <div className="flex col">
            <Header as="h1" textAlign="center" className="hover-pointer">
              <Link href="/" as="/">
                Yard Sale Manager
              </Link>
            </Header>
          </div>
          <div className="flex col">
            <NavBar activePage={props.activePage} />
          </div>
        </div>
        <Divider />
        <div
          style={{ height: "100%"}}
        >
          {props.children}
        </div>
        {/* <Header textAlign="center">&copy; 2021</Header> */}
      </Segment>
    </Container>
  );
};
