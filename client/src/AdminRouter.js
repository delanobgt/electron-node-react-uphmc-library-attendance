import React, { Component, Fragment } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Nav from "./components/Nav";
import Student from "./components/Student";

class AdminRouter extends Component {
  render() {
    return (
      <Fragment>
        <Nav />

        <Switch>
          <Route path="/admin/dashboard" exact component={Dashboard} />
          <Route path="/admin/students" exact component={Student} />

          <Route
            path="*"
            component={() => <Redirect to="/admin/dashboard" />}
          />
        </Switch>
      </Fragment>
    );
  }
}

export default AdminRouter;
