import type * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Metadata } from "next/types";
import { Content } from "src/components/marketing/blog/content";
import { site } from "src/config";
import { dayjs } from "src/lib/dayjs";
import { posts } from "../posts";

type Params = { postId: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { postId } = await params;
  const id = Number(postId);
  const post = posts[id];

  return {
    title: post ? `${post.title} | ${site.name}` : site.name,
    description: post?.description,
    authors: [{ name: "HomeHive", url: site.url }],
  };
}

interface PageProps {
  params: Promise<Params>;
}

export default async function Page({ params }: PageProps): Promise<React.JSX.Element | null> {
  const { postId } = await params;
  const id = Number(postId);
  const post = posts[id];

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
        <Stack spacing={3}>
          <div>
            <Chip label={post.category} />
          </div>
          <Stack spacing={2}>
            <Typography variant="h3">{post.title}</Typography>
            <Typography color="text.secondary" variant="subtitle1">
              {post.description}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar src={post.author.avatar} />
            <div>
              <Typography variant="subtitle2">
                Von {post.author.name} • {dayjs(post.publishedAt).format("D MMMM YYYY")}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Lesezeit: {post.readTime}
              </Typography>
            </div>
          </Stack>
          <Box
            sx={{
              backgroundImage: `url(${post.cover})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              borderRadius: 1,
              height: "380px",
            }}
          />
          <Container>
            <Content content={post.content} />
          </Container>
        </Stack>
      </Stack>
    </Box>
  );
}
