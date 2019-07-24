import React, { Component, Fragment } from "react";

import AppBar from "./AppBar";
import Drawer from "./Drawer";

class Nav extends Component {
  state = {
    drawerOpen: false
  };

  toggleDrawerOpen = drawerOpen => {
    this.setState({ drawerOpen });
  };

  render() {
    const { drawerOpen } = this.state;

    return (
      <Fragment>
        <AppBar
          drawerOpen={drawerOpen}
          toggleDrawerOpen={this.toggleDrawerOpen}
        />
        <Drawer
          drawerOpen={drawerOpen}
          toggleDrawerOpen={this.toggleDrawerOpen}
        />
        <br />
        <br />
      </Fragment>
    );
  }
}

export default Nav;
