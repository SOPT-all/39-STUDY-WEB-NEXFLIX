export type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
};

export const movies: Movie[] = [
  { id: 1, title: '굿 윌 헌팅', year: 1997, genre: '드라마' },
  { id: 2, title: '인터스텔라', year: 2014, genre: 'SF' },
  { id: 3, title: '호프', year: 2026, genre: 'SF' },
  { id: 4, title: '너와 나', year: 2023, genre: '드라마' },
];
