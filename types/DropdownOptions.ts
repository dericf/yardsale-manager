import { SellerSortBy, YardSaleSortBy } from "./Context";

export interface DropdownData {
  value: string
}

export interface YardSaleSortByOptionsInterface {
  key: string;
  text: string;
  value: YardSaleSortBy;
}

export const YardSaleSortByOptions: Array<YardSaleSortByOptionsInterface> = [
  {
    key: "Date (Oldest First)",
    text: "Date (Oldest First)",
    value: "created_at-asc",
  },
  {
    key: "Date (Newest First)",
    text: "Date (Newest First)",
    value: "created_at-desc",
  },
  {
    key: "Name (A-Z)",
    text: "Name (A-Z)",
    value: "name-asc",
  },
  {
    key: "Name (Z-A)",
    text: "Name (Z-A)",
    value: "name-desc",
  },
  {
    key: "Company (A-Z)",
    text: "Company (A-Z)",
    value: "company-asc",
  },
  {
    key: "Company (Z-A)",
    text: "Company (Z-A)",
    value: "company-desc",
  },
];

/**
 * Sellers
 */

export interface SellersSortByOptionsInterface {
  key: string;
  text: string;
  value: SellerSortBy;
}

export const SellersSortByOptions: Array<SellersSortByOptionsInterface> = [
  {
    key: "Name (A-Z)",
    text: "Name (A-Z)",
    value: "name-asc",
  },
  {
    key: "Name (Z-A)",
    text: "Name (Z-A)",
    value: "name-desc",
  },
  {
    key: "Company (A-Z)",
    text: "Company (A-Z)",
    value: "company-asc",
  },
  {
    key: "Company (Z-A)",
    text: "Company (Z-A)",
    value: "company-desc",
  },
  {
    key: "Date Created (Oldest First)",
    text: "Date Created  (Oldest First)",
    value: "created_at-asc",
  },
  {
    key: "Date Created  (Newest First)",
    text: "Date Created  (Newest First)",
    value: "created_at-desc",
  },
];
