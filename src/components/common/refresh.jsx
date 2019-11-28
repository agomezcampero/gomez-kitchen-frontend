import React from "react";

const Refresh = ({ refreshable, onClick }) => {
  if (!refreshable) return null;

  return (
    <i
      onClick={onClick}
      className="clickable fa fa-refresh"
      aria-hidden="true"
    ></i>
  );
};

export default Refresh;
