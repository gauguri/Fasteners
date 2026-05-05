"use client";

import Link from "next/link";
import { ClipboardList, Filter, PackageCheck, Save, Search, Sparkles, X } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";

import type {
  BomSearchResult,
  CatalogSearchFilters,
  CatalogSearchResult,
  SearchMatchType,
  SearchSuggestion
} from "@/lib/search";

type SavedSearch = {
  id: string;
  name: string;
  query: string;
  filters: CatalogSearchFilters;
};

type SearchFacets = {
  series: Array<[string, string]>;
  availability: string[];
  materials: string[];
  finishes: string[];
  exportControls: string[];
};

type ApiProductResult = CatalogSearchResult & {
  product: CatalogSearchResult["product"] & {
    score: number;
    matchType: SearchMatchType;
    matchLabel: string;
    matchedOn: string;
    effectivePrice: number;
    effectivePriceLabel: string;
    allocatableInventory: number;
  };
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function storageKey() {
  return "aegis-catalog-saved-searches";
}

export function CatalogSearchWorkspace({
  initialQuery,
  initialResults,
  facets
}: {
  initialQuery: string;
  initialResults: CatalogSearchResult[];
  facets: SearchFacets;
}) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [filters, setFilters] = useState<CatalogSearchFilters>({});
  const [results, setResults] = useState<CatalogSearchResult[]>(initialResults);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [bomText, setBomText] = useState("AN3-5A, 50\nNAS6204-14 10\nMS24693-C276 qty 200");
  const [bomResult, setBomResult] = useState<BomSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isBomSearching, setIsBomSearching] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey());
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey(), JSON.stringify(savedSearches));
  }, [savedSearches]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();

    if (deferredQuery) {
      params.set("q", deferredQuery);
    }
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params.set(key, String(value));
      }
    }

    setIsSearching(true);
    fetch(`/api/catalog/products?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => {
        setResults(
          payload.results.map((product: ApiProductResult["product"]) => ({
            product,
            score: product.score,
            matchType: product.matchType,
            matchLabel: product.matchLabel,
            matchedOn: product.matchedOn,
            effectivePrice: product.effectivePrice,
            effectivePriceLabel: product.effectivePriceLabel,
            allocatableInventory: product.allocatableInventory
          }))
        );
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      })
      .finally(() => setIsSearching(false));

    window.history.replaceState(null, "", `/search${params.toString() ? `?${params.toString()}` : ""}`);

    return () => controller.abort();
  }, [deferredQuery, filters]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ q: deferredQuery, limit: "7" });

    fetch(`/api/catalog/suggest?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setSuggestions(payload.suggestions))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });

    return () => controller.abort();
  }, [deferredQuery]);

  function updateFilter(key: keyof CatalogSearchFilters, value: string | boolean) {
    setFilters((current) => ({
      ...current,
      [key]: value || undefined
    }));
  }

  function saveCurrentSearch() {
    const name = query || "Filtered catalog view";
    const saved: SavedSearch = {
      id: `${Date.now()}`,
      name,
      query,
      filters
    };

    setSavedSearches((current) => [saved, ...current.filter((item) => item.name !== name)].slice(0, 6));
  }

  function applySavedSearch(saved: SavedSearch) {
    setQuery(saved.query);
    setFilters(saved.filters);
  }

  function removeSavedSearch(id: string) {
    setSavedSearches((current) => current.filter((item) => item.id !== id));
  }

  async function runBomSearch() {
    setIsBomSearching(true);
    const response = await fetch("/api/catalog/bom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: bomText })
    });
    const payload = await response.json();
    setBomResult(payload);
    setIsBomSearching(false);
  }

  return (
    <div className="catalog-search">
      <section className="catalog-search__command">
        <div>
          <span className="eyebrow">
            <Sparkles size={15} /> Smart catalog index
          </span>
          <h2>Find exact hardware, alternates, and build-list matches in one pass.</h2>
          <p className="muted">
            Exact part-number matching, prefix discovery, typo tolerance, normalized spec filters, saved searches,
            autocomplete, and BOM paste are all active on this page.
          </p>
        </div>
        <div className="catalog-search__metrics">
          <strong>{results.length}</strong>
          <span>{isSearching ? "Refreshing matches" : "Ranked matches"}</span>
        </div>
      </section>

      <section className="catalog-search__layout">
        <aside className="catalog-search__rail" aria-label="Search filters">
          <div className="panel-header">
            <span><Filter size={15} /> Filters</span>
            <button type="button" className="text-button" onClick={() => setFilters({})}>
              Clear
            </button>
          </div>
          <div className="field">
            <label htmlFor="series-filter">Series</label>
            <select
              id="series-filter"
              value={filters.series ?? ""}
              onChange={(event) => updateFilter("series", event.target.value)}
            >
              <option value="">All series</option>
              {facets.series.map(([slug, label]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="availability-filter">Availability</label>
            <select
              id="availability-filter"
              value={filters.availability ?? ""}
              onChange={(event) => updateFilter("availability", event.target.value)}
            >
              <option value="">Any availability</option>
              {facets.availability.map((value) => (
                <option key={value} value={value.toLowerCase()}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="material-filter">Material</label>
            <select
              id="material-filter"
              value={filters.material ?? ""}
              onChange={(event) => updateFilter("material", event.target.value)}
            >
              <option value="">Any material</option>
              {facets.materials.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="finish-filter">Finish</label>
            <select
              id="finish-filter"
              value={filters.finish ?? ""}
              onChange={(event) => updateFilter("finish", event.target.value)}
            >
              <option value="">Any finish</option>
              {facets.finishes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="export-filter">Compliance</label>
            <select
              id="export-filter"
              value={filters.exportControl ?? ""}
              onChange={(event) => updateFilter("exportControl", event.target.value)}
            >
              <option value="">Any export status</option>
              {facets.exportControls.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <label className="check-row">
            <input
              type="checkbox"
              checked={filters.inStockOnly ?? false}
              onChange={(event) => updateFilter("inStockOnly", event.target.checked)}
            />
            Only allocatable inventory
          </label>

          <div className="catalog-search__saved">
            <div className="panel-header">
              <span><Save size={15} /> Saved searches</span>
              <button type="button" className="text-button" onClick={saveCurrentSearch}>
                Save
              </button>
            </div>
            {savedSearches.length ? (
              savedSearches.map((saved) => (
                <div className="saved-search" key={saved.id}>
                  <button type="button" onClick={() => applySavedSearch(saved)}>
                    <strong>{saved.name}</strong>
                    <span>{Object.values(saved.filters).filter(Boolean).length} filters</span>
                  </button>
                  <button type="button" aria-label={`Remove ${saved.name}`} onClick={() => removeSavedSearch(saved.id)}>
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="muted">Save a complex lookup and bring it back later from this browser.</p>
            )}
          </div>
        </aside>

        <main className="catalog-search__main">
          <div className="catalog-search__box">
            <label htmlFor="catalog-search-q">Part number, prefix, keyword, material, or spec family</label>
            <div className="catalog-search__input">
              <Search size={22} />
              <input
                id="catalog-search-q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try AN3-5A, AN35A, NAS62, cadmium, A286, Phillips..."
                autoComplete="off"
              />
              <button type="button" className="button-secondary" onClick={saveCurrentSearch}>
                <Save size={16} /> Save
              </button>
            </div>
            {suggestions.length > 0 ? (
              <div className="suggestion-strip" aria-label="Autocomplete suggestions">
                {suggestions.map((suggestion) => (
                  <button type="button" key={`${suggestion.type}-${suggestion.value}`} onClick={() => setQuery(suggestion.value)}>
                    <span>{suggestion.label}</span>
                    <small>{suggestion.detail}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="results-ledger">
            {results.map((result) => (
              <article className="search-result-row" key={result.product.id}>
                <div>
                  <span className={`match-pill match-pill--${result.matchType}`}>{result.matchLabel}</span>
                  <h3>
                    <Link href={`/products/${result.product.slug}`}>{result.product.partNumber}</Link>
                  </h3>
                  <p>{result.product.title}</p>
                  <small className="muted">
                    Matched on {result.matchedOn} · {result.product.specs.material} · {result.product.specs.finish}
                  </small>
                </div>
                <div className="search-result-row__stats">
                  <span>
                    <strong>{result.allocatableInventory.toLocaleString()}</strong>
                    <small>allocatable</small>
                  </span>
                  <span>
                    <strong>{result.effectivePriceLabel}</strong>
                    <small>account price</small>
                  </span>
                  <span>
                    <strong>{result.product.orderingRules.minimumOrderQuantity}</strong>
                    <small>MOQ</small>
                  </span>
                </div>
                <Link className="button-secondary" href={`/products/${result.product.slug}`}>
                  View
                </Link>
              </article>
            ))}
          </div>
        </main>
      </section>

      <section className="bom-workbench">
        <div className="bom-workbench__copy">
          <span className="eyebrow">
            <ClipboardList size={15} /> BOM bulk search
          </span>
          <h2>Paste a build list and let the catalog resolve each line.</h2>
          <p className="muted">
            Works with comma, tab, or space-separated lines. It extracts part numbers, quantities, alternates, and typo
            tolerant matches, then estimates account pricing.
          </p>
          <textarea
            value={bomText}
            onChange={(event) => setBomText(event.target.value)}
            aria-label="Paste BOM lines"
          />
          <button type="button" className="button" onClick={runBomSearch}>
            <PackageCheck size={18} />
            {isBomSearching ? "Resolving BOM..." : "Resolve BOM"}
          </button>
        </div>
        <div className="bom-workbench__results">
          {bomResult ? (
            <>
              <div className="bom-summary">
                <span><strong>{bomResult.matchedCount}</strong> matched</span>
                <span><strong>{bomResult.unresolvedCount}</strong> unresolved</span>
                <span><strong>{money(bomResult.estimatedTotal)}</strong> estimate</span>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Line</th>
                      <th>Requested</th>
                      <th>Match</th>
                      <th>Confidence</th>
                      <th>Ext.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomResult.lines.map((line) => (
                      <tr key={`${line.line}-${line.raw}`}>
                        <td>{line.line}</td>
                        <td>
                          {line.quantity} × {line.query || "Unparsed"}
                        </td>
                        <td>
                          {line.match ? (
                            <Link href={`/products/${line.match.product.slug}`}>{line.match.product.partNumber}</Link>
                          ) : (
                            "Needs review"
                          )}
                        </td>
                        <td>
                          <span className={`confidence confidence--${line.confidence.toLowerCase().replace(" ", "-")}`}>
                            {line.confidence}
                          </span>
                        </td>
                        <td>{line.match ? money(line.match.effectivePrice * line.quantity) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <PackageCheck size={44} />
              <h3>Bulk results will appear here.</h3>
              <p className="muted">Use this for RFQs, maintenance kits, and reorder sheets copied from spreadsheets.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
