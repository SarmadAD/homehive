import { Post } from "src/components/marketing/blog/types";
import { post0Content } from "./post-0";
import { dayjs } from "src/lib/dayjs";

export const posts: Post[] = [
  {
    id: 0,
    title: "3 einfache Tipps, wie du als Vermieter deine Mieteingänge im Blick behältst",
    description: "",
    cover: "/assets/blog/post-0/cover.png",
    category: "Tipps",
    author: { name: "Sarmad", avatar: "/assets/sarmad-image.png" },
    readTime: "2 min",
    publishedAt: dayjs().subtract(45, "minute").toDate(),
    content: post0Content,
  },
];
