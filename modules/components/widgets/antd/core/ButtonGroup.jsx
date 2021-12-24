import React from "react";
import { Button } from "antd";
const ButtonGroup = Button.Group;

export default ({ children }) => {
  return <ButtonGroup
    size={"middle"}
  >{children}</ButtonGroup>;
};
