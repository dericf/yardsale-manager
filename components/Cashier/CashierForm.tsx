import { useRouter } from "next/router";
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
  Message,
} from "semantic-ui-react";
import { CREATE_TRANSACTION_ITEM } from "../../graphql/mutations";
import {
  GET_SELLER_LINKS_FOR_YARDSALE,
  GET_TRANSACTION_ITEMS_FOR_YARDSALE,
} from "../../graphql/queries";
import { useAlert } from "../../hooks/useAlert";
import useForm from "../../hooks/useForm";
import { useYardsales } from "../../hooks/useYardsales";
import { UUID } from "../../types/General";
import { PendingTransactionItem, Transaction } from "../../types/Transaction";
import { YardSaleLinks } from "../../types/YardSaleLinks";
import { YardSalesInterface } from "../../types/YardSales";
import { toMoney, fromMoney } from "../../utilities/money_helpers";

import { ConfirmModal } from "../ConfirmModal";
import { YardSaleSellerLinksModal } from "../Modals/YardSaleSellerLinksModal";

interface Props {
  yardSale: YardSalesInterface;
}

export const CashierForm = ({ yardSale }: Props) => {
  const initialValues = {
    seller: {
      uuid: "",
      name: null,
    },
    price: "",
    description: "",
  };
  const [pendingTransactionItems, setTransactionItems] = useState<
    Array<PendingTransactionItem>
  >(new Array<PendingTransactionItem>());
  const [tender, setTender] = useState("");
  const [changeDue, setChangeDue] = useState("0");
  const [sellers, setSellers] = useState(null);
  const focusRef = useRef<Input>();
  const router = useRouter();
  const onSubmit = () => {
    console.log("Submitted");
    sendAlert("Submitted");
  };
  const {
    sellerLinks,
    transactionItems: historicalTransactionItems,
    getAllYardSaleSellerLinks,
    createYardSaleTransaction,
    getAllYardSaleTransactions,
    setSelectedYardSale,
  } = useYardsales();
  const {
    values: formValues,
    setValues: setFormValues,
    handleChange,
    handleSubmit,
  } = useForm({ initialValues, onSubmit });

  useEffect(() => {
    // Auto Focus on the first input field for better UX
    if (focusRef) {
      focusRef?.current?.focus();
      focusRef?.current?.select();
    }
  }, []);

  const cancel = () => {
    setFormValues(initialValues);
    setTransactionItems([]);
    setSelectedYardSale(null);
    router.push("/yardsales");
  };

  const resetModal = () => {
    setTransactionItems([]);
    setFormValues(initialValues);
  };

  const postTransaction = async () => {
    pendingTransactionItems.forEach(async (item: PendingTransactionItem) => {
      await createYardSaleTransaction(yardSale.uuid, item);
    });
  };
  const { sendAlert, sendError, sendInfo } = useAlert();

  const save = async () => {
    // console.log('Full Transaction: ', transactionItems)
    await postTransaction();
    sendAlert("Transaction has been saved.");
    setTransactionItems(new Array<PendingTransactionItem>());
    // setFormValues(initialValues);
    setTimeout(async () => {
      await getAllYardSaleTransactions(yardSale.uuid);
    }, 500);
    focusRef.current.focus();
    focusRef.current.select();
  };

  const saveAndClose = async () => {
    // console.log('Full Transaction: ', transactionItems)
    await postTransaction();
    sendAlert("Transaction has been saved.");
    setTransactionItems(new Array<PendingTransactionItem>());
    setFormValues(initialValues);
    setSelectedYardSale(null);
    router.push("/yardsales");
  };

  const addItem = () => {
    setTransactionItems([
      ...pendingTransactionItems,
      {
        id: pendingTransactionItems.length,
        seller: {
          uuid: formValues.seller.uuid,
          name: formValues.seller.name,
        },
        price: fromMoney(formValues.price),
        description: formValues.description,
      },
    ]),
      setFormValues({ ...formValues, description: "", price: "" });
    focusRef.current.focus();
    focusRef.current.select();
  };

  const calculateRunningTotal = () => {
    return toMoney(
      pendingTransactionItems.reduce(
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

  const removeTransactionItem = (itemToBeDeleted: PendingTransactionItem) => {
    setTransactionItems(
      pendingTransactionItems.filter((item: PendingTransactionItem) => item.id != itemToBeDeleted.id),
    );
    setTender("0");
  };

  const duplicateTransactionItem = (item) => {
    let newItem = { ...item };
    newItem.id = pendingTransactionItems.length;
    setTransactionItems([...pendingTransactionItems, newItem]);
    setTender("0");
  };

  useEffect(() => {
    calculateChangeDue();
  }, [tender]);

  // if (sellerLinks.length === 0) {
  //   return (
  //     <Segment textAlign="center">
  //       <Header as="h2">Link Sellers to this Yard Sale</Header>
  //       <YardSaleSellerLinksModal yardSale={yardSale} />
  //     </Segment>
  //   );
  // }

  return (
    <>
      <Segment>
        <Grid centered>
          <Grid.Row columns={2}>
            <Grid.Column mobile={15} computer={8}>
              <Form warning={sellerLinks.length === 0}>
                <Grid.Row>
                  <Grid.Column width={15}>
                    <Form.Group>
                      <Form.Field width="7">
                        <label>Price</label>
                        <Input
                          className=""
                          name="price"
                          disabled={sellerLinks.length === 0}
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
                      {/* {JSON.stringify(yardSale)} */}
                      <Form.Field width="8">
                        <label>Select a Seller</label>
                        {sellerLinks && (
                          <Fragment>
                            {sellerLinks.length === 0 ? (
                              <Message warning>
                                You firstly need to link sellers to this Yard
                                Sale
                              </Message>
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
                                options={sellerLinks
                                  .filter(
                                    (link) =>
                                      link.seller.is_active === true &&
                                      link.seller.is_deleted === false,
                                  )
                                  .map((link: YardSaleLinks, index: number) => {
                                    return {
                                      key: link.uuid,
                                      text: `${link.seller.initials} (${link.seller.name})`,
                                      content: `${link.seller.initials} (${link.seller.name})`,
                                      value: `${link.seller.uuid}||${link.seller.initials} (${link.seller.name})`,
                                    };
                                  })}
                                onChange={(e, { value }) => {
                                  // console.log('DROPDOWN Value: ', value.split("|"))
                                  // console.log('DROPDOWN TEXT: ', e.target.textContent)
                                  value = String(value);
                                  setFormValues({
                                    ...formValues,
                                    seller: {
                                      uuid: value.split("||")[0],
                                      name: value.split("||")[1],
                                    },
                                  });
                                }}
                              />
                            )}
                          </Fragment>
                        )}
                      </Form.Field>

                      <Form.Field>
                        <div
                          className="flex row align-center"
                          style={{ height: "100%" }}
                        >
                          <YardSaleSellerLinksModal yardSale={yardSale} />
                        </div>
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
                          disabled={sellerLinks.length === 0}
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
                      color="grey"
                      onClick={addItem}
                      disabled={
                        formValues.price == null ||
                        formValues.seller.uuid === null ||
                        sellerLinks.length === 0 || formValues.price === "NaN"
                      }
                    />
                  </Grid.Column>
                </Grid.Row>
              </Form>
            </Grid.Column>
            {pendingTransactionItems && pendingTransactionItems.length > 0 && (
              <Grid.Column
                mobile={16}
                computer={8}
                style={{ height: "30vh", overflowY: "auto" }}
              >
                <Divider content="pending Items" horizontal />
                <Table className="mt0" striped compact basic="very" unstackable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan="5" textAlign="center">
                        <Header size="medium">
                          Total: {calculateRunningTotal()}
                        </Header>
                      </Table.HeaderCell>
                    </Table.Row>
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
                    {pendingTransactionItems && (
                      <Fragment>
                        {pendingTransactionItems.length === 0 && (
                          <Table.Row textAlign="center">
                            <Table.Cell textAlign="center" colSpan="5">
                              No Items in this Transaction
                            </Table.Cell>
                          </Table.Row>
                        )}

                        {pendingTransactionItems.map((item: any, index) => {
                          return (
                            <Table.Row
                              key={`pending-transaction-item-${index}`}
                            >
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
                                    key={item.uuid}
                                    trigger={
                                      <Button
                                        key={`${item.uuid}-`}
                                        icon="trash"
                                        basic
                                        compact
                                        onClick={() =>
                                          removeTransactionItem(item)
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
          {pendingTransactionItems && pendingTransactionItems.length > 0 && (
            <div className="flex-row justify-around  align-center">
              {/* <Header size="large">Total: {calculateRunningTotal()}</Header> */}

              <div className="flex col">
                <Segment size="huge" basic>
                  Collected: &nbsp;
                  <Input
                    name="tender"
                    labelPosition="left"
                    value={tender}
                    onBlur={(e) => {
                      setTender(toMoney(e.target.value));
                    }}
                    icon="dollar"
                    iconPosition="left"
                    onChange={handleTenderChange}
                    input={
                      <input
                        type="text"
                        style={{
                          textAlign: "right",
                          maxWidth: 165,
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                        autoComplete="false"
                      />
                    }
                  />
                </Segment>
              </div>
              <div className="flex col">
                <Label size="huge" tag>
                  Change Due: &nbsp;$&nbsp;
                  {changeDue}
                </Label>
              </div>
            </div>
          )}
        </Grid>

        <Grid stackable centered>
          <Grid.Row columns={3} centered>
            <Grid.Column mobile={10} tablet={5} computer={5}>
              {pendingTransactionItems.length === 0 ? (
                <Button fluid basic onClick={cancel}>
                  Close
                </Button>
              ) : (
                <ConfirmModal
                  triggerType={"button"}
                  buttonProps={{
                    content: "Close",
                    fluid: true,
                    className: "cancel",
                    basic: true,
                  }}
                  header={"Discard Pending Items?"}
                  content={
                    "Are you sure you want to close this transaction? Any pending items will be discarded."
                  }
                  handleConfirm={() => cancel()}
                  handleCancel={() => null}
                />
              )}
            </Grid.Column>

            <Grid.Column mobile={10} tablet={5} computer={5}>
              <Button
                onClick={saveAndClose}
                content="Save and Close"
                disabled={pendingTransactionItems.length == 0}
                fluid
                primary
                basic
                className="save"
              />
            </Grid.Column>
            <Grid.Column mobile={10} tablet={5} computer={5}>
              <Button
                onClick={save}
                content="Save"
                disabled={pendingTransactionItems.length == 0}
                fluid
                primary
                className="save"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  );
};
