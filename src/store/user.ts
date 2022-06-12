import { AnyAction, Dispatch } from 'redux';
import { getUser } from '../api/user';
import { getRefreshToken, setRole } from '../tokenHandler';
import { User, State } from '../types';

enum ActionTypes {
  SetUser = 'user/set',
}

export const userActions = {
  setUser: (user: User | null): AnyAction => ({
    type: ActionTypes.SetUser,
    value: user,
  }),

  loadUser: () => async (dispatch: Dispatch<AnyAction>) => {
    if (getRefreshToken()) {
      const user = await getUser();

      setRole(user.accountType.toString());
      dispatch(userActions.setUser(user));
    } else {
      setRole('');
      dispatch(userActions.setUser(null));
    }
  },
};

export const userSelectors = {
  getUser: (state: State): User | null => state.user,
};

export const userReducer = (state: User | null = null, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.SetUser:
      return action.value ? { ...action.value } : null;
    default:
      return state;
  }
};
