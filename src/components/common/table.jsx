import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import Pagination from "./pagination";
import {
  Table as RSTable,
  Row,
  Card,
  CardHeader,
  CardFooter
} from "reactstrap";
import SearchBox from "./searchBox";

const Table = ({
  title,
  columns,
  sortColumn,
  onSort,
  data,
  sortable = true,
  itemsCount,
  pageSize,
  currentPage,
  onPageChange,
  searchValue,
  onSearchChange
}) => {
  return (
    <Row>
      <div className="col">
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row>
              <h2 className="mb-0">{title}</h2>
              {onSearchChange && (
                <SearchBox
                  value={searchValue}
                  onChange={onSearchChange}
                ></SearchBox>
              )}
            </Row>
          </CardHeader>

          <RSTable className="align-items-center table-flush" responsive>
            <TableHeader
              columns={columns}
              sortColumn={sortColumn}
              onSort={onSort}
              sortable={sortable}
            />
            <TableBody columns={columns} data={data} />
          </RSTable>
          <CardFooter className="py-4">
            <nav aria-label="...">
              <Pagination
                itemsCount={itemsCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            </nav>
          </CardFooter>
        </Card>
      </div>
    </Row>
  );
};

export default Table;
