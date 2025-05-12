import type { FC, ReactNode } from "react";
import propTypes from "prop-types";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import type { SxProps } from "@mui/system/styleFunctionSx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import type { Theme } from "@mui/material/styles/createTheme";
import { useUser } from "src/hooks/use-user";

interface PricingPlanProps {
  cta: string;
  currency: string;
  description: string;
  features: string[];
  icon: ReactNode;
  name: string;
  popular?: boolean;
  price: string;
  subscriptionText: string;
  link: string;
  priceId: string;
  discountPrice?: number;
  sx?: SxProps<Theme>;
}

export function PricingPlan({
  cta,
  currency,
  description,
  subscriptionText,
  discountPrice,
  features,
  icon,
  name,
  popular,
  price,
  link,
  sx,
  ...other
}: PricingPlanProps) {
  const { user } = useUser();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            height: 52,
            width: 52,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {discountPrice && (
            <Typography
              color="text.secondary"
              sx={{
                textDecoration: "line-through",
                mr: 1,
              }}
              variant="h6"
            >
              {currency}
              {discountPrice}
            </Typography>
          )}
          <Typography variant="h4">
            {currency}
            {price}
          </Typography>
          {subscriptionText && (
            <Typography
              color="text.secondary"
              sx={{
                alignSelf: "flex-end",
                ml: 1,
              }}
              variant="subtitle2"
            >
              /{subscriptionText}
            </Typography>
          )}
        </Box>
        <Typography sx={{ mt: 2 }} variant="h6">
          {name}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
          {description}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: 3,
        }}
      >
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          {features.map((feature) => (
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
              key={feature}
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <SvgIcon color="success">
                <CheckIcon />
              </SvgIcon>
              <Typography sx={{ fontWeight: 500 }} variant="body2">
                {feature}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <Button
            href={`${link}?prefilled_email=${user?.email}&client_reference_id=${user?.id}`}
            fullWidth
            variant={popular ? "contained" : "outlined"}
          >
            {cta}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
