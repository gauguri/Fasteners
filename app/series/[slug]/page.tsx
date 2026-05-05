import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { getProductsBySeries, series } from "@/lib/data";

type SeriesPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const entry = series.find((item) => item.slug === slug);

  if (!entry) {
    notFound();
  }

  const results = getProductsBySeries(slug);

  return (
    <div className="container">
      <PageHeader
        title={entry.name}
        description={entry.description}
        trail={[{ href: "/", label: "Home" }, { href: `/series/${entry.slug}`, label: entry.name }]}
      />
      <section className="section">
        <div className="grid cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
