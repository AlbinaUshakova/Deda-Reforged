export function crossedLessonUnlockScore({
  previousBest,
  nextBest,
  unlockScore,
  hasNextLesson,
}: {
  previousBest: number;
  nextBest: number;
  unlockScore: number;
  hasNextLesson: boolean;
}): boolean {
  return hasNextLesson && previousBest < unlockScore && nextBest >= unlockScore;
}
