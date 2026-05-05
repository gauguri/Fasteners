import { PageHeader } from "@/components/page-header";

export default function TermsPage() {
  return (
    <div className="container">
      <PageHeader
        title="Terms"
        description="Commercial terms, lead-time assumptions, and handling expectations."
        trail={[{ href: "/", label: "Home" }, { href: "/terms", label: "Terms" }]}
      />
      <article className="card">
        <p>
          This scaffold includes representative terms content only. Production deployment should replace this page
          with approved legal copy and account-specific commercial policy.
        </p>
      </article>
    </div>
  );
}
