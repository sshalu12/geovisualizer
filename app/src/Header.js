import React from "react";
import "./App.css";

const Header = (props) => {
  return (
    <div className="ui tabular menu">
      <a
        href="locations"
        className={props.name === "location" ? "item active" : "item"}
      >
        location
      </a>
      <a
        href="state"
        className={props.name === "state" ? "item active" : "item"}
      >
        state
      </a>
    </div>
  );
};

export default Header;
