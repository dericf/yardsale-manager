import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Divider, Header, Segment } from "semantic-ui-react";
import { useIsLoading } from "../../hooks/useIsLoading";

export const Layout = (props) => {
  const { loadingState } = useIsLoading();
  const router = useRouter()
  return (
    <Container>
      <Segment
        raised
        loading={loadingState && loadingState.isLoading}
        style={{ height: "100vh" }}
        padded
      >
        <Link href="/" as="/">
          <Header as="h1" textAlign="center" >
            {" "}
            Yardsale Manager
          </Header>
        </Link>
        <Divider />

        {props.children}
      </Segment>
    </Container>
  );
};
