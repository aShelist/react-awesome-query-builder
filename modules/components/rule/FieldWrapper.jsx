import React, { PureComponent } from "react";
import Field from "./Field";
import {Col} from "../utils";


export default class FieldWrapper extends PureComponent {
  render() {
    const { config, selectedField, setField, parentField, classname, readonly, id, groupId, error, saveRule } = this.props;
    return (
      <Col className={`${classname} ${error ? 'field-error' : ''}`}>
        { config.settings.showLabels
                    && <label className="rule--label">{config.settings.fieldLabel}</label>
        }
        <Field
          saveRule={saveRule}
          config={config}
          selectedField={selectedField}
          parentField={parentField}
          setField={setField}
          customProps={config.settings.customFieldSelectProps}
          readonly={readonly}
          id={id}
          groupId={groupId}
        />
      </Col>
    );
  }
}
