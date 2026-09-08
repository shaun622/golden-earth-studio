const liveSite = "https://goldenearthstudio.co.uk";

export const navigation = [
  { label: "Gallery", href: `${liveSite}/gallery/` },
  { label: "Collective", href: `${liveSite}/collective/` },
  { label: "Journal", href: `${liveSite}/journal/` },
  { label: "Our Mission", href: `${liveSite}/our-mission/` },
];

export const artworks = [
  {
    title: "Teoju",
    artist: "Jihyun Kim",
    image: "/assets/images/teoju.webp",
    href: `${liveSite}/gallery/jihyun-kim/teoju/`,
  },
  {
    title: "Bull's Matter",
    artist: "Zahed Tajeddin",
    image: "/assets/images/bulls-matter.webp",
    href: `${liveSite}/gallery/zahed-tajeddin/bulls-matter/`,
  },
  {
    title: "Bowl",
    artist: "Louis Vincent",
    image: "/assets/images/bowl.webp",
    href: `${liveSite}/gallery/louis-vincent/bowl/`,
  },
  {
    title: "Chopsticks",
    artist: "Rickie Cheuk",
    image: "/assets/images/chopsticks.webp",
    href: `${liveSite}/gallery/rickie-cheuk/chopsticks/`,
  },
];

export const featuredArtists = [
  {
    name: "Louis Vincent",
    portrait: "/assets/images/louis-vincent.webp",
    artwork: "/assets/images/louis-hover.webp",
    href: `${liveSite}/gallery/louis-vincent/`,
  },
  {
    name: "Jihyun Kim",
    portrait: "/assets/images/jihyun-kim.webp",
    artwork: "/assets/images/jihyun-hover.webp",
    href: `${liveSite}/gallery/jihyun-kim/`,
  },
  {
    name: "Jacob Chan",
    portrait: "/assets/images/jacob-chan.webp",
    artwork: "/assets/images/jacob-hover.webp",
    href: `${liveSite}/gallery/jacob-chan/`,
  },
];

export { liveSite };
