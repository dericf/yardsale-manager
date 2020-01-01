import React, { Fragment, useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { Segment, Grid, Divider, Loader, Dimmer, Container, Message } from 'semantic-ui-react';



// Show the map at the top

/*
    <Page Title />
    <Filter/Search />
    <Map />
    <List />

*/

import MarketFilterForm from '../components/MarketFilterForm/MarketFilterForm'
import Loading from '../components/layout/Loading';
const Home = ({ setTitle }) => {
    const [filter, setFilter] = useState({
        searchText: "",
        status: "active"
    })
    const useMyLocationFromStorage = JSON.parse(localStorage.getItem('useMyLocation'))
    console.log('Localstorage?', useMyLocationFromStorage)
    const [myLocation, setMyLocation] = useState( useMyLocationFromStorage === true ? true : false)
    const [loadingMyLocation, setLoadingMyLocation] = useState(false)
    
    var locationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    const locationSuccess = pos => {
        console.log('Success!\nPosition is:  ', pos)
        setLoadingMyLocation(false)
    }

    const locationError = err => {
        console.log('Error!', err)
    }

    useEffect(() => {
        setTitle('Yardsale Market')
    }, [])

    useEffect(() => {
        if (myLocation === true) {
            navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions)        
        } else {
            setLoadingMyLocation(false)
        }
    }, [myLocation])

    return (
        <Container>
            <Grid>
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
                        />
                    </Grid.Column>
                </Grid.Row>
                {/* <Divider className="mx0 my16" /> */}
                <Grid.Row className="my16 py0">
                    <Grid.Column style={{ height: "50vh" }} textAlign="center">
                        {filter.searchText != "" ? (
                            <Segment
                                inverted
                                raised
                                style={{height: "50vh"}}>
                                <Dimmer active>
                                    <Loader size="large"><p>Searching for Yardsales near <strong>{filter.searchText}</strong></p> <Message content="Note: This feature is still under development."></Message></Loader>
                                </Dimmer>
                            </Segment>
                        ) : (
                            <Segment
                                inverted
                                padded
                                raised
                                style={{height: "50vh"}}>
                                    <p>Search for a Yardsale near you!</p>

                                </Segment>
                            )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

export default withRouter(Home)