import React from "react";
import {
  Button,
  Modal as RSModal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyModal = ({
  showModal,
  toggle,
  header,
  body,
  primaryBtnText,
  secondaryBtnText,
  onSecondaryBtnClick,
  size,
  form,
  copyText,
  onCopy,
  copied
}) => {
  return (
    <div>
      <RSModal isOpen={showModal} toggle={toggle} size={size}>
        <ModalHeader toggle={toggle}>{header}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          {copied && <span className="text-success">¡Copiado!</span>}
          <CopyToClipboard text={copyText} onCopy={onCopy}>
            <Button color="primary">{primaryBtnText}</Button>
          </CopyToClipboard>
          <Button color="secondar" onClick={onSecondaryBtnClick} form={form}>
            {secondaryBtnText}
          </Button>
        </ModalFooter>
      </RSModal>
    </div>
  );
};

export default CopyModal;
