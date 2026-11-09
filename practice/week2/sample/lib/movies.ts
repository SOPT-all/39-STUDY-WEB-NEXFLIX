export type Movie = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  description: string;
};

export const movies: Movie[] = [
  {
    id: "1",
    title: "인어섬의 비밀",
    year: 2006,
    genres: ["thriller", "korean"],
    description:
      "어느 날, 광장에서 쉬고 있던 치이카와와 가르마 앞에 얼굴에 전단지를 붙인 토끼가 나타난다. 그곳엔 “특별한 섬으로의 초대”라는 글귀가 적혀 있는데...",
  },
  {
    id: "2",
    title: "모자 쓴 고양이",
    year: 2014,
    genres: ["fantasy"],
    description: "이제껏 본 적 없는 ‘씽’나는 ‘냥’리법석이 펼쳐진다!",
  },
  {
    id: "3",
    title: "수능, 출제의 비밀",
    year: 2008,
    genres: ["action", "thriller", "korean"],
    description:
      "수능 D-DAY, 정답은 이미 정해져 있다? 그 정답을 만드는 사람들이 지금 이 방에 모였습니다.",
  },
  {
    id: "4",
    title: "최종 면접",
    year: 2001,
    genres: ["action", "korean"],
    description:
      "5000:1의 경쟁률, 제한시간 2시간, 단 1명의 합격자. 치열한 경쟁률을 뚫고 최종면접에 오른 6명의 지원자.",
  },
  {
    id: "5",
    title: "명탐정 코난: 30호 살인 사건",
    year: 2015,
    genres: ["action"],
    description:
      "통칭 30호, 신권 위조지폐 사건 발생! 전대미문 사건을 수사하기 위해 전원 출동! 국가적 위기에 맞서라!",
  },
  {
    id: "6",
    title: "하트 오브 비스트",
    year: 2010,
    genres: ["sf", "thriller"],
    description:
      "매 순간 닥쳐오는 죽음의 위협 속에서 오직 서로에게만 의지한 채 처절한 사투를 벌이는 어드벤처 생존 드라마.",
  },
];

export const genres = ["action", "thriller", "sf", "fantasy", "korean"];

export function getMovie(id: string) {
  return movies.find((m) => m.id === id);
}

// 일부러 1.5초 늦게 → loading.tsx 확인!
export async function getMovieSlow(id: string) {
  await new Promise((r) => setTimeout(r, 1500));
  return getMovie(id);
}

// ["action", "korean"] → 두 장르를 모두 가진 작품
export function getMoviesByGenres(slug: string[]) {
  return movies.filter((m) => slug.every((g) => m.genres.includes(g)));
}
