import { PageHeader } from "@/components/page-header";

const faqItems = [
  {
    question: "Can I search by military part number?",
    answer: "Yes. Search supports exact part numbers, partial prefixes, and descriptive catalog terms."
  },
  {
    question: "Do orders include certification packets?",
    answer: "Programs can request CoCs, material traceability, and shipping documents at checkout or RFQ time."
  },
  {
    question: "Can pricing be hidden behind account login?",
    answer: "This scaffold shows pricing publicly, but the data model can be adapted to account-specific pricing."
  }
];

export default function FaqPage() {
  return (
    <div className="container">
      <PageHeader
        title="FAQ"
        description="Common purchasing, documentation, and fulfillment questions."
        trail={[{ href: "/", label: "Home" }, { href: "/faq", label: "FAQ" }]}
      />
      <div className="grid cols-3">
        {faqItems.map((item) => (
          <article key={item.question} className="card">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
