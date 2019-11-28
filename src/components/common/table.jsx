import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Table = ({ columns, sortColumn, onSort, data, sortable = true }) => {
  return (
    <table className="table">
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        onSort={onSort}
        sortable={sortable}
      />
      <TableBody columns={columns} data={data} />
    </table>
  );
};

export default Table;
