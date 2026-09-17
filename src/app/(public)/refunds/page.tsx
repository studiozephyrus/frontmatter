import { PendingLegalPage } from "../pending-legal-page";

export const metadata = { title: "Refunds · frontmatter" };

export default function RefundsPage() {
  return (
    <PendingLegalPage
      title="Refunds and cancellation"
      summary="How a Pro subscription is cancelled, when a payment is refunded, and how mandates are handled."
    />
  );
}
