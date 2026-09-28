"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { GetJobsDto } from "@/services/jobs/job.schema";

export const PAGE_SIZE = 12;

export interface JobFilters {
  q: string;
  department: string;
  location: string;
  employmentType: string;
  tags: string[];
}

export const emptyFilters: JobFilters = {
  q: "",
  department: "",
  location: "",
  employmentType: "",
  tags: [],
};

export const SORT_OPTIONS = [
  { value: "createdDate:DESC", label: "Newest first" },
  { value: "createdDate:ASC", label: "Oldest first" },
  { value: "applicationDeadline:ASC", label: "Closing soonest" },
  { value: "applicationDeadline:DESC", label: "Closing latest" },
] as const;

const DEFAULT_SORT = SORT_OPTIONS[0].value;
const SORT_VALUES = new Set<string>(SORT_OPTIONS.map((option) => option.value));

export interface JobSearch {
  filters: JobFilters;
  page: number;
  sort: string;
}
function readSearch(params: URLSearchParams): JobSearch {
  const sort = params.get("sort") ?? "";
  return {
    filters: {
      q: params.get("q") ?? "",
      department: params.get("department") ?? "",
      location: params.get("location") ?? "",
      employmentType: params.get("employmentType") ?? "",
      tags: params.get("tags")?.split(",").filter(Boolean) ?? [],
    },
    page: Math.max(0, Number(params.get("page")) || 0),
    sort: SORT_VALUES.has(sort) ? sort : DEFAULT_SORT,
  };
}

function toQuery({ filters, page, sort }: JobSearch): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    const isEmpty = Array.isArray(value) ? value.length === 0 : value === "";
    if (!isEmpty) params.set(key, String(value));
  }
  if (page > 0) params.set("page", String(page));
  if (sort !== DEFAULT_SORT) params.set("sort", sort);
  return params.toString();
}

export function useJobSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const search = useMemo(() => readSearch(params), [params]);

  const update = useCallback(
    (patch: Partial<JobSearch>) => {
      const query = toQuery({ ...search, page: 0, ...patch });
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [search, pathname, router],
  );

  const dto = useMemo(() => {
    const [sortBy, sortOrder] = search.sort.split(":");
    return {
      ...search.filters,
      sortBy,
      sortOrder,
      page: search.page,
      limit: PAGE_SIZE,
    } as GetJobsDto;
  }, [search]);

  return {
    filters: search.filters,
    page: search.page,
    sort: search.sort,
    update,
    dto,
  };
}
