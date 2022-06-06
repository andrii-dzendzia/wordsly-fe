import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useMatch } from 'react-router-dom';
import { AccountType } from '../../enums';
import { userActions, userSelectors } from '../../store/user';
import { clearLocalStorage } from '../../tokenHandler';
import './Menu.scss';

export const Menu: React.FC = () => {
  const match = useMatch('/');
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.getUser);
  const [isActive, setActive] = useState(false);
  const node = useRef<HTMLDivElement>(null);

  const clickOutside = useCallback((e: MouseEvent) => {
    if (!node.current?.contains(e.target as Node)) {
      setActive(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', clickOutside);

    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, []);

  const handleLogOut = () => {
    clearLocalStorage();
    dispatch(userActions.setUser(null));

    if (match) {
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
  };

  if (!user) {
    return <></>;
  }

  return (
    <div
      ref={node}
      className={classNames('menu dropdown is-right', { 'is-active': isActive })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="menu__button is-size-4"
          onClick={() => setActive(!isActive)}
        >
          {`${user?.firstname} ${user?.lastname}`}
        </button>
      </div>

      <div className="menu__box dropdown-menu">
        {user.accountType === AccountType.User && (
          <div className="menu__content dropdown-content">
            <Link to="/profile" className="menu__item dropdown-item">
              My profile
            </Link>
            <hr className="dropdown-divider" />

            <Link to="/projects/my" className="menu__item dropdown-item">
              My projects
            </Link>
            <hr className="dropdown-divider" />

            <Link to="/quote" className="menu__item dropdown-item">
              New project
            </Link>
            <hr className="dropdown-divider" />

            <Link
              to="/"
              onClick={handleLogOut}
              className="menu__item dropdown-item"
            >
              Log out
            </Link>
          </div>
        )}

        {user.accountType === AccountType.Translator && (
          <div className="menu__content dropdown-content">
            <Link to="/profile" className="menu__item dropdown-item">
              My profile
            </Link>
            <hr className="dropdown-divider" />

            <Link to="/projects/my" className="menu__item dropdown-item">
              My projects
            </Link>
            <hr className="dropdown-divider" />

            <Link to="/projects" className="menu__item dropdown-item">
              Available projects
            </Link>
            <hr className="dropdown-divider" />

            <Link
              to="/"
              className="menu__item dropdown-item"
              onClick={handleLogOut}
            >
              Log out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
