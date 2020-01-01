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
    Message,
    Item
} from 'semantic-ui-react'

// Apollo/GQL

// Toast Notification
import { notify } from 'react-notify-toast';

import { BASE_URL } from '../../../constants'
import { FakeDataContext } from '../../../App'

import { AuthContext } from '../../../App'

import RegisterModal from '../RegisterModal/RegisterModal'

const RegistrationConfirmationModal = ({ defaultOpen = false, forcedOpen = false, ...props }) => {
    // TODO: (Future) make this more responsive. Add more than just two widths
    // const nameRef = createRef()
    const [open, setOpen] = useState(defaultOpen)
    const openModal = () => {
        setOpen(true)
        // console.log('Ref: ', nameRef)
        // nameRef.current.focus()
    }
    useEffect(() => {
        // setTimeout(() => {
        //     props.history.push('/login')
        // }, 3500);
    }, [open])

    return (
        <Fragment>

            <Menu.Item as="a" index={0} content="Login" className="horizontal" onClick={openModal} />

            <Modal
                style={{ width: 350 }}
                open={open}
                closeOnDimmerClick={false}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                dimmer="inverted"
            >
                <Modal.Header>Email Confirmed</Modal.Header>
                <Modal.Content>
                    <Message content="Success! Your email has been confirmed and your account is now active." success>
                        
                    </Message>

                    {/* <Header as="h4">
                        You will automatically be redirected to the login page...
                    </Header> */}
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row className="">
                            <Grid.Column width={16}>
                                <Button as={Link} fluid to="/login" color="green">Go to Login</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        </Fragment>
    )
}

export default withRouter(RegistrationConfirmationModal)


