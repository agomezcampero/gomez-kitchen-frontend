import React from "react";

const Follow = ({ followed, onClick }) => {
  let classes = "clickable fa fa-heart";
  if (!followed) classes += "-o";
  return <i onClick={onClick} className={classes} aria-hidden="true"></i>;
};

export default Follow;
