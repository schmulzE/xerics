import supabase from '../../../lib/supabase';
import { useInfiniteQuery } from '@tanstack/react-query';


export const useInfiniteScroll = (table, pageSize = 10, tab = null, searchQuery, sortConfig) => {
  return useInfiniteQuery({
    queryKey: ['infinite', table, tab, searchQuery, sortConfig],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from(table)
        .select(`*, tasks(*)`)

      if (tab && tab !== 'all') {
        query = query.eq('status', tab);
      }

      if (searchQuery && searchQuery.trim() !== '') {
        query = query.textSearch('name', searchQuery, { type: 'plain' });
      }

      // Apply sorting based on sortConfig
      const sortColumn =
      sortConfig.sortBy.toLowerCase() === 'alphabetical'
      ? 'name'
      : sortConfig.sortBy.toLowerCase() === 'due date'
      ? 'due_date'
      : sortConfig.sortBy.toLowerCase();

      // const sortColumn = sortConfig.sortBy == 'Alphabetical' ? 'name' : sortConfig.sortBy.toLowerCase();
      // const sortDirection = sortConfig.sortOrder.toLowerCase() === 'ascending';

      query = query
        .range(pageParam * pageSize, (pageParam + 1) * pageSize - 1)
        .order(sortColumn);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data) throw new Error('No data returned from query');


      return {
        data,
        nextPage: data.length === pageSize ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};