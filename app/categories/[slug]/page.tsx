import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { categories, getProductsByCategory } from "@/lib/data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((entry) => entry.slug === slug);

  if (!category) {
    notFound();
  }

  const results = getProductsByCategory(slug);

  return (
    <div className="container">
      <PageHeader
        title={category.name}
        description={category.hero}
        trail={[
          { href: "/", label: "Home" },
          { href: `/categories/${category.slug}`, label: category.name }
        ]}
      />
      <section className="notice">
        <p>{category.description}</p>
      </section>
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
