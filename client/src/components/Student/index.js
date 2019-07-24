import "react-table/react-table.css";
import _ from "lodash";
import React, { Fragment } from "react";
import ReactTable from "react-table";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

import ExportToExcel from "../misc/ExportToExcel";
import * as libraryApi from "../../apis/libraryApi";

const styles = theme => ({
  retryText: {
    textAlign: "center"
  },
  retryButton: {
    display: "block",
    margin: "auto",
    textAlign: "center"
  },
  headline: {
    marginBottom: "1em"
  },
  excelButton: {
    marginBottom: "1em"
  },
  paper: {
    padding: "2em"
  },
  actionDiv: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0.5em 0"
  }
});

const LOADING = "LOADING",
  ERROR = "ERROR",
  DONE = "DONE";

class CandidateListIndex extends React.Component {
  state = {
    loadingStatus: LOADING,
    students: []
  };

  fetchData = async () => {
    try {
      this.setState({ loadingStatus: LOADING });
      const students = await libraryApi.getStudents();
      this.setState({ loadingStatus: DONE, students });
    } catch (error) {
      console.log({ error });
      this.setState({ loadingStatus: ERROR });
    }
  };

  toggleDialog = stateName => open =>
    this.setState(state => ({
      [stateName]: open === undefined ? !Boolean(state[stateName]) : open
    }));

  async componentDidMount() {
    await this.fetchData();
  }

  render() {
    const { classes } = this.props;
    const { loadingStatus, students } = this.state;

    const columns = [
      { Header: "Order Number", accessor: d => d.orderNumber || "-" },
      { Header: "Student ID (NIM)", accessor: d => d.student_nim || "-" },
      {
        Header: "Name",
        accessor: d => d.name || "-"
      },
      {
        Header: "Study Program",
        accessor: d => d.study_program.name || "-"
      }
      // {
      //   Header: "Actions",
      //   accessor: () => "",
      //   Cell: ({ original: d }) => (
      //     <div style={{ textAlign: "center" }}>
      //       <IconButton
      //         onClick={() => this.toggleDialog("EditCandidateDialog")(d)}
      //       >
      //         <EditIcon />
      //       </IconButton>
      //       <IconButton
      //         onClick={() => this.toggleDialog("DeleteCandidateDialog")(d)}
      //       >
      //         <DeleteIcon />
      //       </IconButton>
      //     </div>
      //   )
      // }
    ];

    // table filter method
    const containFilter = (filter, row) => {
      const id = Number(filter.id);
      return columns[id].plain
        ? String(columns[id].plain(row[id]))
            .toLowerCase()
            .includes(filter.value.toLowerCase())
        : String(row[id])
            .toLowerCase()
            .includes(filter.value.toLowerCase());
    };

    let mainContent = null;

    if (loadingStatus === ERROR) {
      mainContent = (
        <Fragment>
          <Typography variant="subtitle1" className={classes.retryText}>
            Cannot fetch data.
          </Typography>
          <Button
            color="primary"
            className={classes.retryButton}
            onClick={this.fetchData}
          >
            Retry
          </Button>
        </Fragment>
      );
    } else if (loadingStatus === LOADING) {
      mainContent = (
        <div style={{ textAlign: "center" }}>
          <CircularProgress size={50} />
        </div>
      );
    } else {
      const data = _.chain(students)
        .sortBy([s => s.student_nim])
        .map((s, idx) => ({ ...s, orderNumber: idx + 1 }))
        .value();

      mainContent = (
        <Fragment>
          <div className={classes.actionDiv}>
            <ExportToExcel
              rows={data}
              headers={columns.map(col => col.Header)}
              accessors={columns.map(col => col.accessor)}
              plains={columns.map(col => col.plain)}
              filename="All Students"
              actionElement={
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.excelButton}
                >
                  Excel
                </Button>
              }
            />
          </div>
          <ReactTable
            data={data}
            filterable
            defaultFilterMethod={containFilter}
            defaultPageSize={10}
            className="-striped -highlight"
            columns={_.map(columns, (column, index) =>
              _.pickBy(
                {
                  id: String(index),
                  width: column.width,
                  style: {
                    whiteSpace: "unset",
                    display: "flex",
                    alignItems: "center"
                  },
                  Header: column.Header,
                  accessor: column.accessor,
                  Cell: column.Cell,
                  filterMethod: containFilter
                },
                prop => prop
              )
            )}
          />
          <Typography variant="subtitle1" style={{ textAlign: "right" }}>
            {data.length} entries
          </Typography>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Grid container justify="center">
          <Grid item xs={11}>
            <Paper className={classes.paper} elevation={3}>
              <Typography variant="h5" gutterBottom>
                All Students
              </Typography>
              <br />
              {mainContent}
            </Paper>
          </Grid>
        </Grid>
        <br />
        <br />
      </Fragment>
    );
  }
}

export default withStyles(styles)(CandidateListIndex);
