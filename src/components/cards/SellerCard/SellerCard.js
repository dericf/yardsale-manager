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

const SellerCard = ({ seller, ...props }) => {
    // TODO: (Future) make this more responsive. Add more than just two widths

    if (seller) return (
        (<Fragment>
            <Card as={Grid} raised fluid className={`seller-card top aligned left justified ${props.inverted ? 'inverted' : ''}`} >
                <Grid.Row verticalAlign="top">
                    <Grid.Column computer={6} mobile={16} verticalAlign="top" >
                        <Card.Content>
                            <Card.Header as="h3" className="mb0">{seller.name}</Card.Header>
                            <Card.Meta as="h6" className={`m0 ${props.inverted ? 'inverted' : ''}`}>{seller.company}</Card.Meta>
                            <Card.Header as="h5" className="m0"><strong>Status:</strong> {(seller.status == 'active') && (<Icon name="genderless" title="Active" className="active-icon" color="green"></Icon>)}{(seller.status == 'inactive') && (<Icon name="genderless" color="red" title="Inactive" className="deactivated-icon"></Icon>)}</Card.Header>
                        </Card.Content>
                    </Grid.Column>

                    <Grid.Column computer={10} mobile={16}>
                        <Card.Content>
                            <Card.Description>
                                <strong>Phone:</strong> {seller.phone || 'None'}
                            </Card.Description>
                            <Card.Description>
                                <strong>Email:</strong> {seller.email || 'None'}
                            </Card.Description>
                            {seller.notes && seller.notes.length > 1 && (
                                <Card.Description>
                                    <strong>Notes:</strong> {seller.notes}
                                </Card.Description>
                            )}
                        </Card.Content>
                    </Grid.Column>

                </Grid.Row>
                {seller.projects && seller.projects.length > 1 && (
                    <Fragment>
                        <Divider horizontal className=""></Divider>
                        <Divider content="Active Yardsales" horizontal className=""></Divider>
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

export default withRouter(SellerCard)


