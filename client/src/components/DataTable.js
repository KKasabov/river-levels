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

  createColumns(num, titles) {
    let jsx;
    for(var i = 0; i < num; i++) {
      jsx += (<CustomTableCell>{titles[i]}</CustomTableCell>);
    }
    return jsx;
  }

  createRows(data) {
    // let jsx = [];
    // data.map(row => {
    //   jsx.push(<TableRow className="row" key={row.id}/>);
    //   for(var i = 0; i < data.length; i++) {
    //     jsx.push(<CustomTableCell {...((i==0) ? {component:"th"} : {})} {...((i==0) ? {scope:"row"} : {})}>{data[i]}</CustomTableCell>);
    //   }
    //   jsx += (</TableRow>);
    // });
    // return jsx;
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
