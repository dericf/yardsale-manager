import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Label,
  Modal,
  Popup,
  Segment,
  Table,
} from "semantic-ui-react";
import { useIsLoading } from "../../hooks/useIsLoading";
import { useSellers } from "../../hooks/useSeller";
import { useYardsales } from "../../hooks/useYardsales";
import { SellersInterface } from "../../types/Sellers";
import { YardSalesInterface } from "../../types/YardSales";
import { fromMoney, toMoney } from "../../utilities/money_helpers";
import { TransactionTable } from "../Tables/TransactionTable";

interface Props {
  seller: SellersInterface;
}

export const SellerTransactionModal = ({ seller }: Props) => {
  const { quickLoad, setQuickLoad } = useIsLoading();

  const {
    getAllTransactionsForSeller,
    getAllLinksForSeller,
    sellerLinks,
    sellerTransactions,
  } = useSellers();
  const [open, setOpen] = useState(false);

  const cancel = () => {
    closeModal();
  };

  const save = () => {};

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    (async () => {
      if (open === true && seller !== null) {
        setQuickLoad(true);
        await getAllTransactionsForSeller(seller.uuid);
        await getAllLinksForSeller(seller.uuid);
        setQuickLoad(false);
      }
    })();
  }, [open]);

  return (
    <>
      <Popup
        inverted
        content="Transaction History"
        position="top center"
        trigger={
          <Button
            onClick={openModal}
            icon="dollar"
            secondary
            basic
            circular
            tabIndex="-1"
            className="icon list-action-icon"
          ></Button>
        }
      />

      <Modal
        open={open}
        closeIcon={<Icon name="close" onClick={closeModal}></Icon>}
        onClose={closeModal}
        closeOnDimmerClick={true}
        closeOnEscape={true}
        dimmer
        style={{ height: "90vh", width: 500 }}
      >
        <Modal.Header>{`Transactions for ${seller.name}`}</Modal.Header>
        {sellerTransactions && (
          <Modal.Content
            as={Segment}
            basic
            loading={quickLoad}
            style={{ maxHeight: "78vh", overflowY: "auto" }}
          >
            <Divider horizontal content="Seller Summary" className="mt0" />
            {sellerLinks && (
              <Fragment>
                <Table
                  style={{
                    maxWidth: 275,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  className="mt0"
                  striped
                  compact
                  basic="very"
                  unstackable
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="left">
                        Yard Sale
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Total Sales
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Fragment>
                      {sellerLinks.map((link, index) => {
                        return (
                          <Table.Row key={index + 5000}>
                            <Table.Cell textAlign="left">
                              {link.yardsale.name}
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              ${" "}
                              {toMoney(
                                link.yardsale.transactions.reduce(
                                  (accum, currentItem) =>
                                    Number(accum) +
                                    Number(fromMoney(currentItem.price)),
                                  0,
                                ),
                              )}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}

                      {sellerLinks?.length === 0 && (
                        <Table.Row>
                          <Table.Cell textAlign="center" colSpan={2}>
                            No transactions for {seller.name}
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Fragment>
                  </Table.Body>
                </Table>
                <div className="flex row justify-center">
                  <Segment raised compact>
                    {sellerTransactions && sellerTransactions.length > 0 && (
                      <Header textAlign="center" size="medium">
                        {`Grand Total: $ ${toMoney(
                          sellerTransactions.reduce(
                            (accum, currentItem) =>
                              Number(accum) +
                              Number(fromMoney(currentItem.price)),
                            0,
                          ),
                        )}`}
                      </Header>
                    )}
                    {sellerTransactions?.length == 0 && (
                      <Header textAlign="center" size="medium">
                        Grand Total: $ 0.00
                      </Header>
                    )}
                  </Segment>
                </div>
              </Fragment>
            )}

            <Divider horizontal content="All Transaction Items" />

            {sellerTransactions && (
              <Grid centered>
                <Grid.Column mobile={16} computer={10}>
                  <Segment
                    className="rounded p0"
                    basic
                    style={{
                      maxWidth: "600px   ",
                    }}
                  >
                    <Table
                      className="mt0"
                      striped
                      compact
                      basic="very"
                      unstackable
                    >
                      <Table.Header>
                        <Table.Row className="primary">
                          <Table.HeaderCell textAlign="left">
                            Yardsale
                          </Table.HeaderCell>
                          <Table.HeaderCell textAlign="center">
                            Price
                          </Table.HeaderCell>
                          <Table.HeaderCell textAlign="center">
                            Description
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        <Fragment>
                          {sellerTransactions &&
                            sellerTransactions.length === 0 && (
                              <Table.Row textAlign="center">
                                <Table.Cell textAlign="center" colSpan="5">
                                  No transactions for {seller.name}
                                </Table.Cell>
                              </Table.Row>
                            )}

                          {sellerTransactions &&
                            sellerTransactions.map((item, index) => {
                              return (
                                <Table.Row key={index + 10000}>
                                  <Table.Cell textAlign="left">
                                    {item.yardsale.name}
                                  </Table.Cell>
                                  <Table.Cell textAlign="right">
                                    $ {toMoney(item.price)}
                                  </Table.Cell>
                                  <Table.Cell textAlign="left">
                                    {item.description}
                                  </Table.Cell>
                                </Table.Row>
                              );
                            })}
                        </Fragment>
                      </Table.Body>
                    </Table>
                  </Segment>
                </Grid.Column>
              </Grid>
            )}

            <Divider></Divider>
          </Modal.Content>
        )}

        {/* <Modal.Actions>
          <Grid centered>
            <Grid.Row columns={1} textAlign="center">
              <Grid.Column width={6} textAlign="center">
                <Button fluid onClick={closeModal} negative>
                  Close
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions> */}
      </Modal>
    </>
  );
};
