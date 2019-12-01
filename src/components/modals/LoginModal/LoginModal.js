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

const LoginModal = ({ defaultOpen = false, forcedOpen = false, ...props }) => {
    // TODO: (Future) make this more responsive. Add more than just two widths
    // const nameRef = createRef()
    const { auth, setAuth } = React.useContext(AuthContext)
    const client = props.client
    const autoFocusRef = useRef()
    const initialValues = {
        email: "",
        password: ""
    }

    const [open, setOpen] = useState(defaultOpen)
    const [values, setValues] = useState(initialValues)
    const [errorMessage, setErrorMessage] = useState(null)

    const closeModal = () => {
        setOpen(false)
    }
    const openModal = () => {
        setOpen(true)
        // console.log('Ref: ', nameRef)
        // nameRef.current.focus()
    }

    useEffect(() => {
        if (open === true) {
            autoFocusRef.current.focus()
        }
    }, [open])

    useEffect(() => {
        // If the user has been sent here in order to re-authenticate the "session". display a message
        if (auth.reAuthenticateRequired === true) {
            setErrorMessage(errorMessage => 'Your session has timed out. Please log in again.')
        }
    }, [open, auth, errorMessage])

    const handleInputChange = (event) => {
        // TODO: Move this to a hook
        const target = event.target;
        const val = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name;

        setValues({
            ...values,
            [name]: val
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setAuth({ ...auth, loading: true })
        let uri = `${BASE_URL}/auth/login`
        let data = {
            email: values.email,
            password: values.password
        }
        // let options = 

        fetch(
            uri,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Credentials": "true",
                },
                body: JSON.stringify(data)
            }
        ).then(res => {
            // console.log("Login Response is: ", res)
            return res.json()
        }).then(json => {
            // console.log('JSON: ', json)
            if (json.STATUS === 'OK' && json.token !== "" && json.refreshToken != "") {
                localStorage.setItem('accessToken', json.token)
                localStorage.setItem('refreshToken', json.refreshToken)
                setValues(initialValues)
                // props.history.push('/yardsales')
                setAuth(auth => ({ ...auth, reAuthenticateRequired: false }))
                props.history.push('/yardsales')
                // window.location.assign(json.callback)
                closeModal()
            } else if (json.STATUS === 'ERROR') {
                // console.log('Bad Login Credentials', json)
                if (json.MESSAGE === 'User not found') {
                    // console.log('User not found', json)
                    setAuth(auth => ({ ...auth, loading: false, reAuthenticateRequired: false }))
                    // setValues(prev => ({ ...prev, email: "" }))
                    autoFocusRef.current.focus()
                    setErrorMessage('No user was found matching that email. Please try again.')
                } else if (json.MESSAGE === 'Wrong password') {
                    setErrorMessage('Password does not match. Please try again.')
                    setAuth(auth => ({ ...auth, loading: false, reAuthenticateRequired: false }))
                    // console.log('Bad password', json)
                } else if (json.MESSAGE === 'Email not confirmed') {
                    setErrorMessage('The email associated with this account has not been confirmed yet. Please check your email and follow the link provided and then log in again.')
                    setAuth(auth => ({ ...auth, loading: false, reAuthenticateRequired: false }))
                    // console.log('Email not confirmed', json)
                }
            }
        }).catch((err) => {
            // console.log('ERROR', err)
            setErrorMessage('There was a problem on our end. Please try again later.')
            setAuth(auth => ({ ...auth, loading: false }))
        })
    }

    return (
        <Fragment>

            <Menu.Item as="a" index={0} content="Login" className="horizontal" onClick={openModal} />

            <Modal
                style={{ width: 350 }}
                open={open}
                closeIcon={<Icon name="close" onClick={forcedOpen ? () => null : closeModal}></Icon>}
                closeOnDimmerClick={false}
                closeOnDocumentClick={false}
                closeOnEscape={true}
                dimmer="inverted"
            >
                <Modal.Header>Log In</Modal.Header>
                <Modal.Content scrolling>
                    <Form as={Grid} className="m0" loading={auth.loading}>
                        <Grid.Row className="py0">
                            <Grid.Column width={16}>
                                <Form.Group  >
                                    <Form.Field width={16}>
                                        <label>Email</label>
                                        <Input
                                            fluid
                                            type="text"
                                            name="email"
                                            icon="at"
                                            iconPosition="left"
                                            ref={autoFocusRef}
                                            value={values.email}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Field>
                                </Form.Group>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="py0">
                            <Grid.Column width={16}>
                                <Form.Group  >
                                    <Form.Field width={16}>
                                        <label>Password</label>
                                        <Input
                                            fluid
                                            type="password"
                                            name="password"
                                            icon="key"
                                            iconPosition="left"
                                            value={values.password}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Field>
                                </Form.Group>
                            </Grid.Column>
                        </Grid.Row>
                        {errorMessage && (
                            <Grid.Row className="py0">
                                <Grid.Column width={16}>
                                    <Message header="Error" negative >
                                        <Message.Header>
                                            Error
                                        </Message.Header>
                                        <Message.Content>
                                            {errorMessage}
                                        </Message.Content>
                                    </Message>
                                </Grid.Column>
                            </Grid.Row>
                        )}
                        <Grid.Row className="py0">
                            <Grid.Column>
                                <Item as={Link} to="/register" content="Create a New Account" />
                                {/* <RegisterModal onClick={closeModal} /> */}
                            </Grid.Column>
                        </Grid.Row>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column width={8}>
                                <Button
                                    onClick={closeModal}
                                    negative
                                    fluid
                                    disabled={forcedOpen}>
                                    Cancel
                                </Button>
                            </Grid.Column>

                            <Grid.Column width={8}>
                                <Button
                                    onClick={handleSubmit}
                                    positive
                                    content='Login'
                                    fluid
                                    loading={auth.loading}
                                    disabled={values.email == '' || values.password == '' || values.password.length < 4}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        </Fragment>
    )
}

export default withRouter(LoginModal)


