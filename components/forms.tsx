import { Filter, Search } from "lucide-react";

export function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" className="command-form form-grid">
      <div className="field full">
        <label htmlFor="search-q">Search by part number, series, material, or application</label>
        <div className="input-with-icon">
          <Search size={20} />
          <input id="search-q" name="q" defaultValue={defaultValue} placeholder="Ex: NAS6204, Phillips, A286" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="search-series">Series</label>
        <select id="search-series" name="series">
          <option value="">All series</option>
          <option value="an">AN Series</option>
          <option value="ms">MS Series</option>
          <option value="nas">NAS Series</option>
          <option value="bacb">BACB Series</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="search-availability">Availability</label>
        <select id="search-availability" name="availability">
          <option value="">Any availability</option>
          <option value="in stock">In Stock</option>
          <option value="limited stock">Limited Stock</option>
          <option value="built to order">Built to Order</option>
        </select>
      </div>
      <button type="submit" className="button">
        <Search size={18} />
        Search Catalog
      </button>
    </form>
  );
}

export function FinderForm({
  defaults
}: {
  defaults?: { material?: string; finish?: string; availability?: string };
}) {
  return (
    <form action="/finder" className="command-form form-grid">
      <div className="field">
        <label htmlFor="finder-material">Material</label>
        <select id="finder-material" name="material" defaultValue={defaults?.material}>
          <option value="">Any material</option>
          <option value="alloy steel">Alloy Steel</option>
          <option value="stainless steel">Stainless Steel</option>
          <option value="a286">A286</option>
          <option value="cres">CRES</option>
          <option value="steel">Steel</option>
          <option value="spring steel">Spring Steel</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="finder-finish">Finish</label>
        <select id="finder-finish" name="finish" defaultValue={defaults?.finish}>
          <option value="">Any finish</option>
          <option value="cadmium">Cadmium Plated</option>
          <option value="passivated">Passivated</option>
          <option value="plain">Plain</option>
          <option value="silver">Silver Plated</option>
          <option value="zinc">Zinc Chromate</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="finder-availability">Availability</label>
        <select id="finder-availability" name="availability" defaultValue={defaults?.availability}>
          <option value="">Any availability</option>
          <option value="in stock">In Stock</option>
          <option value="limited stock">Limited Stock</option>
          <option value="built to order">Built to Order</option>
        </select>
      </div>
      <button type="submit" className="button">
        <Filter size={18} />
        Filter Fasteners
      </button>
    </form>
  );
}
