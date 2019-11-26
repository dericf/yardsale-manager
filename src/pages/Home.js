import React, { Fragment, useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { Segment, Grid, Divider, Loader, Dimmer } from 'semantic-ui-react';



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
    useEffect(() => {
        setTitle('Marketplace')
    }, [])

    return (
        <Fragment>
            <Grid>
                <Grid.Row className="pb0">
                    <Grid.Column>
                        <MarketFilterForm
                            filter={filter}
                            setFilter={setFilter}
                            autofocus={true}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Divider className="m0" />
                <Grid.Row>
                    <Grid.Column style={{ height: "50vh" }} textAlign="center">
                        {filter.searchText != "" ? (
                            <Segment
                                inverted
                                style={{height: "50vh"}}>
                                <Dimmer active>
                                    <Loader size="large"><p>Searching for <strong>{filter.status}</strong> Yardsales near <strong>{filter.searchText}</strong></p></Loader>
                                </Dimmer>
                            </Segment>
                        ) : (
                            <Segment
                                inverted
                                style={{height: "50vh"}}>
                                    <p>Search for a Yardsale near you!</p>

                                </Segment>
                            )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Fragment>
    )
}

export default withRouter(Home)