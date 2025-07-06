import type * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Post } from "src/components/marketing/blog/types";
import { PostCard } from "src/components/marketing/blog/post-card";
import { site } from "src/config";
import { Metadata } from "next/types";

import { dayjs } from "src/lib/dayjs";
import "dayjs/locale/de";
import { post0Content } from "./post-0";
dayjs.locale("de");

export const metadata = { title: `Blog | ${site.name}` } satisfies Metadata;

export const posts: Post[] = [
  // {
  //   id: 0,
  //   title: "Building a Design System from Scratch",
  //   description: "Learn how to build a design system from scratch using Figma and React that scales.",
  //   cover: "/assets/image-abstract-2.png",
  //   category: "Programming",
  //   author: { name: "Sarmad", avatar: "/assets/sarmad-image.png" },
  //   readTime: "5 min",
  //   publishedAt: dayjs().subtract(45, "minute").toDate(),
  //   content: post0Content,
  // },
];

export default function Page(): React.JSX.Element {
  return (
    <Box
      sx={{
        maxWidth: "var(--maxWidth-xl)",
        m: "0 auto",
        "--Content-paddingX": "24px",
        "--Content-paddingY": { xs: "140px", lg: "140px" },
        p: "var(--Content-paddingY) var(--Content-paddingX)",
        width: "100%",
      }}
    >
      <Stack spacing={8}>
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Neueste Artikel</Typography>
            <div>
              <Typography color="text.secondary" variant="body1">
                Entdecke die neuesten Tipps, Neuigkeiten und Einblicke rund um HomeHive.
              </Typography>
              <Typography color="text.secondary" variant="body1">
                Hier erfährst du alles über digitale Immobilienverwaltung, rechtliche Grundlagen für Vermieter und praktische Tools, die dir den
                Vermieteralltag erleichtern.
              </Typography>
            </div>
          </Stack>
          <Divider />
          <Grid container spacing={4}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Grid key={post.title} md={6} xs={12}>
                  <PostCard post={post} />
                </Grid>
              ))
            ) : (
              <Typography color="text.secondary" variant="body1" sx={{ textAlign: "center", width: "100%" }}>
                Es gibt noch keine Artikel. Schau später wieder vorbei, um die neuesten Inhalte zu entdecken!
              </Typography>
            )}
          </Grid>
        </Stack>
        {/* <Newsletter /> */}
      </Stack>
    </Box>
  );
}
