import React from "react";
import Modal from "./modal";

const ModalDelete = ({
  showModal,
  toggle,
  onPrimaryBtnClick,
  onSecondaryBtnClick,
  item
}) => {
  return (
    <Modal
      showModal={showModal}
      toggle={toggle}
      header="Elimnar"
      body={item && `¿Seguro que quieres eliminar ${item.name}?`}
      primaryBtnText="Eliminar"
      onPrimaryBtnClick={() => {
        onPrimaryBtnClick(item);
        toggle();
      }}
      secondaryBtnText="Cancelar"
      onSecondaryBtnClick={onSecondaryBtnClick}
    />
  );
};

export default ModalDelete;
