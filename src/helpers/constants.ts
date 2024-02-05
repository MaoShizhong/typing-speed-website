import { TestOptions } from '../types/types';

export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;

export const DEFAULT_TEST_DURATION = 60 * ONE_SECOND;
export const CHARS_IN_WORD = 5;
export const WORDS_PER_WORDBLOCK = 70;
export const ROWS = 5;

export const DEFAULT_TEST_OPTIONS: TestOptions = {
    type: 'words',
    capitals: 'no_capitals',
    numbers: 'no_numbers',
    duration: DEFAULT_TEST_DURATION,
};
