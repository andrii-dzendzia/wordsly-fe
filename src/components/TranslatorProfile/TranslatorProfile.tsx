import classNames from 'classnames';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useErrorHandler } from 'react-error-boundary';
import {
  getProjectsInfo,
  getTranslatorInfo,
  updateEmail,
  updateName,
  updatePassword,
  updateTranslatorInfo,
} from '../../api/user';
import { emailTest, passwordTest } from '../../RegExps';
import { languagesSelectors } from '../../store/language';
import { subjectsSelectors } from '../../store/subject';
import { userActions, userSelectors } from '../../store/user';
import { LanguagePair, TranslatorInfo, UserProjects } from '../../types';
import { Header } from '../Header/Header';
import '../UserProfile/UserProfile.scss';

export const TranslatorProfile: React.FC = () => {
  const handleError = useErrorHandler();
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.getUser);
  const subjects = useSelector(subjectsSelectors.getSubjects);
  const languages = useSelector(languagesSelectors.getLanguages);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState<UserProjects | null>(null);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [hasPasswordError, setPasswordError] = useState(false);
  const [isWrongPassword, setWrongPassword] = useState(false);
  const [hasNewPasswordError, setNewPasswordError] = useState(false);
  const [hasEmailError, setEmailError] = useState(false);
  const [hasFirstnameError, setFirstnameError] = useState(false);
  const [hasLastnameError, setLastnameError] = useState(false);

  const [translatorInfo, setTranslatorInfo] = useState<TranslatorInfo | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguagePair[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState(0);
  const [outputLanguage, setOutputLanguage] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const newProjects = await getProjectsInfo();
        const newTranslatorInfo = await getTranslatorInfo();

        setProjects(newProjects);
        setTranslatorInfo(newTranslatorInfo);
        setSelectedSubjects(newTranslatorInfo.subjectIds);
        setSelectedLanguages(newTranslatorInfo.languagesPairs);
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

    try {
      const newTranslatorInfo = await updateTranslatorInfo(selectedSubjects, selectedLanguages);

      setTranslatorInfo(newTranslatorInfo);
      setSelectedSubjects(newTranslatorInfo.subjectIds);
      setSelectedLanguages(newTranslatorInfo.languagesPairs);
    } catch (error) {
      handleError(error);
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

    setPassword('');
    setNewPassword('');

    setFirstnameError(false);
    setLastnameError(false);
    setEmailError(false);
    setPasswordError(false);
    setNewPasswordError(false);
    setWrongPassword(false);

    if (translatorInfo) {
      setSelectedLanguages(translatorInfo.languagesPairs);
      setSelectedSubjects(translatorInfo.subjectIds);
    }
  };

  const handleSubject = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value;

    if (!selectedSubjects.includes(value)) {
      setSelectedSubjects([...selectedSubjects, value]);
    }
  };

  const handleDeleteSubject = (subjectId: number) => {
    const newSelectedSubjects = selectedSubjects.filter(id => id !== subjectId);

    setSelectedSubjects(newSelectedSubjects);
  };

  const handleSourceLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value;

    setSourceLanguage(value);
  };

  const handleOutputLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value;

    setOutputLanguage(value);
  };

  const handleAddLanguages = () => {
    const isAdded = selectedLanguages.some(language => (
      language.sourceLanguageId === sourceLanguage
      && language.outputLanguageId === outputLanguage
    ));

    if (sourceLanguage && outputLanguage && !isAdded) {
      setSelectedLanguages([
        ...selectedLanguages,
        {
          sourceLanguageId: sourceLanguage,
          outputLanguageId: outputLanguage,
        },
      ]);
    }
  };

  const handleDeleteLanguage = (languagePair: LanguagePair) => {
    const newSelectedLanguages = selectedLanguages.filter(language => language !== languagePair);

    setSelectedLanguages(newSelectedLanguages);
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
            <p className="is-size-1">{`${projects?.money}$`}</p>
            <p className="is-size-3">total income</p>
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

        <h2 className="user-profile__personal-info-title has-text-centered has-text-white has-text-weight-light is-size-3">
          Subjects
        </h2>

        <div className="user-profile__subjects">
          <div className="select is-rounded is-medium">
            <select
              value={0}
              onChange={handleSubject}
              className="user-profile__subject-select has-text-weight-light"
            >
              <option value={0} disabled>Choose  subject(s)</option>
              {subjects.map(subject => (
                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.subject}
                </option>
              ))}
            </select>
          </div>

          <div className="user-profile__selected-subjects">
            {selectedSubjects.length ? (
              selectedSubjects.map(subjectId => {
                const selectedSubject = subjects.find(subject => subject.id === subjectId);

                return (
                  <span key={subjectId} className="tag is-primary is-rounded">
                    {selectedSubject?.subject}
                    <button
                      type="button"
                      className="delete is-small"
                      onClick={() => handleDeleteSubject(subjectId)}
                    >
                    </button>
                  </span>
                );
              })
            ) : (
              <span className="has-text-white has-text-weight-light">
                Please, choose subject fields in order to have access to projects.
              </span>
            )}
          </div>
        </div>

        <h2 className="user-profile__personal-info-title has-text-centered has-text-white has-text-weight-light is-size-3">
          Language pairs
        </h2>

        <div className="user-profile__language-pairs">
          <div className="user-profile__languages">
            <label
              htmlFor="sourceLanguage"
              className="has-text-white has-text-weight-light is-size-4"
            >
              Translate from:

              <div className="control">
                <div className="user-profile__language-select select is-rounded is-medium">
                  <select
                    id="sourceLanguage"
                    value={sourceLanguage}
                    onChange={handleSourceLanguage}
                    className="user-profile__subject-select has-text-weight-light"
                  >
                    <option value={0} disabled>Choose language(s)</option>
                    {languages.map(language => (
                      <option
                        key={language.id}
                        value={language.id}
                      >
                        {language.language}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </label>

            <label
              htmlFor="outputLanguage"
              className="has-text-white has-text-weight-light is-size-4"
            >
              Translate to:

              <div className="control">
                <div className="user-profile__language-select select is-rounded is-medium">
                  <select
                    id="outputLanguage"
                    value={outputLanguage}
                    onChange={handleOutputLanguage}
                    className="user-profile__subject-select has-text-weight-light"
                  >
                    <option value={0} disabled>Choose language(s)</option>
                    {languages
                      .filter(language => language.id !== sourceLanguage)
                      .map(language => (
                        <option
                          key={language.id}
                          value={language.id}
                        >
                          {language.language}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </label>

            <button
              type="button"
              className="user-profile__add-button user-profile__update button is-rounded is-medium"
              onClick={handleAddLanguages}
            >
              Add
            </button>
          </div>

          {selectedLanguages.length ? (
            <div className="user-profile__table-container table-container">
              <table className="user-profile__table table is-hoverable">
                <thead>
                  <tr>
                    <th>Source language</th>
                    <th>Target language</th>
                    <th>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLanguages.map(languagePair => {
                    const sourceLang = languages.find(language => (
                      language.id === languagePair.sourceLanguageId
                    ));
                    const outputLang = languages.find(language => (
                      language.id === languagePair.outputLanguageId
                    ));

                    return (
                      <tr
                        key={`${languagePair.sourceLanguageId}-${languagePair.outputLanguageId}`}
                      >
                        <td>{sourceLang?.language}</td>
                        <td>{outputLang?.language}</td>
                        <td>
                          <button
                            type="button"
                            className="delete"
                            onClick={() => handleDeleteLanguage(languagePair)}
                          >
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="user-profile__selected-languages">
              <span className="has-text-white has-text-weight-light">
                Please, choose languages pairs in order to have access to projects.
              </span>
            </div>
          )}
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
