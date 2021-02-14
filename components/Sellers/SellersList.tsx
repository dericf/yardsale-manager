import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  Component,
  Fragment,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import {
  Card,
  Icon,
  Divider,
  Grid,
  Header,
  Segment,
  Button,
} from "semantic-ui-react";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import { useSellers } from "../../hooks/useSeller";
import { SellersInterface } from "../../types/Sellers";
import { ConfirmModal } from "../ConfirmModal";
import { SellerTransactionModal } from "../Modals/SellerTransactionModal";
import { SellersFilterForm } from "./SellersFilterForm";

interface Props {}

export const SellersList = () => {
  // TODO: (Future) make this more responsive. Add more than just two widths
  const router = useRouter();
  const { sendAlert, sendError } = useAlert();
  const { user } = useAuth();
  const {
    sellers,
    filter,
    updateSellers,
    deleteSeller,
    setSelectedSeller,
    getAllTransactionsForSeller,
    getAllLinksForSeller,
  } = useSellers();

  useEffect(() => {
    (async () => {
      await updateSellers();
    })();
  }, []);

  return (
    <>
      <Grid.Row className="py0">
        {/* First Grid.Row (Filters/Buttons) */}
        <Grid.Column
          verticalAlign="middle"
          mobile={8}
          tablet={8}
          computer={10}
          className="pl0"
        >
          <SellersFilterForm />
        </Grid.Column>
        <Grid.Column
          mobile={8}
          tablet={8}
          computer={6}
          textAlign="right"
          className="mobile-my8 pr0"
        >
          {/* <YardsaleDetailsModal /> */}
        </Grid.Column>
      </Grid.Row>
      <div style={{ overflowY: "auto", height: "65vh" }}>
        {sellers && sellers?.length == 0 && (
          <div className="flex row justify-center">No Sellers</div>
        )}
        {sellers &&
          sellers?.length > 0 &&
          sellers
            ?.filter(
              (seller: SellersInterface) =>
                filter.searchText.length === 0 ||
                seller?.name?.toLowerCase().includes(filter.searchText) ||
                seller?.initials?.toLowerCase().includes(filter.searchText) ||
                seller?.company?.toLowerCase().includes(filter.searchText),
            )
            .map((seller: SellersInterface) => (
              <Segment
                key={seller?.uuid}
                textAlign="left"
                compact
                style={{ border: "0px !important", width: "100%" }}
                // onClick={(e)=> {
                //   setSelectedSeller(seller)
                //   router.push('/yardsales/edit')
                // }}
              >
                <Grid>
                  <Grid.Row>
                    <Grid.Column mobile={8} tablet={12} computer={12}>
                      <Grid.Row verticalAlign="top" className="pb0">
                        <Grid.Column
                          computer={12}
                          tablet={12}
                          mobile={16}
                          verticalAlign="top"
                        >
                          <Card.Content>
                            <Card.Header as="h3" style={{ marginBottom: 0 }}>
                              {seller?.name} &nbsp; ({seller?.initials}){" "}
                            </Card.Header>
                            <Card.Meta>
                              {seller?.company && (
                                <span>{seller?.company}</span>
                              )}
                            </Card.Meta>
                          </Card.Content>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row className="py0">
                        <Grid.Column computer={12} tablet={12} mobile={16}>
                          <Card.Content>
                            <Card.Content>
                              {seller.phone && (
                                <Card.Description>
                                  <strong>Phone: </strong>
                                  {seller.phone}
                                </Card.Description>
                              )}
                              {seller.email && (
                                <Card.Description>
                                  <strong>Email: </strong>
                                  {seller.email}
                                </Card.Description>
                              )}
                              {seller.notes && seller.notes.length > 1 && (
                                <Segment>
                                  <Card.Description>
                                    <strong>Notes: </strong> <br />
                                    {String(seller.notes)
                                      .split("\n")
                                      .map((line) => (
                                        <Fragment key={line}>
                                          {line} <br />
                                        </Fragment>
                                      ))}
                                  </Card.Description>
                                </Segment>
                              )}
                            </Card.Content>
                          </Card.Content>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid.Column>
                    <Grid.Column
                      mobile={8}
                      tablet={4}
                      computer={4}
                      textAlign="right"
                      verticalAlign="middle"
                    >
                      <div className="flex col align-stretch wrap">
                        <div
                          className="flex row justify-between"
                          style={{ margin: ".75rem" }}
                        >
                          <Link
                            href="/sellers/edit"
                            as="/sellers/edit"
                            scroll={true}
                          >
                            <Button
                              className="my-2"
                              secondary
                              fluid
                              onClick={() => {
                                setSelectedSeller(seller);
                              }}
                            >
                              Edit
                            </Button>
                          </Link>
                        </div>
                        <div
                          className="flex row justify-around"
                          style={{ margin: ".75rem" }}
                        >
                          <SellerTransactionModal seller={seller} />
                          {/* <Button
                              className="my-2"
                              color="red"
                              basic
                              style={{ marginLeft: 16 }}
                              icon="trash"
                              circular
                              onClick={async () => {
                                router.push("/sellers");
                              }}
                            ></Button> */}

                          <ConfirmModal
                            buttonProps={{
                              negative: true,
                              circular: true,
                              basic: true,
                              icon: "trash",
                            }}
                            header="Confirm Delete"
                            content={
                              "Are you sure you want to delete this Seller?"
                            }
                            handleConfirm={async () => {
                              const activeTransactions = await getAllTransactionsForSeller(
                                seller.uuid,
                              );
                              const activeLinks = await getAllLinksForSeller(
                                seller.uuid,
                              );
                              if (activeLinks?.data?.length > 0) {
                                sendError(
                                  `Cannot delete ${seller.name} because they are linked to ${activeLinks.data.length} Yard Sale(s).`,
                                );
                              }
                              if (activeTransactions?.data?.length > 0) {
                                sendError(
                                  `Cannot delete ${seller.name} because there are ${activeTransactions.data.length} Active Transaction(s).`,
                                );
                              }
                              if (
                                activeTransactions?.data?.length === 0 &&
                                activeLinks?.data?.length === 0
                              ) {
                                // await deleteSeller(seller.uuid);
                                // await updateSellers();

                                // router.push("/yardsales");
                                sendAlert(
                                  "Success! Yard Sale has been deleted",
                                );
                              }
                            }}
                          />
                        </div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            ))}
      </div>
    </>
  );
};
