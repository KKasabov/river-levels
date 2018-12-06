import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DataTable.css';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
})) (TableCell);

class DataTable extends Component {

  // create column jsx for given number of columns
  createColumns(num, titles) {
    let jsx = [];
    for(var i = 0; i < num; i++) {
      jsx.push(<CustomTableCell>{titles[i]}</CustomTableCell>);
    }
    return jsx;
  }

  // create all rows
  createRows(data) {
    let jsx = [];
    data.forEach(row => {
      jsx.push(<TableRow className="row" key={row.id}>{this.createRowContent(row)}</TableRow>);

    });
    return jsx;
  }

  // create the content of cells in a single row
  createRowContent(rowData) {
    let jsx = [];
    for(var i = 0; i < rowData.length; i++) {
      jsx.push(
        <CustomTableCell {...((i == 0) ? {component: "th"} : {})} {...((i == 0) ? {scope:"row"} : {})}>
          {rowData[i]}
        </CustomTableCell>
      );
    }
    return jsx;
  }

  render() {
    return (
      <Table className="table">
        <TableHead>
          <TableRow>
            {this.createColumns(this.props.noOfColumns, this.props.columnTitles)}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.createRows(this.props.data)}
        </TableBody>
      </Table>
    );
  }
}

export default (DataTable);
