
import { styled } from "@mui/material/styles";
const FormSection = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
}));

export default FormSection;