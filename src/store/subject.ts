import { AnyAction } from 'redux';
import { State, Subject } from '../types';

enum ActionTypes {
  SetSubjects = 'subjects/set',
}

export const subjectsActions = {
  setSubjects: (subjects: Subject[]): AnyAction => ({
    type: ActionTypes.SetSubjects,
    value: subjects,
  }),
};

export const subjectsSelectors = {
  getSubjects: (state: State): Subject[] => state.subjects,
};

export const subjectsReducer = (state: Subject[] = [], action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.SetSubjects:
      return [...action.value];
    default:
      return state;
  }
};
