import React, { Component, Fragment } from 'react'
import { Button, Confirm, Segment, Grid, Modal, Popup, Message, Divider } from 'semantic-ui-react'

const ConfirmModal = ({ triggerType = 'button', disabled = false, buttonProps = {}, handleConfirm, handleCancel, header, content, warningMessage = null, disabledMessage = null }) => {
    const [open, setOpen] = React.useState(false)
    const showModal = () => {
        setOpen(true)
    }

    const closeModal = () => setOpen(false)

    const confirm = () => {
        setOpen(false)
        handleConfirm()
    }
    const cancel = () => {
        closeModal()
        handleCancel()
    }


    return (
        <Fragment>
            {triggerType === 'button' && (
                <Fragment>
                    {disabled && disabledMessage && (
                        <Popup inverted hideOnScroll style={{ borderRadius: 0 }} position="top center" content={disabledMessage} trigger={<Button {...buttonProps} />} />
                    )}

                    {!disabled && (
                        <Button disabled={disabled} {...buttonProps} onClick={showModal} />
                    )}
                </Fragment>
            )}

            <Modal
                open={open}
                closeOnEscape={true}
                closeOnDimmerClick={true}
                onClose={cancel}
            >
                <Modal.Header>{header}</Modal.Header>
                <Modal.Content>
                    {warningMessage && (
                        <Message content={warningMessage} negative />
                    )}
                    <Divider horizontal />
                    {content}
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row >
                            <Grid.Column width={8}>
                                <Button onClick={cancel} negative fluid>
                                    No
                                </Button>

                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button
                                    onClick={confirm}
                                    positive
                                    labelPosition='right'
                                    icon='checkmark'
                                    content='Yes'
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

export default ConfirmModal