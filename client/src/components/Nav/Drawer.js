import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import NestedList from "./NestedList";

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
};

class TemporaryDrawer extends React.Component {
  render() {
    const { classes, drawerOpen, toggleDrawerOpen } = this.props;

    const sideList = (
      <div className={classes.list}>
        <NestedList
          drawerOpen={drawerOpen}
          toggleDrawerOpen={toggleDrawerOpen}
        />
      </div>
    );

    return (
      <div>
        <Drawer
          open={this.props.drawerOpen}
          onClose={() => this.props.toggleDrawerOpen(false)}
        >
          <div
            tabIndex={0}
            role="button"
            onKeyDown={() => this.props.toggleDrawerOpen(false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(TemporaryDrawer);
