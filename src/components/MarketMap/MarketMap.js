import React, { useEffect, useState, Fragment, useContext } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";

import { GET_YARDSALES } from "../../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { Segment } from "semantic-ui-react";

import YardsaleCard from "../cards/YardsaleCard/YardsaleCard";
import { BASE_URL } from "../../constants";
import { AppContext } from "../../App";

// import useGoogleMap from "./useGoogleMap";

const Map = ({ currentMarker, setCurrentMarker, ...props }) => {
  // const { loading, error, publicYardsales } = useQuery(GET_YARDSALES, {
  //   onError: () => console.log("ERROR WITH QUERY")
  // });
  const { app, setAp } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [selectedYardsale, setSelectedYardsale] = useState(null);
  const myPosition = JSON.parse(localStorage.getItem("myPosition"));

  const [publicYardsales, setPublicYardsales] = useState(null);

  useEffect(() => {
    window
      .fetch(`${BASE_URL}/api/market/get-all-public-yardsales/0/1`, {
        method: "GET",
      })
      .then((response) => response.json())
      .then((json) => {
        setLoading(false);
        console.log("All Public Yardsales: ", json);
      })
      .catch((e) => {
        console.log("Error: 4411", e);
        setLoading(false);
      });
  }, []);

  return (
    <Fragment>
      {/* {JSON.stringify(publicYardsales)} */}
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{
          lat: myPosition.lat || 45.421532,
          lng: myPosition.lng || -75.697189,
        }}
        onClick={(e) => {
          console.log("Current Marker: ", e.latLng);
          setCurrentMarker(e.latLng);
        }}
      >
        {app.market &&
          app.market.yardsales &&
          app.market.yardsales.map((yardsale) => (
            <Marker
              key={yardsale.uuid}
              position={{ lat: yardsale.pos_lat, lng: yardsale.pos_lng }}
            />
          ))}
        {publicYardsales &&
          publicYardsales.yardsale &&
          publicYardsales.yardsale.map((ys) => {
            if (ys.pos_lat !== "" && ys.pos_lng !== null && ys.is_public) {
              return (
                <Marker
                  key={ys.uuid}
                  position={{ lat: Number(ys.pos_lat), lng: ys.pos_lng }}
                  onClick={() => {
                    setSelectedYardsale(ys);
                  }}
                />
              );
            }
          })}
        {currentMarker && currentMarker.infoWindow && (
          <InfoWindow
            position={{
              lat: Number(currentMarker.lat()),
              lng: Number(currentMarker.lng()),
            }}
            children={currentMarker.infoWindow}
          ></InfoWindow>
        )}

        {selectedYardsale && (
          <InfoWindow
            position={{
              lat: Number(selectedYardsale.pos_lat),
              lng: selectedYardsale.pos_lng,
            }}
            onCloseClick={() => setSelectedYardsale(null)}
          >
            <YardsaleCard yardsale={selectedYardsale} />
          </InfoWindow>
        )}
      </GoogleMap>
      {/* {!loading && (
                
            )} */}
      {loading && <Segment loading fluid="true"></Segment>}
    </Fragment>
  );
};

const WrappedMap = withScriptjs(
  withGoogleMap((props) => {
    return <Map {...props} />;
  }),
);

export default function MarketMap({
  center,
  zoom,
  children,
  events,
  currentMarker,
  setCurrentMarker,
}) {
  //   const { maps, map, mapRef, loading } = useGoogleMap({ zoom, center, events });

  return (
    <WrappedMap
      id="example-map"
      currentMarker={currentMarker}
      setCurrentMarker={setCurrentMarker}
      googleMapURL={
        "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAY7t1gPBy8BDhwzHWWcvwBNic828A-RHA"
      }
      loadingElement={
        <div className="loading" style={{ height: "100%" }}></div>
      }
      containerElement={<div style={{ height: "100%" }}></div>}
      mapElement={<div style={{ height: "100%" }}></div>}
    ></WrappedMap>
  );
}
