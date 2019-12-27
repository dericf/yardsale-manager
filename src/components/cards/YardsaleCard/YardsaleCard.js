import React, { Component, Fragment, useState } from 'react'
import { Link, withRouter } from 'react-router-dom';
import {
    Card,
    Icon,
    Divider,
    Grid,
    Header,
    Segment
} from 'semantic-ui-react'

import SellerCard from '../SellerCard/SellerCard'

const YardsaleCard = ({ yardsale, ...props }) => {
    // TODO: (Future) make this more responsive. Add more than just two widths
    const [expandSellers, setExpandSellers] = useState(false)
    if (yardsale) return (
        (<Fragment>
            <Card raised as={Grid} fluid className={`yardsale-card top aligned left justified ${props.inverted ? 'inverted' : ''}`} >
                <Grid.Row verticalAlign="top">
                    <Grid.Column computer={6} mobile={16} verticalAlign="top" >
                        <Card.Content>
                            <Card.Header as="h3" className="mb0">{yardsale.name}</Card.Header>
                            <Card.Meta as="h6" className={`m0 ${props.inverted ? 'inverted' : ''}`}>{yardsale.company}</Card.Meta>
                            <Card.Header as="h5" className="m0"><strong>Status:</strong> {(yardsale.is_active === true) && (<Icon name="genderless" title="Active" className="active-icon" color="green"></Icon>)}{(yardsale.is_active === false) && (<Icon name="genderless" color="red" title="Inactive" className="deactivated-icon"></Icon>)}</Card.Header>
                        </Card.Content>
                    </Grid.Column>

                    <Grid.Column computer={10} mobile={16}>
                        <Card.Content>
                            {yardsale.notes && yardsale.notes.length > 1 && (
                                <Card.Description>
                                    <strong>Notes:</strong> {yardsale.notes}
                                </Card.Description>
                            )}
                        </Card.Content>
                    </Grid.Column>

                </Grid.Row>
                {yardsale.yardsale_seller_links && yardsale.yardsale_seller_links.sellers && yardsale.yardsale_seller_links.sellers.length > 1 && (
                    <Fragment>
                        <Divider horizontal className=""></Divider>
                        <Divider horizontal className="" >Active Sellers <Icon name="user" onClick={() => { setExpandSellers(!expandSellers) }}></Icon></Divider>
                        {expandSellers && (
                            <Segment>
                                {yardsale.yardsale_seller_links.sellers.filter(seller => seller.is_active === true).map(seller => {
                                    return (
                                        <SellerCard seller={seller} />
                                    )
                                })}
                            </Segment>
                        )}
                    </Fragment>
                )}

            </Card>

            {/* <Responsive as={Fragment} minWidth={768} >
                // Desktop Items
            </Responsive>
            
            <Responsive as={Fragment} maxWidth={768} >
                // Mobile Items
            </Responsive> */}
        </Fragment>)
    )
}

export default withRouter(YardsaleCard)


