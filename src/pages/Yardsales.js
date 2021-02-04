import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Link, withRouter } from "react-router-dom";

import { Divider, Grid, Header, Container, Segment } from "semantic-ui-react";

import { NAVBAR_HEIGHT } from "../constants";

import YardsalesFilterForm from "../components/YardsaleFilterForm/YardsaleFilterForm";
import YardsaleDetailsModal from "../components/modals/YardsaleDetailsModal/YardsaleDetailsModal";
import YardsaleCard from "../components/cards/YardsaleCard/YardsaleCard";
import YardsaleActions from "../components/YardsaleActionCard/YardsaleActionCard";

import { GET_YARDSALES, GET_YARDSALES_PREVIEW } from "../graphql/queries";
import { useQuery, useSubscription } from "@apollo/react-hooks";
import CashierModal from "../components/modals/CashierModal/CashierModal";
import Loading from "../components/layout/Loading";
import { SUBSCRIBE_YARDSALES } from "../graphql/subscriptions";
import { AppContext } from "../AppContext";

const Yardsales = ({ setTitle }) => {
  const [filter, setFilter] = useState({
    searchText: "",
    status: "all",
  });

  const [cashierActive, setCashierActive] = useState(null);
  const { app, setApp } = useContext(AppContext);
  const { loading, error, data: yardsaleData } = useQuery(GET_YARDSALES, {
    onError: () => console.log("ERROR WITH QUERY"),
    // onCompleted: (data) => {
    //     console.log('Sub Data: ', data)
    // }
  });

  const handleClick = (yardsale) => {
    console.log("Clicked on card", yardsale);
    setCashierActive(yardsale);
  };

  //   useEffect(() => {
  //     setApp({ ...app, activePage: "yardsales" });
  //   }, []);

  return (
    <Fragment>
      {cashierActive && yardsaleData && yardsaleData.yardsale && (
        <CashierModal
          yardsale={cashierActive}
          autoOpen={true}
          setCashierActive={setCashierActive}
        />
      )}
      <Grid columns={2} centered className="m0 p0">
        <Grid.Row className="py0">
          {/* First Grid.Row (Filters/Buttons) */}
          <Grid.Column
            verticalAlign="middle"
            mobile={8}
            tablet={8}
            computer={10}
            className="pl0"
          >
            {/* Radio Buttons + Search Field */}
            <YardsalesFilterForm
              filter={filter}
              setFilter={setFilter}
              autofocus={true}
            />
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

        <Grid.Row className="pb0 pt0">
          {/* Second Grid.Row (Dividers with headings) */}
          <Grid.Column computer={16}>
            <Divider
              className="my0"
              horizontal={true}
            >{`My Yard Sales`}</Divider>
          </Grid.Column>
          {/* <Grid.Column mobile={8} tablet={7} computer={6}>
                        <Divider horizontal={true} content="Actions"></Divider>
                    </Grid.Column> */}
        </Grid.Row>

        {/* Yardsales List */}
        {loading && <Loading />}
        {!loading &&
          yardsaleData &&
          yardsaleData.yardsale &&
          yardsaleData.yardsale
            .filter((yardsale) => {
              return (
                filter.searchText === "" // ||
                // (filter.searchText !== "" &&
                //   (String(yardsale.name)
                //     .toLowerCase()
                //     .includes(filter.searchText.toLowerCase()) ||
                //     String(yardsale.company)
                //       .toLowerCase()
                //       .includes(filter.searchText.toLowerCase()) ||
                //     String(yardsale.address_text)
                //       .toLowerCase()
                //       .includes(filter.searchText.toLowerCase())) &&
                //   (filter.status === "all" ||
                //     (filter.status === "active" &&
                //       yardsale.is_active === true) ||
                //     (filter.status === "inactive" &&
                //       yardsale.is_active === false)))
              );
            })
            .map((yardsale) => {
              return (
                <Grid.Row key={yardsale.uuid}>
                  <Grid.Column width={12} textAlign="center">
                    {/* Card */}
                    <Fragment>
                      {/* <YardsaleCard
                        yardsale={yardsale}
                        filterValue={filter.status}
                        handleClick={handleClick}
                        setCashierActive={setCashierActive}
                      ></YardsaleCard> */}
                      <p
                        style={{
                          width: "100px",
                          height: "70px",
                          border: "solid 1px #000",
                        }}
                      >
                        Yardsale Card
                      </p>
                    </Fragment>
                  </Grid.Column>

                  {/* <Grid.Column mobile={8} tablet={7} computer={6} verticalAlign="top">
                                <YardsaleActions yardsale={yardsale} />
                            </Grid.Column> */}
                </Grid.Row>
              );
            })}
      </Grid>
    </Fragment>
  );
};

export default withRouter(Yardsales);
