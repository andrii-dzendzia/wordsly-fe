import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../Header/Header';
import background from '../../images/not-found.png';

type Props = {
  error: Error,
  resetErrorBoundary: () => void,
};

export const FallbackComponent: React.FC<Props> = ({ error, resetErrorBoundary }) => {
  return (
    <div>
      <Header />

      <section className="home">
        <h2 className="home__title has-text-weight-light">{error.message}</h2>

        <div className="columns">
          <div className="home__section column is-half-desktop">
            <Link
              to="/"
              onClick={resetErrorBoundary}
              className="home__button button is-rounded is-medium"
            >
              Go to home page
            </Link>
          </div>
        </div>

        <img
          src={background}
          alt="background"
          className="home__background is-hidden-touch"
        />
      </section>
    </div>
  );
};
