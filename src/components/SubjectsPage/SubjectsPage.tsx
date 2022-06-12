import React, { useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import { addSubject, deleteSubject, getSubjects } from '../../api/subject';
import { subjectsActions, subjectsSelectors } from '../../store/subject';
import { Header } from '../Header/Header';
import './SubjectsPage.scss';

export const SubjectsPage: React.FC = () => {
  const handleError = useErrorHandler();
  const dispatch = useDispatch();
  const subjects = useSelector(subjectsSelectors.getSubjects);
  const [newSubject, setSubject] = useState('');

  const handleDelete = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    subjectId: number,
  ) => {
    event.preventDefault();

    try {
      await deleteSubject(subjectId);
      const newSubjects = await getSubjects();

      dispatch(subjectsActions.setSubjects(newSubjects));
    } catch (error) {
      handleError(error);
    }
  };

  const handleAdd = async () => {
    const isNotExist = subjects.every(subject => subject.subject !== newSubject);

    if (newSubject && isNotExist) {
      try {
        await addSubject(newSubject);
        const newSubjects = await getSubjects();

        dispatch(subjectsActions.setSubjects(newSubjects));
        setSubject('');
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <div>
      <div className="subjects__header">
        <Header />
      </div>

      <div className="subjects__container columns">
        <div className="column is-half">
          <table className="table is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Subject</th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => {
                return (
                  <tr key={subject.id}>
                    <td>{subject.subject}</td>
                    <td>
                      <a
                        href="/"
                        className="subjects__table-button"
                        onClick={((event) => handleDelete(event, subject.id))}
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="column">
          <div className="subjects__new-subject-container">
            <input
              type="text"
              placeholder="Enter a new subject"
              value={newSubject}
              onChange={(event) => setSubject(event.target.value)}
              className="subjects__input input is-rounded has-text-weight-light is-medium"
            />

            <button
              type="button"
              onClick={handleAdd}
              className="subjects__add button is-rounded is-medium"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
