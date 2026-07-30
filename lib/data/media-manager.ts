import { createClient } from '@/lib/supabase/server';
import { JobWithMetadata } from '@/lib/types/database';
import { getJobMetadataForList } from '@/lib/actions/metadata';
import { escapeIlike } from '@/lib/utils/escape-ilike';
import { DEFAULT_LIBRARY_PAGE_SIZE } from '@/lib/data/library';

export interface MediaManagerPageData {
  jobs: JobWithMetadata[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  availableCount: number;
  unavailableCount: number;
}

export async function getMediaManagerPageData({
  userId,
  page = 1,
  searchQuery = '',
  statusFilter = 'all',
  sort = 'newest',
  categoryId = 'all',
  actorId = 'all',
}: {
  userId: string;
  page?: number;
  searchQuery?: string;
  statusFilter?: string;
  sort?: string;
  categoryId?: string;
  actorId?: string;
}): Promise<MediaManagerPageData> {
  const supabase = await createClient();
  const pageSize = DEFAULT_LIBRARY_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build count queries for status stats
  const { count: availableCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .is('output_video', null)
    .eq('user_id', userId);

  const { count: unavailableCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .not('output_video', 'is', null)
    .eq('user_id', userId);

  // Main page query
  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  if (searchQuery.trim()) {
    query = query.ilike('title', `%${escapeIlike(searchQuery.trim())}%`);
  }

  if (statusFilter === 'processed') {
    query = query.not('output_video', 'is', null);
  } else if (statusFilter === 'unprocessed') {
    query = query.is('output_video', null);
  }

  if (categoryId && categoryId !== 'all') {
    const { data: catJobs } = await supabase
      .from('job_categories')
      .select('job_id')
      .eq('category_id', categoryId);
    const catJobIds = (catJobs || []).map((jc) => jc.job_id);
    if (catJobIds.length === 0) {
      return {
        jobs: [],
        page,
        pageSize,
        totalCount: 0,
        totalPages: 1,
        availableCount: availableCount || 0,
        unavailableCount: unavailableCount || 0,
      };
    }
    query = query.in('id', catJobIds);
  }

  if (actorId && actorId !== 'all') {
    const { data: actorJobs } = await supabase
      .from('job_actors')
      .select('job_id')
      .eq('actor_id', actorId);
    const actorJobIds = (actorJobs || []).map((ja) => ja.job_id);
    if (actorJobIds.length === 0) {
      return {
        jobs: [],
        page,
        pageSize,
        totalCount: 0,
        totalPages: 1,
        availableCount: availableCount || 0,
        unavailableCount: unavailableCount || 0,
      };
    }
    query = query.in('id', actorJobIds);
  }

  if (sort === 'oldest') {
    query = query.order('created_at', { ascending: true });
  } else if (sort === 'alphabetical') {
    query = query.order('title', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  query = query.range(from, to);

  const { data: jobsData, count: totalCount } = await query;
  const fetchedJobs = (jobsData || []) as JobWithMetadata[];
  const jobIds = fetchedJobs.map((j) => j.id);

  const metadataResult = await getJobMetadataForList(jobIds);

  const jobsWithMetadata = fetchedJobs.map((job) => ({
    ...job,
    categories: metadataResult?.categories[job.id] || [],
    actors: metadataResult?.actors[job.id] || [],
  }));

  const total = totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    jobs: jobsWithMetadata,
    page,
    pageSize,
    totalCount: total,
    totalPages,
    availableCount: availableCount || 0,
    unavailableCount: unavailableCount || 0,
  };
}
