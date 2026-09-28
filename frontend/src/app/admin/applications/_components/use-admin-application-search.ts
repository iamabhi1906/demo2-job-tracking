"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/services/applicants/applicant.schema";

export const PAGE_SIZE = 20;

export const SORT_OPTIONS = [
  { value: "stage:ASC", label: "Pipeline stage" },
  { value: "appliedAt:DESC", label: "Newest applications" },
  { value: "appliedAt:ASC", label: "Oldest applications" },
  { value: "rejectionCount:ASC", label: "Fewest rejections" },
  { value: "rejectionCount:DESC", label: "Most rejections" },
] as const;

const DEFAULT_SORT = SORT_OPTIONS[0].value;
const SORT_VALUES = new Set<string>(SORT_OPTIONS.map((option) => option.value));
export const DEFAULT_RISK_THRESHOLD = 3;

export const RISK_THRESHOLD_OPTIONS = [0, 1, 2, 3, 5, 10] as const;

const STATUS_VALUES = new Set<string>(Object.keys(APPLICATION_STATUS_LABELS));

export interface AdminApplicationFilters {
  q: string;
  statuses: ApplicationStatus[];
  jobId: string;
  appliedFrom: string;
  appliedTo: string;
  tags: string[];
  maxRejections: string;
  riskThreshold: string;
}

export const emptyFilters: AdminApplicationFilters = {
  q: "",
  statuses: [],
  jobId: "",
  appliedFrom: "",
  appliedTo: "",
  tags: [],
  maxRejections: "",
  riskThreshold: String(DEFAULT_RISK_THRESHOLD),
};

export interface AdminApplicationSearch {
  filters: AdminApplicationFilters;
  page: number;
  sort: string;
}

const toInt = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
};

function readSearch(params: URLSearchParams): AdminApplicationSearch {
  const sort = params.get("sort") ?? "";
  return {
    filters: {
      q: params.get("q") ?? "",
      statuses: (params.get("status") ?? "")
        .split(",")
        .filter((value) => STATUS_VALUES.has(value)) as ApplicationStatus[],
      jobId: params.get("jobId") ?? "",
      appliedFrom: params.get("appliedFrom") ?? "",
      appliedTo: params.get("appliedTo") ?? "",
      tags: (params.get("tags") ?? "").split(",").filter(Boolean),
      maxRejections: params.get("maxRejections") ?? "",
      riskThreshold:
        params.get("riskThreshold") ?? String(DEFAULT_RISK_THRESHOLD),
    },
    page: Math.max(0, Number(params.get("page")) || 0),
    sort: SORT_VALUES.has(sort) ? sort : DEFAULT_SORT,
  };
}

function toQuery({ filters, page, sort }: AdminApplicationSearch): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.statuses.length) params.set("status", filters.statuses.join(","));
  if (filters.jobId) params.set("jobId", filters.jobId);
  if (filters.appliedFrom) params.set("appliedFrom", filters.appliedFrom);
  if (filters.appliedTo) params.set("appliedTo", filters.appliedTo);
  if (filters.tags.length) params.set("tags", filters.tags.join(","));
  if (filters.maxRejections) params.set("maxRejections", filters.maxRejections);
  if (filters.riskThreshold !== String(DEFAULT_RISK_THRESHOLD))
    params.set("riskThreshold", filters.riskThreshold);
  if (page > 0) params.set("page", String(page));
  if (sort !== DEFAULT_SORT) params.set("sort", sort);
  return params.toString();
}

export function useAdminApplicationSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const search = useMemo(() => readSearch(params), [params]);

  const update = useCallback(
    (patch: Partial<AdminApplicationSearch>) => {
      const query = toQuery({ ...search, page: 0, ...patch });
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [search, pathname, router],
  );

  const riskThreshold =
    toInt(search.filters.riskThreshold) ?? DEFAULT_RISK_THRESHOLD;

  const dto = useMemo(() => {
    const [sortBy, sortOrder] = search.sort.split(":");
    const maxRejections = toInt(search.filters.maxRejections);
    return {
      ...(search.filters.q ? { q: search.filters.q } : {}),
      ...(search.filters.statuses.length
        ? { status: search.filters.statuses }
        : {}),
      ...(search.filters.jobId ? { jobId: search.filters.jobId } : {}),
      ...(search.filters.appliedFrom
        ? { appliedFrom: search.filters.appliedFrom }
        : {}),
      ...(search.filters.appliedTo
        ? { appliedTo: search.filters.appliedTo }
        : {}),
      ...(search.filters.tags.length ? { tag: search.filters.tags } : {}),
      ...(maxRejections !== undefined ? { maxRejections } : {}),
      sortBy: sortBy as "stage" | "appliedAt" | "rejectionCount",
      sortOrder: sortOrder as "ASC" | "DESC",
      page: search.page,
      limit: PAGE_SIZE,
    };
  }, [search]);

  return {
    filters: search.filters,
    page: search.page,
    sort: search.sort,
    riskThreshold,
    update,
    dto,
  };
}
