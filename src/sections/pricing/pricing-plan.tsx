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
import { Chip, Switch } from "@mui/material";
import { usePathname } from "next/navigation";

interface PricingPlanProps {
  cta: string;
  currency: string;
  description: string;
  features: { name: string; color: string }[];
  icon: ReactNode;
  name: string;
  popular?: boolean;
  price: string;
  subscriptionText: string;
  link?: string;
  discountPrice?: number;
  discountPercentage?: number;
  hint?: string;
  sx?: SxProps<Theme>;
  checked?: boolean;
  setChecked?: (checked: boolean) => void;
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
  hint,
  discountPercentage,
  sx,
  checked,
  setChecked,
  ...other
}: PricingPlanProps) {
  const { user } = useUser();
  const pathname = usePathname();

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
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
              spacing={1}
            >
              <Typography
                color="text.secondary"
                sx={{
                  alignSelf: "flex-end",
                  ml: 1,
                }}
                variant="subtitle2"
              >
                /{subscriptionText}
              </Typography>{" "}
              {discountPercentage && <Chip color="primary" label="-30% Rabatt" size="small" />}
            </Stack>
          )}
        </Box>

        <Stack
          alignItems="baseline"
          // spacing={8}
          justifyContent="space-between"
          direction="row"
          sx={{
            display: "flex",
          }}
        >
          <Typography sx={{ mt: 2, mr: 2 }} variant="h6">
            {name}
          </Typography>
          {setChecked && (
            <Stack alignItems="center" direction="row" spacing={2}>
              <Switch checked={checked} size="small" onChange={(event, checked) => setChecked(checked)} />
              <Typography variant="caption" color="text.secondary">
                Jährliche Abrechnung: {(parseFloat(price) * 12).toFixed(2)} €
              </Typography>
            </Stack>
          )}
        </Stack>

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
              key={feature.name}
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <SvgIcon color="success">
                <CheckIcon color={feature.color} />
              </SvgIcon>
              <Typography sx={{ fontWeight: 500 }} variant="body2">
                {feature.name}
              </Typography>
            </Stack>
          ))}
        </Stack>
        {cta && user && pathname !== "/pricing" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button
              href={`${link}?prefilled_email=${user?.email}&client_reference_id=${user?.id}`}
              fullWidth
              variant={popular ? "contained" : "outlined"}
            >
              {cta}
            </Button>
            {hint && (
              <Typography fontSize={10} variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
                {hint}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
}
