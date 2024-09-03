import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Songs</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
