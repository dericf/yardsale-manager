import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  createRef,
  useContext,
  Ref,
} from "react";
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
  Dropdown,
  Table,
  Segment,
  ButtonGroup,
  Popup,
  Label,
} from "semantic-ui-react";
import { CREATE_TRANSACTION_ITEM } from "../../graphql/mutations";
import {
  GET_SELLER_LINKS_FOR_YARDSALE,
  GET_TRANSACTION_ITEMS_FOR_YARDSALE,
} from "../../graphql/queries";
import { useAlert } from "../../hooks/useAlert";
import useForm from "../../hooks/useForm";
import { useYardsales } from "../../hooks/useYardsales";
import { toMoney, fromMoney } from "../../utilities/money_helpers";

import { ConfirmModal } from "../ConfirmModal";

export const CashierForm = () => {
  const initialValues = {
    seller: {
      uuid: "123123123",
      name: null,
    },
    price: "",
    description: "",
  };
  const [transactionItems, setTransactionItems] = useState([]);
  const [tender, setTender] = useState("");
  const [changeDue, setChangeDue] = useState("0");
	const [sellers, setSellers] = useState(null)
  const focusRef = useRef<Input>();

  const onSubmit = () => {
    console.log("Submitted");
    sendAlert("Submitted");
  };
  const { selectedYardSale } = useYardsales();
  const {
    values: formValues,
    setValues: setFormValues,
    handleChange,
    handleSubmit,
  } = useForm({ initialValues, onSubmit });
  useEffect(() => {
    if (focusRef) {
      focusRef?.current.focus();
      focusRef?.current.select();
    }
  }, [open]);

  const cancel = () => {
    setFormValues(initialValues);
    setTransactionItems([]);
  };

  const resetModal = () => {
    setTransactionItems([]);
    setFormValues(initialValues);
  };

  const postTransaction = () => {
    transactionItems.forEach((item) => {
      // createTransactionItemMutation({
      //   variables: {
      //     sellerUUID: item.seller.uuid,
      //     yardsaleUUID: yardsale.uuid,
      //     price: String(item.price),
      //     description: item.description,
      //   },
      //   refetchQueries: [
      //     {
      //       query: GET_TRANSACTION_ITEMS_FOR_YARDSALE,
      //       variables: { yardsaleUUID: yardsale.uuid },
      //     },
      //     {
      //       query: GET_SELLER_LINKS_FOR_YARDSALE,
      //       variables: { yardsaleUUID: yardsale.uuid },
      //     },
      //   ],
      //   awaitRefetchQueries: true,
      // });
    });
  };
  const { sendAlert, sendError, sendInfo } = useAlert();
  const save = () => {
    // console.log('Full Transaction: ', transactionItems)
    postTransaction();
    sendAlert("Transaction has been saved.");
  };

  const saveAndNew = () => {
    // console.log('Full Transaction: ', transactionItems)
    postTransaction();
    sendAlert("Transaction has been saved.");
    resetModal();
    setTransactionItems([]);
    setFormValues(initialValues);
  };

  const addItem = () => {
    setTransactionItems(
      transactionItems.concat([
        {
          seller: {
            uuid: formValues.seller.uuid,
            name: formValues.seller.name,
          },
          price: fromMoney(formValues.price),
          description: formValues.description,
        },
      ]),
    );
    setFormValues({
      description: "",
      price: "",
      seller: {
        uuid: formValues.seller.uuid,
        name: formValues.seller.name,
      },
    });
    focusRef.current.focus();
    focusRef.current.select();
  };

  const calculateRunningTotal = () => {
    return toMoney(
      transactionItems.reduce(
        (accum, currentItem) => Number(accum) + Number(currentItem.price),
        0,
      ),
    );
  };

  const calculateChangeDue = () => {
    if (Number(fromMoney(tender)) !== null && Number(fromMoney(tender)) > 0) {
      setChangeDue(
        toMoney(
          Number(fromMoney(tender)) -
            Number(fromMoney(calculateRunningTotal())),
        ),
      );
    } else {
      setChangeDue(toMoney(0));
    }
  };

  const handleTenderChange = (e) => {
    setTender(fromMoney(e.target.value));
  };

  const removeTransactionItem = (id) => {
    setTransactionItems(transactionItems.filter((item) => item.id != id));
    setTender(0);
  };

  const duplicateTransactionItem = (item) => {
    let newItem = { ...item };
    newItem.id = transactionItems.length + 1;
    setTransactionItems(transactionItems.concat([newItem]));
    setTender(0);
  };

  useEffect(() => {
    calculateChangeDue();
  }, [tender]);

  return (
    <Segment>
      <Grid centered>
        <Grid.Row columns={2}>
          <Grid.Column mobile={15} computer={8}>
            <Form>
              <Grid.Row>
                <Grid.Column width={15}>
                  <Form.Group>
                    <Form.Field width="7">
                      <label>Price</label>
                      <Input
                        className=""
                        name="price"
                        value={formValues.price}
                        onChange={handleChange}
                        ref={focusRef}
                        size="huge"
                        icon="dollar"
                        iconPosition="left"
                        onBlur={(e) =>
                          setFormValues({
                            ...formValues,
                            price: toMoney(e.target.value),
                          })
                        }
                      />
                    </Form.Field>
                    {/* {JSON.stringify(selectedYardSale)} */}
                    <Form.Field width="8">
                          <label>Select a Seller</label>
                          {sellers &&
                            sellers.yardsale_seller_link && (
                              <Fragment>
                                {sellers.yardsale_seller_link.length ===
                                0 ? (
                                  <span>Add Sellers to this yardsale</span>
                                ) : (
                                  <Dropdown
                                    style={{ height: 52 }}
                                    className="cashier-large-input icon"
                                    compact
                                    placeholder="Select a Seller"
                                    openOnFocus={true}
                                    name="sellerID"
                                    fluid
                                    selection
                                    icon="user outline"
                                    labeled
                                    floating
                                    button
                                    selectOnBlur={true}
                                    selectOnNavigation={true}
                                    options={sellers.yardsale_seller_link
                                      .filter(
                                        (link) =>
                                          link.seller.is_active === true &&
                                          link.seller.is_deleted === false,
                                      )
                                      .map((link, index) => {
                                        return {
                                          key: index,
                                          text: `${link.seller.initials} (${link.seller.name})`,
                                          content: `${link.seller.initials} (${link.seller.name})`,
                                          value: `${link.seller.uuid}|${link.seller.initials} (${link.seller.name})`,
                                        };
                                      })}
                                    onChange={(e, { value }) => {
                                      // console.log('DROPDOWN Value: ', value.split("|"))
                                      // console.log('DROPDOWN TEXT: ', e.target.textContent)
                                      setFormValues({
                                        ...formValues,
                                        seller: {
                                          uuid: value.split("|")[0],
                                          name: value.split("|")[1],
                                        },
                                      });
                                    }}
                                  />
                                )}
                              </Fragment>
                            )}
                        </Form.Field>

                    <Form.Field width={1} inline>
                      {/* <YardsaleSellerModal
                            yardsale={selectedYardSale}
                            caller="cashierModal"
                            fluidButton={false}
                            invertedButton={false}
                          />

                          <YardsaleTransactionsModal
                            yardsale={selectedYardSale}
                            iconLabel={null}
                          /> */}
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Group>
                    <Form.Field width="16">
                      <label>Description</label>
                      <Input
                        size="huge"
                        placeholder="Item Description"
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        icon="file alternate outline"
                        iconPosition="left"
                      />
                    </Form.Field>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="py16">
                <Grid.Column>
                  <Button
                    fluid
                    icon="check"
                    content="Add"
                    className="save"
										color="blue"
										basic
                    onClick={addItem}
                    disabled={
                      formValues.price == null ||
                      formValues.seller.uuid === null
                    }
                  />
                </Grid.Column>
              </Grid.Row>
            </Form>
          </Grid.Column>
          {transactionItems && transactionItems.length > 0 && (
            <Grid.Column mobile={16} computer={8}>
              <Divider content="pending Items" horizontal />
              <Table className="mt0" striped compact basic="very" unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center"></Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">
                      Seller
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">
                      Price
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">
                      Description
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">
                      Actions
                    </Table.HeaderCell>
                    {/* <Table.HeaderCell textAlign="center">
                        Remove
                      </Table.HeaderCell> */}
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {transactionItems && (
                    <Fragment>
                      {transactionItems.length === 0 && (
                        <Table.Row textAlign="center">
                          <Table.Cell textAlign="center" colSpan="5">
                            No Items in this Transaction
                          </Table.Cell>
                        </Table.Row>
                      )}

                      {transactionItems.map((item, index) => {
                        return (
                          <Table.Row key={item.key}>
                            <Table.Cell textAlign="center">
                              {index + 1}
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              {item.seller.name}
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              <strong>$ {toMoney(item.price)}</strong>
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              {item.description}
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <ButtonGroup>
                                <Popup
                                  size="small"
                                  position="top center"
                                  inverted
                                  trigger={
                                    <Button
                                      tabIndex={-1}
                                      compact
                                      basic
                                      icon="add"
                                      onClick={() =>
                                        duplicateTransactionItem(item)
                                      }
                                    ></Button>
                                  }
                                  content="Duplicate this item"
                                />
                                {/* </Table.Cell> */}
                                {/* <Table.Cell textAlign="center"> */}
                                <Popup
                                  size="small"
                                  position="top center"
                                  inverted
                                  key={item.id}
                                  trigger={
                                    <Button
                                      key={`${item.id}-`}
                                      icon="trash can"
                                      basic
                                      compact
                                      onClick={() =>
                                        removeTransactionItem(item.id)
                                      }
                                    />
                                  }
                                  content="Remove this item"
                                />
                                {/* <span ref={modalRef}></span> */}
                              </ButtonGroup>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Fragment>
                  )}
                </Table.Body>
              </Table>
            </Grid.Column>
          )}
        </Grid.Row>
        {/* <Divider className="px0" content="Transaction Totals" horizontal /> */}
        {transactionItems && transactionItems.length > 0 && (
          <Grid.Row className="py16 mb16 mx16 mt0" columns={1} centered>
            <Grid.Column
              mobile={16}
              tablet={16}
              computer={14}
              textAlign="center"
            >
              <Grid.Row>
                <Grid centered stackable columns="3">
                  <Grid.Column
                    mobile={12}
                    tablet={12}
                    computer={5}
                    textAlign="center"
                  >
                    <Form>
                      <Form.Group widths="equal">
                        <Form.Field>
                          {/* <Input
                            label={<Label size="huge" content="Total" basic className="left-input-borderless-label" ></Label>}
                            type="text"
                            size="huge"
                            labelPosition="left"
                            tabIndex={-1}
                            
                            value={calculateRunningTotal()}
                            input={<input type="text" style={{textAlign: "right"}} className="huge" /> }
                          /> */}
                          <Label size="huge" tag content="Total">
                            Total: &nbsp;$ &nbsp;
                            {calculateRunningTotal()}
                          </Label>
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Grid.Column>
                  <Grid.Column
                    mobile={12}
                    tablet={12}
                    computer={5}
                    textAlign="center"
                  >
                    <Form>
                      <Form.Group widths="equal">
                        <Form.Field style={{ textAlign: "center" }}>
                          <Label size="huge" basic>
                            Collected: &nbsp;
                            <Input
                              name="tender"
                              labelPosition="left"
                              value={tender}
                              onBlur={(e) => {
                                setTender(toMoney(e.target.value));
                              }}
                              icon={<Icon name="dollar" />}
                              iconPosition="left"
                              onChange={handleTenderChange}
                              input={
                                <input
                                  type="text"
                                  style={{
                                    textAlign: "right",
                                    maxWidth: 165,
																		marginLeft: "auto",
																		marginRight: "auto"
                                  }}
                                  autoComplete="false"
                                />
                              }
                            />
                          </Label>
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Grid.Column>

                  <Grid.Column
                    mobile={12}
                    tablet={12}
                    computer={5}
                    textAlign="center"
                  >
                    <Form>
                      <Form.Group widths="equal">
                        <Form.Field>
                          {/* <Input
                            type="text"
                            label={<Label size="huge" basic content="Change Due" className="left-input-borderless-label" />}
                            size="huge"
                            labelPosition="left"
                            tabIndex={-1}
                            input={<input type="text" style={{textAlign: "right"}} className="huge" /> }
                            value={changeDue}
                          /> */}

                          <Label size="huge" tag>
                            Change Due: &nbsp;$&nbsp;
                            {changeDue}
                          </Label>
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>

      <Grid stackable centered>
        <Grid.Row columns={2} centered>
          <Grid.Column
            className="mobile-my8"
            mobile={10}
            tablet={8}
            computer={8}
          >
            <ConfirmModal
              triggerType={"button"}
              buttonProps={{
                content: "Cancel",
                fluid: true,
                className: "cancel",
              }}
              header={"Confirm"}
              content={"Are you sure you want to cancel this transaction?"}
              handleConfirm={() => cancel()}
              handleCancel={() => null}
            />
          </Grid.Column>

          <Grid.Column
            className="mobile-my8"
            mobile={10}
            tablet={8}
            computer={8}
          >
            <ButtonGroup style={{ paddingRight: 38 }} fluid>
              <Button
                onClick={save}
                content="Save Transaction"
                disabled={transactionItems.length == 0}
                fluid
								primary
                className="save"
              />
              <Popup
                size="small"
                position="top right"
                inverted
                content="Save Transaction and Start a new one"
                trigger={
                  <Button
                    onClick={saveAndNew}
                    basic
                    black
                    icon="add"
                    style={{ maxWidth: 38 }}
                    disabled={transactionItems.length == 0}
                  />
                }
              ></Popup>
              {/* <Notifications show={true} message="Testing Messages"  /> */}
            </ButtonGroup>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};
