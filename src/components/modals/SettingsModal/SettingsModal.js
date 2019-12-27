import React, { Component, Fragment, useState, createRef, useEffect, useRef } from 'react'
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
    Menu,
    Header,
    Tab,
    Popup
} from 'semantic-ui-react'

// Apollo/GQL

// Toast Notification
import { notify } from 'react-notify-toast';


import { FakeDataContext } from '../../../App'

const SettingsUserForm = ({ closeModal }) => {
    let { fakeData, setFakeData } = React.useContext(FakeDataContext)
    // const { auth, setAuth } = React.useContext(AuthContext)

    let user = fakeData.user
    // const address = `${user.street_1} ${user.street_2}
    // ${user.city} ${user.province}, ${user.country}
    // ${user.postal}    
    // `
    const address = ''

    const initialFormValues = {
        user_id: user.id || null,
        username: user.username || '',
        initials: user.initials || '',
        phone: user.phone || '',
        address: address || '',
        website: user.website || ''
    }

    const [form, setFormValues] = useState(initialFormValues)

    // const [updateUser, { data }] = useMutation(
    //     UPDATE_USER,
    //     {
    //         onCompleted: () => notify.show('User Details Updated ', 'success'),
    //     } 
    // );

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormValues({
            ...form,
            [name]: value
        });
    }

    return (
        <Form as={Grid} className="m0" inverted>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Form.Group  >
                        <Form.Field width="6">
                            <label>Username/Email <Popup content='This value cannot be changed as of this current version.' trigger={<Icon name='info circle' />} /></label>
                            <Input
                                required
                                value={user.username}
                                name="email"
                                disabled
                                onChange={handleInputChange}
                            />
                        </Form.Field>
                        <Form.Field width="2">
                            <label>Initials</label>
                            <Input
                                required
                                value={form.initials}
                                name="initials"
                                onChange={handleInputChange}
                            />
                        </Form.Field>



                    </Form.Group>
                </Grid.Column>
            </Grid.Row>
        </Form>
    )
}

const SettingsUserTab = ({ closeModal }) => {
    // Get User
    // return JSON.stringify(data.user[0])
    return <SettingsUserForm closeModal={closeModal} />
}

const panes = (props) => {
    return ([
        { menuItem: 'User', render: () => <Tab.Pane><SettingsUserTab closeModal={props.closeModal}></SettingsUserTab></Tab.Pane> },
    ])
}

const SettingsModal = (props) => {
    // const { auth, setAuth } = React.useContext(AuthContext)

    // TODO: (Future) make this more responsive. Add more than just two widths
    // const nameRef = createRef()
    const client = props.client
    const [open, setOpen] = useState(false)

    const closeModal = () => {
        setOpen(false)
    }
    const openModal = () => {
        setOpen(true)
        // console.log('Ref: ', nameRef)
        // nameRef.current.focus()
    }

    useEffect(() => {
        // console.log('USING EFFECT')
    }, [open])

    useRef(() => {

    })

    const cancel = () => {
        // setFormValues(initialFormValues)
    }

    const save = () => {
        // Call update mutation here
        // console.log('Updating User Record');
    }

    return (
        <Fragment>

            <Menu.Item as="a" index="settings" content="Settings" className="horizontal" onClick={openModal} />

            <Modal
                open={open}
                closeIcon={<Icon name="close" onClick={closeModal}></Icon>}
                closeOnDimmerClick={false}
                closeOnDocumentClick={false}
                closeOnEscape={true}
                dimmer="inverted"
            >
                <Modal.Header>Settings</Modal.Header>
                <Modal.Content scrolling >
                    <Tab panes={panes({ closeModal: closeModal })} defaultActiveIndex={0} />
                </Modal.Content>
                <Modal.Actions style={{ textAlign: 'center' }} >
                    <Grid>
                        <Grid.Row textAlign="right">
                            <Grid.Column textAlign="right" width={8}>
                                <Button onClick={cancel} negative fluid>
                                    Cancel
                                </Button>

                            </Grid.Column>

                            <Grid.Column textAlign="right" width={8}>
                                <Button
                                    onClick={save}
                                    positive
                                    content='Save'
                                    fluid
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>

        </Fragment>
    )
}

export default withRouter(SettingsModal)


