import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../Header/Header';
import homeBackground from '../../images/home-background.png';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  return (
    <>
      <Header />

      <main>
        <section className="home">
          <h2 className="home__title has-text-weight-light">Translate Better and Faster</h2>

          <div className="columns">
            <div className="home__section column is-half-desktop">
              <p className="home__text has-text-weight-light">
                Easily translate your documents and digital content
                with quality and speed in over 50 languages.
              </p>

              <Link
                to="/quote"
                className="home__button button is-rounded is-medium"
              >
                Get an instant quote
              </Link>
            </div>
          </div>

          <img
            src={homeBackground}
            alt="background"
            className="home__background is-hidden-touch"
          />
        </section>
      </main>
    </>
  );
};
