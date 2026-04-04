import React from "react";

export const Shell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="shell">{children}</div>;

export const TopArea: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="shell__top">{children}</div>;

export const DownArea: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="shell__down">{children}</div>;

export const MiddleStrip: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="shell__middle">{children}</div>;
