import React, {Component} from "react";
import {
  Query, Builder, Utils,
  //types:
  ImmutableTree, Config, BuilderProps, JsonTree, JsonLogicTree, ActionMeta, Actions
} from "react-awesome-query-builder";
import throttle from "lodash/throttle";
import loadConfig from "./config";
import loadedInitValue from "./init_value";
import loadedInitLogic from "./init_logic";
import Immutable from "immutable";
import clone from "clone";

const stringify = JSON.stringify;
const {elasticSearchFormat, queryBuilderFormat, jsonLogicFormat, queryString, mongodbFormat, sqlFormat, getTree, checkTree, loadTree, uuid, loadFromJsonLogic, isValidTree} = Utils;
const preStyle = { backgroundColor: "darkgrey", margin: "10px", padding: "10px" };
const preErrorStyle = { backgroundColor: "lightpink", margin: "10px", padding: "10px" };

const initialSkin = window._initialSkin || "antd";
const emptyInitValue: JsonTree = {id: uuid(), type: "group"};
const loadedConfig = loadConfig(initialSkin);
let initValue: JsonTree = loadedInitValue && Object.keys(loadedInitValue).length > 0 ? loadedInitValue as JsonTree : emptyInitValue;
const initLogic: JsonLogicTree = loadedInitLogic && Object.keys(loadedInitLogic).length > 0 ? loadedInitLogic as JsonLogicTree : undefined;
let initTree: ImmutableTree;
//initTree = checkTree(loadTree(initValue), loadedConfig);
initTree = checkTree(loadFromJsonLogic(initLogic, loadedConfig), loadedConfig); // <- this will work same

// Trick to hot-load new config when you edit `config.tsx`
const updateEvent = new CustomEvent<CustomEventDetail>("update", { detail: {
  config: loadedConfig,
  _initTree: initTree,
  _initValue: initValue,
} });
window.dispatchEvent(updateEvent);

declare global {
  interface Window {
    _initialSkin: string;
  }
}

interface CustomEventDetail {
  config: Config;
  _initTree: ImmutableTree;
  _initValue: JsonTree;
}

interface DemoQueryBuilderState {
  tree: ImmutableTree;
  config: Config;
}

type ImmOMap = Immutable.OrderedMap<string, any>;

export default class DemoQueryBuilder extends Component<{}, DemoQueryBuilderState> {
    private immutableTree: ImmutableTree;
    private config: Config;

    componentDidMount() {
      window.addEventListener("update", this.onConfigChanged);
    }

    componentWillUnmount() {
      window.removeEventListener("update", this.onConfigChanged);
    }

    state = {
      tree: initTree,
      config: loadedConfig,
    };

    render = () => (
      <div>
        {/* @ts-ignore */}
        <Query
          {...this.state.config}
          // value={this.state.tree}
          onChange={this.onChange}
          renderBuilder={this.renderBuilder}
        />

        <div className="query-builder-result">
          {this.renderResult(this.state)}
        </div>
      </div>
    )

    onConfigChanged = (e: Event) => {
      const {detail: {config, _initTree, _initValue}} = e as CustomEvent<CustomEventDetail>;
      console.log("Updating config...");
      this.setState({
        config,
      });
      initTree = _initTree;
      initValue = _initValue;
    }

    validate = () => {
      this.setState({
        tree: checkTree(this.state.tree, this.state.config)
      });
    }

    clearValue = () => {
      this.setState({
        tree: loadTree(emptyInitValue),
      });
    };

    renderBuilder = (props: BuilderProps) => {
      return (
        <div className="query-builder-container" style={{padding: "10px"}}>
          <div className="query-builder qb-lite">
            <Builder {...props} />
          </div>
        </div>
      );
    }

    onChange = (immutableTree: ImmutableTree, config: Config, actionMeta?: ActionMeta) => {
      this.immutableTree = immutableTree;
      this.config = config;
      this.updateResult();

      const jsonTree = getTree(immutableTree); //can be saved to backend
    }

    updateResult = throttle(() => {
      this.setState({tree: this.immutableTree, config: this.config});
    }, 100)


    renderResult = ({tree: immutableTree, config} : {tree: ImmutableTree, config: Config}) => {
      const isValid = isValidTree(immutableTree);
      const {logic, data, errors} = jsonLogicFormat(immutableTree, config);
      return (
        <div>
          {isValid ? null : <pre style={preErrorStyle}>{"Tree has errors"}</pre>}
          <br />
          <hr/>
          <div>
            <a href="http://jsonlogic.com/play.html" target="_blank" rel="noopener noreferrer">jsonLogicFormat</a>:
            { errors.length > 0
              && <pre style={preErrorStyle}>
                {stringify(errors, undefined, 2)}
              </pre>
            }
            { !!logic
              && <pre style={preStyle}>
                {"// Rule"}:<br />
                {stringify(logic, undefined, 2)}
                <br />
                <hr />
                {"// Data"}:<br />
                {stringify(data, undefined, 2)}
              </pre>
            }
          </div>
          <hr/>
          <div>
          Tree:
            <pre style={preStyle}>
              {stringify(getTree(immutableTree), undefined, 2)}
            </pre>
          </div>
          <hr/>
          <div>
          queryBuilderFormat:
            <pre style={preStyle}>
              {stringify(queryBuilderFormat(immutableTree, config), undefined, 2)}
            </pre>
          </div>
        </div>
      );
    }

}
