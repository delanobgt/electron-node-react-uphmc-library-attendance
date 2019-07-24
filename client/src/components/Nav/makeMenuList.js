import _ from "lodash";
import React from "react";
import {
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon
} from "@material-ui/icons";

export default ({ props }) => {
  return _.chain([
    { icon: <DashboardIcon />, label: "Dashboard", link: "/admin/dashboard" },
    { icon: <PeopleIcon />, label: "Students", link: "/admin/students" },
    {
      icon: <AccessTimeIcon />,
      label: "Attendances",
      link: "/admin/attendances"
    },
    {
      icon: <ExitToAppIcon />,
      label: "Logout",
      link: "/"
    }
  ])
    .compact()
    .value();
};
