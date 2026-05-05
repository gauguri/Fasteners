import { CatalogSearchWorkspace } from "@/components/catalog-search-workspace";
import { PageHeader } from "@/components/page-header";
import { searchCatalog, searchFacets } from "@/lib/search";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const initialResults = searchCatalog({ query });

  return (
    <div className="container">
      <PageHeader
        title="Power Search"
        description="Exact part-number lookup, prefix search, typo tolerance, filters, saved searches, autocomplete, and BOM paste."
        trail={[{ href: "/", label: "Home" }, { href: "/search", label: "Search" }]}
      />
      <CatalogSearchWorkspace initialQuery={query} initialResults={initialResults} facets={searchFacets()} />
    </div>
  );
}
