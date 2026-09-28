"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  TERMINAL_STATUSES,
} from "@/services/applicants/applicant.schema";

export const PAGE_SIZE = 10;

export const STATUS_OPTIONS = [
  ...Object.keys(APPLICATION_STATUS_LABELS).map(
    (value) => value as ApplicationStatus,
  ),
] as const;

const STATUS_VALUES = new Set<string>(STATUS_OPTIONS);

export interface ApplicationSearch {
  status: ApplicationStatus | "";
  page: number;
}

function readSearch(params: URLSearchParams): ApplicationSearch {
  const status = params.get("status") ?? "";
  return {
    status: STATUS_VALUES.has(status) ? (status as ApplicationStatus) : "",
    page: Math.max(0, Number(params.get("page")) || 0),
  };
}

function toQuery({ status, page }: ApplicationSearch): string {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page > 0) params.set("page", String(page));
  return params.toString();
}

export function useApplicationSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const search = useMemo(() => readSearch(params), [params]);

  const update = useCallback(
    (patch: Partial<ApplicationSearch>) => {
      const query = toQuery({ ...search, page: 0, ...patch });
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [search, pathname, router],
  );

  const dto = useMemo(
    () => ({
      ...(search.status ? { status: search.status } : {}),
      page: search.page,
      limit: PAGE_SIZE,
    }),
    [search],
  );

  return { status: search.status, page: search.page, update, dto };
}

export { TERMINAL_STATUSES };
