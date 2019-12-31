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
    Header
} from 'semantic-ui-react'

// import MaskedInput from 'react-input-mask'

import { notify } from 'react-notify-toast';

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_SELLER, CREATE_SELLER } from '../../../graphql/mutations'
import { GET_SELLERS } from '../../../graphql/queries'

const SellerDetailsModal = ({ seller = null, autofocus = true, fluid = false, invertedButton = false, ...props }) => {
    const [open, setOpen] = useState(false)

    const [updateSellerMutation, { data: sellerMutationData, loading: sellerMutationLoading, error: sellerMutationError }] = useMutation(UPDATE_SELLER);
    const [createSellerMutation, { data: createSellerMutationData, loading: createSellerMutationLoading, error: createSellerMutationError }] = useMutation(CREATE_SELLER);

    const sellerNameRef = useRef()
    useEffect(() => {
        if (open === true && autofocus === true) {
            sellerNameRef.current.focus()
        }
    }, [open])

    const initialFormValues = {
        sellerName: seller ? seller.name : '',
        sellerInitials: seller ? seller.initials : '',
        sellerCompany: seller ? seller.company : '',
        sellerPhone: seller ? seller.phone : '',
        sellerEmail: seller ? seller.email : '',
        sellerAddress: seller ? seller.address_text : '',
        sellerNotes: seller ? seller.notes : ''
    }

    const [formValues, setFormValues] = useState(initialFormValues)

    const handleInputChange = (event) => {
        // TODO: Move this to a hook
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormValues({
            ...formValues,
            [name]: value
        });
    }

    const cancel = () => {
        setFormValues(initialFormValues)
        closeModal()
    }

    const save = () => {
        // 
        // This function either creates a new seller (if seller === null)
        // OR updates an existing seller
        //
        if (seller == null || typeof seller == 'undefined') {
            // Create New seller
            createSellerMutation({
                variables: {
                    name: formValues.sellerName,
                    initials: formValues.sellerInitials,
                    company: formValues.sellerCompany,
                    phone: formValues.sellerPhone,
                    email: formValues.sellerEmail,
                    address: formValues.sellerAddress,
                    notes: formValues.sellerNotes,
                },
                onError: (err) => console.log('Error Updating Seller', err),
                refetchQueries: [{
                    query: GET_SELLERS
                }]
            })
            notify.show('Seller Created successfully ', 'success')
        } else {
            // console.log('Editing Existing seller: ', seller.uuid);
            updateSellerMutation({
                variables: {
                    sellerUUID: seller.uuid,
                    name: formValues.sellerName,
                    initials: formValues.sellerInitials,
                    company: formValues.sellerCompany,
                    phone: formValues.sellerPhone,
                    email: formValues.sellerEmail,
                    address: formValues.sellerAddress,
                    notes: formValues.sellerNotes,
                },
                onError: (err) => console.log('Error Updating Seller', err),
                refetchQueries: [{
                    query: GET_SELLERS
                }]
            })
            // console.log(formValues)
            notify.show('Seller Updated successfully ', 'success')
        }
        closeModal()
        // props.history.push('/sellers')
    }

    const closeModal = () => {
        setOpen(false)
    }

    const openModal = () => {
        setOpen(true)
    }

    return (
        <Fragment>

            {props.edit === true ? (
                <Button fluid color="blue" fluid onClick={openModal} >
                    <Icon name="edit" onClick={openModal}></Icon>{props.iconLabel}
                </Button>
            ) : (
                    <Button size="medium" fluid={fluid} inverted={invertedButton} onClick={openModal}>New</Button>
                )}
            <Modal
                open={open}
                closeIcon={<Icon name="close" onClick={closeModal}></Icon>}
                closeOnDimmerClick={false}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                dimmer="inverted"
            >
                <Modal.Header>{seller ? "Edit Seller Details" : "Create New Seller"}</Modal.Header>
                <Modal.Content>

                    <Form onSubmit={save} id="SellerDetailsModal" className="p0 m0" loading={sellerMutationLoading}>
                        <Grid>
                        <Grid.Row className="pb0">
                            <Grid.Column>
                                <Form.Group >
                                    <Form.Field width="7">
                                        <label>Seller Name</label>
                                        <Input
                                            icon="user"
                                            iconPosition="left"
                                            ref={sellerNameRef}
                                            placeholder='Seller Name'
                                            name="sellerName"
                                            value={formValues.sellerName}
                                            onChange={handleInputChange}
                                        />

                                    </Form.Field >
                                    <Form.Field width="2">
                                        <label>Initials</label>
                                        <Input
                                            name="sellerInitials"
                                            value={formValues.sellerInitials}
                                            onChange={handleInputChange}
                                        />

                                    </Form.Field >

                                    <Form.Field width="7">
                                        <label>Company</label>
                                        <Input
                                            icon="building"
                                            iconPosition="left"
                                            placeholder='Company'
                                            name="sellerCompany"
                                            value={formValues.sellerCompany}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Field>


                                </Form.Group>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="pt0 pb0">
                            <Grid.Column>
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <label>Phone</label>
                                        <Input
                                            icon="phone"
                                            iconPosition="left"
                                            placeholder='Phone'
                                            type="tel"
                                            name="sellerPhone"
                                            value={formValues.sellerPhone}
                                            onChange={handleInputChange}
                                        >
                                        </Input>
                                    </Form.Field>


                                    <Form.Field>
                                        <label>Email</label>
                                        <Input
                                            icon="envelope"
                                            iconPosition="left"
                                            placeholder='Email'
                                            type="email"
                                            name="sellerEmail"
                                            value={formValues.sellerEmail}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Field>

                                </Form.Group>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="pt0">
                            <Grid.Column >
                                <Form.Group widths="equal" >
                                    <Form.Field>
                                        <label>Address</label>
                                        <TextArea
                                            icon="address card"
                                            iconPosition="left"
                                            placeholder='Address'
                                            name="sellerAddress"
                                            value={formValues.sellerAddress}
                                            onChange={handleInputChange}
                                            rows={5}
                                        />
                                    </Form.Field>

                                    <Form.Field>
                                        <label>Notes</label>
                                        <TextArea
                                            icon="sticky note"
                                            iconPosition="left"
                                            placeholder='Notes'
                                            name="sellerNotes"
                                            value={formValues.sellerNotes}
                                            onChange={handleInputChange}
                                            rows={5}
                                        />
                                    </Form.Field>

                                </Form.Group>
                            </Grid.Column>
                        </Grid.Row>
                        </Grid>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Button fluid onClick={cancel} negative>
                                    Cancel
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button
                                    type="submit"
                                    form="SellerDetailsModal"
                                    positive
                                    fluid
                                    loading={sellerMutationLoading}
                                    content={props.edit === true ? 'Save Changes' : 'Create Seller'}
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

export default withRouter(SellerDetailsModal)


