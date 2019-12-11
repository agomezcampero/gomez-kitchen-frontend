import React from "react";
import {
  Button,
  Modal as RSModal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

const Modal = ({
  showModal,
  toggle,
  header,
  body,
  primaryBtnText,
  onPrimaryBtnClick,
  secondaryBtnText,
  onSecondaryBtnClick,
  size,
  form
}) => {
  return (
    <div>
      <RSModal isOpen={showModal} toggle={toggle} size={size}>
        <ModalHeader toggle={toggle}>{header}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onPrimaryBtnClick} form={form}>
            {primaryBtnText}
          </Button>
          {secondaryBtnText && (
            <Button color="secondary" onClick={onSecondaryBtnClick}>
              {secondaryBtnText}
            </Button>
          )}
        </ModalFooter>
      </RSModal>
    </div>
  );
};

export default Modal;
