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

import { useQuery, useMutation } from '@apollo/react-hooks'
import { UPDATE_SELLER, CREATE_SELLER, CREATE_YARDSALE_SELLER_LINK, DELETE_YARDSALE_SELLER_LINK } from '../../../graphql/mutations'
import { GET_TRANSACTION_ITEMS_FOR_YARDSALE, GET_SELLER_LINKS_FOR_YARDSALE, GET_SELLERS } from '../../../graphql/queries'

import { toMoney, fromMoney } from '../../../utils/formating'
import SellerDetailsModal from '../SellerDetailsModal/SellerDetailsModal'
import YardsaleDetailsModal from '../YardsaleDetailsModal/YardsaleDetailsModal';

const YardsaleTransactionsModal = ({ yardsale, iconLabel, invertedButton = false, fluidButton = false, caller = 'yardsaleActions', ...props }) => {
    const [open, setOpen] = useState(false)

    const [createYardsaleSellerLink, { error: mutationError, data: mutationData, loading: mutationLoading }] = useMutation(CREATE_YARDSALE_SELLER_LINK)
    const [deleteYardsaleSellerLink, { error: deleteMutationError, data: deleteMutationData, loading: deleteMutationLoading }] = useMutation(DELETE_YARDSALE_SELLER_LINK)

    const { loading, error, data } = useQuery(GET_TRANSACTION_ITEMS_FOR_YARDSALE, {
        variables: {
            yardsaleUUID: yardsale.uuid
        },
        onError: () => console.log('ERROR WITH QUERY'),

        onCompleted: (data) => {
            if (data == null || typeof data == 'undefined') {
                return false
            }
            console.log('TRANSACTION FROM QUERY: ', data["transaction"])
            return true
        }
    })


    const { loading: sellerLinksLoading, data: sellerLinksData } = useQuery(GET_SELLER_LINKS_FOR_YARDSALE, {
        variables: {
            yardsaleUUID: yardsale.uuid
        },
        onError: () => console.log('ERROR WITH SELLER LINKS QUERY')
    })

    const { loading: sellersLoading, data: sellersData } = useQuery(GET_SELLERS, {
        onError: () => console.log('ERROR WITH SELLER QUERY')
    })

    const closeModal = () => {
        setOpen(false)
    }

    const openModal = () => {
        setOpen(true)
    }


    const deleteLink = (link) => {
        console.log('Deleting: ', link)
        createYardsaleSellerLink({
            variables: {
                UUID: link.uuid
            },
            refetchQueries: [
                {
                    query: GET_SELLER_LINKS_FOR_YARDSALE,
                    variables: {
                        yardsaleUUID: yardsale.uuid
                    }
                }
            ]
        })
    }

    const createLink = (seller) => {
        console.log('Creating link for: ', seller)
        createYardsaleSellerLink({
            variables: {
                sellerUUID: seller.uuid,
                yardsaleUUID: yardsale.uuid
            },
            refetchQueries: [
                {
                    query: GET_SELLER_LINKS_FOR_YARDSALE,
                    variables: {
                        yardsaleUUID: yardsale.uuid
                    }
                }
            ]
        })
    }

    const sellersToBeAdded = (all_sellers, existing_seller_links) => {
        // console.log("all sellers: ", all_sellers)
        // console.log("Existing Sellers: ", existing_seller_links)
        const newList = all_sellers.filter((seller) => {
            let linkExists = false
            existing_seller_links.forEach((link) => {
                // console.log('Comparing Sellers:')
                // console.log('link.seller', link.seller.uuid)
                console.log('seller', seller.uuid)
                if (link.seller.uuid === seller.uuid) {
                    console.log('Found Match: ', seller, link.seller)
                    linkExists = true
                }
            })
            return !linkExists
        })
        console.log('newList', newList)
        return newList
    }

    return (
        <Fragment>

            {caller === 'yardsaleActions' && (
                <Button
                    fluid
                    color="orange"
                    onClick={openModal}
                    icon="user"
                    content={iconLabel}
                />

            )}

            {caller === 'cashierModal' && (
                <Button
                    compact
                    size="medium"
                    fluid={fluidButton}
                    inverted={invertedButton}
                    onClick={openModal}
                    content={iconLabel}
                />
            )}

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
                    <SellerDetailsModal iconLabel="New Seller" ></SellerDetailsModal>
                    <Divider horizontal content="Seller Summary" />
                    {!sellerLinksLoading && sellerLinksData && sellerLinksData.yardsale_seller_link && (
                        <Table className="mt0" striped compact celled unstackable inverted color="black">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width={6} textAlign="center">Seller</Table.HeaderCell>
                                    <Table.HeaderCell width={10} textAlign="center">Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                                <Fragment>
                                    {sellerLinksData.yardsale_seller_link.length === 0 && (
                                        <Table.Row textAlign="center">
                                            <Table.Cell textAlign="center" colSpan="5">
                                                No Sellers for this Yardsale
                                            </Table.Cell>
                                        </Table.Row>
                                    )}

                                    {sellerLinksData.yardsale_seller_link.map((link, index) => {
                                        return (
                                            <Table.Row key={index + 10000}>
                                                <Table.Cell textAlign="center">{link.seller.name} ({link.seller.initials})</Table.Cell>
                                                <Table.Cell textAlign="center"> <Button icon="close" negative content={`Remove ${link.seller.initials} From This Yardsale`} onClick={() => deleteLink(link)} /></Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Fragment>
                            </Table.Body>
                        </Table>
                    )}

                    <Divider horizontal content="All Transaction Items" />
                    {!sellerLinksLoading && sellerLinksData && sellerLinksData.yardsale_seller_link && (
                        <Fragment>
                            <Table className="mt0" striped compact celled unstackable inverted color="grey">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={6} textAlign="center">Seller</Table.HeaderCell>
                                        <Table.HeaderCell width={10} textAlign="center">Actions</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body >
                                    <Fragment>
                                        {/* <Highlight >
                                                {JSON.stringify(invoice, null, 2)}
                                            </Highlight> */}

                                        {sellerLinksData.yardsale_seller_link.length === sellersData.seller.length && (
                                            <Table.Row textAlign="center">
                                                <Table.Cell textAlign="center" colSpan="5">
                                                    No Sellers in the System
                                                </Table.Cell>
                                            </Table.Row>
                                        )}

                                        {sellersToBeAdded(sellersData.seller, sellerLinksData.yardsale_seller_link).map((seller, index) => {
                                            return (
                                                <Table.Row key={index + 1000}>
                                                    <Table.Cell width={6} textAlign="center">{seller.name} ({seller.initials})</Table.Cell>
                                                    <Table.Cell width={10} textAlign="center">
                                                        <Button icon="add" positive content={`Add ${seller.initials} to This Yardsale`} onClick={() => createLink(seller)} />
                                                    </Table.Cell>
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


