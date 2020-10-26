import React, { Component, useState, Fragment } from "react";
import {
  Grid,
  Dropdown,
  Header,
  Button,
  Card,
  Segment
} from "semantic-ui-react";
import { BASE_URL } from "../../constants";

const MarketSearch = ({ myPosition, currentMarker, setCurrentMarker, ...props }) => {
  const [state, setState] = useState({
    isFetching: false,
    multiple: true,
    search: true,
    searchQuery: null,
    value: null,
    publicYardsales: []
  });
  const searchFunction = (options, query) => {
    // const re = new RegExp(_.escapeRegExp(query))
    // return options.filter((opt) => re.test(opt.text))
    return options;
  };
  

  const handleChange = (e, { value }) => {
    // TODO: this should set a market for the selected Yardsale and open up the info window.
    setState({ ...state, value });
    setCurrentMarker({
        lat: () => Number(value.pos_lat),
        lng: () => Number(value.pos_lng),
        infoWindow:
            <Segment>
                This is just a test window
            </Segment>
    })
  };
  const handleSearchChange = (e, { searchQuery }) => {
    fetchOptions();
    setState({ ...state });
  };

  const fetchOptions = () => {
    setState({ ...state, isFetching: true });
    fetchFilteredYardsales();
    setState({ ...state, isFetching: false });
  };

  //   const { multiple, options, isFetching, search, value } = state;

  return (
    <Fragment>
      <Dropdown
        fluid
        selection
        search={searchFunction}
        options={state.options}
        value={state.value}
        placeholder="Search Yardsales"
        onChange={handleChange}
        onSearchChange={handleSearchChange}
        disabled={state.isFetching}
        loading={state.isFetching}
        simple
      />
      {/* <Header>State</Header> */}
      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
    </Fragment>
  );
};

export default MarketSearch;
