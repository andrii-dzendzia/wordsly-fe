import { AnyAction } from 'redux';
import { Language, State } from '../types';

enum ActionTypes {
  SetLanguages = 'languages/set',
}

export const languagesActions = {
  setLanguages: (languages: Language[]): AnyAction => ({
    type: ActionTypes.SetLanguages,
    value: languages,
  }),
};

export const languagesSelectors = {
  getLanguages: (state: State): Language[] => state.languages,
};

export const languagesReducer = (state: Language[] = [], action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.SetLanguages:
      return [...action.value];
    default:
      return state;
  }
};
