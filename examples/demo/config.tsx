import React, {Component} from "react";
import merge from "lodash/merge";
import {
  BasicConfig, BasicFuncs,
  // types:
  Operators, Widgets, Fields, Config, Types, Conjunctions, Settings, LocaleSettings, OperatorProximity, Funcs,
  DateTimeFieldSettings,
} from "react-awesome-query-builder";
import moment from "moment";
import ru_RU from "antd/lib/locale-provider/ru_RU";
import { ruRU } from "@material-ui/core/locale";

import AntdConfig from "react-awesome-query-builder/config/antd";
import AntdWidgets from "react-awesome-query-builder/components/widgets/antd";
import MaterialConfig from "react-awesome-query-builder/config/material";
const {
  FieldSelect,
  FieldDropdown,
  FieldCascader,
  FieldTreeSelect,
} = AntdWidgets;

const skinToConfig: Record<string, Config> = {
  vanilla: BasicConfig,
  antd: AntdConfig,
  material: MaterialConfig,
};

export default (skin: string) => {
  const InitialConfig = skinToConfig[skin] as BasicConfig;

  const demoListValues = [
    {title: "A", value: "a"},
    {title: "AA", value: "aa"},
    {title: "AAA1", value: "aaa1"},
    {title: "AAA2", value: "aaa2"},
    {title: "B", value: "b"},
    {title: "C", value: "c"},
    {title: "D", value: "d"},
    {title: "E", value: "e"},
    {title: "F", value: "f"},
    {title: "G", value: "g"},
    {title: "H", value: "h"},
    {title: "I", value: "i"},
    {title: "J", value: "j"},
  ];

  const conjunctions: Conjunctions = {
    ...InitialConfig.conjunctions,
  };

  const operators: Operators = {
    equal: {
      ...InitialConfig.operators.equal,
    },
    less: {
      ...InitialConfig.operators.less,
    },
    greater: {
      ...InitialConfig.operators.greater,
    },
    not_equal: {
      ...InitialConfig.operators.not_equal,
    },
    is_empty: {
      ...InitialConfig.operators.not_equal,
      label: 'Пусто'
    },
    is_not_empty: {
      ...InitialConfig.operators.not_equal,
      label: 'Не пусто'
    },
  };

  const widgets: Widgets = {
    ...InitialConfig.widgets,
    // examples of  overriding
    text: {
      ...InitialConfig.widgets.text
    },
    textarea: {
      ...InitialConfig.widgets.textarea,
      maxRows: 3
    },
    slider: {
      ...InitialConfig.widgets.slider
    },
    rangeslider: {
      ...InitialConfig.widgets.rangeslider
    },
    date: {
      ...InitialConfig.widgets.date,
      dateFormat: "DD.MM.YYYY",
      valueFormat: "YYYY-MM-DD",
    },
    time: {
      ...InitialConfig.widgets.time,
      timeFormat: "HH:mm",
      valueFormat: "HH:mm:ss",
    },
    datetime: {
      ...InitialConfig.widgets.datetime,
      timeFormat: "HH:mm",
      dateFormat: "DD.MM.YYYY",
      valueFormat: "YYYY-MM-DD HH:mm:ss",
    },
    func: {
      ...InitialConfig.widgets.func,
      customProps: {
        showSearch: true
      }
    },
    select: {
      ...InitialConfig.widgets.select,
    },
    multiselect: {
      ...InitialConfig.widgets.multiselect,
      customProps: {
        //showCheckboxes: false,
        width: "200px",
        input: {
          width: "100px"
        }
      }
    },
    treeselect: {
      ...InitialConfig.widgets.treeselect,
      customProps: {
        showSearch: true
      }
    },
  };


  const types: Types = {
    ...InitialConfig.types,
    // examples of  overriding
    boolean: merge(InitialConfig.types.boolean, {
      widgets: {
        boolean: {
          widgetProps: {
            hideOperator: true,
            operatorInlineLabel: "is"
          },
          opProps: {
            equal: {
              label: "is"
            },
            not_equal: {
              label: "is not"
            }
          }
        },
      },
    }),
  };


  const localeSettings: LocaleSettings = {
    locale: {
      moment: "ru",
      antd: ru_RU,
      material: ruRU,
    },
    valueLabel: "Value",
    valuePlaceholder: "Value",
    fieldLabel: "Field",
    operatorLabel: "Operator",
    funcLabel: "Function",
    fieldPlaceholder: "Выберите поле",
    funcPlaceholder: "Select function",
    operatorPlaceholder: "Select operator",
    lockLabel: "Lock",
    lockedLabel: "Locked",
    deleteLabel: null,
    addGroupLabel: "Add group",
    addRuleLabel: "Add rule",
    addSubRuleLabel: "Add sub rule",
    delGroupLabel: null,
    notLabel: "Not",
    valueSourcesPopupTitle: "Select value source",
    removeRuleConfirmOptions: {
      title: "Are you sure delete this rule?",
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel"
    },
    removeGroupConfirmOptions: {
      title: "Are you sure delete this group?",
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel"
    },
  };

  const settings: Settings = {
    ...InitialConfig.settings,
    ...localeSettings,

    defaultSliderWidth: "200px",
    defaultSelectWidth: "200px",
    defaultSearchWidth: "100px",
    defaultMaxRows: 5,
    showNot: false,
    renderSize: "medium",
    valueSourcesInfo: {
      value: {
        label: "Value"
      },
      field: {
        label: "Field",
        widget: "field",
      },
      func: {
        label: "Function",
        widget: "func",
      }
    },
    canReorder: false,
    canRegroup: false,
    showLock: false,
    // showNot: true,
    // showLabels: true,
    // maxNesting: 5,
    canLeaveEmptyGroup: true,
    shouldCreateEmptyGroup: false,
    showErrorMessage: true,
    customFieldSelectProps: {
      showSearch: true
    },
    compositeMode: true,
    // renderField: (props) => <FieldCascader {...props} />,
    // renderOperator: (props) => <FieldDropdown {...props} />,
    // renderFunc: (props) => <FieldSelect {...props} />,
    // maxNumberOfRules: 10 // number of rules can be added to the query builder
  };

  //////////////////////////////////////////////////////////////////////

  const fields: Fields = {
    name: {
      label: "Имя",
      type: "text",
    },
    pet: {
      label: "Питомец",
      type: "text",
    },
    balance: {
      label: "Баланс",
      type: "number",
    },
    city: {
      label: "Город",
      type: "text",
    },
    age: {
      label: "Возраст",
      type: "number",
    },

    date: {
      label: "Дата рождения",
      type: "date",
      valueSources: ["value"],
      fieldSettings: {
        dateFormat: "DD-MM-YYYY",
        validateValue: (val, fieldSettings: DateTimeFieldSettings) => {
          // example of date validation
          const dateVal = moment(val, fieldSettings.valueFormat);
          return dateVal.year() != (new Date().getFullYear()) ? "Please use current year" : null;
        },
      },
    },
  };

  //////////////////////////////////////////////////////////////////////

  const funcs: Funcs = {
    ...BasicFuncs
  };


  const config: Config = {
    conjunctions,
    operators,
    widgets,
    types,
    settings,
    fields,
    funcs,
  };

  return config;
};

