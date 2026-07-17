/* ============================================================
   Лента роликов участников — вертикальные видео, как в reels/сторис.
   Чтобы добавить ролик: скопируй объект в items.
     src    — путь к видео (assets/video/имя.mp4)
     poster — кадр-превью (assets/video/имя-poster.webp)
     url    — ссылка на пост в Instagram (клик по карточке)
     avatar — путь к аватарке (webp), avatarFallback — png-запасной
     status — "опубликовано" | "на модерации" | "скрыто"
     pinned — true, чтобы закрепить сверху
   ============================================================ */
window.VIDEOS_DATA = {
  items: [
    {
      author: "Аня и Паша",
      avatar: "assets/webp/avatars/ann.webp",
      avatarFallback: "Ann.png",
      network: "Instagram",
      caption: "Ставим палатку на берегу: трезвый выходной вдвоём",
      date: "2026-07-12",
      status: "опубликовано",
      pinned: true,
      src: "assets/video/shorts.mp4",
      poster: "assets/video/shorts-poster.webp",
      url: "https://www.instagram.com/dr.shurov"
    },
    {
      author: "Марина",
      avatar: "assets/webp/avatars/marina.webp",
      avatarFallback: "marina.png",
      network: "Instagram",
      caption: "Качели, ветер и лето, и ни капли алкоголя",
      date: "2026-07-11",
      status: "опубликовано",
      pinned: false,
      src: "assets/video/girl.mp4",
      poster: "assets/video/girl-poster.webp",
      url: "https://www.instagram.com/dr.shurov"
    },
    {
      author: "Игорь",
      avatar: "assets/webp/avatars/igor.webp",
      avatarFallback: "igor.png",
      network: "Instagram",
      caption: "Утренняя тропа у леса. Голова ясная, шаг лёгкий",
      date: "2026-07-10",
      status: "опубликовано",
      pinned: false,
      src: "assets/video/near_forest.mp4",
      poster: "assets/video/near_forest-poster.webp",
      url: "https://www.instagram.com/dr.shurov"
    }
  ]
};
