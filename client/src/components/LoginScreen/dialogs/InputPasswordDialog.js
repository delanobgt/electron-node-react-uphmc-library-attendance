import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  TextField
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import bycrypt from "../../../modules/bcrypt";

const styles = theme => ({});

const INITIAL_STATE = { password: "", errorMsg: <span>&nbsp;</span> };

class InputPasswordDialog extends React.Component {
  state = INITIAL_STATE;
  errorMsgTimeout = null;

  onClose = () => {
    const { name, toggleDialog } = this.props;
    toggleDialog(name)(false);
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = async e => {
    if (e) e.preventDefault();

    const { password } = this.state;
    const { history } = this.props;

    if (this.errorMsgTimeout) clearTimeout(this.errorMsgTimeout);

    this.setState({ errorMsg: <span>&nbsp;</span> });
    const hash = "$2a$10$viM9Xem1AAW8bAX7pNFzreIpppNtJhPb8lciBB7MUvb97bi3GLuwK";
    if (await bycrypt.compare(password, hash)) {
      history.push("/admin");
    } else {
      this.setState({ errorMsg: "Wrong password!" });
      this.errorMsgTimeout = setTimeout(() => {
        this.setState({ errorMsg: <span>&nbsp;</span> });
      }, 2000);
    }
  };

  render() {
    const { password, errorMsg } = this.state;
    const { state, name } = this.props;
    const payload = state[name];

    if (!payload) return null;

    return (
      <Dialog
        open={Boolean(payload)}
        aria-labelledby="form-dialog-title"
        onClose={this.onClose}
      >
        <DialogContent style={{ minWidth: "16em" }}>
          <Typography
            variant="subtitle1"
            align="center"
            gutterBottom
            style={{ marginTop: "1em", marginBottom: "1em" }}
          >
            Please input the password
          </Typography>
          <form onSubmit={this.handleSubmit}>
            <TextField
              type="password"
              variant="outlined"
              label="Password"
              value={password}
              onChange={this.handlePasswordChange}
              fullWidth
              placeholder="Password"
              autoFocus={true}
            />
            <Typography
              variant="caption"
              style={{ display: "block", color: "red", marginTop: "0.5em" }}
            >
              {errorMsg}
            </Typography>
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="primary">Cancel</Button>
          <Button color="primary" onClick={this.handleSubmit}>
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(withStyles(styles)(InputPasswordDialog));
