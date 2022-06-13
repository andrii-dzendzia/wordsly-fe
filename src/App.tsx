import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { getLanguages } from './api/language';
import { getSubjects } from './api/subject';
import './App.scss';
import { SignIn } from './components/Authorization/SignIn';
import { SignUp } from './components/Authorization/SignUp';
import { AvailableProjects } from './components/AvailableProjects/AvailableProjects';
import { HomePage } from './components/HomePage/HomePage';
import { Project } from './components/Project/Project';
import { Quote } from './components/Qoute/Quote';
import { TranslatorProfile } from './components/TranslatorProfile/TranslatorProfile';
import { UserProfile } from './components/UserProfile/UserProfile';
import { TranslatorProjects } from './components/UserProjects/TranslatorProjects';
import { UserProjects } from './components/UserProjects/UserProjects';
import { AccountType } from './enums';
import { languagesActions } from './store/language';
import { subjectsActions } from './store/subject';
import { userActions, userSelectors } from './store/user';
import { FallbackComponent } from './components/FallbackComponent/FallbackComponent';
import { IncomePage } from './components/IncomePage/IncomePage';
import { LanguagesPage } from './components/LanguagesPage/LanguagesPage';
import { SubjectsPage } from './components/SubjectsPage/SubjectsPage';
import { getRole } from './tokenHandler';
import { ProjectsPage } from './components/ProjectsPage/ProjectsPage';
import { UserPage } from './components/UserPage/UserPage';
import { UsersPage } from './components/UsersPage/UsersPage';

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.getUser);

  useEffect(() => {
    (async () => {
      const newSubjects = await getSubjects();
      const newLanguages = await getLanguages();

      dispatch(subjectsActions.setSubjects(newSubjects));
      dispatch(languagesActions.setLanguages(newLanguages));
      dispatch(userActions.loadUser());
    })();
  }, [user?.email]);

  if (getRole() === AccountType.Admin.toString()) {
    return (
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Routes>
          <Route path="/" element={<IncomePage />} />
          <Route path="/languages" element={<LanguagesPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/users" element={<UsersPage accountType={AccountType.User} />} />
          <Route path="/user/:id" element={<UserPage isTranslator={false} />} />
          <Route path="/translators" element={<UsersPage accountType={AccountType.Translator} />} />
          <Route path="/translator/:id" element={<UserPage isTranslator />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects" element={<IncomePage />} />
          <Route path="/project/:id/:lang" element={<Project />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quote" element={<Quote />} />
        {!getRole() ? (
          <>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </>
        ) : (
          <>
            <Route path="/profile" element={getRole() === AccountType.User.toString() ? <UserProfile /> : <TranslatorProfile />} />
            <Route path="/project/:id/:lang" element={<Project />} />
            <Route path="/projects/my" element={getRole() === AccountType.User.toString() ? <UserProjects /> : <TranslatorProjects />} />
            <Route path="/projects" element={<AvailableProjects />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};
