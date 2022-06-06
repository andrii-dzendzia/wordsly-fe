import classNames from 'classnames';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useErrorHandler } from 'react-error-boundary';
import { saveProject } from '../../api/quota';
import {
  getPersonalInfo,
  getProjectsInfo,
  updateEmail,
  updateName,
  updatePassword,
  updatePersonalInfo,
} from '../../api/user';
import { emailTest, passwordTest } from '../../RegExps';
import { userActions, userSelectors } from '../../store/user';
import { PersonalInfo, UserProjects } from '../../types';
import { Header } from '../Header/Header';
import './UserProfile.scss';

export const UserProfile: React.FC = () => {
  const handleError = useErrorHandler();
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.getUser);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState<UserProjects | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [website, setWebsite] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [hasPasswordError, setPasswordError] = useState(false);
  const [isWrongPassword, setWrongPassword] = useState(false);
  const [hasNewPasswordError, setNewPasswordError] = useState(false);
  const [hasEmailError, setEmailError] = useState(false);
  const [hasFirstnameError, setFirstnameError] = useState(false);
  const [hasLastnameError, setLastnameError] = useState(false);

  useEffect(() => {
    (async () => {
      const quoteId = sessionStorage.getItem('quote');
      const preferences = sessionStorage.getItem('preferences');

      if (quoteId) {
        try {
          await saveProject(quoteId, preferences);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
        } finally {
          sessionStorage.removeItem('quote');
          sessionStorage.removeItem('preferences');
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const newProjects = await getProjectsInfo();
        const newInfo = await getPersonalInfo();

        setProjects(newProjects);
        setPersonalInfo(newInfo);
        setWebsite(newInfo.website);
        setCompany(newInfo.company);
      } catch (error) {
        handleError(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (user?.firstname !== firstname || user?.lastname !== lastname) {
      try {
        const newUser = await updateName(firstname, lastname);

        dispatch(userActions.setUser(newUser));
      } catch (error) {
        handleError(error);
      }
    }

    if (personalInfo?.website !== website || personalInfo.company !== company) {
      try {
        const newPersonalInfo = await updatePersonalInfo(website, company);

        setPersonalInfo(newPersonalInfo);
      } catch (error) {
        handleError(error);
      }
    }

    if (user?.email !== email) {
      try {
        const newUser = await updateEmail(email);

        dispatch(userActions.setUser(newUser));
      } catch (error) {
        handleError(error);
      }
    }

    if (password && newPassword) {
      try {
        await updatePassword(password, newPassword);
      } catch (e) {
        setWrongPassword(true);
      }
    }
  };

  const validateEmail = () => {
    if (!emailTest.test(email)) {
      setEmailError(true);
    }
  };

  const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setEmailError(false);
    setEmail(value);
  };

  const validateFirstname = () => {
    if (!firstname) {
      setFirstnameError(true);
    }
  };

  const handleFirstname = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFirstnameError(false);
    setFirstname(value);
  };

  const validateLastname = () => {
    if (!lastname) {
      setLastnameError(true);
    }
  };

  const handleLastname = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setLastnameError(false);
    setLastname(value);
  };

  const validatePassword = () => {
    if (!passwordTest.test(password) && password) {
      setPasswordError(true);
    }
  };

  const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setPasswordError(false);
    setWrongPassword(false);
    setPassword(value);
  };

  const validateNewPassword = () => {
    if (!passwordTest.test(newPassword) && newPassword) {
      setNewPasswordError(true);
    }
  };

  const handleNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewPasswordError(false);
    setNewPassword(value);
  };

  const handleCancel = () => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setEmail(user.email);
    }

    if (personalInfo) {
      setCompany(personalInfo.company);
      setWebsite(personalInfo.website);
    }

    setPassword('');
    setNewPassword('');

    setFirstnameError(false);
    setLastnameError(false);
    setEmailError(false);
    setPasswordError(false);
    setNewPasswordError(false);
    setWrongPassword(false);
  };

  return (
    <div>
      <div className="user-profile__header">
        <Header />
      </div>

      <div className="user-profile__container">
        <div className="user-profile__projects-info has-text-white has-text-weight-light">
          <div className="user-profile__projects-info-data">
            <p className="is-size-1">{projects?.active}</p>
            <p className="is-size-3"> active projects</p>
          </div>

          <div className="user-profile__projects-info-data">
            <p className="is-size-1">{projects?.completed}</p>
            <p className="is-size-3">completed projects</p>
          </div>

          <div className="user-profile__projects-info-data">
            <p className="is-size-1">{projects?.waiting}</p>
            <p className="is-size-3">waiting for payment</p>
          </div>

          <div className="user-profile__projects-info-data">
            <p className="is-size-1">{`${projects?.money}$`}</p>
            <p className="is-size-3">total amount</p>
          </div>
        </div>

        <h2 className="user-profile__personal-info-title has-text-centered has-text-white has-text-weight-light is-size-3">
          Personal information
        </h2>

        <div className="user-profile__personal-info">
          <label
            htmlFor="firstname"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Firstname:

            <div className="control">
              <input
                id="firstname"
                type="text"
                value={firstname}
                onChange={handleFirstname}
                onBlur={validateFirstname}
                className={classNames(
                  'user-profile__personal-info-input input is-rounded has-text-weight-light is-medium',
                  { 'is-danger': hasFirstnameError },
                )}
              />
              {hasFirstnameError && (
                <p className="user-profile__error help is-danger">Please, enter your firstname</p>
              )}
            </div>
          </label>

          <label
            htmlFor="lastname"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Lastname:

            <div className="control">
              <input
                id="lastname"
                type="text"
                value={lastname}
                onChange={handleLastname}
                onBlur={validateLastname}
                className={classNames(
                  'user-profile__personal-info-input input is-rounded has-text-weight-light is-medium',
                  { 'is-danger': hasLastnameError },
                )}
              />
              {hasLastnameError && (
                <p className="user-profile__error help is-danger">Please, enter a valid email</p>
              )}
            </div>
          </label>

          <label
            htmlFor="company"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Company name:

            <div className="control">
              <input
                id="company"
                type="text"
                value={company}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setCompany(event.target.value);
                }}
                className="user-profile__personal-info-input input is-rounded has-text-weight-light is-medium"
              />
            </div>
          </label>

          <label
            htmlFor="userWebsite"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Website:

            <div className="control">
              <input
                id="userWebsite"
                type="text"
                value={website}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setWebsite(event.target.value);
                }}
                className="user-profile__personal-info-input input is-rounded has-text-weight-light is-medium"
              />
            </div>
          </label>
        </div>

        <h2 className="user-profile__personal-info-title has-text-centered has-text-white has-text-weight-light is-size-3">
          Security and privacy
        </h2>

        <div className="user-profile__personal-info">
          <label
            htmlFor="password"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Current password:

            <div className="control">
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePassword}
                onBlur={validatePassword}
                className={classNames(
                  'user-profile__personal-info-input input is-rounded has-text-weight-light is-medium',
                  { 'is-danger': hasPasswordError || isWrongPassword },
                )}
              />
              {hasPasswordError && (
                <p className="user-profile__error help is-danger">
                  Password must contain at least 8 characters, one digit,
                  one uppercase and lowercase letter
                </p>
              )}
              {isWrongPassword && (
                <p className="user-profile__error help is-danger">
                  Ooops, wrong password.
                </p>
              )}
            </div>
          </label>

          <label
            htmlFor="newPassword"
            className="has-text-white has-text-weight-light is-size-4"
          >
            New password:

            <div className="control">
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleNewPassword}
                onBlur={validateNewPassword}
                className={classNames(
                  'user-profile__personal-info-input input is-rounded has-text-weight-light is-medium',
                  { 'is-danger': hasNewPasswordError },
                )}
              />
              {hasNewPasswordError && (
                <p className="user-profile__error help is-danger">
                  Password must contain at least 8 characters, one digit,
                  one uppercase and lowercase letter
                </p>
              )}
            </div>
          </label>

          <label
            htmlFor="email"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Email:

            <div className="control">
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmail}
                onBlur={validateEmail}
                className={classNames(
                  'user-profile__personal-info-input input is-rounded has-text-weight-light is-medium',
                  { 'is-danger': hasEmailError },
                )}
              />
              {hasEmailError && (
                <p className="user-profile__error help is-danger">Please, enter a valid email</p>
              )}
            </div>
          </label>
        </div>

        <div className="user-profile__button-container">
          <button
            type="button"
            className="user-profile__cancel button is-rounded is-medium"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              hasEmailError
              || hasPasswordError
              || isWrongPassword
              || hasNewPasswordError
              || hasFirstnameError
              || hasLastnameError
            }
            onClick={handleUpdate}
            className="user-profile__update button is-rounded is-medium"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
