import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);

    const text = _.get(item, column.path);

    if (column.editable)
      return (
        <React.Fragment>
          {text}
          <i className="clickable align-right fa fa-pencil-square-o fa-sm"></i>
        </React.Fragment>
      );

    return text;
  };

  render() {
    const { data, columns } = this.props;
    return (
      <tbody>
        {data.map(item => (
          <tr key={item._id}>
            {columns.map(column => (
              <td key={column.path || column.key}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
