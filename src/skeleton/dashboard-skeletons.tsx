import { Box, Skeleton } from "@mui/material";

export default function OverViewStatusObjectsSkeleton() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        px: 3,
        py: 3,
      }}
    >
      <Skeleton variant="circular" width={150} height={150} />
    </Box>
  );
}
