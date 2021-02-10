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
import { useSellers } from "../../hooks/useSeller";
import { SellersInterface } from "../../types/Sellers";
import { SellersFilterForm } from "./SellersFilterForm";

interface Props {}

export const SellersList = () => {
  // TODO: (Future) make this more responsive. Add more than just two widths
  const router = useRouter();
  const {
    sellers,
    filter,
    updateSellers,
    deleteSeller,
    setSelectedSeller,
  } = useSellers();

  useEffect(() => {
    console.log("YARDSALES: ");
    console.log(sellers);
    console.log("Updating YardSales");
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
          {/* <YardsaleDetailsM`odal /> */}
        </Grid.Column>
      </Grid.Row>
      {sellers && sellers?.length == 0 && <div>No Yard Sales</div>}
      {sellers && sellers?.length > 0 && (
        <>
          {sellers
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
                fluid="true"
                compact
                style={{ border: "0px !important", width: "100%" }}
                // onClick={(e)=> {
                //   setSelectedSeller(seller)
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
                              {seller?.name} &nbsp; ({seller?.initials})
                            </Card.Header>
                            <Card.Meta as="h6">{seller?.company}</Card.Meta>
                            {/* <Card.Header as="h5" className="m0"><strong>Status:</strong> {(seller?.is_active === true) && (<Icon name="genderless" title="Active" className="active-icon" color="green"></Icon>)}{(seller?.is_active === false) && (<Icon name="genderless" color="red" title="Inactive" className="deactivated-icon"></Icon>)}</Card.Header> */}
                          </Card.Content>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row className="py0">
                        <Grid.Column computer={10} mobile={16}>
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
                                <Card.Description>
                                  <strong>Notes: </strong>
                                  {String(seller.notes)
                                    .split("\n")
                                    .map((line) => (
                                      <Fragment>
                                        {line} <br />
                                      </Fragment>
                                    ))}
                                </Card.Description>
                              )}
                            </Card.Content>
                          </Card.Content>
                        </Grid.Column>
                      </Grid.Row>

                      <Grid.Row className="pt0">
                        <Grid.Column computer={10} mobile={16}>
                          <Card.Content>
                            {seller?.notes && seller?.notes?.length > 1 && (
                              <Card.Description>
                                <strong>Notes: </strong>
                                {String(seller?.notes)
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
                  seller={seller}
                  setCashierActive={setCashierActive}
                /> */}
                      <Link href="/transactions" as="/cashier">
                        <Button
                          className="my-2"
                          primary
                          onClick={() => {
                            setSelectedSeller(seller);
                          }}
                        >
                          Transactions
                        </Button>
                      </Link>
                      <Link
                        href="/sellers/edit"
                        as="/sellers/edit"
                        scroll={true}
                      >
                        <Button
                          className="my-2"
                          secondary
                          onClick={() => {
                            setSelectedSeller(seller);
                          }}
                        >
                          Edit
                        </Button>
                      </Link>
                      <Button
                        className="my-2"
                        color="red"
                        basic
                        icon="trash"
                        onClick={async () => {
                          await deleteSeller(seller.uuid);
                          await updateSellers();
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
