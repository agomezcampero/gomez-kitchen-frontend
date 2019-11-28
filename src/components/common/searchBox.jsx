import React from "react";

const SearchBox = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      className="form-control my-2"
      placeholder={placeholder}
      id="search"
      name="search"
      value={value}
      onChange={e => onChange(e.currentTarget.value)}
    />
  );
};

export default SearchBox;
