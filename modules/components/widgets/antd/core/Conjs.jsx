import React, { PureComponent } from "react";
import { Button } from "antd";
const classNames = require("classnames");
const ButtonGroup = Button.Group;


class ConjsButton extends PureComponent {
  onClick = (_e) => {
    const {setConjunction, anotherItem} = this.props;
    const conj = anotherItem.key;
    setConjunction(conj);
  }

  render() {
    const {disabled, item} = this.props;
    const cn = classNames(
      "btn-group",
      item.key === "OR" && "btn-group-or",
      item.key === "AND" && "btn-group-and",
      item.checked && "btn-group-checked"
    );
    return (
      <Button
        disabled={disabled}
        className={cn}
        onClick={this.onClick}
      >{item.label}</Button>
    );
  }
}


export default class ConjsButtons extends PureComponent {
  render() {
    const {readonly, disabled, conjunctionOptions, config, setConjunction } = this.props;
    const checked = Object.values(conjunctionOptions).find(item => item.checked);
    const notChecked = Object.values(conjunctionOptions).find(item => !item.checked);
    const { renderSize } = config.settings;

    return (
      <ButtonGroup
        key="group-conjs-buttons"
        size={"middle"}
        disabled={disabled || readonly}
      >
        <ConjsButton
          item={checked}
          anotherItem={notChecked}
          disabled={disabled || readonly}
          setConjunction={setConjunction}
        />
      </ButtonGroup>
    );
  }
}
