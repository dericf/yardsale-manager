import React, { Component, Fragment } from "react";
import {
  Button,
  Confirm,
  Segment,
  Grid,
  Modal,
  Popup,
  Message,
  Divider,
} from "semantic-ui-react";
import { Position } from "../types/General";

interface Props {
  triggerType?: string,
  disabled?: boolean,
  buttonProps?: object,
  handleConfirm?: ()=> void,
  handleCancel?: ()=> void,
  header?: string,
  content?: string,
  warningMessage?:string,
  disabledMessage?: string,
  popupEnabled?: boolean,
  popupMessage?: string,
  popupPosition?: Position,
}

export const ConfirmModal = ({
  triggerType = "button",
  disabled = false,
  buttonProps = {},
  handleConfirm = ()=> {},
  handleCancel = ()=> {},
  header = null,
  content = null,
  warningMessage = null,
  disabledMessage = null,
  popupEnabled = false,
  popupMessage = null,
  popupPosition = "top center",
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const confirm = () => {
    setOpen(false);
    handleConfirm();
  };
  const cancel = () => {
    closeModal();
    handleCancel();
  };

  return (
    <Fragment>
      {triggerType === "button" && (
        <Fragment>
          {disabled && disabledMessage && (
            <Popup
              inverted
              hideOnScroll
              style={{ borderRadius: 0 }}
              position="top center"
              content={disabledMessage}
              trigger={
                <Button icon {...buttonProps} basic />
              }
            />
          )}

          {!disabled && (
            <Fragment>
              {popupEnabled && popupMessage && (
                <Popup
                  inverted
                  content={popupMessage}
                  position={popupPosition}
                  trigger={
                    <Button
                      icon
                      disabled={disabled}
                      {...buttonProps}
                      onClick={showModal}
                      basic
                      className="icon"
                    />
                  }
                />
              )}

              {!popupEnabled && (
                <Button
                  disabled={disabled}
                  {...buttonProps}
                  onClick={showModal}
                  className="icon"
                />
              )}
            </Fragment>
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
            <Fragment>
              <Message content={`${warningMessage} ${content}`} negative />
            </Fragment>
          )}
          {warningMessage === null && (
            <Fragment>
              <Divider horizontal />
              <p>{`${content}`}</p>
            </Fragment>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Button onClick={cancel} fluid className="cancel">
                  No
                </Button>
              </Grid.Column>
              <Grid.Column width={8}>
                <Button
                  className="save"
                  onClick={confirm}
                  content="Yes"
                  fluid
                  primary
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
};
