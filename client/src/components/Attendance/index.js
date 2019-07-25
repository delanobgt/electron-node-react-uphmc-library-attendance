import "react-table/react-table.css";
import _ from "lodash";
import moment from "moment";
import React, { Fragment } from "react";
import ReactTable from "react-table";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

import * as libraryApi from "../../apis/libraryApi";
import ExportToExcel from "../misc/ExportToExcel";
import DateRangeInput from "../misc/DateRangeInput";

const LOADING = "LOADING",
  ERROR = "ERROR",
  DONE = "DONE";

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
  selectedButton: {
    textTransform: "none"
  },
  generateButton: {
    display: "block",
    margin: "1em 0"
  },
  divider: {
    margin: "1em 0"
  },
  chip: {
    marginRight: "1em",
    marginBottom: "1em"
  },
  paper: {
    padding: "2.5em"
  }
});

class AttendanceIndex extends React.Component {
  state = {
    loadingStatus: DONE,
    attendances: [],
    startDate: "",
    endDate: "",
    generateButtonTouched: false
  };

  fetchAttendances = async ({ startDate, endDate }) => {
    try {
      this.setState({ generateButtonTouched: true, loadingStatus: LOADING });
      const attendances = await libraryApi.getAttendances({
        startDate: startDate || this.state.startDate,
        endDate: endDate || this.state.endDate
      });
      console.log(attendances);
      this.setState({ loadingStatus: DONE, attendances });
    } catch (error) {
      console.log({ error });
      this.setState({ loadingStatus: ERROR });
    }
  };

  handleGenerateClicked = async ({ startDate, endDate }) => {
    this.setState({ startDate, endDate });
    await this.fetchAttendances({ startDate, endDate });
  };

  render() {
    const { classes } = this.props;
    const {
      loadingStatus,
      startDate,
      endDate,
      attendances,
      generateButtonTouched
    } = this.state;

    const headerContent = (
      <DateRangeInput
        onAction={this.handleGenerateClicked}
        actionButtonDisabled={loadingStatus === LOADING}
      />
    );

    let attendanceContent = null;
    if (loadingStatus === ERROR) {
      attendanceContent = (
        <Fragment>
          <Typography variant="subtitle1" className={classes.retryText}>
            Cannot fetch attendances!
          </Typography>
          <Button
            color="primary"
            className={classes.retryButton}
            onClick={() => this.fetchAttendances({})}
          >
            Retry
          </Button>
        </Fragment>
      );
    } else if (loadingStatus === LOADING) {
      attendanceContent = (
        <div style={{ textAlign: "center" }}>
          <CircularProgress size={50} />
        </div>
      );
    } else {
      const data = _.chain(attendances)
        .sortBy([
          d => moment(d.time).valueOf()
          // , d => d.student.student_nim
        ])
        .map((row, index) => ({
          ...row,
          orderNo: index + 1
        }))
        .value();

      const columns = [
        { Header: "No", accessor: d => d.orderNo },
        { Header: "Student ID (NIM)", accessor: d => d.student.student_nim },
        {
          Header: "Name",
          accessor: d => d.student.name
        },
        {
          Header: "Study Program",
          accessor: d => d.student.study_program.name
        },
        {
          Header: "Date",
          accessor: d => moment(d.time).valueOf(),
          plain: time =>
            time ? moment(time).format("D MMMM YYYY (HH:mm:ss)") : "-",
          Cell: ({ original: d }) =>
            moment(d.time).format("D MMMM YYYY (HH:mm:ss)")
        }
      ];

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

      attendanceContent = (
        <Fragment>
          <ExportToExcel
            rows={data}
            headers={columns.map(col => col.Header)}
            accessors={columns.map(col => col.accessor)}
            plains={columns.map(col => col.plain)}
            filename={`[Library] Attendances (${moment(startDate).format(
              "D MMM YYYY"
            )} - ${moment(endDate).format("D MMM YYYY")})`}
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
          <div>
            <Typography variant="subtitle1">
              From{" "}
              <span style={{ color: "blue" }}>
                {moment(startDate).format("D MMM YYYY")}
              </span>{" "}
              to{" "}
              <span style={{ color: "blue" }}>
                {moment(endDate).format("D MMM YYYY")}
              </span>
            </Typography>
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
                    style: { whiteSpace: "unset" },
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
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Grid container justify="center">
          <Grid item xs={11}>
            <Paper className={classes.paper} elevation={3}>
              <Typography variant="h5" className={classes.headline}>
                Attendances
              </Typography>
              <Divider light className={classes.divider} />
              {headerContent}
            </Paper>
            <br />
            <br />
            {generateButtonTouched && (
              <Paper className={classes.paper} elevation={3}>
                {attendanceContent}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(AttendanceIndex);
