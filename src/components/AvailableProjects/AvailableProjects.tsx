import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import { getAvailableProjects, joinProject } from '../../api/projects';
import { getTranslatorInfo } from '../../api/user';
import { languagesSelectors } from '../../store/language';
import { subjectsSelectors } from '../../store/subject';
import {
  Language,
  Project,
  Subject,
  TranslatorInfo,
} from '../../types';
import { Header } from '../Header/Header';
import './AvailableProjects.scss';

export const AvailableProjects: React.FC = () => {
  const navigate = useNavigate();
  const handleError = useErrorHandler();

  const subjects = useSelector(subjectsSelectors.getSubjects);
  const languages = useSelector(languagesSelectors.getLanguages);

  const [selectedSubject, setSelectedSubject] = useState(0);
  const [selectedSourceLang, setSourceLang] = useState(0);
  const [selectedTargetLang, setTargetLang] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [filteredSourceLanguages, setFilteredSourceLanguages] = useState<Language[]>([]);
  const [translatorInfo, setTranslatorInfo] = useState<TranslatorInfo | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const newProjects = await getAvailableProjects(
          selectedSubject,
          selectedSourceLang,
          selectedTargetLang,
        );

        setProjects(newProjects);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [selectedSubject, selectedSourceLang, selectedTargetLang]);

  useEffect(() => {
    (async () => {
      try {
        const newTranslatorInfo = await getTranslatorInfo();

        setTranslatorInfo(newTranslatorInfo);

        const newSubjects = subjects
          .filter(subject => newTranslatorInfo.subjectIds.includes(subject.id));

        setFilteredSubjects(newSubjects);

        const newSourceLang = languages
          .filter(language => (
            newTranslatorInfo.languagesPairs
              .some(translatorLang => translatorLang.sourceLanguageId === language.id)
          ));

        setFilteredSourceLanguages(newSourceLang);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [subjects, languages]);

  const filteredTargetLanguages = useMemo(() => {
    if (!translatorInfo) {
      return [];
    }

    if (selectedSourceLang) {
      return languages
        .filter(language => (
          translatorInfo.languagesPairs
            .some(translatorLang => translatorLang.outputLanguageId === language.id
              && translatorLang.sourceLanguageId === selectedSourceLang)
        ));
    }

    return languages
      .filter(language => (
        translatorInfo.languagesPairs
          .some(translatorLang => translatorLang.outputLanguageId === language.id)
      ));
  }, [selectedSourceLang, translatorInfo]);

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

  const handleChoose = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    projectId: number,
    targetLangId: number,
  ) => {
    event.nativeEvent.preventDefault();

    try {
      await joinProject(projectId, targetLangId);

      navigate(`/project/${projectId}/${targetLangId}`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="projects__header">
        <Header />
      </div>

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
            {filteredTargetLanguages.map(language => (
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

      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>File name</th>
            <th>Source language</th>
            <th>Target language</th>
            <th>Subject</th>
            <th>Words count</th>
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
                <td>
                  <a
                    href="/"
                    className="projects__choose"
                    onClick={(event) => handleChoose(event, project.id, project.targetLanguage.id)}
                  >
                    Choose a project
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
