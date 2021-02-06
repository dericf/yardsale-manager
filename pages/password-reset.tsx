import Head from "next/head";
import { Segment } from "semantic-ui-react";

export default function index() {
  return (
    <>
      <Head>
        <title>Reset Password | Yard Sale Manager</title>
      </Head>
      <Segment raised>Reset your password</Segment>;
    </>
  );
}
