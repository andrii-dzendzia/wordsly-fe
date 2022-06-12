import React, { useEffect, useMemo, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import { getUserById } from '../../api/user';
import { User } from '../../types';
import { Header } from '../Header/Header';
import { Projects } from '../Projects/Projects';

type Props = {
  isTranslator?: boolean;
};

export const UserPage: React.FC<Props> = ({ isTranslator }) => {
  const handleError = useErrorHandler();
  const { id } = useParams();

  const [user, setUser] = useState<User>();

  const userId = useMemo(() => (id === undefined ? undefined : +id), [id]);

  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          const newUser = await getUserById(userId);

          setUser(newUser);
        } catch (error) {
          handleError(error);
        }
      })();
    }
  }, [userId]);

  return (
    <div>
      <Header />

      <div className="message">
        <section className="message-body has-text-white">
          {user?.firstname}
          {' '}
          {user?.lastname}
          <br />
          <a href={`mailto:${user?.email}`}>{user?.email}</a>
        </section>
      </div>

      <Projects userId={userId} isTranslator={!!isTranslator} />
    </div>
  );
};
