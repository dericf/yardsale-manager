import React, { Fragment, useEffect, useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Segment,
  Grid,
  Divider,
  Loader,
  Dimmer,
  Container,
  Message
} from "semantic-ui-react";

// Map helpers
import Map from "../components/MarketMap/Map";
import Marker from "../components/MarketMap/Marker";
import getPlaces from "../components/MarketMap/utils/GetPlaces";

import MarketMap from "../components/MarketMap/MarketMap";
// Show the map at the top

/*
    <Page Title />
    <Filter/Search />
    <Map />
    <List />

*/

import MarketFilterForm from "../components/MarketFilterForm/MarketFilterForm";
import Loading from "../components/layout/Loading";
import { BASE_URL } from "../constants";
import { AppContext } from "../App";
const Home = ({ setTitle }) => {
  const [filter, setFilter] = useState({
    searchText: "",
    status: "active"
  });
  
  const {app, setApp } = useContext(AppContext)

  const useMyLocationFromStorage = JSON.parse(
    localStorage.getItem("useMyLocation")
  );
  // console.log("Localstorage?", useMyLocationFromStorage);
  const [myLocation, setMyLocation] = useState(
    useMyLocationFromStorage === true ? true : false
  );
  const [myPosition, setMyPosition] = useState({});
  const [loadingMyLocation, setLoadingMyLocation] = useState(false);
  const places = getPlaces();
  const [placeIndex, setPlaceIndex] = useState(0);
  const [bound, setBound] = useState({});

  const [currentMarker, setCurrentMarker] = useState(null);

  var locationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  const locationSuccess = pos => {
    console.log("Success!\nPosition is:  ", pos);
    setLoadingMyLocation(false);
    setMyPosition(pos.coords);
    localStorage.setItem(
      "myPosition",
      JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    );
  };

  useEffect(() => {
    console.log("POSITION STATE: ", myPosition);
  }, [myPosition]);

  const locationError = err => {
    console.log("Error!", err);
  };

  useEffect(() => {
    if (myLocation === true && myPosition == +{}) {
      setMyPosition(navigator.geolocation.getCurrentPosition());
    }

    fetchFilteredYardsales()

  }, []);

  useEffect(() => {
    if (myLocation === true) {
      navigator.geolocation.getCurrentPosition(
        locationSuccess,
        locationError,
        locationOptions
      );
    } else {
      setLoadingMyLocation(false);
    }
  }, [myLocation]);

  const fetchFilteredYardsales = () => {
    //   TODO: Change the url to filtered instead of all
    window
      .fetch(
        `${BASE_URL}/api/market/get-all-public-yardsales/${
          myPosition ? myPosition.lat : 0
        }/${myPosition ? myPosition.lng : 0}`,
        {
          method: "GET"
        }
      )
      .then(response => response.json())
      .then(json => {
        setApp({
          ...app,
          market: {
            publicYardsales: json.yardsales
          }
        });
      })
      .catch(e => {
        console.log("Error: 4433", e);
        setState({ ...state, isFetching: false });
      });
  };

  return (
      <Grid centered stackable>
        <Grid.Row>
          {JSON.stringify(app.market)}
        </Grid.Row>
        <Grid.Row className="py0 mt16 mb0">
          <Grid.Column>
            {myLocation}
            <MarketFilterForm
              filter={filter}
              setFilter={setFilter}
              autofocus={true}
              myLocation={myLocation}
              setMyLocation={setMyLocation}
              loadingMyLocation={loadingMyLocation}
              setLoadingMyLocation={setLoadingMyLocation}
              myPosition={myPosition}
              setMyPosition={setMyPosition}
              currentMarker={currentMarker}
              setCurrentMarker={setCurrentMarker}
            />
          </Grid.Column>
        </Grid.Row>
        {/* <Divider className="mx0 my16" /> */}
        <Grid.Row className="my16 py0" centered>
          <Grid.Column
            style={{ height: "60vh", width: "90vw" }}
            textAlign="center"
          >
            {/* {filter.searchText != "" ? (
                            <Segment
                                inverted
                                raised
                                style={{height: "50vh"}}>
                                <Dimmer active>
                                    <Loader size="large"><p>Searching for Yardsales near <strong>{filter.searchText}</strong></p> <Message content="Note: This feature is still under development."></Message></Loader>
                                </Dimmer>
                            </Segment>
                        ) : 
                         */}

            <MarketMap
              currentMarker={currentMarker}
              setCurrentMarker={setCurrentMarker}
              center={
                myLocation === true && myPosition !== {}
                  ? { lat: myPosition.latitude, lng: myPosition.longitude }
                  : { lat: 45.421532, lng: -75.697189 }
              }
            ></MarketMap>

            {/* {!myLocation && (
                                <MarketMap center={{lat: places[placeIndex].lat, lng: places[placeIndex].lng }}></MarketMap>
                            )} */}

            {/* )} */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
  );
};

export default withRouter(Home);
