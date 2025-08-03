import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router";

export default function SignIn() {
  const { t, i18n } = useTranslation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SignInForm />
    </>
  );
}
