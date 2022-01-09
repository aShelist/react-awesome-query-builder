import React, { PureComponent } from "react";
import { Dropdown, Menu, Button } from "antd";
import { IconAddGroup, IconMore, IconPlus, IconTrash } from '../icons';

const groupActionsPositionList = {
  topLeft: "group--actions--tl",
  topCenter: "group--actions--tc",
  topRight: "group--actions--tr",
  bottomLeft: "group--actions--bl",
  bottomCenter: "group--actions--bc",
  bottomRight: "group--actions--br"
};
const defaultPosition = "topRight";

export class GroupActions extends PureComponent {
  render() {
    const {
      config,
      addRule, addGroup, removeSelf, setLock, isLocked, isTrueLocked, id,
      canAddGroup, canAddRule, canDeleteGroup
    } = this.props;
    const {
      groupActionsPosition,
    } = config.settings;
    const position = groupActionsPositionList[groupActionsPosition || defaultPosition];

    const actions = {
      addRule,
      addGroup,
      removeSelf
    };
    const menu = (
      <Menu onClick={({ key }) => actions[key].call()}>
        {canAddRule && <Menu.Item key="addRule" className="dropdown__item" icon={<IconPlus />}>
          Добавить условие
        </Menu.Item>}
        {canAddGroup && <Menu.Item key="addGroup" className="dropdown__item" icon={<IconAddGroup />}>
          Добавить группу
        </Menu.Item>}
        {canDeleteGroup && <Menu.Item key="removeSelf" className="dropdown__item" icon={<IconTrash />}>
          Удалить условие
        </Menu.Item>}
      </Menu>
    );

    return (
      <div className={`group--actions ${position}`}>
        <Dropdown
          overlay={menu}
        >
          <Button className="group--actions__dropdown" icon={<IconMore />} />
        </Dropdown>
      </div>
    );
  }
}
