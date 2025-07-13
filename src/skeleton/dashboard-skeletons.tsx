import { Box, Card, CardContent, List, ListItem, Skeleton, Stack } from "@mui/material";

export function OverViewStatusObjectsSkeleton() {
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

export function MobileCardSkeleton() {
  return (
    <Box sx={{ mb: 2 }}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="text" width={100} height={24} />
              </Stack>
              <Skeleton variant="circular" width={32} height={32} />
            </Stack>
            <List sx={{ "& .MuiListItem-root": { justifyContent: "space-between", px: 0, py: 1 } }}>
              <ListItem divider>
                <Skeleton variant="text" width={60} />
                <Skeleton variant="text" width={120} />
              </ListItem>
              <ListItem>
                <Skeleton variant="text" width={60} />
                <Skeleton variant="text" width={120} />
              </ListItem>
            </List>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
