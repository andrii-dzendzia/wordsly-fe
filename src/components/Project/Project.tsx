import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { useErrorHandler } from 'react-error-boundary';
import {
  approveProject,
  getComments,
  getProjectInfo,
  getProjectString,
  getProjectStrings,
  sendComment,
  sendProjectString as sendProjectStringTranslation,
} from '../../api/projects';
import { Header } from '../Header/Header';
import background from '../../images/not-found.png';
import { ProjectInfo, StringComment, StringModel } from '../../types';
import './Project.scss';
import { commentsHub, stringsHub } from '../../api/apis';
import { userSelectors } from '../../store/user';
import { AccountType } from '../../enums';
import { languagesSelectors } from '../../store/language';

export const Project : React.FC = () => {
  const handleError = useErrorHandler();
  const navigate = useNavigate();
  const user = useSelector(userSelectors.getUser);
  const languages = useSelector(languagesSelectors.getLanguages);
  const { id, lang } = useParams();
  const [page, setPage] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [strings, setStrings] = useState<StringModel[]>([]);
  const [pagesCount, setPagesCount] = useState(0);
  const [selectedStringId, setSelectedStringId] = useState(0);
  const [translation, setTranslation] = useState('');
  const [translationError, setTranslationError] = useState('');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>();
  const [comments, setComments] = useState<StringComment[]>([]);
  const [comment, setComment] = useState('');
  const [stringsConnection, setStringsConnection] = useState<HubConnection>();
  const [commentsConnection, setCommentsConnection] = useState<HubConnection>();

  const isNotCustomer = useMemo(() => user?.accountType !== AccountType.User, [user]);
  const isNotTranslator = useMemo(() => user?.accountType !== AccountType.Translator, [user]);

  useEffect(() => {
    (async () => {
      if (id && lang) {
        const newProjectInfo = await getProjectInfo(id, lang);

        setProjectInfo(newProjectInfo);
      }
    })();
  }, [id, lang]);

  useEffect(() => {
    (async () => {
      if (id && lang && page) {
        try {
          const newStrings = await getProjectStrings(id, lang, page);

          setStrings(newStrings.result);
          setPagesCount(newStrings.pagesCount);
        } catch {
          setNotFound(true);
        }
      }
    })();
  }, [id, lang, page]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(stringsHub, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setStringsConnection(newConnection);

    const newCommentsConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(commentsHub, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setCommentsConnection(newCommentsConnection);
  }, []);

  useEffect(() => {
    (async () => {
      if (stringsConnection) {
        await stringsConnection.start();
        stringsConnection.on('loadString', async (stringId: number, langId: number) => {
          if (!id) {
            return;
          }

          try {
            const str = await getProjectString(id, langId, stringId);

            setStrings(oldStrings => oldStrings.map(s => {
              if (s.id === str.id) {
                return str;
              }

              return s;
            }));
          } catch (error) {
            handleError(error);
          }
        });
      }
    })();
  }, [stringsConnection]);

  useEffect(() => {
    (async () => {
      if (commentsConnection) {
        await commentsConnection.start();
        commentsConnection.on('loadComments', async (stringId: number, langId: number) => {
          try {
            const newComments = await getComments(stringId, langId);

            setComments(newComments);
          } catch (error) {
            handleError(error);
          }
        });
      }
    })();
  }, [commentsConnection]);

  useEffect(() => {
    if (commentsConnection?.state === HubConnectionState.Connected && selectedStringId && lang) {
      commentsConnection.invoke('Join', selectedStringId, +lang);
    }

    return () => {
      if (commentsConnection?.state === HubConnectionState.Connected && selectedStringId && lang) {
        commentsConnection.invoke('Leave', selectedStringId, +lang);
      }
    };
  }, [commentsConnection?.state, selectedStringId]);

  useEffect(() => {
    if (stringsConnection?.state === HubConnectionState.Connected && lang) {
      strings.forEach((s) => {
        stringsConnection.invoke('Join', s.id, +lang);
      });
    }

    return () => {
      if (stringsConnection?.state === HubConnectionState.Connected && lang) {
        strings.forEach((s) => {
          stringsConnection.invoke('Leave', s.id, +lang);
        });
      }
    };
  }, [stringsConnection?.state, strings.map(s => s.id)]);

  useEffect(() => {
    const str = strings.find(s => s.id === selectedStringId);

    if (str) {
      setTranslation(str.translatedString);
    }

    if (
      isNotCustomer
      && stringsConnection?.state === HubConnectionState.Connected
      && id
      && lang
      && selectedStringId
    ) {
      stringsConnection.invoke('StartEdit', selectedStringId, +lang);
    }

    return () => {
      if (
        isNotCustomer
        && stringsConnection?.state === HubConnectionState.Connected
        && id
        && lang
        && selectedStringId
      ) {
        stringsConnection.invoke('LeaveEdit', selectedStringId, +lang);
      }
    };
  }, [stringsConnection?.state, selectedStringId]);

  useEffect(() => {
    (async () => {
      if (selectedStringId && lang) {
        try {
          const newComments = await getComments(selectedStringId, +lang);

          setComments(newComments);
        } catch (error) {
          handleError(error);
        }
      }
    })();
  }, [selectedStringId, lang]);

  const handleSendComment = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && comment && lang) {
      try {
        await sendComment(selectedStringId, +lang, comment);
        setComment('');
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleSelectedString = (stringId: number) => {
    if (stringId !== selectedStringId) {
      setSelectedStringId(stringId);
      setTranslation('');

      if (translationError) {
        setTranslationError('');
      }
    }
  };

  const handlePage = (newPage: number) => {
    setPage(newPage);
    handleSelectedString(0);
  };

  const handleTranslation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranslation(event.target.value);

    if (translationError) {
      setTranslationError('');
    }
  };

  const handleSendTranslation = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && id && lang && selectedStringId) {
      event.nativeEvent.preventDefault();
      try {
        await sendProjectStringTranslation(
          id,
          +lang,
          selectedStringId,
          translation,
        );

        setSelectedStringId(0);
        // eslint-disable-next-line
      } catch (e: any) {
        setTranslationError(e.message);
      }
    }
  };

  const handleApprove = async () => {
    if (id && lang) {
      try {
        await approveProject(+id, +lang);
        navigate('/projects/my');
      } catch (error) {
        handleError(error);
      }
    }
  };

  const language = useMemo(() => {
    if (lang) {
      return languages.find(l => l.id === +lang)?.language || '';
    }

    return '';
  }, [lang, languages]);

  if (notFound || !user) {
    return (
      <div>
        <Header />

        <section className="home">
          <h2 className="home__title has-text-weight-light">The project was not found</h2>

          <div className="columns">
            <div className="home__section column is-half-desktop">
              <Link
                to="/"
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
  }

  return (
    <div>
      <Header />

      <div className="project__container">
        <div className="project__strings-column">
          {strings.map(str => (
            // eslint-disable-next-line
            <article
              key={str.id}
              className="message"
              onClick={() => handleSelectedString(str.id)}
            >
              <div
                className={classNames(
                  'project__strings message-body',
                  {
                    'project__selected-string': str.id === selectedStringId,
                  },
                )}
              >
                <p className="project__string has-text-white-ter has-text-weight-light">
                  {str.originalString}
                </p>

                {/* eslint-disable-next-line */}
                {str.isEditing && !str.translatedString ? (
                  <p className="project__string has-text-white-ter">
                    <span className="has-text-primary-dark">
                      Is translating...
                    </span>
                  </p>
                ) : (isNotTranslator && selectedStringId === str.id ? (
                  <div className="project__string-control control">
                    <textarea
                      className={classNames('project__string-entry textarea has-fixed-size', { 'is-danger': !!translationError })}
                      placeholder="Please, enter translation and press ENTER"
                      value={translation}
                      onChange={handleTranslation}
                      onKeyPress={handleSendTranslation}
                    />
                    {translationError && (
                      <p className="project__error help is-danger">
                        {translationError}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="project__string has-text-white-ter">
                    {str.translatedString || (
                      <span className="has-text-primary-dark">
                        Currently not translated
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </article>
          ))}
          <div className="project__pagination">
            {page > 1 && (
              <button
                type="button"
                onClick={() => handlePage(page - 1)}
                className="project__pagination-button button is-small"
              >
                {'<'}
              </button>
            )}
            <p className="project__pagination-page is-size-4 has-text-weight-light has-text-white-ter">{page}</p>
            {page < pagesCount && (
              <button
                type="button"
                onClick={() => handlePage(page + 1)}
                className="project__pagination-button button is-small"
              >
                {'>'}
              </button>
            )}
          </div>
        </div>

        <div className="project__info-column">
          <article className="message">
            <div className="message-header">
              <span>{`${projectInfo?.projectName} To ${language}`}</span>
            </div>
            {!!projectInfo?.preferences && (
              <div className="message-body has-text-white-ter">
                {projectInfo?.preferences}
              </div>
            )}
            {user.accountType !== AccountType.Translator && (
              <button
                type="button"
                className="project__info-footer message-header"
                onClick={handleApprove}
              >
                Approve project
              </button>
            )}
          </article>
          {!!selectedStringId && (
            <article className="message">
              <div className="message-header">
                {comments.length ? 'Comments' : 'No comments'}
              </div>
              <div className="message-body">
                {comments.map(c => (
                  <article
                    key={c.id}
                    className={classNames(
                      'message is-small',
                      {
                        'is-primary': c.role === AccountType.User,
                        'is-danger': c.role === AccountType.Admin,
                        'is-link': c.role === AccountType.Translator,
                      },
                    )}
                  >
                    <div className="message-body">
                      <span>{`${c.userName}: `}</span>
                      {c.comment}
                    </div>
                  </article>
                ))}
                <input
                  type="text"
                  name="comment"
                  className="input"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  onKeyPress={handleSendComment}
                />
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};
