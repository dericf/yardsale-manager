import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Icon,
  Label,
  Modal,
  Popup,
  Segment,
  Table,
} from "semantic-ui-react";
import { useAlert } from "../../hooks/useAlert";
import { useIsLoading } from "../../hooks/useIsLoading";
import { useSellers } from "../../hooks/useSeller";
import { useYardsales } from "../../hooks/useYardsales";
import { SellersInterface } from "../../types/Sellers";
import { YardSalesInterface } from "../../types/YardSales";
import { fromMoney, toMoney } from "../../utilities/money_helpers";

interface Props {
  yardSale: YardSalesInterface;
  openOnLoad?: boolean;
}

export const YardSaleSellerLinksModal = ({
  yardSale,
  openOnLoad = false,
}: Props) => {
  const [open, setOpen] = useState(openOnLoad);
  const { sendError, sendAlert } = useAlert();
  const { sellers, updateSellers } = useSellers();
  const router = useRouter();

  const {
    sellerLinks,
    transactionItems,
    getAllYardSaleTransactions,
    getAllYardSaleSellerLinks,
    createYardSaleSellerLink,
    deleteYardSaleSellerLink,
    getSellersCanBeAdded,
    getAllTransactionsForSellerOnYardSale,
  } = useYardsales();
  const { quickLoad, setQuickLoad } = useIsLoading();

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
    setQuickLoad(true);
    console.log("YardSale Seller Links Modal Loaded");
    (async () => {
      console.log("Async");
      if (open === true && yardSale !== null) {
        await updateSellers();
        await getAllYardSaleSellerLinks(yardSale?.uuid);
        setQuickLoad(false);
      }
    })();
  }, [open]);

  return (
    <>
      <Popup
        inverted
        content="Linked Sellers"
        position="top center"
        trigger={
          <Button
            onClick={openModal}
            icon="user"
            secondary
            basic
            circular
            tabIndex="-1"
            className="icon"
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
        <Modal.Content scrolling as={Segment} basic loading={quickLoad}>
          <Divider horizontal content="Sellers Linked to this Yardsale" />
          <Table className="mt0" striped compact basic="very" unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={8} textAlign="left">
                  Seller
                </Table.HeaderCell>
                <Table.HeaderCell width={8} textAlign="right">
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <>
                {sellerLinks?.length === 0 && (
                  <Table.Row textAlign="center">
                    <Table.Cell textAlign="center" colSpan="2">
                      No Sellers for this Yardsale
                    </Table.Cell>
                  </Table.Row>
                )}

                {sellerLinks?.map((link, index) => (
                  <Table.Row key={index + 10000}>
                    <Table.Cell textAlign="left">
                      {link.seller.name} ({link.seller.initials}){" "}
                      {link.seller.is_deleted === true && (
                        <strong> - *Seller Was Removed From System*</strong>
                      )}
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Popup
                        inverted
                        position="top right"
                        content={`Remove ${link.seller.initials} From this Yardsale`}
                        trigger={
                          <Button
                            icon="trash"
                            negative
                            basic
                            circular
                            onClick={async (e) => {
                              const {
                                data: transactionsResponse,
                              } = await getAllTransactionsForSellerOnYardSale(
                                link.yardsale_uuid,
                                link.seller.uuid,
                              );
                              if (
                                transactionsResponse?.transaction?.length > 0
                              ) {
                                sendError(
                                  "Cannot delete a seller that has linked historical transactions.",
                                );
                                return { data: {} };
                              } else {
                                sendAlert(
                                  `Success! ${link.seller.initials} was unlinked from ${yardSale.name}`,
                                );
                                await deleteYardSaleSellerLink(link.uuid);
                                await getAllYardSaleSellerLinks(yardSale.uuid);
                              }
                            }}
                          />
                        }
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </>
            </Table.Body>
          </Table>
          <Divider></Divider>
          <Divider horizontal content="All Other Sellers" />
          <Table
            className="mt0"
            color="orange"
            striped
            compact
            basic="very"
            unstackable
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={8} textAlign="left">
                  Seller
                </Table.HeaderCell>
                <Table.HeaderCell width={8} textAlign="right">
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <>
                {sellerLinks?.length === sellers?.length && (
                  <Table.Row textAlign="center">
                    <Table.Cell textAlign="center" colSpan="2">
                      All sellers have been accounted for.
                    </Table.Cell>
                  </Table.Row>
                )}

                {sellers?.length === 0 && (
                  <Table.Row textAlign="center">
                    <Table.Cell textAlign="center" colSpan="2">
                      No sellers in the system.
                    </Table.Cell>
                  </Table.Row>
                )}

                {getSellersCanBeAdded(sellers, sellerLinks)
                  .filter((seller) => seller.is_deleted === false)
                  .map((seller: SellersInterface, index) => {
                    return (
                      <Table.Row key={index + 1000}>
                        <Table.Cell width={8} textAlign="left">
                          {seller.name} ({seller.initials})
                        </Table.Cell>
                        <Table.Cell width={8} textAlign="right">
                          <Popup
                            inverted
                            position="top right"
                            content={`Add ${seller.initials} to this Yardsale`}
                            trigger={
                              <Button
                                icon="add"
                                basic
                                circular
                                primary
                                onClick={async (e) => {
                                  await createYardSaleSellerLink(
                                    seller.uuid,
                                    yardSale?.uuid,
                                  );
                                  await getAllYardSaleSellerLinks(
                                    yardSale.uuid,
                                  );
                                }}
                              />
                            }
                          />
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
              </>
            </Table.Body>
          </Table>
        </Modal.Content>
      </Modal>
    </>
  );
};
