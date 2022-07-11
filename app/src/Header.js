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
      <div className="right menu">
        <a href="logout" className="ui item">
          Logout
        </a>
      </div>
    </div>
  );
};

export default Header;
