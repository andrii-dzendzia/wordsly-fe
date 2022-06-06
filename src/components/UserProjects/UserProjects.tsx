import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import { downloadFile } from '../../api/file';
import { getProjects } from '../../api/projects';
import { ProjectStatus } from '../../enums';
import { Project } from '../../types';
import { Header } from '../Header/Header';
import { PaymentModal } from '../PaymentModal/PaymentModal';
import './UserProjects.scss';

export const UserProjects: React.FC = () => {
  const handleError = useErrorHandler();
  const [statusProject, setStatusProject] = useState(ProjectStatus.Unpaid);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setProjectId] = useState(0);

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

  const handlePay = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: number,
  ) => {
    event.nativeEvent.preventDefault();

    setProjectId(id);
    setShowModal(true);
  };

  const completePayment = async () => {
    setShowModal(false);
    try {
      const newProjects = await getProjects(statusProject);

      setProjects(newProjects);
    } catch (error) {
      handleError(error);
    }
  };

  const handleDownload = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    projectId: number,
    targetLangId: number,
    projectName: string,
  ) => {
    event.nativeEvent.preventDefault();

    try {
      await downloadFile(projectId, targetLangId, projectName);
    } catch (error) {
      handleError(error);
    }
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

          <li
            className={classNames({ 'is-active': statusProject === ProjectStatus.Unpaid })}
          >
            <a
              href="/"
              onClick={(event) => handleTabClick(event, ProjectStatus.Unpaid)}
            >
              Unpaid projects
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
            {statusProject !== ProjectStatus.Unpaid && (
              <th>Start date</th>
            )}
            {statusProject === ProjectStatus.Completed && (
              <th>End date</th>
            )}
            <th>Price</th>
            <th>
            </th>
            {statusProject === ProjectStatus.Completed && (
              <th>
              </th>
            )}
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
                {statusProject !== ProjectStatus.Unpaid && (
                  <td>{new Date(Date.parse(project.startDate)).toDateString()}</td>
                )}
                {statusProject === ProjectStatus.Completed && (
                  <td>{new Date(Date.parse(project.endDate)).toDateString()}</td>
                )}
                <td>{`${project.price}$`}</td>
                <td>
                  {statusProject === ProjectStatus.Unpaid ? (
                    <a
                      href="/"
                      className="projects-page__table-button"
                      onClick={(event) => handlePay(event, project.id)}
                    >
                      Pay
                    </a>
                  ) : (
                    <Link
                      to={`/project/${project.id}/${project.targetLanguage.id}`}
                      className="projects-page__table-button"
                    >
                      View
                    </Link>
                  )}
                </td>
                {statusProject === ProjectStatus.Completed && (
                  <td>
                    <a
                      href="/"
                      className="projects-page__table-button"
                      onClick={(event) => handleDownload(
                        event,
                        project.id,
                        project.targetLanguage.id,
                        project.fileName,
                      )}
                    >
                      Download
                    </a>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <PaymentModal
        show={showModal}
        setShow={setShowModal}
        projectId={selectedProjectId}
        onPaymentComplete={completePayment}
      />
    </div>
  );
};
