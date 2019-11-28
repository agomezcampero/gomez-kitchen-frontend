import React from "react";

const Delete = ({ onClick }) => {
  return (
    <i
      onClick={onClick}
      className="clickable fa fa-times"
      aria-hidden="true"
    ></i>
  );
};

export default Delete;
