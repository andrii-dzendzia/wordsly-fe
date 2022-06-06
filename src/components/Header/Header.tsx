import React from 'react';
import { Link } from 'react-router-dom';
import { getRefreshToken } from '../../tokenHandler';
import { Menu } from '../Menu/Menu';
import './Header.scss';

export const Header: React.FC = () => {
  const refreshToken = getRefreshToken();

  return (
    <header className="header">
      <Link
        to="/"
        className="header__logo has-text-primary-dark has-text-weight-light is-size-2"
      >
        Wordsly
      </Link>

      {refreshToken ? (
        <Menu />
      ) : (
        <Link
          to="/sign-in"
          className="header__sign-in is-size-4"
        >
          Sign in
        </Link>
      )}
    </header>
  );
};
