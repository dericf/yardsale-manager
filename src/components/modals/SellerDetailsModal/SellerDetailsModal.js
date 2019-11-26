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

import {notify} from 'react-notify-toast';

import {FakeDataContext} from '../../../App'
const SellerDetailsModal = ({ seller = null, autofocus = true, ...props }) => {
    let {fakeData, setFakeData} = React.useContext(FakeDataContext)
    const [open, setOpen] = useState(false)
    
    const sellerNameRef = useRef()
    useEffect(() => {
        if (open === true && autofocus === true) {
            sellerNameRef.current.focus()
        }
    }, [open])

    const initialFormValues = {
        sellerName: seller ? seller.name : '',
        sellerInitials: seller ? seller.initials: '',
        sellerCompany: seller ? seller.company : '',
        sellerPhone: seller ? seller.phone : '',
        sellerEmail: seller ? seller.email : '',
        sellerAddress: seller ? seller.address : '',
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
        close()
    }

    const save = () => {
        // get the list of sellers
        
        if (seller == null || typeof seller == 'undefined') {
            // Create New seller
            // GQL Mutation
        
            console.log('Creating new seller');
            console.log(formValues)
            let newSellers = fakeData.user.sellers
            console.log('newSellers', newSellers)
            newSellers = newSellers.concat({
                name: formValues.sellerName,
                initials: formValues.sellerInitials,
                company: formValues.sellerCompany,
                phone: formValues.sellerPhone,
                email: formValues.sellerEmail,
                address: formValues.sellerAddress,
                notes: formValues.sellerNotes,
                status: 'active'
            })
            
            console.log('newSeller After Updater', newSellers)
            
            let newData = {
                ...fakeData,
                user: {
                    ...fakeData.user,
                    sellers: newSellers,
                    yardsales: {...fakeData.user.yardsales}
                }
            }
            console.log('New Data: ', newSellers, fakeData.user.sellers, newData)
            setFakeData(newData)
            notify.show('seller Created/Updated successfully ', 'success')
            
        } else {
            
            console.log('Editing Existing seller: ', seller.id);
            console.log(formValues)
        }
        close()
        props.history.push('/sellers')
    }
    
    const close = () => {
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
                    <Button compact size="small" onClick={openModal}>New Seller</Button>
                )}
            <Modal
                open={open}
                closeIcon={<Icon name="close" onClick={close}></Icon>}
                closeOnDimmerClick={false}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                dimmer="inverted"
            >
                <Modal.Header>{seller ? "Edit Seller Details" : "Create New Seller"}</Modal.Header>
                <Modal.Content>

                    <Form as={Grid} className="p0 m0">
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
                                        <label>Seller Company</label>
                                        <Input 
                                            icon="building"
                                            iconPosition="left"
                                            placeholder='seller Company'
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
                                        />
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
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button onClick={cancel} negative>
                        Cancel
                    </Button>
                    <Button
                        onClick={save}
                        positive
                        content={props.edit === true ? 'Save Changes' : 'Create Seller'}
                    />
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


