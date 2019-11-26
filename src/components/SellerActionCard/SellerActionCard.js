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
import { FakeDataContext } from '../../App'

// Apollo/GQL
// import { useMutation, useQuery } from '@apollo/react-hooks';

// import { GET_CLIENTS } from '../gql/queries'
// import { DEACTIVATE_CLIENT } from '../gql/mutations'

const SellerActions = ({ seller }) => {
    let { fakeData, setFakeData } = React.useContext(FakeDataContext)

    const confirmDeactivateSeller = () => {

        let newData = {
            ...fakeData,
            user: {
                ...fakeData.user,
                sellers: [
                    ...fakeData.user.sellers.filter(flaggedSeller => (seller.id != flaggedSeller.id))
                ],
                yardsales: { ...fakeData.user.yardsales }
            }
        }
        console.log('New Data: ', newData)
        setFakeData(newData)
    }
    return (
        <Fragment>
            {/* // Desktop Items */}
            <Grid>
                <Grid.Row className="py0">
                    <Grid.Column computer={8} mobile={16} style={{ paddingTop: 14 }}>
                        <SellerDetailsModal edit={true} seller={seller} iconLabel="Edit Seller Details" ></SellerDetailsModal>
                    </Grid.Column>
                    <Grid.Column computer={8} mobile={16} style={{ paddingTop: 14 }}>
                        <Button color="green" fluid ><Icon name="dollar"></Icon> Seller Billing</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={16} mobile={16}>
                        {seller.status != 'inactive' && <ConfirmModal
                            edit={true}
                            seller={seller}
                            iconName="trash"
                            iconLabel="Deactivate Seller"
                            trigger={() => (<Button icon="trash" content="Remove" fluid negative />)}
                            handleConfirm={() => {
                                ///HERE
                                confirmDeactivateSeller()
                            }}
                            handleCancel={() => console.log('cancel')}
                            header="Confirm Deactivation"
                            content={`Proceed deactivating ${seller.name}?`}
                        />}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Fragment>
    )
}

export default withRouter(SellerActions)