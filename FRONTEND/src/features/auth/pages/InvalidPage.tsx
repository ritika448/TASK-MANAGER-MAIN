import { FeaturePlaceholder } from "../../../components/common/FeaturePlaceholder";

export function InvalidPage() {
  return (
    <FeaturePlaceholder
      title="Invalid Page"
      description="Global screen for expired session and invalid reset links."
      route="/invalid-page"
      highlights={["Invalid link", "Session expired", "Back to login"]}
    />
  );
}

