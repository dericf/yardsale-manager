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
  TextArea,
} from "semantic-ui-react";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import useForm, { FormErrors, FormValues } from "../../hooks/useForm";
import { useSellers } from "../../hooks/useSeller";
import { FormErrorObject } from "../../types/Errors";
import { SellersInterface } from "../../types/Sellers";

interface Props {
  seller: SellersInterface;
}

export const SellersForm = ({ seller }: Props) => {
  const { user, token } = useAuth();
  const { sendError, sendAlert } = useAlert();
  const sellerNameRef = useRef<Input>();
  const { createNewSeller, updateSeller, setSelectedSeller } = useSellers();
  const router = useRouter();
  const initialValues: FormValues = {
    name: seller ? seller.name : "",
    initials: seller ? seller.initials : "",
    company: seller ? seller.company : "",
    phone: seller ? seller.phone : "",
    email: seller ? seller.email : "",
    address: seller ? seller.address_text : "",
    notes: seller ? seller.notes : "",
    // street1: yardSale ? yardSale.address_street1 : "",
    // street2: yardSale ? yardSale.address_street2 : "",
    // country: yardSale ? yardSale.address_country : "",
    // province: yardSale ? yardSale.address_province : "",
    // city: yardSale ? yardSale.address_city : "",
    // postal: yardSale ? yardSale.address_postal : "",
  };
  const onSubmit = async (values: FormValues, errors: FormErrors) => {
    let sellerVars = {
      name: values.name,
      initials: values.initials,
      company: values.company,
      phone: values.phone,
      email: values.email,
      address: values.address,
      notes: values.notes,
    } as FormValues;
    if (seller) {
      // Update Yard Sale by uuid
      sellerVars.sellerUUID = seller.uuid;
      await updateSeller(sellerVars);
      sendAlert("Success ! Seller was updated.");
      setSelectedSeller(null);
    } else {
      // Insert new Yard Sale
      await createNewSeller(sellerVars);
      sendAlert("Success ! Seller was created.");
    }

    router.push("/sellers");
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

  const validate = () => {
    let errors = {} as FormErrorObject;
    if (values.name.length === 0) {
      errors.name = "Please enter a name for this Seller";
    }

    return errors;
  };

  const { values, handleChange, handleSubmit, setValues } = useForm({
    initialValues,
    onSubmit,
    validate,
  });

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    let computedInitials = null;
    const target = e.target as HTMLInputElement;
    computedInitials = String(
      target.value.split(" ").map((name) => name[0]),
    ).replace(",", "");
    setValues({ ...values, name: target.value, initials: computedInitials });
  };

  useEffect(() => {
    // Auto focus the first form input on first page load
    if (sellerNameRef) sellerNameRef.current.focus();
  }, []);

  return (
    <>
      <Grid columns={1} centered className="m0 p0">
        <Grid.Row className="py0">
          {/* First Grid.Row (Filters/Buttons) */}
          <Grid.Column>
            <Form
              onSubmit={handleSubmit}
              id="SellerDetailsModal"
              className="p0 m0"
            >
              <Grid>
                <Grid.Row className="pb0">
                  <Grid.Column>
                    <Form.Group>
                      <Form.Field width="7">
                        <label>Seller Name</label>
                        <Input
                          icon="user"
                          iconPosition="left"
                          ref={sellerNameRef}
                          placeholder="Seller Name"
                          name="name"
                          value={values.name}
                          onChange={handleNameChange}
                        />
                      </Form.Field>
                      <Form.Field width="2">
                        <label>Initials</label>
                        <Input
                          name="initials"
                          icon="address card"
                          iconPosition="left"
                          value={values.initials}
                          onChange={handleChange}
                        />
                      </Form.Field>

                      <Form.Field width="7">
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
                      <Form.Field>
                        <label>Phone</label>
                        <Input
                          icon="phone"
                          iconPosition="left"
                          placeholder="Phone"
                          type="tel"
                          name="phone"
                          value={values.phone}
                          onChange={handleChange}
                        ></Input>
                      </Form.Field>

                      <Form.Field>
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

                <Grid.Row className="pt0">
                  <Grid.Column>
                    <Form.Group widths="equal">
                      <Form.Field>
                        <label>Address</label>
                        <TextArea
                          placeholder="Address"
                          name="address"
                          value={values.address}
                          onChange={async (e) => handleChange(e)}
                          rows={5}
                        />
                      </Form.Field>

                      <Form.Field>
                        <label>Notes</label>
                        <TextArea
                          placeholder="Notes"
                          name="notes"
                          value={values.notes}
                          onChange={handleChange}
                          rows={5}
                        />
                      </Form.Field>
                    </Form.Group>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Grid.Column>
        </Grid.Row>

        {/* Yardsales List */}
        {/* {loading && <Loading />} */}
      </Grid>

      <Grid centered>
        <Grid.Row centered>
          <Grid.Column mobile={14} tablet={8} computer={5}>
            <Button
              style={{ marginTop: "0.75rem" }}
              className="cancel"
              basic
              fluid
              onClick={() => router.push("/sellers")}
            >
              Cancel
            </Button>
          </Grid.Column>
          <Grid.Column mobile={14} tablet={8} computer={5}>
            <Button
              fluid
              style={{ marginTop: "0.75rem" }}
              primary
              className="save"
              disabled={values.name.length === 0}
              onClick={handleSubmit}
              content={seller ? "Save Changes" : "Create Seller"}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};
