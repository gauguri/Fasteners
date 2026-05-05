import Link from "next/link";
import { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  trail,
  actions
}: {
  title: string;
  description: string;
  trail?: { href: string; label: string }[];
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      {trail?.length ? (
        <div className="breadcrumbs">
          {trail.map((item, index) => (
            <span key={item.href}>
              {index > 0 ? " / " : ""}
              <Link href={item.href}>{item.label}</Link>
            </span>
          ))}
        </div>
      ) : null}
      <h1>{title}</h1>
      <p className="lede">{description}</p>
      {actions}
    </div>
  );
}
