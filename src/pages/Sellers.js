import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link, withRouter } from "react-router-dom";

import { Divider, Grid, Header, Segment, Container } from "semantic-ui-react";

import { NAVBAR_HEIGHT } from "../constants";

import SellersFilterForm from "../components/SellersFilterForm";
import SellerDetailsModal from "../components/modals/SellerDetailsModal/SellerDetailsModal";
import SellerCard from "../components/cards/SellerCard/SellerCard";
import SellerActions from "../components/SellerActionCard/SellerActionCard";

import { GET_SELLERS } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../components/layout/Loading";

const Sellers = ({ setTitle }) => {
  const [filterValue, setFilterValue] = useState("all");
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    setTitle("Sellers");
  }, []);

  const { loading, error, data: sellerData } = useQuery(GET_SELLERS, {
    onError: () => console.log("ERROR WITH QUERY"),

    onCompleted: data => {
      if (data == null || typeof data == "undefined") {
        return false;
      }
      // setFetchUser(false)
      // client.writeData({ user: data["user"][0] })
      return true;
    }
  });

  const getFilteredSellersForSeller = (seller, searchVal) => {
    return (
      searchVal === "" ||
      (searchVal !== "" &&
        (String(seller.name)
          .toLowerCase()
          .includes(searchVal.toLowerCase()) ||
          String(seller.initials)
            .toLowerCase()
            .includes(searchVal.toLowerCase()) ||
          String(seller.company)
            .toLowerCase()
            .includes(searchVal.toLowerCase())))
    );
  };
  return (
    <Fragment>
      <Grid columns={2}>
        <Grid.Row className="pb0">
          {/* First Grid.Row (Filters/Buttons) */}
          <Grid.Column
            verticalAlign="middle"
            mobile={8}
            tablet={8}
            computer={10}
          >
            {/* Radio Buttons + Search Field */}
            <SellersFilterForm
              value={filterValue}
              setValue={setFilterValue}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
              autofocus={true}
            />
          </Grid.Column>
          <Grid.Column
            mobile={8}
            tablet={8}
            computer={6}
            textAlign="right"
            className="mobile-my8"
          >
            <SellerDetailsModal />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row className="pb0 pt0">
          {/* Second Grid.Row (Dividers with headings) */}
          <Grid.Column width={16}>
            <Divider className="my0" horizontal={true}>{`My Sellers`}</Divider>
          </Grid.Column>
        </Grid.Row>

        {/* Sellers List */}
        {loading && <Loading />}
        {/* TODO: This should eventually be re-worked. Not the most efficient way to do it. Perhaps incorporate it into the Query (but this would cause way more requests to the GQL server) */}
        {/* {JSON.stringify(sellerData)} */}
        {!loading &&
          sellerData &&
          sellerData["seller"] &&
          sellerData["seller"]
            .filter(seller => {
              return getFilteredSellersForSeller(seller, searchVal);
            })
            .map(seller => {
              return (
                <Fragment key={seller.uuid}>
                  {/* Third Grid.Row (Card/Actions) */}
                  <Grid.Row centered>
                    <Grid.Column
                      width={12}
                      textAlign="center"
                    >
                      {/* Card */}

                      <SellerCard
                        seller={seller}
                        filterValue={filterValue}
                      ></SellerCard>
                    </Grid.Column>
                  </Grid.Row>
                </Fragment>
              );
            })}
      </Grid>
    </Fragment>
  );
};

export default withRouter(Sellers);
