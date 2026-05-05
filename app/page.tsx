import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  FileCheck2,
  PackageSearch,
  Radar,
  Truck
} from "lucide-react";

import { SearchForm } from "@/components/forms";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import {
  categories,
  getFeaturedProducts,
  getRecentlyUpdatedProducts,
  products,
  series,
  stats
} from "@/lib/data";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const recent = getRecentlyUpdatedProducts();
  const heroProduct = products[0];

  return (
    <div className="home">
      <section className="command-hero">
        <div className="container command-hero__grid">
          <div className="command-hero__copy">
            <p className="eyebrow">Aerospace and defense sourcing console</p>
            <h1>ForgeLine Fasteners</h1>
            <p className="lede">
              Search military hardware, compare spec families, request formal quotes, and keep cert-backed
              buying workflows moving from one focused desk.
            </p>
            <SearchForm />
          </div>
          <aside className="command-hero__panel" aria-label="Priority product">
            <div className="panel-header">
              <span>Priority Stock</span>
              <BadgeCheck size={18} />
            </div>
            <div className="hero-product">
              <img src={heroProduct.imageSrc} alt={`${heroProduct.partNumber} product reference`} />
              <div>
                <span className="status">{heroProduct.availability}</span>
                <h2>{heroProduct.partNumber}</h2>
                <p>{heroProduct.title}</p>
                <Link href={`/products/${heroProduct.slug}`} className="button">
                  Inspect Part <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="metrics-band">
        <div className="container metrics-grid">
          {stats.map((stat) => (
            <div className="metric-tile" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHeading
          title="Fastener Departments"
          description="Direct paths into the families buyers actually source every day."
          action={
            <Link href="/search" className="inline-action">
              View catalog <ArrowRight size={17} />
            </Link>
          }
        />
        <div className="department-grid">
          {categories.map((category, index) => {
            const icons = [Boxes, PackageSearch, ClipboardCheck, Truck];
            const Icon = icons[index % icons.length];

            return (
              <Link key={category.slug} href={`/categories/${category.slug}`} className="department-link">
                <Icon size={22} />
                <strong>{category.name}</strong>
                <span>{category.description}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section container">
        <SectionHeading
          title="Featured Inventory"
          description="High-demand items with visible stock state, lead time, and quick inspection."
        />
        <div className="grid cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section split-band">
        <div className="container split-band__grid">
          <div>
            <SectionHeading
              title="Series Index"
              description="Navigate by the spec family printed on your drawings and purchase packets."
            />
            <div className="series-list">
              {series.map((item) => (
                <Link key={item.slug} href={`/series/${item.slug}`} className="series-row">
                  <span>{item.name}</span>
                  <small>{item.description}</small>
                  <ArrowRight size={18} />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading
              title="Recent Changes"
              description="Updated prices, lead times, and document references ready for review."
            />
            <div className="activity-list">
              {recent.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id} className="activity-row">
                  <FileCheck2 size={18} />
                  <span>{product.partNumber}</span>
                  <small>{product.updatedAt}</small>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="workflow-strip">
          <div>
            <Radar size={22} />
            <strong>Find</strong>
            <span>Search by part, family, material, or application.</span>
          </div>
          <div>
            <ClipboardCheck size={22} />
            <strong>Quote</strong>
            <span>Submit quantities, cert requirements, and program notes.</span>
          </div>
          <div>
            <Truck size={22} />
            <strong>Release</strong>
            <span>Checkout, split shipments, and retrieve order documents.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
