import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Segment, Header, Modal, Button, Container, Form, TextArea } from 'semantic-ui-react'

const Error404 = (props) => {
    return (
        <Container>
        <Segment size="large" textAlign="center" className="borderless" style={{height: "100%"}} >
            <Header content="This page does not exist." />
            <Button className="save" content="Click here to go home" onClick={() => {props.history.push("/")}} />
                <Form style={{marginTop: "5vh"}}>
                    <Form.Group>
                        <Form.Field width={8}>
                            <label>Let us know what went wrong</label>
                            <TextArea 
                                rows={3}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Button type="submit">Send</Button>
                        </Form.Field>
                    </Form.Group>
                    
                </Form>
        </Segment>
        </Container>
    )
}

export default withRouter(Error404)