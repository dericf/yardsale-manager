import moment from "moment";
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
import { useIsLoading } from "../../hooks/useIsLoading";
import { useYardsales } from "../../hooks/useYardsales";
import { YardSalesInterface } from "../../types/YardSales";
import { dateFormat } from "../../utilities/date_helpers";
import { ConfirmModal } from "../ConfirmModal";
import { YardSaleSellerLinksModal } from "../Modals/YardSaleSellerLinksModal";
import { YardSaleTransactionModal } from "../Modals/YardSaleTransactionModal";
import { YardSaleFilterForm } from "./YardSaleFilterForm";

interface Props {}

export const YardSaleList = () => {
  // TODO: (Future) make this more responsive. Add more than just two widths
  const {
    yardSales,
    filter,
    updateYardSales,
    deleteYardSale,
    setSelectedYardSale,
    getAllYardSaleTransactions,
  } = useYardsales();
  const router = useRouter();
  const { sendError, sendAlert } = useAlert();
  const { quickLoad, setQuickLoad } = useIsLoading();
  useEffect(() => {
    (async () => {
      await updateYardSales();
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
          <YardSaleFilterForm />
        </Grid.Column>
        <Grid.Column
          mobile={8}
          tablet={8}
          computer={6}
          textAlign="right"
          className="mobile-my8 pr0"
        >
          {/* <YardsaleDetailsM`odal /> */}
        </Grid.Column>
      </Grid.Row>
      {yardSales && yardSales?.length == 0 && <div>No Yard Sales</div>}
      {yardSales && yardSales?.length > 0 && (
        <div style={{ overflowY: "auto", height: "65vh" }}>
          {yardSales
            ?.filter(
              (yardSale: YardSalesInterface) =>
                filter.searchText.length === 0 ||
                yardSale?.name
                  .toLocaleLowerCase()
                  .includes(filter.searchText) ||
                yardSale?.company
                  .toLocaleLowerCase()
                  .includes(filter.searchText),
            )
            ?.map((yardSale: YardSalesInterface, index: number) => (
              <>
                <Segment
                  key={yardSale?.uuid}
                  textAlign="left"
                  fluid
                  compact
                  style={{
                    border: "0px !important",
                    width: "100%",
                    marginBottom: "2rem",
                  }}

                  // onClick={(e)=> {
                  //   setSelectedYardSale(yardSale)
                  //   router.push('/yardsales/edit')
                  // }}
                >
                  <Grid>
                    <Grid.Row>
                      <Grid.Column mobile={8} tablet={12} computer={12}>
                        <Grid.Row verticalAlign="top" className="pb0">
                          <Grid.Column
                            computer={6}
                            mobile={16}
                            verticalAlign="top"
                          >
                            <Card.Content>
                              <Card.Header as="h3" style={{ marginBottom: 0 }}>
                                {yardSale?.name}
                              </Card.Header>
                              <Card.Meta>
                                {yardSale?.company && (
                                  <span>{yardSale?.company}</span>
                                )}
                              </Card.Meta>

                              {/* <Card.Header as="h5" className="m0"><strong>Status:</strong> {(yardSale?.is_active === true) && (<Icon name="genderless" title="Active" className="active-icon" color="green"></Icon>)}{(yardSale?.is_active === false) && (<Icon name="genderless" color="red" title="Inactive" className="deactivated-icon"></Icon>)}</Card.Header> */}
                            </Card.Content>
                          </Grid.Column>
                        </Grid.Row>

                        {(yardSale?.notes?.length > 0 ||
                          yardSale?.address_text?.length > 0) && (
                          <Divider className="my0 m0" fitted></Divider>
                        )}
                        <Grid.Row className="py0">
                          <Grid.Column computer={10} mobile={16}>
                            <Card.Content>
                              {yardSale?.address_text &&
                                yardSale?.address_text.length > 1 && (
                                  <Card.Description>
                                    {String(yardSale?.address_text)
                                      .split("\n")
                                      .map((line, index) => (
                                        <Fragment key={`${index}address`}>
                                          {line} <br />
                                        </Fragment>
                                      ))}
                                  </Card.Description>
                                )}
                            </Card.Content>
                          </Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="pt0">
                          <Grid.Column computer={10} mobile={16}>
                            <Card.Content>
                              {yardSale.notes && yardSale.notes.length > 1 && (
                                <Segment>
                                  <Card.Description>
                                    <strong>Notes: </strong> <br />
                                    {String(yardSale.notes)
                                      .split("\n")
                                      .map((line, index) => (
                                        <Fragment key={`${index}notes`}>
                                          {line} <br />
                                        </Fragment>
                                      ))}
                                  </Card.Description>
                                </Segment>
                              )}
                            </Card.Content>
                          </Grid.Column>
                        </Grid.Row>
                        <Divider></Divider>
                        <Grid.Row className="pt0">
                          <Grid.Column computer={10} mobile={16}>
                            <Card.Content>
                              Created:&nbsp;
                              <strong>{dateFormat(yardSale.created_at)}</strong>
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
                        {/* <YardsaleActionCard
                  yardSale={yardSale}
                  setCashierActive={setCashierActive}
                /> */}
                        <div className="flex col align-stretch">
                          <div
                            className="flex row justify-between"
                            style={{ margin: ".75rem" }}
                          >
                            <Link href="/cashier" as="/cashier">
                              <Button
                                fluid
                                className="my-2"
                                primary
                                onClick={() => {
                                  setQuickLoad(true);
                                  setSelectedYardSale(yardSale);
                                }}
                              >
                                Cashier
                              </Button>
                            </Link>
                            <Link
                              href="/yardsales/edit"
                              as="/yardsales/edit"
                              scroll={true}
                            >
                              <Button
                                fluid
                                className="my-2"
                                secondary
                                onClick={() => {
                                  setQuickLoad(true);
                                  setSelectedYardSale(yardSale);
                                }}
                              >
                                Edit
                              </Button>
                            </Link>
                          </div>
                          {/* <Link
                        href="/yardsales/seller-links"
                        as="/yardsales/seller-links"
                        scroll={true}
                      >
                        <Button
                          className="my-2"
                          secondary
                          basic
                          onClick={() => {
                            setSelectedYardSale(yardSale);
                          }}
                        >
                          Sellers
                        </Button>
                      </Link> */}
                          <div
                            className="flex row justify-around"
                            style={{ margin: ".75rem" }}
                          >
                            <YardSaleSellerLinksModal yardSale={yardSale} />
                            <YardSaleTransactionModal yardSale={yardSale} />
                            <ConfirmModal
                              buttonProps={{
                                negative: true,
                                circular: true,
                                basic: true,
                                icon: "trash",
                              }}
                              header="Confirm Delete"
                              content={
                                "Are you sure you want to delete this Yard Sale?"
                              }
                              handleConfirm={async () => {
                                const response = await getAllYardSaleTransactions(
                                  yardSale.uuid,
                                );
                                if (response?.data?.length > 0) {
                                  sendError(
                                    "Cannot delete Yard Sale that has active transactions.",
                                  );
                                } else {
                                  await deleteYardSale(yardSale.uuid);
                                  await updateYardSales();
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
              </>
            ))}
        </div>
      )}
    </>
  );
};
