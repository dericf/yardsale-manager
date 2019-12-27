import React, { Component, Fragment, useState, useEffect, useRef } from 'react'
import { Link, withRouter } from 'react-router-dom';
import {
    Card,
    Icon,
    Divider,
    Grid,
    Modal,
    Button,
    Form,
    Input,
    TextArea,
    Header,
    Table
} from 'semantic-ui-react'

import { notify } from 'react-notify-toast';

import { useQuery } from '@apollo/react-hooks'
import { UPDATE_SELLER, CREATE_SELLER } from '../../../graphql/mutations'
import { GET_TRANSACTION_ITEMS_FOR_YARDSALE, GET_SELLER_LINKS_FOR_YARDSALE } from '../../../graphql/queries'

import { toMoney, fromMoney } from '../../../utils/formating'

const YardsaleTransactionsModal = ({ yardsale, iconLabel, ...props }) => {
    const [open, setOpen] = useState(false)

    const { loading, error, data } = useQuery(GET_TRANSACTION_ITEMS_FOR_YARDSALE, {
        variables: {
            yardsaleUUID: yardsale.uuid
        },
        onError: () => console.log('ERROR WITH QUERY'),

        onCompleted: (data) => {
            if (data == null || typeof data == 'undefined') {
                return false
            }
            return true
        }
    })


    const { loading: sellerLinksLoading, data: sellerLinksData } = useQuery(GET_SELLER_LINKS_FOR_YARDSALE, {
        variables: {
            yardsaleUUID: yardsale.uuid
        },
        onError: () => console.log('ERROR WITH QUERY'),

        onCompleted: (data) => {
            if (data == null || typeof data == 'undefined') {
                return false
            }
            return true
        }
    })

    const cancel = () => {
        closeModal()
    }

    const save = () => {

    }

    const closeModal = () => {
        setOpen(false)
    }

    const openModal = () => {
        setOpen(true)
    }

    return (
        <Fragment>

            <Button
                fluid
                color="green"
                onClick={openModal}
                icon="dollar"
                content={iconLabel}
            >
            </Button>

            <Modal
                open={open}
                closeIcon={<Icon name="close" onClick={closeModal}></Icon>}
                closeOnDimmerClick={false}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                dimmer="inverted"

            >
                <Modal.Header>{`Transactions for ${yardsale.name}`}</Modal.Header>
                <Modal.Content scrolling>
                    <Divider horizontal content="Seller Summary" />
                    {!sellerLinksLoading && sellerLinksData && sellerLinksData.yardsale_seller_link && (
                        <Table className="mt0" striped compact celled unstackable inverted color="black">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign="center">Seller</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center">Total Sales</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                                <Fragment>
                                    {sellerLinksData.yardsale_seller_link.map(link => {
                                        return (
                                            <Table.Row key={link.uuid}>
                                                <Table.Cell textAlign="center">{link.seller.name} ({link.seller.initials})</Table.Cell>
                                                <Table.Cell textAlign="right">$ {toMoney(link.seller.transactions.reduce((accum, currentItem) => (Number(accum) + Number(fromMoney(currentItem.price))), 0))}</Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Fragment>
                            </Table.Body>
                        </Table>
                    )}

                    <Divider horizontal content="All Transaction Items" />
                    {!loading && data && data.transaction && (
                        <Fragment>
                            <Table className="mt0" striped compact celled unstackable inverted color="grey">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell textAlign="center">Seller</Table.HeaderCell>
                                        <Table.HeaderCell textAlign="center">Price</Table.HeaderCell>
                                        <Table.HeaderCell textAlign="center">Description</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body >
                                    <Fragment>
                                        {/* <Highlight >
                                                {JSON.stringify(invoice, null, 2)}
                                            </Highlight> */}

                                        {data.transaction.length === 0 && (
                                            <Table.Row textAlign="center">
                                                <Table.Cell textAlign="center" colSpan="5">
                                                    No Transactions for this Yardsale
                                                </Table.Cell>
                                            </Table.Row>
                                        )}

                                        {data.transaction.map(item => {
                                            return (
                                                <Table.Row key={item.uuid}>
                                                    <Table.Cell textAlign="center">{item.seller.name} ({item.seller.initials})</Table.Cell>
                                                    <Table.Cell textAlign="right">$ {toMoney(item.price)}</Table.Cell>
                                                    <Table.Cell textAlign="left">{item.description}</Table.Cell>
                                                </Table.Row>
                                            )
                                        })}
                                    </Fragment>
                                </Table.Body>
                            </Table>
                        </Fragment>
                    )}



                </Modal.Content>

                <Modal.Actions>
                    <Grid centered>
                        <Grid.Row columns={1} textAlign="center">
                            <Grid.Column width={4} textAlign="center" >
                                <Button fluid onClick={closeModal} negative>
                                    Close
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        </Fragment>
    )
}

export default withRouter(YardsaleTransactionsModal)


