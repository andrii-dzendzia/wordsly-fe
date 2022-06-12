import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import { getUsers } from '../../api/user';
import { AccountType } from '../../enums';
import { UserView } from '../../types';
import { Header } from '../Header/Header';
import './UsersPage.scss';

type Props = {
  accountType: AccountType;
};

export const UsersPage: React.FC<Props> = ({ accountType }) => {
  const handleError = useErrorHandler();
  const [users, setUsers] = useState<UserView[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const newUsers = await getUsers(accountType);

        setUsers(newUsers);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [accountType]);

  return (
    <div>
      <div className="users__header">
        <Header />
      </div>

      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
            <th>Projects count</th>
            <th>Total money</th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            return (
              <tr key={user.id}>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.projectCount}</td>
                <td>{user.totalMoney}</td>
                <td>
                  <Link
                    to={accountType === AccountType.User
                      ? `/user/${user.id}`
                      : `/translator/${user.id}`}
                    className="users__table-button"
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
