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
  onSecondaryBtnClick
}) => {
  return (
    <div>
      <RSModal isOpen={showModal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{header}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onPrimaryBtnClick}>
            {primaryBtnText}
          </Button>
          <Button color="secondary" onClick={onSecondaryBtnClick}>
            {secondaryBtnText}
          </Button>
        </ModalFooter>
      </RSModal>
    </div>
  );
};

export default Modal;
