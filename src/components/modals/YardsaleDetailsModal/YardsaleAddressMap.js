import React, { useEffect, useState, Fragment, useRef } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";

import { useQuery } from "@apollo/react-hooks";
import { Segment } from "semantic-ui-react";

import { BASE_URL } from "../../../constants";

import Geocode from "react-geocode";

import Autocomplete from "react-google-autocomplete";

const {
  StandaloneSearchBox
} = require("react-google-maps/lib/components/places/StandaloneSearchBox");

const Map = ({
  yardsaleLocation,
  setYardsaleLocation,
  formValues,
  setFormValues,
  yardsale = null,
  ...props
}) => {
  const onPlaceSelected = place => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      //   city = this.getCity(addressArray),
      //   area = this.getArea(addressArray),
      //   state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    // this.setState({
    //   address: address ? address : "",
    //   area: area ? area : "",
    //   city: city ? city : "",
    //   state: state ? state : "",
    //   markerPosition: {
    //     lat: latValue,
    //     lng: lngValue
    //   },
    //   mapPosition: {
    //     lat: latValue,
    //     lng: lngValue
    //   }
    // });
    setCurrentMarker({
      lat: latValue,
      lng: lngValue
    });
    console.log("PLACES CHANGED: ", address);
  };
  // const { loading, error, publicYardsales } = useQuery(GET_YARDSALES, {
  //   onError: () => console.log("ERROR WITH QUERY")
  // });
  const searchBoxRef = useRef();
  const [loading, setLoading] = useState(true);
  const [selectedYardsale, setSelectedYardsale] = useState(null);
  const myPosition = JSON.parse(localStorage.getItem("myPosition"));
  const [currentMarker, setCurrentMarker] = useState(
    yardsale
      ? {
          lat: () => yardsale.pos_lat,
          lng: () => yardsale.pos_lng
        }
      : null
  );
  // console.log("PROPSPSSSS: ", props);

  useEffect(() => {
    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
  }, []);

  const findResult = (results, name) => {
    console.log(
      "Results: ",
      results,
      name,
      Array(results.types).includes(name)
    );
    Array(results).forEach(component => {
      if (component.types.includes(name)) {
        return component.short_name;
      } else {
        return "";
      }
    });
    // let result = _.find(results, function(obj) {
    //   return obj.types[0] == name && obj.types[1] == "political";
    // });
    // return result ? result.short_name : null;
  };
  return (
    <Fragment>
      <Segment>
        {/* <Autocomplete
          style={{
            width: "100%",
            height: "40px",
            paddingLeft: "16px",
            marginTop: "2px",
            marginBottom: "100px"
          }}
          onPlaceSelected={onPlaceSelected}
          key={"AIzaSyAY7t1gPBy8BDhwzHWWcvwBNic828A-RHA"}
        /> */}
      </Segment>
      {/* {JSON.stringify(publicYardsales)} */}
      <Segment style={{ marginTop: 100 }}>
        {/* {JSON.stringify(myPosition)} */}
        <div data-standalone-searchbox="">
          {/* <StandaloneSearchBox
            onPlacesChanged={onPlaceSelected}
            ref={searchBoxRef}
          >
            <input
              type="text"
              placeholder="Customized your placeholder"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`
              }}
            />
          </StandaloneSearchBox> */}
        </div>
        {JSON.stringify(currentMarker)}
        <br />
        {JSON.stringify(yardsaleLocation)}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Segment>
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{
          lat: myPosition ? myPosition.lat : 45.421532,
          lng: myPosition ? myPosition.lng : -75.697189
        }}
        onClick={e => {
          console.log("Current Marker: ", e.latLng);

          Geocode.setApiKey("AIzaSyBgIaIfdl6IvaA8rwfwX97lI0AL_aWkRpM");

          // set response language. Defaults to english.
          Geocode.setLanguage("en");

          // set response region. Its optional.
          // A Geocoding request with region=es (Spain) will return the Spanish city.
          Geocode.setRegion("ca");

          // Enable or disable logs. Its optional.
          Geocode.enableDebug();
          Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
            response => {
              const address = response.results[0].formatted_address;
              let results = response.results[0].address_components;
              let city = findResult(results, "locality");
              let state = findResult(results, "administrative_area_level_1");
              let country = findResult(results, "country");
              console.log("ADddress from geocode: ", response.results[0]);
              console.log("ADddress from geocode: ", city, state, country);
              {
                /* console.log("ADddress from geocode: ", address); */
              }
              setYardsaleLocation({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                address: address
              });

              setCurrentMarker(e.latLng);
              setFormValues({
                ...formValues,
                yardsaleAddress:
                  formValues.address_text && formValues.address_text.length > 0
                    ? formValues.address_text
                    : address,
                addressObj: {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                  address_text: address
                }
              });
            },
            error => {
              console.error(error);
            }
          );
        }}
      >
        {currentMarker && (
          <Marker
            key={"1000"}
            position={{ lat: currentMarker.lat(), lng: currentMarker.lng() }}
          />
        )}
      </GoogleMap>
      {/* {!loading && (
                
            )} */}
      {/* {loading && <Segment loading fluid></Segment>} */}
    </Fragment>
  );
};

const WrappedMap = withScriptjs(
  withGoogleMap(props => {
    return <Map {...props} />;
  })
);

const YardsaleAddressMap = ({
  center,
  zoom,
  children,
  events,
  yardsaleLocation,
  setYardsaleLocation,
  formValues,
  setFormValues,
  yardsale
}) => {
  //   const { maps, map, mapRef, loading } = useGoogleMap({ zoom, center, events });
  // const WrappedMap = withScriptjs(withGoogleMap(<Map center={center} zoom={zoom} children={children} events={events} />));
  return (
    <WrappedMap
      id="example-map"
      testProp={"TESTING"}
      yardsaleLocation={yardsaleLocation}
      setYardsaleLocation={setYardsaleLocation}
      formValues={formValues}
      setFormValues={setFormValues}
      yardsale={yardsale}
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
};

export default YardsaleAddressMap;
