import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  useRef,
  useContext
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
  Checkbox,
  Message,
  Popup,
  Segment
} from "semantic-ui-react";
import { notify } from "react-notify-toast";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_YARDSALE, CREATE_YARDSALE } from "../../../graphql/mutations";
import { GET_YARDSALES, GET_YARDSALE } from "../../../graphql/queries";

import TimePicker from "../../TimePicker";

import YardsaleAddressMap from "./YardsaleAddressMap";
import { AppContext } from "../../../App";
// import YardsaleAddressForm from "./YardsaleAddressForm";

const YardsaleDetailsModal = ({
  yardsale = null,
  autofocus = true,
  iconLabel = "",
  onCloseCallback = () => {}, // function
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const defaultYardsaleLocation = {
    lat: null,
    lng: null,
    address: {}
  };
  const [yardsaleLocation, setYardsaleLocation] = useState(
    defaultYardsaleLocation
  );

  useEffect(() => {
    console.log("YARDSALE LOCATION HAS CHANGED : ", yardsaleLocation);
    setApp({
      ...app,
      yardsales: { ...app.yardsales, selectedYardsale: yardsale }
    });
  }, [yardsaleLocation]);

  const { app, setApp } = useContext(AppContext);
  const [
    updateYardsaleMutation,
    {
      data: updateYardsaleMutationData,
      loading: updateYardsaleMutationLoading,
      error: updateYardsaleMutationError
    }
  ] = useMutation(UPDATE_YARDSALE);
  const [
    createYardsaleMutation,
    {
      data: createYardsaleMutationData,
      loading: createYardsaleMutationLoading,
      error: createYardsaleMutationError
    }
  ] = useMutation(CREATE_YARDSALE);

  const yardsaleNameRef = useRef();
  useEffect(() => {
    if (open === true && autofocus === true) {
      yardsaleNameRef.current.focus();
    }
  }, [open]);

  const initialFormValues = {
    yardsaleName: yardsale ? yardsale.name : "",
    yardsaleInitials: yardsale ? yardsale.initials : "",
    yardsaleCompany: yardsale ? yardsale.company : "",
    yardsalePhone: yardsale ? yardsale.phone : "",
    yardsaleEmail: yardsale ? yardsale.email : "",
    yardsaleAddress: yardsale ? yardsale.address_text : "",
    street1: yardsale ? yardsale.address_street1 : "",
    street2: yardsale ? yardsale.address_street2 : "",
    country: yardsale ? yardsale.address_country : "",
    province: yardsale ? yardsale.address_province : "",
    city: yardsale ? yardsale.address_city : "",
    postal: yardsale ? yardsale.address_postal : "",
    yardsaleNotes: yardsale ? yardsale.notes : "",
    isPublic: yardsale ? yardsale.is_public : false,
    timeOpen: null,
    timeClosed: null,
    addressObj: yardsale
      ? {
          lat: yardsale.pos_lat,
          lng: yardsale.pos_lng,
          address_text: yardsale.address_text
        }
      : {
          lat: null,
          lng: null,
          address_text: null
        }
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  const timeOpenRef = useRef();

  const handleInputChange = event => {
    // TODO: Move this to a hook
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const cancel = () => {
    setFormValues(initialFormValues);
    closeModal();
  };

  const save = () => {
    // get the list of yardsales

    if (yardsale == null || typeof yardsale == "undefined") {
      // Create New yardsale
      // GQL Mutation

      createYardsaleMutation({
        variables: {
          name: formValues.yardsaleName,
          phone: formValues.yardsalePhone,
          email: formValues.yardsaleEmail,
          address_text: formValues.yardsaleAddress,
          notes: formValues.yardsaleNotes,
          company: formValues.yardsaleCompany,
          is_public: formValues.isPublic,
          pos_lat: formValues.addressObj.lat || 0,
          pos_lng: formValues.addressObj.lng || 0
        },
        refetchQueries: [
          {
            query: GET_YARDSALES
          }
        ]
      });

      // notify.show("Yardsale Created successfully ", "success");
      setApp({
        ...app,
        notifications: {
          show: true,
          dismiss: true,
          message: "Yard Sale Created Successfully",
          level: "success"
        }
      });
    } else {
      updateYardsaleMutation({
        variables: {
          yardsaleUUID: yardsale.uuid,
          name: formValues.yardsaleName,
          phone: formValues.yardsalePhone,
          email: formValues.yardsaleEmail,
          address_text: formValues.yardsaleAddress,
          notes: formValues.yardsaleNotes,
          company: formValues.yardsaleCompany,
          is_public: formValues.isPublic,
          pos_lat: formValues.addressObj.lat || 0,
          pos_lng: formValues.addressObj.lng || 0
        },
        refetchQueries: [
          {
            query: GET_YARDSALES
          },
          {
            query: GET_YARDSALE,
            variables: { yardsaleUUID: yardsale.uuid }
          }
        ]
      });
      notify.show("Yard Sale Updated successfully ", "success");
    }
    // setFormValues(initialFormValues);
    closeModal();
    // props.history.push("/yardsales");
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

  const myPosition = JSON.parse(localStorage.getItem("myPosition"));

  return (
    <Fragment>
      {props.children && props.children !== null ? (
        <Fragment>
          {props.children({
            openModal: openModal
          })}
        </Fragment>
      ) : (
        <Fragment>
          {props.edit === true ? (
            <Popup
              inverted
              content="Edit Yard Sale Details"
              position="top center"
              trigger={
                <Button
                  onClick={openModal}
                  icon="edit"
                  className="icon"
                  content={iconLabel ? iconLabel : null}
                  circular
                  basic
                  className="list-action-icon"
                />
              }
            ></Popup>
          ) : (
            <Button size="small" onClick={openModal} className="new">
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
          {yardsale ? "Edit Yard Sale Details" : "Create New Yard Sale"}
        </Modal.Header>
        <Modal.Content scrolling>
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
                      name="yardsaleName"
                      value={formValues.yardsaleName}
                      onChange={handleInputChange}
                    />
                  </Form.Field>

                  <Form.Field width="8" className="mt16">
                    <label>Company</label>
                    <Input
                      icon="building"
                      iconPosition="left"
                      placeholder="Company"
                      name="yardsaleCompany"
                      value={formValues.yardsaleCompany}
                      onChange={handleInputChange}
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
                      name="yardsalePhone"
                      value={formValues.yardsalePhone}
                      onChange={handleInputChange}
                    />
                  </Form.Field>

                  <Form.Field className="mt16">
                    <label>Email</label>
                    <Input
                      icon="envelope"
                      iconPosition="left"
                      placeholder="Email"
                      type="email"
                      name="yardsaleEmail"
                      value={formValues.yardsaleEmail}
                      onChange={handleInputChange}
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
                      value={formValues.street1 || ""}
                      onChange={handleInputChange}
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
                      value={formValues.street2 || ""}
                      onChange={handleInputChange}
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
                      value={formValues.country || ""}
                      onChange={handleInputChange}
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
                      value={formValues.province || ""}
                      onChange={handleInputChange}
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
                      value={formValues.city || ""}
                      onChange={handleInputChange}
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
                      value={formValues.postal || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Field>
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
            {/* End Address Form */}

            <Grid.Row>
              <Grid.Column>
                <Form.Group widths="equal">
                  <Form.Field>
                    <Checkbox
                      toggle
                      label={<label>Public</label>}
                      name="isPublic"
                      checked={formValues.isPublic}
                      onChange={e =>
                        setFormValues(prevState => {
                          return {
                            ...formValues,
                            isPublic: !prevState.isPublic
                          };
                        })
                      }
                    />
                  </Form.Field>
                </Form.Group>
              </Grid.Column>
            </Grid.Row>

            {formValues.isPublic && (
              <Fragment>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Form.Group>
                      <Form.Field width={8}>
                        <label>Date/Time Open</label>
                        <TimePicker
                          value={formValues.timeOpen}
                          handleChange={val =>
                            setFormValues({ ...formValues, timeOpen: val })
                          }
                          name={"timeOpen"}
                        />
                      </Form.Field>
                    </Form.Group>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Form.Group>
                      <Form.Field width={8}>
                        <label>Date/Time Closed</label>
                        <TimePicker
                          value={formValues.timeClosed}
                          handleChange={val =>
                            setFormValues({ ...formValues, timeClosed: val })
                          }
                          name={"timeClosed"}
                        />
                      </Form.Field>
                    </Form.Group>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    <Segment
                      basic
                      compact
                      style={{ height: 400, width: "100%" }}
                    >
                      <Message content="This yard Sale will now be visible to the public on the Yard Sale Market" />
                      
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Fragment>
            )}
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Grid centered stackable>
            <Grid.Row centered>
              <Grid.Column mobile={10} tablet={8} computer={8}>
                <Button className="cancel" fluid onClick={cancel}>
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column mobile={10} tablet={8} computer={8}>
                <Button
                  fluid
                  className="save"
                  onClick={save}
                  content={
                    props.edit === true ? "Save Changes" : "Create Yard Sale"
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

export default withRouter(YardsaleDetailsModal);
