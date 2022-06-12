import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAdminProjects } from '../../api/projects';
import { getTranslatorById } from '../../api/user';
import { ProjectStatus } from '../../enums';
import { languagesSelectors } from '../../store/language';
import { subjectsSelectors } from '../../store/subject';
import { Project, Translator } from '../../types';

type Props = {
  userId?: number;
  isTranslator?: boolean;
};

export const Projects: React.FC<Props> = ({ userId, isTranslator }) => {
  const handleError = useErrorHandler();
  const navigate = useNavigate();
  const subjects = useSelector(subjectsSelectors.getSubjects);
  const languages = useSelector(languagesSelectors.getLanguages);

  const [selectedSubject, setSelectedSubject] = useState(0);
  const [selectedSourceLang, setSourceLang] = useState(0);
  const [selectedTargetLang, setTargetLang] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>();
  const [translator, setTranslator] = useState<Translator>();

  useEffect(() => {
    if (userId && isTranslator) {
      (async () => {
        const newTranslator = await getTranslatorById(userId);

        setTranslator(newTranslator);
      })();
    } else {
      setTranslator(undefined);
    }
  }, [userId, isTranslator]);

  useEffect(() => {
    (async () => {
      try {
        const newProjects = await getAdminProjects(
          selectedSubject,
          selectedSourceLang,
          selectedTargetLang,
          projectStatus,
          userId,
          isTranslator,
        );

        setProjects(newProjects);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [
    selectedSubject,
    selectedSourceLang,
    selectedTargetLang,
    projectStatus,
    userId,
    isTranslator,
  ]);

  const filteredSubjects = useMemo(() => {
    return translator
      ? subjects.filter(s => translator.subjectIds.includes(s.id))
      : subjects;
  }, [translator]);

  const filteredSourceLanguages = useMemo(() => {
    return translator
      ? languages
        .filter(language => (
          translator.languagesPairs
            .some(translatorLang => translatorLang.sourceLanguageId === language.id)
        ))
      : languages;
  }, [translator]);

  const filteredTargetLanguages = useMemo(() => {
    if (!translator) {
      return languages.filter(l => l.id !== selectedSourceLang);
    }

    if (selectedSourceLang) {
      return languages
        .filter(language => (
          translator.languagesPairs
            .some(translatorLang => translatorLang.outputLanguageId === language.id
              && translatorLang.sourceLanguageId === selectedSourceLang)
        ));
    }

    return languages
      .filter(language => (
        translator.languagesPairs
          .some(translatorLang => translatorLang.outputLanguageId === language.id)
      ));
  }, [selectedSourceLang, translator]);

  const handleSubject = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value;

    setSelectedSubject(value);
  };

  const handleSourceLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value;

    setSourceLang(value);
  };

  const handleTargetLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value;

    setTargetLang(value);
  };

  const handleProjectStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value;

    setProjectStatus(value < 0 ? undefined : value);
  };

  const handleChoose = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    projectId: number,
    targetLangId: number,
  ) => {
    event.nativeEvent.preventDefault();

    try {
      navigate(`/project/${projectId}/${targetLangId}`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <div className="projects__filters">
        <div className="select is-rounded is-medium">
          <select
            value={selectedSubject}
            onChange={handleSubject}
            className="projects__select has-text-weight-light"
          >
            <option value={0}>All subjects</option>
            {filteredSubjects.map(subject => (
              <option
                key={subject.id}
                value={subject.id}
              >
                {subject.subject}
              </option>
            ))}
          </select>
        </div>

        <div className="select is-rounded is-medium">
          <select
            value={selectedSourceLang}
            onChange={handleSourceLanguage}
            className="projects__select has-text-weight-light"
          >
            <option value={0}>All source languages</option>
            {filteredSourceLanguages.map(language => (
              <option
                key={language.id}
                value={language.id}
              >
                {language.language}
              </option>
            ))}
          </select>
        </div>

        <div className="select is-rounded is-medium">
          <select
            value={selectedTargetLang}
            onChange={handleTargetLanguage}
            className="projects__select has-text-weight-light"
          >
            <option value={0}>All target languages</option>
            {filteredTargetLanguages
              .filter(language => language.id !== selectedSourceLang)
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

        <div className="select is-rounded is-medium">
          <select
            value={projectStatus}
            onChange={handleProjectStatus}
            className="projects__select has-text-weight-light"
          >
            <option value={-1}>All project statuses</option>
            {!translator && (<option value={0}>Unpaid</option>)}
            <option value={1}>Active</option>
            <option value={2}>Completed</option>
          </select>
        </div>
      </div>

      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>File name</th>
            <th>Source language</th>
            <th>Target language</th>
            <th>Subject</th>
            <th>Words count</th>
            <th>Translated words count</th>
            <th>Price</th>
            <th>Starn date</th>
            <th>End date</th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            return (
              <tr key={project.id + project.targetLanguage.id}>
                <td>{project.fileName}</td>
                <td>{project.sourceLanguage.language}</td>
                <td>{project.targetLanguage.language}</td>
                <td>{project.subject.subject}</td>
                <td>{project.wordsCount}</td>
                <td>{project.transaltedWordsCount}</td>
                <td>{project.price}</td>
                <td>{project.startDate}</td>
                <td>{project.endDate}</td>
                <td>
                  <a
                    href="/"
                    className="projects__choose"
                    onClick={(event) => handleChoose(event, project.id, project.targetLanguage.id)}
                  >
                    View
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
