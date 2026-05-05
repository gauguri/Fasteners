import { PageHeader } from "@/components/page-header";

export default function PrivacyPage() {
  return (
    <div className="container">
      <PageHeader
        title="Privacy"
        description="How buyer, order, and quote data should be handled in a production deployment."
        trail={[{ href: "/", label: "Home" }, { href: "/privacy", label: "Privacy" }]}
      />
      <article className="card">
        <p>
          This starter app does not persist production customer data. Replace this content with approved privacy
          language and implement retention, consent, and deletion workflows before launch.
        </p>
      </article>
    </div>
  );
}
