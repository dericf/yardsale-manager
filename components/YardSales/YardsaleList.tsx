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
import { useYardsales } from "../../hooks/useYardsales";
import { YardSalesInterface } from "../../types/YardSales";
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
  } = useYardsales();
  const router = useRouter();

  useEffect(() => {
    console.log("Updating YardSales");

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
        <>
          {yardSales
            ?.filter(
              (yardSale: YardSalesInterface) =>
                filter.searchText.length === 0 ||
                yardSale?.name.toLocaleLowerCase().includes(filter.searchText) ||
                yardSale?.company.toLocaleLowerCase().includes(filter.searchText),
            )
            ?.map((yardSale: YardSalesInterface) => (
              <Segment
                key={yardSale?.uuid}
                textAlign="left"
                fluid="true"
                compact
                style={{ border: "0px !important", width: "100%" }}
                // onClick={(e)=> {
                //   setSelectedYardSale(yardSale)
                //   router.push('/yardsales/edit')
                // }}
              >
                <Grid>
                  <Grid.Row>
                    <Grid.Column mobile={8} tablet={8} computer={10}>
                      <Grid.Row verticalAlign="top" className="pb0">
                        <Grid.Column
                          computer={6}
                          mobile={16}
                          verticalAlign="top"
                        >
                          <Card.Content>
                            <Card.Header as="h3" className="mb0">
                              {yardSale?.name}
                            </Card.Header>
                            <Card.Meta as="h6">{yardSale?.company}</Card.Meta>
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
                                      <Fragment key={`line1${index}`}>
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
                            {yardSale?.notes && yardSale?.notes?.length > 1 && (
                              <Card.Description>
                                <strong>Notes: </strong>
                                {String(yardSale?.notes)
                                  .split("\n")
                                  .map((line, index) => (
                                    <Fragment key={`line2${index}`}>
                                      {line} <br />
                                    </Fragment>
                                  ))}
                              </Card.Description>
                            )}
                          </Card.Content>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid.Column>
                    <Grid.Column
                      mobile={8}
                      tablet={8}
                      computer={6}
                      textAlign="right"
                      verticalAlign="middle"
                    >
                      {/* <YardsaleActionCard
                  yardSale={yardSale}
                  setCashierActive={setCashierActive}
                /> */}
                      <Link href="/cashier" as="/cashier">
                        <Button
                          className="my-2"
                          primary
                          onClick={() => {
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
                          className="my-2"
                          secondary
                          onClick={() => {
                            setSelectedYardSale(yardSale);
                          }}
                        >
                          Edit
                        </Button>
                      </Link>
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
                      <YardSaleSellerLinksModal yardSale={yardSale} />
                      <YardSaleTransactionModal yardSale={yardSale} />
                      <Button
                        className="my-2"
                        color="red"
                        basic
                        icon="trash"
                        onClick={async () => {
                          await deleteYardSale(yardSale.uuid);
                          await updateYardSales();
                          router.push("/yardsales");
                        }}
                      ></Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            ))}
        </>
      )}
    </>
  );
};
