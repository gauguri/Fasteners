import { FinderForm } from "@/components/forms";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { filterProducts } from "@/lib/data";

type FinderPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FinderPage({ searchParams }: FinderPageProps) {
  const params = await searchParams;
  const filters = {
    material: typeof params.material === "string" ? params.material : undefined,
    finish: typeof params.finish === "string" ? params.finish : undefined,
    availability: typeof params.availability === "string" ? params.availability : undefined
  };

  const results = filterProducts(filters);

  return (
    <div className="container">
      <PageHeader
        title="Drilldown Finder"
        description="Narrow by material, finish, and stock profile to reach alternate-capable fasteners fast."
        trail={[{ href: "/", label: "Home" }, { href: "/finder", label: "Finder" }]}
      />
      <FinderForm defaults={filters} />
      <section className="section">
        <p className="muted">Matched {results.length} fasteners for the selected filters.</p>
        <div className="grid cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
