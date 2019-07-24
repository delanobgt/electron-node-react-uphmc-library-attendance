import React, { Component, Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({});

class Welcome extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Grid container justify="center">
          <Grid item xs={11}>
            <Paper elevation={3} style={{ padding: "2em" }}>
              <Typography variant="h4" gutterBottom className={classes.class}>
                Dashboard
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                className={classes.class}
              >
                Welcome to UPHMC Library Attendance System
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Welcome);
