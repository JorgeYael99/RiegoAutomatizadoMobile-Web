import React from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  actions?: React.ReactNode;
  subtitle?: string;
}

export default function PageHeader({ title, actions, subtitle }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="header-content">
        <h1>{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      <div className="header-actions">
        {actions}
      </div>
    </div>
  );
}