//멤버
// export const members = [
//   { id: 1, name: "김민채", grade: 2, position: "부장", duty: "엔지니어" },
//   { id: 2, name: "이태율", grade: 2, position: "차장", duty: "엔지니어" },
//   { id: 3, name: "조현재", grade: 2, position: "대리", duty: "PD" },
//   { id: 4, name: "최윤아", grade: 2, position: "오락부장", duty: "엔지니어" },
//   { id: 5, name: "노유진", grade: 2, position: "미화부장", duty: "아나운서" },
//   { id: 6, name: "공지우", grade: 1, position: null, duty: "PD" },
//   { id: 7, name: "최우진", grade: 1, position: null, duty: "엔지니어" },
//   { id: 8, name: "함서희", grade: 1, position: null, duty: "엔지니어" },
//   { id: 9, name: "박소이", grade: 1, position: null, duty: "엔지니어" },
//   { id: 10, name: "김동하", grade: 1, position: null, duty: "아나운서" },
// ];

export const broadcasts = [
  {
    id: 1,
    title: "청소방송",
    date: "2026-05-11",
    category: "청소방송",
    isRecurring: true,
    notes: "매일 방과후",
  },
  {
    id: 2,
    title: "청소방송",
    date: "2026-05-12",
    category: "청소방송",
    isRecurring: true,
    notes: "매일 방과후",
  },
  {
    id: 3,
    title: "방송실 청소",
    date: "2026-05-13",
    category: "방송실청소",
    isRecurring: true,
    notes: "매주 수요일",
  },
  {
    id: 4,
    title: "청소방송",
    date: "2026-05-13",
    category: "청소방송",
    isRecurring: true,
    notes: "매일 방과후",
  },
  {
    id: 5,
    title: "청소방송",
    date: "2026-05-14",
    category: "청소방송",
    isRecurring: true,
    notes: "매일 방과후",
  },
  {
    id: 6,
    title: "청소방송",
    date: "2026-05-15",
    category: "청소방송",
    isRecurring: true,
    notes: "매일 방과후",
  },
];

export const assignments = [
  { id: 1, broadcastId: 3, memberId: 1, duty: "대걸레" },
  { id: 2, broadcastId: 3, memberId: 2, duty: "쓰레기통" },
  { id: 3, broadcastId: 3, memberId: 3, duty: "빗자루" },
  { id: 4, broadcastId: 3, memberId: 4, duty: "빗자루" },
  { id: 5, broadcastId: 3, memberId: 5, duty: "물티슈" },
];
