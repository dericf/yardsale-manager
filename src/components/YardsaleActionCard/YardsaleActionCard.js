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
import CashierModal from '../modals/CashierModal/CashierModal'
import ConfirmModal from '../modals/generic/ConfirmModal'

import { notify } from 'react-notify-toast';
import { FakeDataContext } from '../../App'

// Apollo/GQL
// import { useMutation, useQuery } from '@apollo/react-hooks';

// import { GET_CLIENTS } from '../gql/queries'
// import { DEACTIVATE_CLIENT } from '../gql/mutations'

const YardsaleActions = ({ yardsale }) => {
    let { fakeData, setFakeData } = React.useContext(FakeDataContext)

    const confirmDeactivateYardsale = () => {

        let newData = {
            ...fakeData,
            user: {
                ...fakeData.user,
                yardsales: { ...fakeData.user.yardsales }
            }
        }
        console.log('New Data: ', newData)
        setFakeData(newData)
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
                    <Grid.Column computer={16} mobile={16} style={{ paddingTop: 14 }}>
                        <Button color="green" fluid ><Icon name="dollar"></Icon> Transaction History</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="py0">
                    <Grid.Column computer={16} mobile={16} style={{ paddingTop: 14 }}>
                        {yardsale.status != 'inactive' && <ConfirmModal
                            edit={true}
                            yardsale={yardsale}
                            iconName="trash"
                            iconLabel="Deactivate Yardsale"
                            trigger={() => (<Button icon="trash" content="Remove" fluid negative />)}
                            handleConfirm={() => {
                                ///HERE
                                confirmDeactivateYardsale()
                            }}
                            handleCancel={() => console.log('cancel')}
                            header="Confirm Deactivation"
                            content={`Proceed deactivating ${yardsale.name}?`}
                        />}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Fragment>
    )
}

export default withRouter(YardsaleActions)