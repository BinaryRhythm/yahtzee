import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Sum,
  FourOfKind,
  MiniStraight,
  Straight,
  FiveOfKind,
  FullHouse,
} from "./icons";

export const scoreRatings = [
  [
    {
      name: "ones",
      iconComponent: Dice1,
      rating: (diceList: DiceData[]): number => {
        return getSmallScore(toValues(diceList), 1);
      },
    },
    {
      name: "sum",
      iconComponent: Sum,
      rating: (diceList: DiceData[]): number => {
        return sum(toValues(diceList));
      },
    },
  ],
  [
    {
      name: "twos",
      iconComponent: Dice2,
      rating: (diceList: DiceData[]): number => {
        return getSmallScore(toValues(diceList), 2);
      },
    },
    {
      name: "fourOfKind",
      iconComponent: FourOfKind,
      rating: (diceList: DiceData[]): number => {
        const values = toValues(diceList);
        return isNOfKind(values, 4) ? sum(values) : 0;
      },
    },
  ],
  [
    {
      name: "threes",
      iconComponent: Dice3,
      rating: (diceList: DiceData[]): number => {
        return getSmallScore(toValues(diceList), 3);
      },
    },
    {
      name: "fullhouse",
      iconComponent: FullHouse,
      rating: (diceList: DiceData[]): number => {
        const values = toValues(diceList);
        return isFullHouse(values) ? sum(values) : 0;
      },
    },
  ],
  [
    {
      name: "fours",
      iconComponent: Dice4,
      rating: (diceList: DiceData[]): number => {
        return getSmallScore(toValues(diceList), 4);
      },
    },
    {
      name: "miniStraight",
      iconComponent: MiniStraight,
      rating: (diceList: DiceData[]): number => {
        const values = toValues(diceList);
        return isMiniStraight(values) ? 15 : 0;
      },
    },
  ],
  [
    {
      name: "fives",
      iconComponent: Dice5,
      rating: (diceList: DiceData[]): number => {
        return getSmallScore(toValues(diceList), 5);
      },
    },
    {
      name: "straight",
      iconComponent: Straight,
      rating: (diceList: DiceData[]): number => {
        const values = toValues(diceList);
        return isStraight(values) ? 30 : 0;
      },
    },
  ],
  [
    {
      name: "sixes",
      iconComponent: Dice6,
      rating: (diceList: DiceData[]): number => {
        return getSmallScore(toValues(diceList), 6);
      },
    },
    {
      name: "fiveOfKind",
      iconComponent: FiveOfKind,
      rating: (diceList: DiceData[]): number => {
        const values = toValues(diceList);
        return isNOfKind(values, 5) ? 50 : 0;
      },
    },
  ],
];

function toValues(diceList: DiceData[]): number[] {
  return diceList.map((dice) => dice.value);
}

function getSmallScore(values: number[], number: number): number {
  return values.filter((value) => value === number).length * number;
}

function sum(values: number[]): number {
  return values.reduce((sum, item) => sum + item);
}

function isNOfKind(values: number[], n: number): boolean {
  const nMap = new Map<number, number>();
  let maxCount = 1;

  values.forEach((value) => {
    if (!value) return;
    let count = nMap.get(value);
    if (!count) {
      nMap.set(value, 1);
    } else {
      count++;
      nMap.set(value, count);
      maxCount = Math.max(count, maxCount);
    }
  });

  return maxCount >= n;
}

function isStraight(values: number[]): boolean {
  values.sort((a, b) => a - b);
  return /12345|23456/.test(values.join(""));
}

function isMiniStraight(values: number[]): boolean {
  values = [...new Set(values)].sort((a, b) => a - b);
  return /1234|2345|3456/.test(values.join(""));
}

function isFullHouse(values: number[]): boolean {
  values.sort((a, b) => a - b);
  return (
    isNOfKind(values, 3) &&
    /(\d)\1{2}(\d)\2{1}|(\d)\3{1}(\d)\4{2}/.test(values.join(""))
  );
}

export const BONUS_NEED = 63;
export const BONUS_SCORE = 35;

function scoresToValues(scores: Scores): number[] {
  return Object.keys(scores).map((type) => scores[type]);
}

export function getBonusScore(scores: Scores): number {
  const types = ["ones", "twos", "threes", "fours", "fives", "sixes"];
  const bonusScore = sum(types.map((type) => scores[type]));
  return bonusScore;
}

export function getSumScore(scores: Scores): number {
  if (!scores) return 0;
  const bonusScore = getBonusScore(scores);
  const hasBonus = bonusScore >= BONUS_NEED;

  let sumScore = sum(scoresToValues(scores));
  hasBonus && (sumScore += BONUS_SCORE);
  return sumScore;
}

export function gameOver(start: boolean, players: Player[]): boolean {
  if (!start || players.length <= 0) return false;
  const scoresList = players.reduce((res, item) => {
    const { scores } = item;
    return res.concat(scoresToValues(scores));
  }, []);
  return scoresList.filter((value) => value === null).length <= 0;
}
