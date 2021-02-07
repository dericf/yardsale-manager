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
import { Fragment, useEffect, useRef } from "react";
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
import { Layout } from "../Layout/Layout";
// import useSWR from "swr";
import { ProtectedComponent } from "../ProtectedComponent";
import { GET_YARDSALES } from "../../graphql/queries";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import useForm, { FormErrors, FormValues } from "../../hooks/useForm";
import { useHasura } from "../../hooks/useHasura";
import { useYardsales } from "../../hooks/useYardsales";
import { YardSalesContextInterFace } from "../../types/Context";
import { YardSalesInterface } from "../../types/YardSales";

const YardsaleForm = () => {
  const { user, token } = useAuth();
  const { sendError, sendAlert } = useAlert();
  const { createNewYardsale, selectedYardSale: yardSale, setSelectedYardSale, updateYardsale } = useYardsales();
  const router = useRouter();
  const yardsaleNameRef = useRef();
  const initialValues: FormValues = {
    name: yardSale ? yardSale.name : "",
    company: yardSale ? yardSale.company : "",
    phone: yardSale ? yardSale.phone : "",
    email: yardSale ? yardSale.email : "",
    address: yardSale ? yardSale.address_text : "",
    notes: yardSale ? yardSale.notes : "",
    // street1: yardSale ? yardSale.address_street1 : "",
    // street2: yardSale ? yardSale.address_street2 : "",
    // country: yardSale ? yardSale.address_country : "",
    // province: yardSale ? yardSale.address_province : "",
    // city: yardSale ? yardSale.address_city : "",
    // postal: yardSale ? yardSale.address_postal : "",
  };
  const onSubmit = async (values: FormValues, errors: FormErrors) => {
    console.log("Submitting... Form..", values);
    let yardSaleVars = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      address_text: values.address,
      notes: values.notes,
      company: values.company,
    } as FormValues;
    if (yardSale) {
      // Update Yard Sale by uuid
      yardSaleVars.yardsaleUUID = yardSale.uuid
      await updateYardsale(yardSaleVars);
      sendAlert("Success ! Yard Sale was updated.");
      setSelectedYardSale(null)
    } else {
      // Insert new Yard Sale
      await createNewYardsale(yardSaleVars);
      sendAlert("Success ! Yard Sale was created.");
    }

    router.push("/yardsales");
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

  useEffect(() => {
    if (yardsaleNameRef) yardsaleNameRef.current.focus()
  }, [])

  return (
    <>
      <Grid columns={1} centered className="m0 p0">
        <Grid.Row className="py0">
          {/* First Grid.Row (Filters/Buttons) */}
          <Grid.Column>
            <Form as={Grid} stackable className="p0 m0">
              <Grid.Row className="pb0">
                <Grid.Column>
                  <Form.Group>
                    <Form.Field width="8" className="mt16">
                      <label>Yard Sale Name</label>
                      <Input
                        icon="tag"
                        required
                        iconPosition="left"
                        ref={yardsaleNameRef}
                        placeholder="Yard Sale Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Form.Field>

                    <Form.Field width="8" className="mt16">
                      <label>Company</label>
                      <Input
                        icon="building"
                        iconPosition="left"
                        placeholder="Company"
                        name="company"
                        value={values.company}
                        onChange={handleChange}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="pt0 pb0">
                <Grid.Column>
                  <Form.Group widths="equal">
                    <Form.Field className="mt16">
                      <label>Phone</label>
                      <Input
                        icon="phone"
                        iconPosition="left"
                        placeholder="Phone"
                        type="tel"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                      />
                    </Form.Field>

                    <Form.Field className="mt16">
                      <label>Email</label>
                      <Input
                        icon="envelope"
                        iconPosition="left"
                        placeholder="Email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>

              {/* Address Form */}
              <Grid.Row className="pb0">
                <Grid.Column>
                  <Form.Group>
                    <Form.Field width="8" className="mt16">
                      <label>Street Address</label>
                      <Input
                        icon="address card"
                        iconPosition="left"
                        placeholder="Street 1"
                        name="street1"
                        type="text"
                        fluid
                        value={values.street1 || ""}
                        onChange={handleChange}
                      />
                    </Form.Field>

                    <Form.Field width="8" className="mt16">
                      <label>Street Address Line 2</label>
                      <Input
                        icon="address card"
                        iconPosition="left"
                        fluid
                        type="text"
                        placeholder="Street 2"
                        name="street2"
                        value={values.street2 || ""}
                        onChange={handleChange}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="pb0">
                <Grid.Column>
                  <Form.Group>
                    <Form.Field width="8" className="mt16">
                      <label>Country</label>
                      <Input
                        icon="address card"
                        iconPosition="left"
                        placeholder="Country"
                        name="country"
                        type="text"
                        fluid
                        value={values.country || ""}
                        onChange={handleChange}
                      />
                    </Form.Field>

                    <Form.Field width="8" className="mt16">
                      <label>Province/State</label>
                      <Input
                        icon="address card"
                        iconPosition="left"
                        fluid
                        type="text"
                        placeholder="Province/State"
                        name="province"
                        value={values.province || ""}
                        onChange={handleChange}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="pb0">
                <Grid.Column>
                  <Form.Group>
                    <Form.Field width="8" className="mt16">
                      <label>City</label>
                      <Input
                        icon="address card"
                        iconPosition="left"
                        placeholder="City"
                        name="city"
                        type="text"
                        fluid
                        value={values.city || ""}
                        onChange={handleChange}
                      />
                    </Form.Field>

                    <Form.Field width="8" className="mt16">
                      <label>Postal/Zip Code</label>
                      <Input
                        icon="address card"
                        iconPosition="left"
                        fluid
                        type="text"
                        placeholder="Postal/Zip"
                        name="postal"
                        value={values.postal || ""}
                        onChange={handleChange}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
              {/* End Address Form */}

              <Grid.Row></Grid.Row>
            </Form>
          </Grid.Column>
        </Grid.Row>

        {/* Yardsales List */}
        {/* {loading && <Loading />} */}
      </Grid>

      <Grid centered stackable>
        <Grid.Row centered>
          <Grid.Column mobile={10} tablet={8} computer={8}>
            <Button className="cancel" fluid onClick={() => router.push("/yardsales")}>
              Cancel
            </Button>
          </Grid.Column>
          <Grid.Column mobile={10} tablet={8} computer={8}>
            <Button
              fluid
              className="save"
              onClick={handleSubmit}
              content={yardSale ? "Save Changes" : "Create Yard Sale"}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};
export default YardsaleForm;
