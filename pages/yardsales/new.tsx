import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
  useQuery,
  useApolloClient,
  fromError,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "apollo-link-context";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Input,
  Label,
  Message,
  Segment,
} from "semantic-ui-react";
import { Layout } from "../../components/Layout/Layout";
// import useSWR from "swr";
import { ProtectedComponent } from "../../components/ProtectedComponent";
import { GET_YARDSALES } from "../../graphql/queries";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import useForm, { FormErrors, FormValues } from "../../hooks/useForm";
import { useHasura } from "../../hooks/useHasura";
import { useYardsales } from "../../hooks/useYardsales";
import { YardSalesContextInterFace } from "../../types/Context";
import { YardSalesInterface } from "../../types/YardSales";



interface Props {
  yardsale?: YardSalesInterface
}

const index = ({yardsale}: Props) => {
  const { user, token } = useAuth();
  const { sendError, sendAlert } = useAlert();
  const {createNewYardsale} = useYardsales()
  const router = useRouter()
  const initialValues: FormValues = {
    name: yardsale ? yardsale.name : "",
    company: yardsale ? yardsale.company : "",
    phone: yardsale ? yardsale.phone : "",
    email: yardsale ? yardsale.email : "",
    address: yardsale ? yardsale.address_text : "",
    notes: yardsale ? yardsale.notes : "",
    // street1: yardsale ? yardsale.address_street1 : "",
    // street2: yardsale ? yardsale.address_street2 : "",
    // country: yardsale ? yardsale.address_country : "",
    // province: yardsale ? yardsale.address_province : "",
    // city: yardsale ? yardsale.address_city : "",
    // postal: yardsale ? yardsale.address_postal : "",
  };
  const onSubmit = async (formValues: FormValues, errors: FormErrors) => {
    console.log("Submitting... Form..", formValues);
		sendAlert("Success ! Your Yard Sale has been created.")
    let yardsaleVars = {
      name: formValues.name,
      phone: formValues.phone,
      email: formValues.email,
      address_text: formValues.address,
      notes: formValues.notes,
      company: formValues.company,
    }
    await createNewYardsale(yardsaleVars)

    router.push('/yardsales')

  };

  // const validate = () => {
  //   let errors: FormErrors = {};
  //   if (values.name.trim() === "") {
  //     errors.name = "Please enter a valid name";
  //   }
	// 	if (values.address.trim() === "") {
  //     errors.address = "Please enter a valid address";
  //   }

  //   return errors;
  // };

  const { values, handleChange, handleSubmit } = useForm({
    initialValues,
    onSubmit,
  });

  return (
    <ProtectedComponent>
      <Head>
        <title>New Yard Sale | Yard Sale Manager</title>
      </Head>
      <Layout activePage="yard sales">
        <Header textAlign="center" as="h2">
          New Yard Sale
        </Header>
        <Grid columns={1} centered className="m0 p0">
          <Grid.Row className="py0">
            {/* First Grid.Row (Filters/Buttons) */}
            <Grid.Column>
              <Form name="NewYardSaleForm" onSubmit={handleSubmit}>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={values.name}
                />
								<Input
                  type="text"
                  name="address"
                  onChange={handleChange}
                  value={values.address}
                />
                <Button type="submit">Submit</Button>
              </Form>
            </Grid.Column>
          </Grid.Row>

          {/* Yardsales List */}
          {/* {loading && <Loading />} */}
        </Grid>
      </Layout>
    </ProtectedComponent>
  );
}
export default index;