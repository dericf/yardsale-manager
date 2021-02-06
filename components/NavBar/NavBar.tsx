import { NextPage } from "next";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { Menu } from "semantic-ui-react";
import { useAuth } from "../../hooks/useAuth";
import { ActivePage } from "../../types/General";

interface Props {
  activePage: ActivePage;
}

export const NavBar: NextPage = ({ activePage }: PropsWithChildren<Props>) => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="flex row justify-between align-center">
      {isAuthenticated === true && (
        <Menu pointing secondary>
          <Menu.Item
            name="yard sales"
            onClick={async (e) => {
              e.preventDefault;
              router.push("/yardsales");
            }}
            active={activePage === "yard sales"}
          />
          <Menu.Item
            name="sellers"
            onClick={async (e) => {
              e.preventDefault;
              router.push("/sellers");
            }}
            active={activePage === "sellers"}
          />
          <Menu.Item
            name="account"
            onClick={async (e) => {
              e.preventDefault;
              router.push("/account");
            }}
            active={activePage === "account"}
          />
          <Menu.Menu position="right">
            <Menu.Item
              name="logout"
              onClick={async (e) => {
                e.preventDefault;
                await logout();
                router.push("/");
              }}
            />
          </Menu.Menu>
        </Menu>
      )}
    </div>
  );
};
