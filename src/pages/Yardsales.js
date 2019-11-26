import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Link, withRouter } from 'react-router-dom';

import {
    Divider,
    Grid,
    Header,
    Segment
} from "semantic-ui-react";

import { NAVBAR_HEIGHT } from '../constants'

import { yardsales as YardsalesData, yardsales } from '../FakeData'

import YardsalesFilterForm from '../components/YardsaleFilterForm/YardsaleFilterForm'
import YardsaleDetailsModal from '../components/modals/YardsaleDetailsModal/YardsaleDetailsModal'
import YardsaleCard from '../components/cards/YardsaleCard/YardsaleCard'
import YardsaleActions from '../components/YardsaleActionCard/YardsaleActionCard'
import { FakeDataContext } from '../App'

const Yardsales = ({ setTitle }) => {
    let { fakeData, setFakeData } = React.useContext(FakeDataContext)
    const [filter, setFilter] = useState({
        searchText: "",
        status: "active"
    })

    useEffect(() => {
        setTitle('Yardsales')
    }, [])

    return (
        <Segment style={{ padding: "16px 24px", border: 'none' }} >
            <Grid columns={2}>
                <Grid.Row className="pb0">
                    {/* First Grid.Row (Filters/Buttons) */}
                    <Grid.Column verticalAlign="middle" width={10}>
                        {/* Radio Buttons + Search Field */}
                        <YardsalesFilterForm
                            filter={filter}
                            setFilter={setFilter}
                            autofocus={true}
                        />
                    </Grid.Column>
                    <Grid.Column width={6} textAlign="right">
                        <YardsaleDetailsModal />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row className="pb0 pt0">
                    {/* Second Grid.Row (Dividers with headings) */}
                    <Grid.Column width={10}>
                        <Divider horizontal={true}>{`${filter.status} Yardsales`}</Divider>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Divider horizontal={true} content="Actions"></Divider>
                    </Grid.Column>
                </Grid.Row>



                {/* Yardsales List */}

                {fakeData.user.yardsales.filter(yardsale => {
                    return (filter.status === 'all') || (yardsale.status === filter.status)
                }).map(yardsale => {
                    if (filter.searchText != '') {
                        if (!(String(yardsale.name).toLowerCase().includes(filter.searchText))) {
                            return (<Fragment>{JSON.stringify(yardsale)}</Fragment>)
                        }
                    }

                    return (
                        <Fragment>
                            {/* Third Grid.Row (Card/Actions) */}
                            <Grid.Row key={yardsale.id}>
                                <Grid.Column width={10} verticalAlign="middle" style={{ height: "100%" }}>

                                    {/* Card */}
                                    <Fragment>
                                        <YardsaleCard
                                            yardsale={yardsale}
                                            filterValue={filter.status}
                                        ></YardsaleCard>

                                    </Fragment>

                                </Grid.Column>

                                <Grid.Column width={6} verticalAlign="top">
                                    {/* Actions */}
                                    <YardsaleActions yardsale={yardsale} />
                                </Grid.Column>
                            </Grid.Row>
                            {yardsales.length > 1 && (<Divider></Divider>)}
                        </Fragment>
                    )
                })}

            </Grid>
        </Segment>
    )
}

export default withRouter(Yardsales)

/*
Components:
    <YardsaleFilters>
    <NewYardsaleModal>
    ...Form
    <
    <YardsaleList>
        {yardsales.map(yardsale =>
            <YardsaleCard>
            <YarsaleActions>
        )}
*/