import type * as React from "react";
import RouterLink from "next/link";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Post } from "./types";
import { paths } from "src/paths";
import { dayjs } from "src/lib/dayjs";

export interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps): React.JSX.Element {
  return (
    <Card>
      <CardMedia component={RouterLink} href={paths.marketing.blog.details(post.id)} image={post.cover} sx={{ height: "280px" }} />
      <CardContent>
        <Stack spacing={2}>
          <div>
            <Chip label={post.category} />
          </div>
          <div>
            <Link color="text.primary" component={RouterLink} href={paths.marketing.blog.details(post.id)} variant="h5">
              {post.title}
            </Link>
          </div>
          <Typography
            color="text.secondary"
            sx={{
              height: "48px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
            variant="body1"
          >
            {post.description}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar src={post.author.avatar} />
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}>
              <Typography sx={{ flex: "1 1 auto" }} variant="subtitle2">
                Von {post.author.name} • {dayjs(post.publishedAt).format("D MMMM YYYY")}
              </Typography>
              <Typography color="text.secondary" sx={{ whiteSpace: "nowrap" }} variant="body2">
                Lesezeit: {post.readTime}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
