import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Card,
  Icon,
  Divider,
  Grid,
  Modal,
  Button,
  Form,
  Input,
  TextArea,
  Header,
} from "semantic-ui-react";

// import MaskedInput from 'react-input-mask'

import { useMutation } from "@apollo/react-hooks";
import { UPDATE_SELLER, CREATE_SELLER } from "../../../graphql/mutations";
import { GET_SELLERS } from "../../../graphql/queries";
import { AppContext } from "../../../App";

const SellerDetailsModal = ({
  seller = null, // null or Seller DB JSON Object
  userAsSeller = null, // null or Object
  onCloseCallback = () => {}, // function
  autofocus = true, //
  autoOpen = false,
  fluid = false,
  invertedButton = false,
  trigger = null,
  onClick = null,
  ...props
}) => {
  const [open, setOpen] = useState(autoOpen);
  const { app, setApp } = useContext(AppContext);
  const [
    updateSellerMutation,
    {
      data: sellerMutationData,
      loading: sellerMutationLoading,
      error: sellerMutationError,
    },
  ] = useMutation(UPDATE_SELLER);
  const [
    createSellerMutation,
    {
      data: createSellerMutationData,
      loading: createSellerMutationLoading,
      error: createSellerMutationError,
    },
  ] = useMutation(CREATE_SELLER);

  const sellerNameRef = useRef();
  useEffect(() => {
    if (open === true && autofocus === true) {
      sellerNameRef.current.focus();
    }
  }, [open]);

  const initialFormValues = {
    sellerName: seller ? seller.name : userAsSeller ? userAsSeller.name : "",
    sellerInitials: seller
      ? seller.initials
      : userAsSeller
      ? userAsSeller.initials
      : "",
    sellerCompany: seller ? seller.company : "",
    sellerPhone: seller ? seller.phone : "",
    sellerEmail: seller ? seller.email : userAsSeller ? userAsSeller.email : "",
    sellerAddress: seller ? seller.address_text : "",
    sellerNotes: seller ? seller.notes : "",
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  const handleInputChange = (event) => {
    // TODO: Move this to a hook
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    let setInitials = null;
    let computedInitials = "";
    if (name == "sellerName") {
      setInitials = true;
      computedInitials = String(
        String(value)
          .split(" ")
          .map((name) => name[0]),
      ).replace(",", "");
    }

    setFormValues({
      ...formValues,
      [name]: value,
      sellerInitials: setInitials ? computedInitials : value,
    });
  };

  const cancel = () => {
    setFormValues(initialFormValues);
    closeModal();
  };

  const save = () => {
    //
    // This function either creates a new seller (if seller === null)
    // OR updates an existing seller
    //
    if (seller === null || typeof seller === "undefined") {
      // Create New seller
      createSellerMutation({
        variables: {
          name: formValues.sellerName,
          initials: formValues.sellerInitials,
          company: formValues.sellerCompany,
          phone: formValues.sellerPhone,
          email: formValues.sellerEmail,
          address: formValues.sellerAddress,
          notes: formValues.sellerNotes,
        },
        onError: (err) => console.log("Error Updating Seller", err),
        refetchQueries: [
          {
            query: GET_SELLERS,
          },
        ],
      });
      setApp({
        ...app,
        notifications: {
          show: true,
          dismiss: true,
          message: `${formValues.sellerName} has been created`,
          level: "success",
        },
      });
    } else {
      // console.log('Editing Existing seller: ', seller.uuid);
      updateSellerMutation({
        variables: {
          sellerUUID: seller.uuid,
          name: formValues.sellerName,
          initials: formValues.sellerInitials,
          company: formValues.sellerCompany,
          phone: formValues.sellerPhone,
          email: formValues.sellerEmail,
          address: formValues.sellerAddress,
          notes: formValues.sellerNotes,
        },
        onError: (err) => console.log("Error Updating Seller", err),
        refetchQueries: [
          {
            query: GET_SELLERS,
          },
        ],
      });
      setApp({
        ...app,
        notifications: {
          show: true,
          dismiss: true,
          message: `${seller.name} was updated`,
          level: "info",
        },
      });
      // console.log(formValues)
    }
    closeModal();
    // props.history.push('/sellers')
  };

  const closeModal = () => {
    setOpen(false);
    if (onCloseCallback !== null) {
      onCloseCallback();
    }
  };

  const openModal = () => {
    setOpen(true);
  };

  //   if (trigger !== null) {

  //   }

  return (
    <Fragment>
      {props.children && props.children !== null ? (
        <Fragment>
          {props.children({
            openModal: openModal,
          })}
        </Fragment>
      ) : (
        <Fragment>
          {props.edit === true ? (
            <Button
              circular
              basic
              onClick={openModal}
              icon={<Icon name="edit" fitted onClick={openModal}></Icon>}
              content={props.iconLabel && props.iconLabel}
            ></Button>
          ) : (
            <Button
              size="small"
              fluid={fluid}
              className="new"
              inverted={invertedButton}
              onClick={openModal}
            >
              New
            </Button>
          )}
        </Fragment>
      )}

      <Modal
        open={open}
        closeIcon={<Icon name="close" onClick={closeModal}></Icon>}
        onClose={closeModal}
        closeOnDimmerClick={true}
        closeOnEscape={true}
        dimmer="blurring"
      >
        <Modal.Header>
          {seller
            ? "Edit Seller Details"
            : userAsSeller
            ? `Add ${
                userAsSeller.name ? userAsSeller.name : userAsSeller.email
              } as a Seller`
            : "Create New Seller"}
        </Modal.Header>
        <Modal.Content>
          <Form
            onSubmit={save}
            id="SellerDetailsModal"
            className="p0 m0"
            loading={sellerMutationLoading}
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
                        name="sellerName"
                        value={formValues.sellerName}
                        onChange={handleInputChange}
                      />
                    </Form.Field>
                    <Form.Field width="2">
                      <label>Initials</label>
                      <Input
                        name="sellerInitials"
                        icon="address card"
                        iconPosition="left"
                        value={formValues.sellerInitials}
                        onChange={handleInputChange}
                      />
                    </Form.Field>

                    <Form.Field width="7">
                      <label>Company</label>
                      <Input
                        icon="building"
                        iconPosition="left"
                        placeholder="Company"
                        name="sellerCompany"
                        value={formValues.sellerCompany}
                        onChange={handleInputChange}
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
                        name="sellerPhone"
                        value={formValues.sellerPhone}
                        onChange={handleInputChange}
                      ></Input>
                    </Form.Field>

                    <Form.Field>
                      <label>Email</label>
                      <Input
                        icon="envelope"
                        iconPosition="left"
                        placeholder="Email"
                        type="email"
                        name="sellerEmail"
                        value={formValues.sellerEmail}
                        onChange={handleInputChange}
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
                        name="sellerAddress"
                        value={formValues.sellerAddress}
                        onChange={handleInputChange}
                        rows={5}
                      />
                    </Form.Field>

                    <Form.Field>
                      <label>Notes</label>
                      <TextArea
                        placeholder="Notes"
                        name="sellerNotes"
                        value={formValues.sellerNotes}
                        onChange={handleInputChange}
                        rows={5}
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Button fluid="true" onClick={cancel} className="cancel">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column width={8}>
                <Button
                  type="submit"
                  form="SellerDetailsModal"
                  fluid
                  loading={sellerMutationLoading}
                  className="save"
                  content={
                    props.edit === true ? "Save Changes" : "Create Seller"
                  }
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
};

export default withRouter(SellerDetailsModal);
