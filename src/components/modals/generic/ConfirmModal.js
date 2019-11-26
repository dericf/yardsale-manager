import React, { Component, Fragment } from 'react'
import { Button, Confirm, Segment } from 'semantic-ui-react'

const ConfirmModal = (props) => {
    const [open, setOpen] = React.useState(false)
    console.log('Confirm Modal Props: ', props)
    const show = () => {
        console.log('SHOWW');
        setOpen(true)
    }
    const hide = () => setOpen(false)

    const handleConfirm = () => {
        setOpen(false)
        props.handleConfirm()
    }
    const handleCancel = () => {
        setOpen(false)
        props.handleCancel()
    }

    const Trigger = props.trigger

    return (
        <Fragment>
            <div onClick={show}><Trigger /></div>
            {/* <Button {...props.buttonProps} onClick={show}><Trigger /></Button> */}
            <Confirm
                open={open}
                closeOnDimmerClick={false}
                closeOnEscape={false}
                closeOnDocumentClick={false}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                header={props.header}
                content={props.content}
            />
        </Fragment>
    )
}

export default ConfirmModal