import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo'

function Header() {
  return (
    <header className="site-header">
      <div className="container">
         <Logo />
        <h1 className="logo"><Link to="/">Image gallery</Link></h1>
        <nav className="nav">
          <Link to="/gallery">My gallery</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;