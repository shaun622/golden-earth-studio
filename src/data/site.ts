export const site = {
  name: "Golden Earth Studio",
  url: "https://goldenearthstudio.co.uk",
  email: "info@goldenearthstudio.co.uk",
  description: "A platform for creatives and landscape developers to embrace circularity.",
  socialImage: "/assets/images/hero-fallback.webp",
  instagram: "https://www.instagram.com/goldenearthstudio/",
  linkedin: "https://www.linkedin.com/company/golden-earth-studio/",
};

export const navigation = [
  { label: "Gallery", href: "/gallery/" },
  { label: "Collective", href: "/collective/" },
  { label: "Journal", href: "/journal/" },
  { label: "Our Mission", href: "/our-mission/" },
];

export function isCurrentPath(currentPath: string, href: string) {
  return currentPath === href || (href !== "/" && currentPath.startsWith(href));
}
