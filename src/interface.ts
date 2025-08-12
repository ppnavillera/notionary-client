export interface Result {
  word: string;
  pronunciation: string;
  definition1: string;
  definition2: string | null;
  example: string;
  synonyms: string[] | null;
  antonyms: string[] | null;
}
