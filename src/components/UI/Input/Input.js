import React from "react";

import classes from "./Input.module.css";

const Input = (props) => {
  let inputElement = null;
  switch (props.elementType) {
    case "input":
      inputElement = <input onChange={props.changed} className={classes.InputElement} {...props.elementConfig} {...props.validation} />;
      break;
    case "textarea":
      inputElement = <textarea onChange={props.changed} className={classes.InputElement} {...props.elementConfig} {...props.validation} />;
      break;
    case "select":
      const options = (props.elementConfig.options).map((option) => {
        return <option key={option.name} name={option.name}>{option.displayValue}</option>;
      });

      inputElement = (
        <select onChange={props.changed} className={classes.InputElement} {...props.elementConfig}>
          {options}
        </select>
      );
      break;
    default:
      inputElement = <input className={classes.InputElement} {...props} />;
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default Input;
