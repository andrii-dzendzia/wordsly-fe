import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import { getProjects } from '../../api/projects';
import { ProjectStatus } from '../../enums';
import { Project } from '../../types';
import { Header } from '../Header/Header';
import './UserProjects.scss';

export const TranslatorProjects: React.FC = () => {
  const handleError = useErrorHandler();
  const [statusProject, setStatusProject] = useState(ProjectStatus.Active);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const newProjects = await getProjects(statusProject);

        setProjects(newProjects);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [statusProject]);

  const handleTabClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    status: ProjectStatus,
  ) => {
    event.nativeEvent.preventDefault();

    setStatusProject(status);
  };

  return (
    <div>
      <div className="projects-page__header">
        <Header />
      </div>

      <div className="tabs is-boxed is-medium">
        <ul className="projects-page__list">
          <li
            className={classNames({ 'is-active': statusProject === ProjectStatus.Active })}
          >
            <a
              href="/"
              onClick={(event) => handleTabClick(event, ProjectStatus.Active)}
            >
              Active projects
            </a>
          </li>

          <li
            className={classNames({ 'is-active': statusProject === ProjectStatus.Completed })}
          >
            <a
              href="/"
              onClick={(event) => handleTabClick(event, ProjectStatus.Completed)}
            >
              Completed projects
            </a>
          </li>
        </ul>
      </div>

      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>File name</th>
            <th>Source language</th>
            <th>Target language</th>
            <th>Subject</th>
            <th>Words count</th>
            <th>Translated words</th>
            <th>Start date</th>
            {statusProject === ProjectStatus.Completed && (
              <>
                <th>End date</th>
                <th>Price</th>
              </>
            )}
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            return (
              <tr key={project.id + project.targetLanguage.languageCode}>
                <td>{project.fileName}</td>
                <td>{project.sourceLanguage.language}</td>
                <td>{project.targetLanguage.language}</td>
                <td>{project.subject.subject}</td>
                <td>{project.wordsCount}</td>
                <td>{project.transaltedWordsCount}</td>
                <td>{new Date(Date.parse(project.startDate)).toDateString()}</td>
                {statusProject === ProjectStatus.Completed && (
                  <>
                    <td>{new Date(Date.parse(project.endDate)).toDateString()}</td>
                    <td>{`${project.price}$`}</td>
                  </>
                )}
                <td>
                  <Link
                    to={`/project/${project.id}/${project.targetLanguage.id}`}
                    className="projects-page__table-button"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
