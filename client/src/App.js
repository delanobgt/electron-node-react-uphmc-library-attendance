import React, { Component } from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import LoginScreen from "./components/LoginScreen";
import AdminRouter from "./AdminRouter";

const myTheme = createMuiTheme({
  palette: { primary: { main: "#79cdcd", contrastText: "#fff" } }
});

const styles = theme => ({});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={myTheme}>
        <BrowserRouter>
          <Switch>
            <Route path="/loginScreen" component={LoginScreen} />
            <Route path="/admin" component={AdminRouter} />

            <Route path="*" component={() => <Redirect to="/loginScreen" />} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
