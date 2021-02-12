import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Icon,
  Label,
  Modal,
  Popup,
  Segment,
  Table,
} from "semantic-ui-react";
import { useIsLoading } from "../../hooks/useIsLoading";
import { useYardsales } from "../../hooks/useYardsales";
import { YardSalesInterface } from "../../types/YardSales";
import { fromMoney, toMoney } from "../../utilities/money_helpers";
import { TransactionTable } from "../Tables/TransactionTable";

interface Props {
  yardSale: YardSalesInterface;
}

export const YardSaleTransactionModal = ({ yardSale }: Props) => {
  const {quickLoad, setQuickLoad} = useIsLoading()

  const {
    sellerLinks,
    transactionItems,
    getAllYardSaleTransactions,
    getAllYardSaleSellerLinks,
    clearSelectedYardSale,
    deleteTransactionItem,
  } = useYardsales();
  const [open, setOpen] = useState(false);

  const cancel = () => {
    closeModal();
  };

  const save = () => {};

  const closeModal = () => {
    clearSelectedYardSale();
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    console.log("Modal Loaded");
    (async () => {
      console.log("Async");
      if (open === true && yardSale !== null) {
        setQuickLoad(true)
        await getAllYardSaleTransactions(yardSale.uuid);
        await getAllYardSaleSellerLinks(yardSale.uuid);
        setQuickLoad(false)
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
        dimmer="none"
        style={{ height: "90vh", width: 500 }}
      >
        <Modal.Header>{`Transactions for ${yardSale.name}`}</Modal.Header>
        {transactionItems && (
          <Modal.Content as={Segment} basic loading={quickLoad} style={{ maxHeight: "78vh", overflowY: "auto" }}>
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
                        Seller
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Total Sales
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Fragment>
                      {sellerLinks?.map((link) => {
                        return (
                          <Table.Row key={link.uuid}>
                            <Table.Cell textAlign="left">
                              {link.seller.name} ({link.seller.initials}){" "}
                              {link.seller.is_deleted === true && (
                                <strong> - *Seller Removed*</strong>
                              )}
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              ${" "}
                              {toMoney(
                                link.seller.transactions.reduce(
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
                            No transactions
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Fragment>
                  </Table.Body>
                </Table>
                {transactionItems && transactionItems.length > 0 && (
                  <Container textAlign="center">
                    <Label
                      style={{ width: 275 }}
                      size="large"
                      content={`Grand Total: $ ${toMoney(
                        transactionItems.reduce(
                          (accum, currentItem) =>
                            Number(accum) +
                            Number(fromMoney(currentItem.price)),
                          0,
                        ),
                      )}`}
                    />

                    {transactionItems?.length == 0 && (
                      <Label size="large" content={`Grand Total: $ 0.00`} />
                    )}
                  </Container>
                )}
              </Fragment>
            )}

            <Divider></Divider>
            <Divider horizontal content="All Transaction Items" />

            {transactionItems && (
              <Fragment>
                <TransactionTable yardSale={yardSale}></TransactionTable>
              </Fragment>
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
