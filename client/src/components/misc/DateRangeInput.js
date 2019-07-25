import moment from "moment";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center"
  },
  dateField: {
    marginRight: "1em"
  }
});

class DateRangeInput extends Component {
  errorMsgTimeout = null;

  constructor(props) {
    super(props);
    if (props.initDate) {
      const { startDate, endDate } = props.initDate;
      this.state = {
        startDate,
        endDate,
        errorMsg: <span>&nbsp;</span>
      };
    } else {
      this.state = {
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        errorMsg: <span>&nbsp;</span>
      };
    }
  }

  handleChange = stateName => event => {
    this.setState({ [stateName]: event.target.value });
  };

  handleSubmit = e => {
    if (this.errorMsgTimeout) clearTimeout(this.errorMsgTimeout);

    e.preventDefault();
    const { startDate, endDate } = this.state;
    const { onAction } = this.props;

    if (moment(startDate).isAfter(endDate)) {
      this.errorMsgTimeout = setTimeout(() => {
        this.setState({
          errorMsg: <span>&nbsp;</span>
        });
      }, 2000);
      return this.setState({
        errorMsg: "Invalid data range!"
      });
    }
    if (onAction) onAction({ startDate, endDate });
  };

  render() {
    const { classes, buttonLabel, actionButtonDisabled } = this.props;
    const { errorMsg } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className={classes.container}>
            <TextField
              type="date"
              label="Start Date"
              required={true}
              disabled={actionButtonDisabled === true}
              onChange={this.handleChange("startDate")}
              value={this.state.startDate}
              className={classes.dateField}
            />
            <TextField
              type="date"
              label="End Date"
              required={true}
              disabled={actionButtonDisabled === true}
              onChange={this.handleChange("endDate")}
              value={this.state.endDate}
              className={classes.dateField}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={actionButtonDisabled === true}
            >
              {buttonLabel || "Generate"}
            </Button>
          </div>
          <Typography variant="subtitle1" style={{ color: "red" }}>
            {errorMsg}
          </Typography>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(DateRangeInput);
