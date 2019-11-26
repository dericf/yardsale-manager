import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Link, withRouter } from 'react-router-dom';

import {
    Divider,
    Grid,
    Header,
    Segment
} from "semantic-ui-react";

import { NAVBAR_HEIGHT } from '../constants'

import { sellers as SellersData } from '../FakeData'

import SellersFilterForm from '../components/SellersFilterForm'
import SellerDetailsModal from '../components/modals/SellerDetailsModal/SellerDetailsModal'
import SellerCard from '../components/cards/SellerCard/SellerCard'
import SellerActions from '../components/SellerActionCard/SellerActionCard'
import { FakeDataContext } from '../App'

import { GET_SELLERS } from '../graphql/queries'
import { useQuery } from '@apollo/react-hooks';

const Sellers = ({ setTitle }) => {
    let { fakeData, setFakeData } = React.useContext(FakeDataContext)
    const [filterValue, setFilterValue] = useState('active');
    const [searchVal, setSearchVal] = useState('')

    useEffect(() => {
        setTitle('Sellers')
    }, [])


    const { loading, error, data: sellerData } = useQuery(GET_SELLERS, {
        onError: () => console.log('ERROR WITH QUERY'),

        onCompleted: (data) => {
            if (data == null || typeof data == 'undefined') {
                return false
            }
            console.log('SELLERS FROM QUERY: ', data)
            // setFetchUser(false)
            // client.writeData({ user: data["user"][0] })
            return true
        }
    })
    return (
        <Segment style={{ padding: "16px 24px", border: 'none' }} >
            <Grid columns={2}>
                <Grid.Row className="pb0">
                    {/* First Grid.Row (Filters/Buttons) */}
                    <Grid.Column verticalAlign="middle" width={10}>
                        {/* Radio Buttons + Search Field */}
                        <SellersFilterForm
                            value={filterValue}
                            setValue={setFilterValue}
                            searchVal={searchVal}
                            setSearchVal={setSearchVal}
                            autofocus={true}
                        />
                    </Grid.Column>
                    <Grid.Column width={6} textAlign="right">
                        <SellerDetailsModal />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row className="pb0 pt0">
                    {/* Second Grid.Row (Dividers with headings) */}
                    <Grid.Column width={10}>
                        <Divider horizontal={true}>{`${filterValue} Sellers`}</Divider>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Divider horizontal={true} content="Actions"></Divider>
                    </Grid.Column>
                </Grid.Row>



                {/* Sellers List */}
                {/* TODO: This should eventually be re-worked. Not the most efficient way to do it. Perhaps incorporate it into the Query (but this would cause way more requests to the GQL server) */}
                {/* {JSON.stringify(sellerData)} */}
                {!loading && sellerData && sellerData["seller"].filter(seller => {
                    return (
                        (searchVal === '') ||
                        (searchVal !== '' && (String(seller.name).toLowerCase().includes(searchVal)))) &&
                        (
                            (filterValue === 'all') ||
                            (filterValue === 'active' && seller.is_active === true) ||
                            (filterValue === 'inactive' && seller.is_active === false)
                        )
                }).map(seller => {
                    return (
                        <Fragment>
                            {/* Third Grid.Row (Card/Actions) */}
                            <Grid.Row key={seller.id}>
                                <Grid.Column width={10} verticalAlign="middle" style={{ height: "100%" }}>

                                    {/* Card */}
                                    <Fragment>
                                        <SellerCard
                                            seller={seller}
                                            filterValue={filterValue}
                                        ></SellerCard>

                                    </Fragment>

                                </Grid.Column>

                                <Grid.Column width={6} verticalAlign="middle">
                                    {/* Actions */}
                                    <SellerActions seller={seller} />
                                </Grid.Column>
                            </Grid.Row>
                            <Divider></Divider>
                        </Fragment>
                    )
                })}

            </Grid>
        </Segment>
    )
}

export default withRouter(Sellers)