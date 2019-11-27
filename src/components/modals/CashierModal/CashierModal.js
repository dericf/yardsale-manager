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
    Dropdown,
    Table,
    Segment
} from 'semantic-ui-react'

import { notify } from 'react-notify-toast';

import { FakeDataContext } from '../../../App'
import { user, sellers } from '../../../FakeData';
import { toMoney } from '../../../utils/formating'

import ConfirmModal from "../generic/ConfirmModal"
import { GET_SELLERS } from '../../../graphql/queries'
import { useQuery } from '@apollo/react-hooks';


const YardsaleDetailsModal = ({ yardsale = null, autofocus = true, ...props }) => {
    let { fakeData, setFakeData } = React.useContext(FakeDataContext)
    const [open, setOpen] = useState(false)

    const [transactionItems, setTransactionItems] = useState([])

    const [tender, setTender] = useState(null)

    const [changeDue, setChangeDue] = useState(0)

    const focusRef = useRef()
    useEffect(() => {
        if (open === true && autofocus === true) {
            focusRef.current.focus()
            focusRef.current.select()
        }
    }, [open])

    const initialFormValues = {
        sellerID: null,
        price: null,
        description: ""
    }

    const [formValues, setFormValues] = useState(initialFormValues)

    const { loading: sellersLoading, error: sellersError, data: sellersData } = useQuery(GET_SELLERS, {
        onError: () => console.log('ERROR WITH QUERY'),
        onCompleted: (data) => {
            console.log('SELLER DATA: ', data)
        }
    })

    const handleInputChange = (event, { value }) => {
        console.log('Handle Input CHange: ', event, value)
        // TODO: Move this to a hook
        const target = event.target;
        const val = value ? value : (target.type === 'checkbox' ? target.checked : target.value)
        const name = target.name;

        setFormValues({
            ...formValues,
            [name]: val
        });
    }

    const cancel = () => {
        setFormValues(initialFormValues)
        close()
    }

    const save = () => {
        // get the list of yardsales
        notify.show('Transaction has been saved.', 'success')
        close()
    }

    const close = () => {
        setOpen(false)
    }

    const openModal = () => {
        setOpen(true)
    }

    //[{ id: 1, text: "", value: "" }]

    const addItem = () => {
        console.log('FV: ', formValues, sellers)
        let seller = sellers.find(seller => seller.id === 1)
        setTransactionItems(
            transactionItems.concat([{
                id: transactionItems.length + 1,
                seller: {
                    id: seller.id,
                    initials: seller.initials,
                    name: seller.name
                },
                price: Number(formValues.price),
                description: formValues.description
            }])
        )
        // setFormValues(initialFormValues)
        focusRef.current.focus()
        focusRef.current.select()
    }

    const calculateRunningTotal = () => {
        return toMoney(transactionItems.reduce((accum, currentItem) => (Number(accum) + Number(currentItem.price)), 0))
    }

    const calculateChangeDue = () => {
        console.log('Tender: ', tender)
        if (tender != null && tender > 0) {
            setChangeDue(toMoney(Number(tender) - Number(calculateRunningTotal())))
        } else {
            setChangeDue(toMoney(0))
        }
    }

    const handleTenderChange = (e) => {
        setTender(e.target.value)
    }

    const removeTransactionItem = (id) => {
        setTransactionItems(transactionItems.filter(item => item.id != id))
        setTender(0)
    }

    const duplicateTransactionItem = (item) => {
        let newItem = { ...item }
        newItem.id = transactionItems.length + 1
        setTransactionItems(transactionItems.concat([newItem]))
        setTender(0)
    }

    const unknownSeller = [{
        key: 0,
        text: "Unknown Seller",
        value: 0
    }]

    useEffect(() => {
        calculateChangeDue()
    }, [tender])

    return (
        <Fragment>

            <Button fluid color="brown" fluid onClick={openModal} >
                <Icon name="add"></Icon>{props.iconLabel}
            </Button>
            <Modal
                open={open}
                closeIcon={<Icon name="close" onClick={close}></Icon>}
                closeOnDimmerClick={false}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                dimmer="inverted"
            >
                <Modal.Header>New Sale</Modal.Header>
                <Modal.Content scrolling>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column mobile={16} computer={8}>
                                <Form>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Form.Group >
                                                <Form.Field width="5">
                                                    <label>Price</label>
                                                    <Input
                                                        name="price"
                                                        value={formValues.price}
                                                        onChange={handleInputChange}
                                                        ref={focusRef}
                                                        icon="dollar"
                                                        iconPosition="left"
                                                        onBlur={(e) => setFormValues({ ...formValues, price: toMoney(e.target.value) })}
                                                    />

                                                </Form.Field >

                                                <Form.Field width="12">
                                                    <label>Select a Seller</label>
                                                    {!sellersLoading && sellersData && sellersData.seller && (

                                                        < Dropdown
                                                            placeholder='Select a Seller'
                                                            openOnFocus={true}
                                                            name="sellerID"
                                                            fluid
                                                            selection
                                                            icon="user outline"
                                                            labeled
                                                            floating
                                                            button
                                                            options={(sellersData.seller.filter(seller => seller.is_active === true).map(seller => {
                                                                return {
                                                                    key: seller.uuid,
                                                                    text: `${seller.initials} (${seller.name})`,
                                                                    value: seller.uuid,
                                                                }
                                                            })).concat(unknownSeller)}
                                                            onChange={handleInputChange}
                                                            className="icon"

                                                        />
                                                    )}
                                                </Form.Field >
                                            </Form.Group>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Form.Group>
                                                <Form.Field width="16">
                                                    <label>Description</label>
                                                    <Input
                                                        placeholder='Item Description'
                                                        name="description"
                                                        value={formValues.description}
                                                        onChange={handleInputChange}
                                                        icon="file alternate outline"
                                                        iconPosition="left"
                                                    />
                                                </Form.Field>
                                            </Form.Group>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className="py16">
                                        <Grid.Column>
                                            <Button
                                                fluid
                                                onClick={save}
                                                positive
                                                icon="add"
                                                content="Add Item to Transaction"
                                                onClick={addItem}
                                                disabled={formValues.price == null}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Form>
                            </Grid.Column>

                            <Grid.Column mobile={16} computer={8}>
                                <Divider content="pending Items" horizontal />
                                <Table className="mt0" striped compact celled unstackable inverted color="grey">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell textAlign="center">Seller</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="center">Price</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="center">Description</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="center">Duplicate</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="center">Remove</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body >
                                        <Fragment>
                                            {/* <Highlight >
                                                    {JSON.stringify(invoice, null, 2)}
                                                </Highlight> */}

                                            {transactionItems.length === 0 && (
                                                <Table.Row textAlign="center">
                                                    <Table.Cell textAlign="center" colSpan="5">
                                                        No Items in this Transaction
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}

                                            {transactionItems.map(item => {
                                                return (
                                                    <Table.Row key={item.id}>
                                                        <Table.Cell textAlign="center">{item.seller.initials}</Table.Cell>
                                                        <Table.Cell textAlign="right">$ {toMoney(item.price)}</Table.Cell>
                                                        <Table.Cell textAlign="left">{item.description}</Table.Cell>
                                                        <Table.Cell textAlign="center">
                                                            <Button tabIndex={-1} compact color="blue" icon="add" onClick={() => duplicateTransactionItem(item)}></Button>
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="center">
                                                            <Button tabIndex={-1} compact color="red" icon="close" onClick={() => (removeTransactionItem(item.id))}></Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                        </Fragment>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                        <Divider className="px0" content="Transaction Totals" horizontal />
                        <Grid.Row className="py16 mb16 mx16 mt0" columns={3} as={Segment} raised color="grey" tertiary compact>
                            <Grid.Column>
                                <Form >
                                    <Form.Group>
                                        <Form.Field width="10">
                                            <label>Total:</label>
                                            <Input
                                                type="text"
                                                icon="dollar"
                                                iconPosition="left"
                                                tabIndex={-1}
                                                value={calculateRunningTotal()} />
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            </Grid.Column>

                            <Grid.Column>
                                <Form >
                                    <Form.Group>
                                        <Form.Field width="10">
                                            <label>Tender: </label>
                                            <Input
                                                name="tender"
                                                icon="money alternate outline"
                                                iconPosition="left"
                                                value={tender}
                                                onBlur={(e) => { setTender(toMoney(e.target.value)) }}
                                                onChange={handleTenderChange}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            </Grid.Column>

                            <Grid.Column>
                                <Form >
                                    <Form.Group>
                                        <Form.Field width="10">
                                            <label>Change Due:</label>
                                            <Input
                                                type="text"
                                                icon="dollar"
                                                iconPosition="left"
                                                tabIndex={-1}
                                                value={changeDue} />
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>

                <Modal.Actions>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>

                                <ConfirmModal
                                    triggerType={"button"}
                                    buttonProps={{ content: "Cancel", fluid: true, negative: true }}
                                    header={"Confirm"}
                                    content={"Are you sure you want to cancel this transaction?"}
                                    handleConfirm={() => (cancel())}
                                    handleCancel={() => (null)}
                                />
                            </Grid.Column>

                            <Grid.Column>
                                <Button
                                    fluid
                                    onClick={save}
                                    positive
                                    content="Save Transaction"
                                    disabled={transactionItems.length == 0}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
            {/* <Responsive as={Fragment} minWidth={768} >
                // Desktop Items
            </Responsive>
            
            <Responsive as={Fragment} maxWidth={768} >
                // Mobile Items
            </Responsive> */}
        </Fragment>
    )
}

export default withRouter(YardsaleDetailsModal)


