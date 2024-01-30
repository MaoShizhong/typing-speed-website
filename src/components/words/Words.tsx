import { TestType } from '../../types/types';
import testStyles from './css/test.module.css';

type WordsProps = {
    testType: TestType;
    words: string[];
    // renderNewWordblock: () => void;
    inputLetters: string;
    fontSize: number;
};

const ROWS = 5;

export function Words({ testType, words, inputLetters, fontSize }: WordsProps) {
    const lineHeight = fontSize * 1.5;
    const letters = words.join(' ').split('');
    // console.log(inputLetters);

    // if (inputLetters.length === letters.length * (2 / 3)) {
    //     renderNewWordblock();
    // }

    return (
        <div className={testStyles.words_container}>
            <div
                style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: `${lineHeight}px`,
                    height: `${ROWS * lineHeight}px`,
                }}
            >
                {letters.map((letter: string, i: number): JSX.Element => {
                    const currentLetter = inputLetters.length === i;
                    const isScored = inputLetters.length >= i + 1;
                    const correctness = inputLetters[i] === letter ? 'correct' : 'wrong';

                    const classes = [];
                    if (currentLetter) classes.push(testStyles.current);
                    if (isScored) classes.push(testStyles[correctness]);

                    return (
                        <span key={i} className={classes.join(' ')}>
                            {letter}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
