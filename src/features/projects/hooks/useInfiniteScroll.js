import supabase from '../../../lib/supabase';
import { useInfiniteQuery } from '@tanstack/react-query';


export const useInfiniteScroll = (table, pageSize = 10, tab = null, searchQuery) => {
  return useInfiniteQuery({
    queryKey: ['infinite', table, tab, searchQuery],
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

      query = query
        .range(pageParam * pageSize, (pageParam + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
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