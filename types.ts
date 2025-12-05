export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  birth_date?: string;
}

export enum CardPosition {
  PAST = 'Passado',
  PRESENT = 'Presente',
  FUTURE = 'Futuro',
}

export interface TarotCard {
  id: number;
  name: string;
  image: string; // URL or placeholder description
  meaningUpright: string;
}

export interface ReadingResult {
  cards: TarotCard[];
  interpretation: string;
}