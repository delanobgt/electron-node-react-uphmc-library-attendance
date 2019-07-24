import _ from "lodash";
import React from "react";
import { withStyles, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import { CheckCircleOutlined as CheckCircleIcon } from "@material-ui/icons";

const styles = theme => ({});

const INITIAL_STATE = {
  progressBarValue: 0
};

class CardToastDialog extends React.Component {
  state = INITIAL_STATE;
  timerInterval = null;

  onClose = () => {
    const { name, toggleDialog } = this.props;
    toggleDialog(name)(false);
  };

  componentDidMount() {
    this.timerInterval = setInterval(() => {
      this.setState(state => {
        if (state.progressBarValue === 100) {
          this.onClose();
          return {};
        } else {
          return {
            progressBarValue: state.progressBarValue + 10
          };
        }
      });
    }, 500);
  }

  componentWillUnmount() {
    const { timerInterval } = this.state;
    if (timerInterval) clearInterval(timerInterval);
  }

  render() {
    const { progressBarValue } = this.state;
    const { state, name } = this.props;
    const payload = state[name];

    if (!payload) return null;

    return (
      <Dialog
        open={Boolean(payload)}
        aria-labelledby="form-dialog-title"
        onClose={this.onClose}
      >
        <DialogContent
          onClick={this.onClose}
          style={{ background: "limegreen", minWidth: "16em" }}
        >
          <div style={{ textAlign: "center", marginTop: "1em" }}>
            <CheckCircleIcon style={{ fontSize: "6em", color: "white" }} />
          </div>
          <Typography
            variant="subtitle1"
            align="center"
            gutterBottom
            style={{ color: "white", marginTop: "2em" }}
          >
            Signed in as
          </Typography>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ color: "white" }}
          >
            {_.chain(payload.name)
              .lowerCase()
              .startCase()
              .value()}
          </Typography>

          <Typography
            variant="subtitle2"
            align="center"
            gutterBottom
            style={{
              color: "white",
              marginTop: "2.5em",
              marginBottom: "0.5em"
            }}
          >
            TAP TO DISMISS
          </Typography>

          <div>
            <LinearProgress variant="determinate" value={progressBarValue} />
            <Typography
              variant="caption"
              align="center"
              gutterBottom
              style={{ display: "block", color: "white", marginTop: "0.2em" }}
            >
              (will autoclose in {5 - Math.floor(progressBarValue / 20)}{" "}
              seconds)
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(CardToastDialog);
