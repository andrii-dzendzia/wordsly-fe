import React from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguageStatus, getLanguages } from '../../api/language';
import { languagesActions, languagesSelectors } from '../../store/language';
import { Header } from '../Header/Header';
import './LanguagesPage.scss';
import background from '../../images/languages.png';

export const LanguagesPage: React.FC = () => {
  const handleError = useErrorHandler();
  const dispatch = useDispatch();
  const languages = useSelector(languagesSelectors.getLanguages);

  const handleChangeState = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    langId: number,
  ) => {
    event.preventDefault();

    try {
      await changeLanguageStatus(langId);
      const newLanguages = await getLanguages();

      dispatch(languagesActions.setLanguages(newLanguages));
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <div className="languages__header">
        <Header />
      </div>

      <div className="languages__container columns">
        <div className="column is-half">
          <table className="table is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Language</th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              {languages.map(language => {
                return (
                  <tr key={language.id}>
                    <td>{language.language}</td>
                    <td>
                      <a
                        href="/"
                        className="languages__table-button"
                        onClick={(event => handleChangeState(event, language.id))}
                      >
                        {language.isActive ? 'Deactivate' : 'Activate'}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          <img
            src={background}
            alt="background"
            className="languages__background is-hidden-touch"
          />
        </div>
      </div>
    </div>
  );
};
