import { PendingLegalPage } from "../pending-legal-page";

export const metadata = { title: "Privacy · frontmatter" };

export default function PrivacyPage() {
  return (
    <PendingLegalPage
      title="Privacy notice"
      summary="What frontmatter stores about you and your documents, who processes it, and how to have it deleted."
    />
  );
}
