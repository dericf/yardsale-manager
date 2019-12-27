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

import { notify } from 'react-notify-toast';


import { useMutation } from '@apollo/react-hooks'
import { UPDATE_YARDSALE, CREATE_YARDSALE } from '../../../graphql/mutations'
import { GET_YARDSALES } from '../../../graphql/queries'

const YardsaleDetailsModal = ({ yardsale = null, autofocus = true, ...props }) => {
    // let {fakeData, setFakeData} = React.useContext(FakeDataContext)
    const [open, setOpen] = useState(false)

    const [updateYardsaleMutation, { data: updateYardsaleMutationData, loading: updateYardsaleMutationLoading, error: updateYardsaleMutationError }] = useMutation(UPDATE_YARDSALE);
    const [createYardsaleMutation, { data: createYardsaleMutationData, loading: createYardsaleMutationLoading, error: createYardsaleMutationError }] = useMutation(CREATE_YARDSALE);

    const yardsaleNameRef = useRef()
    useEffect(() => {
        if (open === true && autofocus === true) {
            yardsaleNameRef.current.focus()
        }
    }, [open])

    const initialFormValues = {
        yardsaleName: yardsale ? yardsale.name : '',
        yardsaleInitials: yardsale ? yardsale.initials : '',
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
        closeModal()
    }

    const save = () => {
        // get the list of yardsales

        if (yardsale == null || typeof yardsale == 'undefined') {
            // Create New yardsale
            // GQL Mutation

            createYardsaleMutation({
                variables: {
                    name: formValues.yardsaleName,
                    phone: formValues.yardsalePhone,
                    email: formValues.yardsaleEmail,
                    address: formValues.yardsaleAddress,
                    notes: formValues.yardsaleNotes
                },
                refetchQueries: [{
                    query: GET_YARDSALES
                }]
            })

            notify.show('Yardsale Created successfully ', 'success')

        } else {
            updateYardsaleMutation({
                variables: {
                    yardsaleUUID: yardsale.uuid,
                    name: formValues.yardsaleName,
                    phone: formValues.yardsalePhone,
                    email: formValues.yardsaleEmail,
                    address: formValues.yardsaleAddress,
                    notes: formValues.yardsaleNotes
                },
                refetchQueries: [{
                    query: GET_YARDSALES
                }]
            })
            notify.show('Yardsale Updated successfully ', 'success')
        }
        setFormValues(initialFormValues)
        closeModal()
        props.history.push('/yardsales')
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
                    <Button compact size="small" onClick={openModal}>New Yardsale</Button>
                )}
            <Modal
                open={open}
                closeIcon={<Icon name="close" onClick={closeModal}></Icon>}
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
                                    <Form.Field width="8">
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


                                    <Form.Field width="8">
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
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Button fluid onClick={cancel} negative>
                                    Cancel
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button
                                    fluid
                                    onClick={save}
                                    positive
                                    content={props.edit === true ? 'Save Changes' : 'Create Yardsale'}
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


