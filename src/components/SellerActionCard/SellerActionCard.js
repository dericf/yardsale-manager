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


import SellerDetailsModal from '../modals/SellerDetailsModal/SellerDetailsModal'
import ConfirmModal from '../modals/generic/ConfirmModal'

import { notify } from 'react-notify-toast';

// Apollo/GQL
// import { useMutation, useQuery } from '@apollo/react-hooks';

import { GET_SELLERS } from '../../graphql/queries'
import { DELETE_SELLER } from '../../graphql/mutations'
import { useMutation } from '@apollo/react-hooks'

const SellerActions = ({ seller }) => {

    const [deleteSellerMutation, { loading: deleteSellerLoading, error: deleteSellerError }] = useMutation(DELETE_SELLER, {
        variables: {
            sellerUUID: seller.uuid
        },
        refetchQueries: [{
            query: GET_SELLERS
        }]
    })

    const confirmDeactivateSeller = () => {
        deleteSellerMutation()
    }
    return (
        <Fragment>
            {/* // Desktop Items */}
            <Grid>
                <Grid.Row className="py0">
                    <Grid.Column computer={8} mobile={16} style={{ paddingTop: 14 }}>
                        <SellerDetailsModal edit={true} seller={seller} iconLabel="Edit Details" ></SellerDetailsModal>
                    </Grid.Column>
                    <Grid.Column computer={8} mobile={16} style={{ paddingTop: 14 }}>
                        <Button color="green" fluid ><Icon name="dollar"></Icon> Transactions</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={16} mobile={16}>
                        {seller.status != 'inactive' && <ConfirmModal
                            buttonProps={{ icon: "trash", content: "Remove", fluid: true, negative: true }}
                            disabled={seller.is_user_link}
                            handleConfirm={() => {
                                ///HERE
                                confirmDeactivateSeller()
                            }}
                            handleCancel={() => console.log('cancel')}
                            header="Confirm Delete"
                            content={`Proceed deactivating ${seller.name}?`}
                            warningMessage={"Warning! This action cannot be undone! Proceed with caution."}
                            disabledMessage={"This seller cannot be deleted. It is directly linked to the user."}
                        />}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Fragment>
    )
}

export default withRouter(SellerActions)