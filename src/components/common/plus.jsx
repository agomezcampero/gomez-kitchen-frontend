import React from "react";

const Plus = ({ show, onClick }) => {
  return (
    <i
      onClick={onClick}
      className="clickable fa fa-plus"
      aria-hidden="true"
    ></i>
  );
};

export default Plus;
