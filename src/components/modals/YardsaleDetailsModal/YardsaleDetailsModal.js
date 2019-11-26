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
const YardsaleDetailsModal = ({ yardsale = null, autofocus = true, ...props }) => {
    let {fakeData, setFakeData} = React.useContext(FakeDataContext)
    const [open, setOpen] = useState(false)
    
    const yardsaleNameRef = useRef()
    useEffect(() => {
        if (open === true && autofocus === true) {
            yardsaleNameRef.current.focus()
        }
    }, [open])

    const initialFormValues = {
        yardsaleName: yardsale ? yardsale.name : '',
        yardsaleInitials: yardsale ? yardsale.initials: '',
        yardsaleCompany: yardsale ? yardsale.company : '',
        yardsalePhone: yardsale ? yardsale.phone : '',
        yardsaleEmail: yardsale ? yardsale.email : '',
        yardsaleAddress: yardsale ? yardsale.address : '',
        yardsaleNotes: yardsale ? yardsale.notes : ''
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
        // get the list of yardsales
        
        if (yardsale == null || typeof yardsale == 'undefined') {
            // Create New yardsale
            // GQL Mutation
        
            console.log('Creating new yardsale');
            console.log(formValues)
            let newYardsales = fakeData.user.yardsales
            console.log('newYardsales', newYardsales)
            newYardsales = newYardsales.concat({
                name: formValues.yardsaleName,
                initials: formValues.yardsaleInitials,
                company: formValues.yardsaleCompany,
                phone: formValues.yardsalePhone,
                email: formValues.yardsaleEmail,
                address: formValues.yardsaleAddress,
                notes: formValues.yardsaleNotes,
                status: 'active'
            })
            
            console.log('newYardsale After Updater', newYardsales)
            
            let newData = {
                ...fakeData,
                user: {
                    ...fakeData.user,
                    yardsales: newYardsales
                }
            }
            console.log('New Data: ', newYardsales, fakeData.user.yardsales, newData)
            setFakeData(newData)
            notify.show('yardsale Created/Updated successfully ', 'success')
            
        } else {
            
            console.log('Editing Existing yardsale: ', yardsale.id);
            console.log(formValues)
        }
        close()
        props.history.push('/yardsales')
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
                    <Button compact size="small" onClick={openModal}>New Yardsale</Button>
                )}
            <Modal
                open={open}
                closeIcon={<Icon name="close" onClick={close}></Icon>}
                closeOnDimmerClick={false}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                dimmer="inverted"
            >
                <Modal.Header>{yardsale ? "Edit Yardsale Details" : "Create New Yardsale"}</Modal.Header>
                <Modal.Content>

                    <Form as={Grid} className="p0 m0">
                        <Grid.Row className="pb0">
                            <Grid.Column>
                                <Form.Group >
                                    <Form.Field width="7">
                                        <label>Yardsale Name</label>
                                        <Input
                                            icon="user"
                                            iconPosition="left"
                                            ref={yardsaleNameRef}
                                            placeholder='Yardsale Name'
                                            name="yardsaleName"
                                            value={formValues.yardsaleName}
                                            onChange={handleInputChange}
                                        />

                                    </Form.Field >
                                    <Form.Field width="2">
                                        <label>Initials</label>
                                        <Input
                                            name="yardsaleInitials"
                                            value={formValues.yardsaleInitials}
                                            onChange={handleInputChange}
                                        />

                                    </Form.Field >

                                    <Form.Field width="7">
                                        <label>Yardsale Company</label>
                                        <Input 
                                            icon="building"
                                            iconPosition="left"
                                            placeholder='yardsale Company'
                                            name="yardsaleCompany"
                                            value={formValues.yardsaleCompany}
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
                                            name="yardsalePhone"
                                            value={formValues.yardsalePhone}
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
                                            name="yardsaleEmail"
                                            value={formValues.yardsaleEmail}
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
                                            name="yardsaleAddress"
                                            value={formValues.yardsaleAddress}
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
                                            name="yardsaleNotes"
                                            value={formValues.yardsaleNotes}
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
                        content={props.edit === true ? 'Save Changes' : 'Create Yardsale'}
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

export default withRouter(YardsaleDetailsModal)


