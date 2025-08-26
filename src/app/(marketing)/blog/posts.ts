import { Post } from "src/components/marketing/blog/types";
import { post0Content } from "./post-0";
import { dayjs } from "src/lib/dayjs";

export const posts: Post[] = [
  {
    id: 0,
    title: "3 einfache Tipps, wie du als Vermieter deine Mieteingänge im Blick behältst",
    description: "Learn how to build a design system from scratch using Figma and React that scales.",
    cover: "/assets/image-abstract-2.png",
    category: "Tipps",
    author: { name: "Sarmad", avatar: "/assets/sarmad-image.png" },
    readTime: "5 min",
    publishedAt: dayjs().subtract(45, "minute").toDate(),
    content: post0Content,
  },
];
