import { Puzzle } from "@/components/ui/puzzle";
import { shuffle } from "@/utils/puzzle-utils";
import { PuzzleContextProvider } from "@/context/puzzle-context";
import { Text, View } from "react-native";
import { allPuzzles } from "@/utils/puzzle-data";
import { useState } from "react";
import PuzzleBoard from "@/components/ui/puzzle/puzzle-board";
import { Stack, useLocalSearchParams } from "expo-router";

const Puzzles = () => {

  const {id} = useLocalSearchParams();
  const puzzleId = Array.isArray(id) ? id[0] : id; 
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(parseInt(puzzleId))



  const changePuzzle = () => {
    const nextIndex = (currentPuzzleIndex + 1) % allPuzzles.length; // Loop through puzzles
    setCurrentPuzzleIndex(nextIndex);
  };

  const currentPuzzle = allPuzzles[currentPuzzleIndex];
  const shuffledWords = shuffle(currentPuzzle.words);

  return (
    
    <View className="relative flex-grow items-center justify-center bg-white">


        <PuzzleContextProvider puzzle={currentPuzzle} initialShuffle={shuffledWords}>
          <PuzzleBoard />
        </PuzzleContextProvider>
      </View>
  )
}

export default Puzzles