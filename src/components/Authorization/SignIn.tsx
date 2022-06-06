import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import { signIn } from '../../api/authorization';
import { emailTest, passwordTest } from '../../RegExps';
import { userActions } from '../../store/user';
import { setTokens } from '../../tokenHandler';
import './Authorization.scss';

export const SignIn: React.FC = () => {
  const handleError = useErrorHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasPasswordError, setPasswordError] = useState(false);
  const [hasEmailError, setEmailError] = useState(false);

  const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setEmailError(false);
    setEmail(value);
  };

  const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setPasswordError(false);
    setPassword(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasEmailError || hasPasswordError) {
      return;
    }

    try {
      const tokens = await signIn(email, password);

      setTokens(tokens);
      dispatch(userActions.loadUser());
      navigate('/profile');
    } catch (error) {
      handleError(error);
    }
  };

  const validateEmail = () => {
    if (!emailTest.test(email)) {
      setEmailError(true);
    }
  };

  const validatePassword = () => {
    if (!passwordTest.test(password)) {
      setPasswordError(true);
    }
  };

  return (
    <div className="authorization">
      <h1
        className="title has-text-white has-text-weight-light is-size-1 mb-6"
      >
        Sign in to
        <Link to="/" className="has-text-primary-dark"> Wordsly</Link>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="authorization__form mb-3"
      >
        <div className="field">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleEmail}
            onBlur={validateEmail}
            className={classNames('input is-rounded has-text-weight-light is-medium', { 'is-danger': hasEmailError })}
          />
          {hasEmailError && (
            <p className="authorization__error help is-danger">Please, enter a valid email</p>
          )}
        </div>

        <div className="field">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={handlePassword}
            onBlur={validatePassword}
            className={classNames('input is-rounded has-text-weight-light is-medium', { 'is-danger': hasPasswordError })}
          />
          {hasPasswordError && (
            <p className="authorization__error help is-danger">
              Password must contain at least 8 characters, one digit,
              one uppercase and lowercase letter
            </p>
          )}
        </div>

        <button
          type="submit"
          className="authorization__button button is-fullwidth is-rounded is-medium"
        >
          Sign in
        </button>
      </form>

      <p className="has-text-white has-text-weight-light is-size-5">
        Don&apos;t have an account yet?&nbsp;
        <Link
          to="/sign-up"
          className="has-text-primary-dark"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};
