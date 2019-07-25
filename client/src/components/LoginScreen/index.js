import _ from "lodash";
import moment from "moment";
import React, { Fragment } from "react";
import {
  Button,
  TextField,
  Typography,
  CircularProgress
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import BgImage from "../../res/lab-plain.jpg";
import * as libraryApi from "../../apis/libraryApi";
import CardToastDialog from "./dialogs/CardToastDialog";
import InputPasswordDialog from "./dialogs/InputPasswordDialog";

const styles = theme => ({
  bg: {
    margin: 0,
    padding: 0,
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${BgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  },
  rightDiv: {
    marginLeft: "50%",
    display: "flex",
    alignItems: "center",
    height: "100vh"
  },
  contentDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minWidth: "30em"
  }
});

const SUBMIT_LOADING = "SUBMIT_LOADING",
  SUBMIT_IDLE = "SUBMIT_IDLE",
  SUBMIT_ERROR = "SUBMIT_ERROR";

class LoginScreen extends React.Component {
  state = {
    txtNim: "",
    submitStatus: SUBMIT_IDLE,
    errorMsg: <span>&nbsp;</span>
  };
  errorMsgTimeout = null;

  handleTxtNimChange = e => {
    this.setState({ txtNim: e.target.value.replace(/ /g, "") });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { txtNim } = this.state;

    if (txtNim === "openSesame") {
      this.toggleDialog("InputPasswordDialog")(true);
    } else {
      try {
        if (this.errorMsgTimeout) clearTimeout(this.errorMsgTimeout);

        this.setState({
          submitStatus: SUBMIT_LOADING,
          errorMsg: <span>&nbsp;</span>
        });
        const responseData = await libraryApi.createAttendance({
          student_nim: txtNim,
          time: moment().format()
        });
        this.setState({ submitStatus: SUBMIT_IDLE, txtNim: "" });
        this.toggleDialog("CardToastDialog")(responseData);
      } catch (error) {
        console.log({ error });
        this.setState({
          submitStatus: SUBMIT_ERROR,
          errorMsg: _.get(error, "response.data.msg", " ")
        });

        this.errorMsgTimeout = setTimeout(() => {
          this.setState({ errorMsg: <span>&nbsp;</span> });
        }, 2000);
      }
    }
  };

  toggleDialog = stateName => open =>
    this.setState(state => ({
      [stateName]: open === undefined ? !Boolean(state[stateName]) : open
    }));

  render() {
    const { classes } = this.props;
    const { txtNim, submitStatus, errorMsg } = this.state;

    return (
      <Fragment>
        <div className={classes.bg}>
          <div className={classes.rightDiv}>
            <form onSubmit={this.handleSubmit} className={classes.contentDiv}>
              <Typography
                variant="h5"
                style={{ marginBottom: "0.5em", fontWeight: "bold" }}
              >
                Entering the Library?
              </Typography>
              <Typography variant="subtitle1" style={{ marginBottom: "2.5em" }}>
                before that, please login first
              </Typography>

              <TextField
                required
                variant="outlined"
                autoFocus={true}
                style={{ width: "75%" }}
                value={txtNim}
                placeholder="Student ID (NIM)"
                onChange={this.handleTxtNimChange}
                inputProps={{
                  style: { textAlign: "center" }
                }}
              />
              <Typography
                variant="caption"
                align="center"
                style={{ display: "block", color: "red", marginTop: "0.5em" }}
              >
                {errorMsg}
              </Typography>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={{
                  marginTop: "1em",
                  width: "50%",
                  borderRadius: "27px"
                }}
              >
                {submitStatus === SUBMIT_LOADING ? (
                  <CircularProgress size={24} />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>
        </div>
        {Boolean(this.state["CardToastDialog"]) && (
          <CardToastDialog
            name="CardToastDialog"
            state={this.state}
            toggleDialog={this.toggleDialog}
          />
        )}
        {Boolean(this.state["InputPasswordDialog"]) && (
          <InputPasswordDialog
            name="InputPasswordDialog"
            state={this.state}
            toggleDialog={this.toggleDialog}
          />
        )}
      </Fragment>
    );
  }
}

export default withStyles(styles)(LoginScreen);
