import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom';
import {
    Header,
    Icon,
    Menu,
    Responsive,
    Button,
    Grid
} from 'semantic-ui-react'


import YardsaleDetailsModal from '../modals/YardsaleDetailsModal/YardsaleDetailsModal'
import YardsaleTransactionsModal from '../modals/YardsaleTransactionsModal/YardsaleTransactionsModal'
import YardsaleSellerModal from '../modals/YardsaleSellerModal/YardsaleSellerModal'
import CashierModal from '../modals/CashierModal/CashierModal'
import ConfirmModal from '../modals/generic/ConfirmModal'

import { notify } from 'react-notify-toast';
import { DELETE_YARDSALE } from '../../graphql/mutations'
import { GET_YARDSALES } from '../../graphql/queries'
import { useMutation } from '@apollo/react-hooks'

const YardsaleActions = ({ yardsale }) => {

    const [deleteYardsaleMutation, { loading: deleteYardsaleLoading, error: deleteYardsaleError }] = useMutation(DELETE_YARDSALE, {

    })

    const confirmDeactivateYardsale = () => {
        deleteYardsaleMutation({
            variables: {
                yardsaleUUID: yardsale.uuid
            },
            refetchQueries: [{
                query: GET_YARDSALES
            }]
        })
    }

    const cashierMode = () => {

    }

    return (
        <Fragment>
            <Grid>
                <Grid.Row className="py0">
                    <Grid.Column computer={8} mobile={16} style={{ paddingTop: 14 }}>
                        <CashierModal iconLabel="New Sale" yardsale={yardsale} />
                    </Grid.Column>

                    <Grid.Column computer={8} mobile={16} style={{ paddingTop: 14 }}>
                        <YardsaleDetailsModal edit={true} yardsale={yardsale} iconLabel="Edit Details" ></YardsaleDetailsModal>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="py0">
                    <Grid.Column computer={8} mobile={16} style={{ paddingTop: 14 }}>
                        {/* <Button color="green" fluid ><Icon name="dollar"></Icon> Transaction History</Button> */}
                        <YardsaleSellerModal yardsale={yardsale} iconLabel="Sellers" />
                    </Grid.Column>
                    <Grid.Column computer={8} mobile={16} style={{ paddingTop: 14 }}>
                        {/* <Button color="green" fluid ><Icon name="dollar"></Icon> Transaction History</Button> */}
                        <YardsaleTransactionsModal yardsale={yardsale} iconLabel="History" />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="py0">
                    <Grid.Column computer={16} mobile={16} style={{ paddingTop: 14 }}>
                        <ConfirmModal
                            buttonProps={{ icon: "trash", content: "Remove", fluid: true, negative: true }}
                            handleConfirm={() => {
                                confirmDeactivateYardsale()
                            }}
                            handleCancel={() => console.log('cancel')}
                            header="Confirm Delete"
                            content={`Proceed deleting ${yardsale.name}?`}
                            warningMessage={"Warning! This action cannot be undone! Proceed with caution."}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Fragment>
    )
}

export default withRouter(YardsaleActions)