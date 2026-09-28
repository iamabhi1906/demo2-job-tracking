"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTags } from "@/services/tags/fetch-tags";
import type { Tag } from "@/services/tags/tag.type";

export interface UseTagOptionsParams {
  enabled: boolean;
  query: string;
  limit?: number;
  debounceMs?: number;
}

export interface UseTagOptionsResult {
  options: Tag[];
  loading: boolean;
  error: string | null;
  /**
   * Insert a tag created during this session so it is visible straight away,
   * without waiting for the next fetch.
   */
  addTag: (tag: Tag) => void;
}

const normalize = (name: string) => name.trim().toLocaleLowerCase();

const mergeTag = (tags: Tag[], tag: Tag): Tag[] =>
  tags.some((option) => normalize(option.name) === normalize(tag.name))
    ? tags
    : [tag, ...tags];

/** Mirrors the backend `LIKE %q%` filter applied to locally created tags. */
const matchQuery = (tag: Tag, query: string) => {
  const needle = query.trim().toLocaleLowerCase();
  return needle.length === 0 || normalize(tag.name).includes(needle);
};

export function useTagOptions({
  query,
  limit = 10,
  debounceMs = 300,
}: UseTagOptionsParams): UseTagOptionsResult {
  const [options, setOptions] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const created = useRef<Tag[]>([]);

  const addTag = useCallback((tag: Tag) => {
    created.current = mergeTag(created.current, tag);
    setOptions((current) => mergeTag(current, tag));
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetchTags({ q: trimmed, limit });
        const local = created.current.filter((tag) => matchQuery(tag, trimmed));
        setOptions(local.reduce(mergeTag, response.tags));
        setError(null);
      } catch (caught) {
        setOptions([]);
        setError(
          caught instanceof Error ? caught.message : "Failed to load tags.",
        );
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, limit, debounceMs]);

  return { options, loading, error, addTag };
}

export default useTagOptions;
