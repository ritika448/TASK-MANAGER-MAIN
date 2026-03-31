import { FeaturePlaceholder } from "../../../components/common/FeaturePlaceholder";

export function ResetPasswordPage() {
  return (
    <FeaturePlaceholder
      title="Reset Password"
      description="Validates reset code and allows secure password update."
      route="/reset-password/:resetPasswordCode"
      highlights={["Token validation", "Password policy", "Confirm password"]}
    />
  );
}

