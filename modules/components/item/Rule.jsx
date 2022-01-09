import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SliderSwitch } from "@vkontakte/vkui";
import RuleContainer from "../containers/RuleContainer";
import Draggable from "../containers/Draggable";
import OperatorWrapper from "../rule/OperatorWrapper";
import FieldWrapper from "../rule/FieldWrapper";
import Widget from "../rule/Widget";
import {getFieldConfig, getOperatorConfig, getFieldWidgetConfig} from "../../utils/configUtils";
import {getFieldPathLabels} from "../../utils/ruleUtils";
import {useOnPropsChanged} from "../../utils/reactUtils";
import {Col, DragIcon, dummyFn, ConfirmFn} from "../utils";
import { Button, Dropdown, Menu } from "antd";
import { IconAddGroup, IconCheck, IconPencil, IconPlus, IconTrash, IconCancel, IconMore } from "../icons";
import Immutable from "immutable";
const classNames = require("classnames");


@RuleContainer
@Draggable("rule")
@ConfirmFn
class Rule extends PureComponent {
    static propTypes = {
      id: PropTypes.string.isRequired,
      groupId: PropTypes.string,
      selectedField: PropTypes.string,
      selectedOperator: PropTypes.string,
      operatorOptions: PropTypes.object,
      config: PropTypes.object.isRequired,
      value: PropTypes.any, //depends on widget
      valueSrc: PropTypes.any,
      asyncListValues: PropTypes.array,
      isDraggingMe: PropTypes.bool,
      isDraggingTempo: PropTypes.bool,
      parentField: PropTypes.string, //from RuleGroup
      valueError: PropTypes.any,
      isLocked: PropTypes.bool,
      isTrueLocked: PropTypes.bool,
      //path: PropTypes.instanceOf(Immutable.List),
      //actions
      handleDraggerMouseDown: PropTypes.func,
      setField: PropTypes.func,
      setOperator: PropTypes.func,
      setOperatorOption: PropTypes.func,
      setLock: PropTypes.func,
      removeSelf: PropTypes.func,
      setValue: PropTypes.func,
      setValueSrc: PropTypes.func,
      reordableNodesCnt: PropTypes.number,
    };

    constructor(props) {
      super(props);
      useOnPropsChanged(this);
      this.removeSelf = this.removeSelf.bind(this);
      this.setLock = this.setLock.bind(this);

      this.onPropsChanged(props);

      this.state = {
        value: null,
        field: null,
        operator: "equal",
        setValueData: [],
        error: "",
        isNew: false
      };
    }

    onPropsChanged(nextProps) {
      const prevProps = this.props;
      const keysForMeta = ["selectedField", "selectedOperator", "config", "reordableNodesCnt", "isLocked"];
      const needUpdateMeta = !this.meta || keysForMeta.map(k => (nextProps[k] !== prevProps[k])).filter(ch => ch).length > 0;

      if (needUpdateMeta) {
        this.meta = this.getMeta(nextProps);
      }
    }

    componentDidMount() {
      const { config, value, isLocked } = this.props;
      const { compositeMode } = config.settings;

      if (compositeMode && (!value.get(0) || !["include", "exclude"].includes(value.get(0)))) {
        this.props.setValue(0, "include", "text");
        if (!isLocked) {
          this.setState({ value: "include" });
        }
      }

      if (!value.get(0)) {
        this.setState({ isNew: true });
      }
    }

    componentDidUpdate(prevProps) {
      const { isLocked, value, selectedField, selectedOperator, config } = this.props;

      if (prevProps.isLocked && !isLocked) {
        this.setState({
          value: value.get(0),
          operator: selectedOperator || "equal",
          field: selectedField,
          setValueData: [],
          isNew: !value.get(0) && !selectedOperator && !selectedField
        });
      }

      const { compositeMode } = config.settings;
      const compositeModePrev = prevProps.config.settings.compositeMode;

      if (!compositeModePrev && compositeMode && !["include", "exclude"].includes(value.get(0))) {
        this.props.setValue(0, "include", "text");
        this.clearError();
        if (!isLocked) {
          this.setState({ value: "include" });
        }
      }
    }

    getMeta({selectedField, selectedOperator, config, reordableNodesCnt, isLocked}) {
      const selectedFieldPartsLabels = getFieldPathLabels(selectedField, config);
      const selectedFieldConfig = getFieldConfig(config, selectedField);
      const isSelectedGroup = selectedFieldConfig && selectedFieldConfig.type == "!struct";
      const isFieldAndOpSelected = selectedField && selectedOperator && !isSelectedGroup;
      const selectedOperatorConfig = getOperatorConfig(config, selectedOperator, selectedField);
      const selectedOperatorHasOptions = selectedOperatorConfig && selectedOperatorConfig.options != null;
      const selectedFieldWidgetConfig = getFieldWidgetConfig(config, selectedField, selectedOperator) || {};
      const hideOperator = selectedFieldWidgetConfig.hideOperator;

      const showDragIcon = config.settings.canReorder && reordableNodesCnt > 1 && !isLocked;
      const showOperator = selectedField && !hideOperator;
      const showOperatorLabel = selectedField && hideOperator && selectedFieldWidgetConfig.operatorInlineLabel;
      const showWidget = isFieldAndOpSelected;
      const showOperatorOptions = isFieldAndOpSelected && selectedOperatorHasOptions;

      return {
        selectedFieldPartsLabels, selectedFieldWidgetConfig,
        showDragIcon, showOperator, showOperatorLabel, showWidget, showOperatorOptions
      };
    }

    setLock(lock) {
      this.props.setLock(lock);
    }

    saveField = () => {
      this.clearError();
      if (this.validateRule()) {
        this.props.setField(this.state.field);
        this.props.setOperator(this.state.operator);
        if (this.state.setValueData.length > 0) {
          this.props.setValue(...this.state.setValueData);
        }
        this.closeEditField();
      }
    }

    closeEditField = () => {
      this.clearError();
      this.setState({
        value: null,
        operator: "equal",
        field: null,
        isNew: false
      });
      this.props.setLock(true);
    }

    removeSelf() {
      const {confirmFn} = this.props;
      const {renderConfirm, removeRuleConfirmOptions: confirmOptions} = this.props.config.settings;
      const doRemove = () => {
        this.props.removeSelf();
      };
      if (confirmOptions && !this.isEmptyCurrentRule()) {
        renderConfirm({...confirmOptions,
          onOk: doRemove,
          onCancel: null,
          confirmFn: confirmFn
        });
      } else {
        doRemove();
      }
    }

    isEmptyCurrentRule() {
      return !(
        this.props.selectedField !== null
            && this.props.selectedOperator !== null
            && this.props.value.filter((val) => val !== undefined).size > 0
      );
    }

    validateRule = () => {
      const { config } = this.props;
      const { value, field, operator } = this.state;
      const { compositeMode } = config.settings;

      if (!value || !field || (!operator && compositeMode)) {
        let errorField = "";

        if (!field) {
          errorField = "field";
        } else if (!value) {
          errorField = "value";
        } else if (!operator && compositeMode) {
          errorField = "operator";
        }

        this.setState({
          error: "Необходимо заполнить все поля",
          errorField,
        });
        return false;
      }

      return true;
    }

    clearError = () => this.setState({ error: "", errorField: "" });

    renderField() {
      const {config, isLocked} = this.props;
      const { errorField } = this.state;
      const { immutableFieldsMode, compositeMode } = config.settings;

      if (!isLocked) {
        return <FieldWrapper
          key="field"
          classname={classNames("rule--field", compositeMode && "rule--field_composite")}
          config={config}
          error={errorField === "field"}
          selectedField={this.state.field}
          setField={this.setField}
          parentField={this.props.parentField}
          saveRule={this.saveField}
          readonly={immutableFieldsMode || isLocked}
          id={this.props.id}
          groupId={this.props.groupId}
        />;
      }

      return <FieldWrapper
        key="field"
        classname={classNames("rule--field", compositeMode && "rule--field_composite")}
        config={config}
        selectedField={this.props.selectedField}
        setField={!immutableFieldsMode ? this.props.setField : dummyFn}
        parentField={this.props.parentField}
        readonly={immutableFieldsMode || isLocked}
        id={this.props.id}
        groupId={this.props.groupId}
      />;
    }


    renderSwitcher () {
      const values = {
        include: "Включая сегмент",
        exclude: "Исключая сегмент"
      };

      const { isLocked, value } = this.props;
      const val = value.get(0);

      if (isLocked) {
        return (
          <div className={
            classNames(
              "segment",
              val === "include" && "segment_include",
              val === "exclude" && "segment_exclude"
            )
          }
          key="switcher"
          >
            {values[val]}
          </div>
        );
      }

      return (
        <div
          key="switcher"
          className="rule-switcher"
        >
          <SliderSwitch
            onSwitch={value => this.setValue(0, value, "text")}
            activeValue={this.state.value}
            options={Object.keys(values).map(value => ({ name: values[value], value }))}
          />
        </div>
      );

    }

    setOperator = (operator) => {
      this.clearError();
      this.setState({ operator });
    }
    setField = (field) => {
      this.clearError();
      this.setState({ field });
    }

    renderOperator () {
      const {config, isLocked} = this.props;
      const {
        selectedFieldPartsLabels, selectedFieldWidgetConfig, showOperator, showOperatorLabel
      } = this.meta;
      const { immutableOpsMode } = config.settings;
      const { errorField } = this.state;

      if (!isLocked) {
        return <OperatorWrapper
          key="operator"
          config={config}
          error={errorField === "operator"}
          selectedField={this.state.field || this.props.selectedField}
          selectedOperator={this.state.operator}
          setOperator={this.setOperator}
          selectedFieldPartsLabels={selectedFieldPartsLabels}
          showOperator={!!this.state.field}
          showOperatorLabel={showOperatorLabel}
          selectedFieldWidgetConfig={selectedFieldWidgetConfig}
          readonly={immutableOpsMode || isLocked}
          id={this.props.id}
          groupId={this.props.groupId}
        />;
      }

      return <OperatorWrapper
        key="operator"
        config={config}
        selectedField={this.props.selectedField}
        selectedOperator={this.props.selectedOperator}
        setOperator={dummyFn}
        selectedFieldPartsLabels={selectedFieldPartsLabels}
        showOperator={showOperator}
        showOperatorLabel={showOperatorLabel}
        selectedFieldWidgetConfig={selectedFieldWidgetConfig}
        readonly={immutableOpsMode || isLocked}
        id={this.props.id}
        groupId={this.props.groupId}
      />;
    }

    setValue = (...props) => {
      this.clearError();
      this.setState({
        value: props[1],
        setValueData: props
      });
    }

    renderWidget() {
      const {config, valueError, isLocked} = this.props;
      const { showWidget } = this.meta;
      const { immutableValuesMode } = config.settings;
      const { errorField } = this.state;
      if (!showWidget && !isLocked && !this.state.field) return null;

      let widget;
      if (!isLocked && this.state.field) {

        widget = <Widget
          key="values"
          field={this.state.field}
          parentField={this.props.parentField}
          operator={this.state.operator}
          error={errorField === 'value'}
          saveRule={this.saveField}
          value={new Immutable.List([ this.state.value ])}
          valueSrc={this.props.valueSrc}
          asyncListValues={this.props.asyncListValues}
          valueError={valueError}
          config={config}
          setValue={this.setValue}
          setValueSrc={!immutableValuesMode ? this.props.setValueSrc : dummyFn}
          readonly={immutableValuesMode || isLocked}
          id={this.props.id}
          groupId={this.props.groupId}
        />;
      } else {
        widget = <Widget
          key="values"
          field={this.props.selectedField}
          parentField={this.props.parentField}
          operator={this.props.selectedOperator}
          value={this.props.value}
          valueSrc={this.props.valueSrc}
          asyncListValues={this.props.asyncListValues}
          valueError={valueError}
          config={config}
          setValue={dummyFn}
          setValueSrc={!immutableValuesMode ? this.props.setValueSrc : dummyFn}
          readonly={immutableValuesMode || isLocked}
          id={this.props.id}
          groupId={this.props.groupId}
        />;
      }



      return (
        <Col key={"widget-for-"+this.props.selectedOperator} className="rule--value">
          {widget}
        </Col>
      );
    }

    renderError() {
      const {config, valueError} = this.props;

      const { renderRuleError, showErrorMessage } = config.settings;
      const oneValueError = valueError && valueError.toArray().filter(e => !!e).shift() || null;
      return showErrorMessage && oneValueError
        && <div className="rule--error">
          {renderRuleError ? renderRuleError({error: oneValueError}) : oneValueError}
        </div>;
    }

    renderDrag() {
      const { showDragIcon } = this.meta;

      return showDragIcon
        && <span
          key="rule-drag-icon"
          className={"qb-drag-handler rule--drag-handler"}
          onMouseDown={this.props.handleDraggerMouseDown}
        ><DragIcon /> </span>;
    }

    renderDel() {
      const {countRules, addRuleAfterThis, addGroupAfterThis, setLock, isLocked} = this.props;
      const { isNew } = this.state;

      const menu = (
        <Menu>
          {isLocked && <Button onClick={() => setLock(false)} className="rule-btn" icon={<IconPencil />} />}
          <Button onClick={() => addRuleAfterThis()} className="rule-btn" icon={<IconPlus />} />
          <Button onClick={() => addGroupAfterThis()} className="rule-btn" icon={<IconAddGroup />} />
          {countRules > 1 && (<Button className="rule-btn" onClick={this.removeSelf}  icon={<IconTrash />} />)}
        </Menu>
      );

      return (
        <>
          {!isLocked && <Button onClick={this.saveField} className="group--actions__dropdown" icon={<IconCheck  />} />}
          {!isLocked && !(isNew && countRules === 1) && <Button onClick={isNew ? this.removeSelf : this.closeEditField} className="group--actions__dropdown" icon={<IconCancel  />} />}
          <Dropdown
            overlay={menu}
            overlayClassName="rule-dropdown"
          >
            <Button className="group--actions__dropdown" icon={<IconMore  />} />
          </Dropdown>
        </>
      );
    }

    render () {
      const { showOperatorOptions, selectedFieldWidgetConfig } = this.meta;
      const { valueSrc, value, config } = this.props;
      const canShrinkValue = valueSrc.first() == "value" && !showOperatorOptions && value.size == 1 && selectedFieldWidgetConfig.fullWidth;
      const { renderButtonGroup: BtnGrp, compositeMode } = config.settings;

      const parts = [
        compositeMode && this.renderSwitcher(),
        this.renderField(),
        !compositeMode && this.renderOperator(),
        !compositeMode && this.renderWidget(),
      ];
      const body = <div key="rule-body" className={classNames("rule--body", canShrinkValue && "can--shrink--value")}>{parts}</div>;

      const error = this.renderError();
      const drag = this.renderDrag();
      const del = this.renderDel();

      return (
        <>
          {drag}
          <div className="rule--body--wrapper">
            {body}{error}
          </div>
          <div className="rule--header">
            <BtnGrp config={config}>
              {del}
            </BtnGrp>
          </div>
        </>
      );
    }

}


export default Rule;
