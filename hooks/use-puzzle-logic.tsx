import { useState, useMemo, useCallback } from "react";
import { shuffle as arrayShuffle, sleep} from "@/utils/puzzle-utils";
import { Guess, Puzzle, Word } from "@/types/puzzle";
import { Status } from "@/types/status";
import { sortSelectedWords, toggleWordSelection } from "@/utils/word-manager";
import { getCorrectGuesses, handleCorrectGuess, handleIncorrectGuess, isCorrectGuess } from "@/utils/guess-manager";


export const usePuzzleLogic = (puzzle: Puzzle, initialShuffle: Word[]) => {
  const [shuffledWords, setShuffledWords] = useState(initialShuffle);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [status, setStatus] = useState<Status>("guessing");
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const sortedSelectedWords = useMemo(() => sortSelectedWords(selectedWords, shuffledWords), [shuffledWords, selectedWords]);


  const correctGuesses = useMemo(() => getCorrectGuesses(guesses), [guesses]);


  const shuffle = useCallback(
    () =>
      setShuffledWords(arrayShuffle(shuffledWords, correctGuesses.length * 4)),
    [shuffledWords, correctGuesses.length]
  );

  const deselect = useCallback(() => setSelectedWords([]), []);

  const onWordClick = useCallback(
    (word: Word) => {
      setSelectedWords((prev) => toggleWordSelection(prev, word, status, setStatus, puzzle.words));
    },
    [status, puzzle.words]
  );
  

  const onSubmit = useCallback(async () => {
    if (status !== "submittable") return;
    setStatus("pending");
    await sleep(700);
  
    if (isCorrectGuess(selectedWords)) {
      await handleCorrectGuess(selectedWords, shuffledWords, correctGuesses, setShuffledWords, setGuesses, setStatus, setSelectedWords);
    } else {
      await handleIncorrectGuess(selectedWords, guesses, shuffledWords, correctGuesses, setGuesses, setStatus, setSelectedWords, setShuffledWords);
    }
  }, [selectedWords, shuffledWords, correctGuesses.length, status, guesses.length]);
  

  return {
    status,
    shuffledWords,
    selectedWords,
    sortedSelectedWords,
    onWordClick,
    onSubmit,
    correctGuesses,
    guesses,
    shuffle,
    deselect,
    initialShuffle,
    categories: puzzle.categories,
    name: puzzle.name,
  };
};
