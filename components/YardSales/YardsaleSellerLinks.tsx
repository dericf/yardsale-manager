import { create } from "domain";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
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
  Table,
  Popup,
  Segment,
} from "semantic-ui-react";
import { useHasura } from "../../hooks/useHasura";
import { useSellers } from "../../hooks/useSeller";
import { useYardsales } from "../../hooks/useYardsales";
import { SellersInterface } from "../../types/Sellers";

export const YardSaleSellerLinks = () => {
  const {
    selectedYardSale,
    sellerLinks,
    createYardSaleSellerLink,
    deleteYardSaleSellerLink,
    getAllYardSaleSellerLinks,
    getSellersCanBeAdded,
  } = useYardsales();
  const { sellers, updateSellers } = useSellers();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      console.log("SEL YADDSA");
      console.log(selectedYardSale);
      if (!selectedYardSale || selectedYardSale === null) {
        router.push("/yardsales");
      } else {
        await updateSellers();
        await getAllYardSaleSellerLinks(selectedYardSale?.uuid);
      }
    })();
  }, []);

  return (
    <>
      <Segment>
        <Grid>
          <Grid.Column textAlign="right">
            {/* <SellerDetailsModal iconLabel="New Seller"></SellerDetailsModal> */}
          </Grid.Column>
        </Grid>
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
                            await deleteYardSaleSellerLink(link.uuid)
                            router.push("/yardsales/seller-links")
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
        <>
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
                                    selectedYardSale?.uuid,
                                  );
                                  router.push("/yardsales/seller-links");
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
        </>
      </Segment>
    </>
  );
};
