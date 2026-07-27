import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  OFF_SEARCH_DEBOUNCE_MS,
  OFF_SEARCH_MIN_QUERY_LENGTH,
  OFF_SEARCH_PAGE_SIZE,
} from '@/constants/api';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { getErrorMessage, OffRateLimitError } from '@/services/errors';
import {
  searchOffProducts,
  type OffSearchHit,
} from '@/services/openFoodFacts.service';

type UseOffProductSearchOptions = {
  enabled?: boolean;
};

export const useOffProductSearch = ({ enabled = true }: UseOffProductSearchOptions = {}) => {
  const [query, setQuery] = useState('');
  const [allHits, setAllHits] = useState<OffSearchHit[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWithoutCarbs, setShowWithoutCarbs] = useState(false);

  const debouncedQuery = useDebouncedValue(query, OFF_SEARCH_DEBOUNCE_MS);
  const abortRef = useRef<AbortController | null>(null);
  const searchKeyRef = useRef('');

  const trimmedQuery = debouncedQuery.trim();
  const canSearch = enabled && trimmedQuery.length >= OFF_SEARCH_MIN_QUERY_LENGTH;

  const resetSearch = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setAllHits([]);
    setTotalCount(0);
    setCurrentPage(0);
    setError(null);
    setIsLoading(false);
    setIsLoadingMore(false);
    searchKeyRef.current = '';
  }, []);

  const runSearch = useCallback(
    async (searchQuery: string, page: number, append: boolean) => {
      const searchKey = `${searchQuery}::${page}`;
      if (!append && searchKeyRef.current === searchKey) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      searchKeyRef.current = searchKey;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      try {
        const result = await searchOffProducts(
          searchQuery,
          page,
          OFF_SEARCH_PAGE_SIZE,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        setTotalCount(result.count);
        setCurrentPage(result.page);
        setAllHits((prev) => (append ? [...prev, ...result.hits] : result.hits));
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        if (err instanceof OffRateLimitError) {
          setError(getErrorMessage(err));
        } else {
          setError(getErrorMessage(err));
        }
        if (!append) {
          setAllHits([]);
          setTotalCount(0);
          setCurrentPage(0);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!canSearch) {
      resetSearch();
      return;
    }

    void runSearch(trimmedQuery, 1, false);
  }, [canSearch, trimmedQuery, runSearch, resetSearch]);

  const filteredHits = useMemo(() => {
    if (showWithoutCarbs) return allHits;
    return allHits.filter((hit) => hit.carbsPer100g != null);
  }, [allHits, showWithoutCarbs]);

  const hasMore = allHits.length < totalCount;

  const loadMore = useCallback(() => {
    if (!canSearch || isLoading || isLoadingMore || !hasMore) return;
    void runSearch(trimmedQuery, currentPage + 1, true);
  }, [
    canSearch,
    currentPage,
    hasMore,
    isLoading,
    isLoadingMore,
    runSearch,
    trimmedQuery,
  ]);

  const toggleShowWithoutCarbs = useCallback(() => {
    setShowWithoutCarbs((prev) => !prev);
  }, []);

  const clearQuery = useCallback(() => {
    setQuery('');
    resetSearch();
  }, [resetSearch]);

  return {
    query,
    setQuery,
    filteredHits,
    isLoading,
    isLoadingMore,
    error,
    showWithoutCarbs,
    toggleShowWithoutCarbs,
    loadMore,
    hasMore,
    canSearch,
    clearQuery,
    resetSearch,
  };
};
