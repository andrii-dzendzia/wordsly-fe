import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import { Header } from '../Header/Header';
import './Quote.scss';
import { quotaHub } from '../../api/apis';
import { initCookies, saveProject, sendFileForTranslating } from '../../api/quota';
import { languagesSelectors } from '../../store/language';
import { Quota } from '../../types';
import { subjectsSelectors } from '../../store/subject';
import { getRefreshToken } from '../../tokenHandler';

export const Quote: React.FC = () => {
  const navigate = useNavigate();
  const handleError = useErrorHandler();

  const languages = useSelector(languagesSelectors.getLanguages);
  const subjects = useSelector(subjectsSelectors.getSubjects);

  const [quote, setQuote] = useState<Quota>();
  const [connection, setConnection] = useState<HubConnection>();
  const [quoteId, setQuoteId] = useState('');
  const [subject, setSubject] = useState('0');
  const [sourceLanguage, setSourceLanguage] = useState('0');
  const [preferences, setPreferences] = useState('');

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(quotaHub, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    (async () => {
      const newQuoteId = await initCookies();

      setQuoteId(newQuoteId);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (connection && quoteId) {
        await connection.start();
        connection.on('updateQuota', (quota: Quota) => {
          setQuote(quota);
          setSourceLanguage(quota.sourceLanguage?.languageCode);
          setSubject(quota.subject?.id.toString());
        });
        await connection.invoke('Join', quoteId);
      }
    })();
  }, [connection, quoteId]);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files) {
      const file = files[0];

      try {
        await sendFileForTranslating(file, quoteId);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleDeleteLanguage = async (id: number) => {
    if (quote?.targetLanguages?.length) {
      await connection?.invoke(
        'SendTargetLanguageCodes',
        quoteId,
        quote.targetLanguages
          .filter(lang => lang.id !== id)
          .map(lang => lang.languageCode),
      );
    }
  };

  const handleOutputLanguage = async (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    await connection?.invoke(
      'SendTargetLanguageCodes',
      quoteId,
      quote?.targetLanguages?.length
        ? [...quote.targetLanguages.map(l => l.languageCode), value]
        : [value],
    );
  };

  const handleSubject = async (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    setSubject(value);

    if (connection?.state === HubConnectionState.Connected) {
      await connection.invoke(
        'SendSubjectId',
        quoteId,
        +value,
      );
    }
  };

  const handleSourceLanguage = async (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    setSourceLanguage(value);

    if (connection?.state === HubConnectionState.Connected) {
      await connection.invoke(
        'SendSourceLanguageCode',
        quoteId,
        value,
        false,
      );
    }
  };

  const handleSave = async () => {
    if (quote?.fileName
        && quote.sourceLanguage
        && quote.targetLanguages.length
        && quote.subject
        && quote.price) {
      try {
        if (getRefreshToken()) {
          try {
            await saveProject(quoteId, preferences);
            sessionStorage.removeItem('quote');
            navigate('/projects/my');
          } catch (error) {
            handleError(error);
          }
        } else {
          sessionStorage.setItem('preferences', preferences);
          navigate('/sign-in');
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <div>
      <div className="quote__header">
        <Header />
      </div>

      <div className="quote__title">
        <span className="has-text-white has-text-weight-light is-size-4">
          Please give us a description of what you need by completing the following:
        </span>
      </div>

      <div className="quote__container">
        <div className="quote__inputs">
          <span className="has-text-white has-text-weight-light is-size-4">
            File for translation:
            <div className="quote__input file has-name is-fullwidth is-medium is-right">
              <label htmlFor="file" className="file-label">
                <input
                  id="file"
                  onChange={handleFile}
                  className="file-input is-rounded"
                  type="file"
                  name="resume"
                  accept=".rtf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .html, .xml, .txt, .srt, .sbv, .odt, .ods, .odp"
                />

                <span className="file-cta">
                  <span className="file-label">
                    Choose a file…
                  </span>
                </span>

                <span className="file-name has-text-white">
                  {quote?.fileName}
                </span>
              </label>
            </div>
          </span>

          <label
            htmlFor="subject"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Subject:
            <div className="quote__input select is-rounded is-medium is-fullwidth">
              <select
                id="subject"
                value={subject}
                onChange={handleSubject}
                className="has-text-weight-light"
              >
                <option value={0} disabled>Choose  subject(s)</option>
                {subjects.map(s => (
                  <option
                    key={s.id}
                    value={s.id}
                  >
                    {s.subject}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label
            htmlFor="sourceLanguage"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Translate from:

            <div className="control">
              <div className="quote__input select is-fullwidth is-rounded is-medium">
                <select
                  id="sourceLanguage"
                  value={sourceLanguage}
                  onChange={handleSourceLanguage}
                  className="has-text-weight-light"
                >
                  <option value={0} disabled>Choose language(s)</option>
                  {languages.map(language => (
                    <option
                      key={language.id}
                      value={language.languageCode}
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
              <div className="quote__input select is-rounded is-fullwidth is-medium">
                <select
                  id="outputLanguage"
                  value={0}
                  onChange={handleOutputLanguage}
                  className="has-text-weight-light"
                >
                  <option value={0} disabled>Choose language(s)</option>
                  {languages
                    .filter(language => language.languageCode !== sourceLanguage)
                    .map(language => (
                      <option
                        key={language.id}
                        value={language.languageCode}
                      >
                        {language.language}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </label>

          <div className="control">
            <textarea
              className="quote__preferences textarea has-fixed-size is-fullwidth is-medium"
              placeholder="Please, enter your preferences"
              value={preferences}
              onChange={event => setPreferences(event.target.value)}
            />
          </div>
        </div>

        <div className="quote__info">
          <div className="quote__card card">
            <header className="card-header">
              <h1 className="quote__info-header card-header-title">
                Order Details
              </h1>
            </header>
            <section className="card-content">
              <div className="content">
                <p>
                  {`File name: ${quote?.fileName || ''}`}
                </p>
                <p>
                  {`Subject field: ${quote?.subject?.subject || ''}`}
                </p>
                <p>
                  {`Transalte from: ${quote?.sourceLanguage?.language || ''}`}
                </p>
                <p className="quote__info-langs">
                  {'Translate to: '}
                  {!!quote?.targetLanguages?.length && (
                    quote.targetLanguages.map(({ id }) => {
                      const selectedLanguage = languages.find(language => language.id === id);

                      return (
                        <span key={id} className="tag is-light is-rounded">
                          {selectedLanguage?.language}
                          <button
                            type="button"
                            className="delete is-small"
                            onClick={() => handleDeleteLanguage(id)}
                          >
                          </button>
                        </span>
                      );
                    })
                  )}
                </p>
                <div className="quote__info-row">
                  <p className="quote__info-words">
                    {`Words count: ${quote?.wordsCount || (quote?.isCounting ? 'counting' : '')}`}
                  </p>
                  <p>
                    {`Price ($): ${quote?.price ? quote.price / 100 : ''}`}
                  </p>
                </div>
              </div>
            </section>
            <footer className="card-footer">
              <button
                type="button"
                className="quote__info-button card-header-title card-footer-item"
                onClick={handleSave}
              >
                Save
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
