import React from "react";
import "./App.css";

const Header = () => {
  return (
    <div className="ui tabular menu">
      <a href="poi" className="item active">
        poi
      </a>
      <a href="state" className="item active">
        state
      </a>
    </div>
  );
};

export default Header;
