import React from 'react';
import { Nav } from 'react-bootstrap';
import Link from 'next/link';

const NavLink = ({ href, children, ...props }) => {
  return (
    <Nav.Link {...props}>
      <Link href={href} passHref>
        {children}
      </Link>
    </Nav.Link>
  );
};

export default NavLink;
