import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import { signUp } from '../../api/authorization';
import { emailTest, passwordTest } from '../../RegExps';
import { userActions } from '../../store/user';
import { setTokens } from '../../tokenHandler';
import './Authorization.scss';

export const SignUp: React.FC = () => {
  const handleError = useErrorHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('0');
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

  const handleFirstname = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFirstname(value);
  };

  const handleLastname = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setLastname(value);
  };

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    setAccountType(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasEmailError || hasPasswordError || accountType === '0') {
      return;
    }

    try {
      const tokens = await signUp({
        email,
        password,
        firstname,
        lastname,
        accountType: +accountType,
      });

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
        Sign up to
        <Link to="/" className="has-text-primary-dark"> Wordsly</Link>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="authorization__form mb-3"
      >
        <div className="field">
          <input
            type="text"
            placeholder="Firstname"
            required
            value={firstname}
            onChange={handleFirstname}
            className="input is-rounded has-text-weight-light is-medium"
          />
        </div>

        <div className="field">
          <input
            type="text"
            placeholder="Lastname"
            required
            value={lastname}
            onChange={handleLastname}
            className="input is-rounded has-text-weight-light is-medium"
          />
        </div>

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

        <div className="field">
          <div className={classNames('select is-rounded is-fullwidth is-medium', { authorization__placeholder: accountType === '0' })}>
            <select
              value={accountType}
              onChange={handleSelect}
              className="has-text-weight-light"
            >
              <option value="0" disabled>Choose your account type</option>
              <option value="1">Customer</option>
              <option value="2">Translator</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="authorization__button button is-fullwidth is-rounded is-medium"
        >
          Sign up
        </button>
      </form>

      <p className="has-text-white has-text-weight-light is-size-5">
        Already have an account?&nbsp;
        <Link
          to="/sign-in"
          className="has-text-primary-dark"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};
