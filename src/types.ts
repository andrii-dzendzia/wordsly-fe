import { AccountType } from './enums';

export interface Result<T> {
  isSuccess: boolean;
  isFailure: boolean;
  errorMessage: string;
  errorCode: string;
  data: T;
}

export interface Tokens {
  authorizationToken: string;
  refreshToken: string;
}

export interface SignUpModel {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  accountType: number;
}

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  accountType: AccountType;
}

export interface UserProjects {
  active: number;
  completed: number;
  waiting: number;
  money: number;
}

export interface PersonalInfo {
  website: string;
  company: string;
}

export interface State {
  user: User | null;
  subjects: Subject[];
  languages: Language[];
}

export interface Subject {
  id: number;
  subject: string;
}

export interface Language {
  id: number;
  language: string;
  languageCode: string;
  isActive: boolean;
}

export interface Quota {
  id: string;
  sourceLanguage: Language;
  targetLanguages: Language[];
  subject: Subject;
  wordsCount: number | undefined;
  price: number | undefined;
  isCounting: boolean;
  isDetected: boolean;
  fileName: string | undefined;
}

export interface LanguagePair {
  sourceLanguageId: number;
  outputLanguageId: number;
}

export interface TranslatorInfo {
  subjectIds: number[];
  languagesPairs: LanguagePair[];
}

export interface StringModel {
  id: number;
  originalString: string;
  translatedString: string;
  transaltorId: number;
  isEditing: boolean;
}

export interface PaginationResult<T> {
  currentPage: number;
  pagesCount: number;
  result: T[];
}

export interface ProjectInfo {
  preferences: string;
  projectName: string;
  status: number;
}

export interface StringComment {
  id: number;
  role: AccountType;
  userName: string;
  comment: string;
}

export interface Project {
  id: number;
  fileName: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  subject: Subject;
  wordsCount: number;
  transaltedWordsCount: number;
  price: number;
  startDate: string;
  endDate: string;
}

export interface Income {
  totalIncome: number;
  income: number;
  totalPayments: number;
}

export interface Pricing {
  pricePerUnitInput: number;
  pricePerUnitOutput: number;
  sourceLanguageId: number;
  targetLanguageId: number;
}

export interface Translator extends User, TranslatorInfo {
}

export interface UserView {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  projectCount: number;
  totalMoney: number;
}
