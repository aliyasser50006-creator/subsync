import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { VideoDetailPage } from '@/components/library/video-detail/video-detail-page';
import { getJobWithMetadata } from '@/lib/actions/metadata';
import { normalizeLibraryVideoId } from '@/lib/utils/library-video-route';
import { createClient } from '@/lib/supabase/server';
import { LibraryVideo } from '@/lib/data/library';

interface Props {
  params: { id: string };
  searchParams: { from?: string; categoryId?: string; actorId?: string };
}

export const metadata: Metadata = {
  title: 'Video Details',
  description: 'View video, subtitle, and file details.',
};

export default async function VideoDetailsRoute({ params, searchParams }: Props) {
  const receivedRouteParameter = params.id;

  const videoId = normalizeLibraryVideoId(receivedRouteParameter);
  if (!videoId) {
    throw new Error('The video details route received an invalid video ID.');
  }

  const result = await getJobWithMetadata(videoId);

  if (result.error === 'Unauthorized') redirect('/login');
  if (!result.data) notFound();
  if (result.error) {
    throw new Error(result.error);
  }

  const job = result.data;
  
  // Fetch Related Videos
  const supabase = await createClient();
  let relatedJobIds = new Set<string>();

  // 1. Match by Category
  if (job.categories && job.categories.length > 0) {
    const { data: catJobs } = await supabase
      .from('job_categories')
      .select('job_id')
      .in('category_id', job.categories.map(c => c.id));
    catJobs?.forEach(c => relatedJobIds.add(c.job_id));
  }

  // 2. Match by Actor
  if (job.actors && job.actors.length > 0) {
    const { data: actorJobs } = await supabase
      .from('job_actors')
      .select('job_id')
      .in('actor_id', job.actors.map(a => a.id));
    actorJobs?.forEach(a => relatedJobIds.add(a.job_id));
  }

  relatedJobIds.delete(job.id); // Remove current video

  let relatedQuery = supabase
    .from('jobs')
    .select('id, title, video_url, img_url, subtitle_file, subtitle_settings, created_at, status')
    .eq('user_id', job.user_id)
    .neq('id', job.id);

  if (relatedJobIds.size > 0) {
    relatedQuery = relatedQuery.in('id', Array.from(relatedJobIds));
  }
  
  relatedQuery = relatedQuery.order('created_at', { ascending: false }).limit(6);

  const { data: relatedData } = await relatedQuery;

  // Fallback to recent videos if we didn't get enough matches
  let finalRelated = relatedData || [];
  if (finalRelated.length < 4) {
    const excludeIds = [job.id, ...finalRelated.map(r => r.id)];
    const { data: recentData } = await supabase
      .from('jobs')
      .select('id, title, video_url, img_url, subtitle_file, subtitle_settings, created_at, status')
      .eq('user_id', job.user_id)
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .order('created_at', { ascending: false })
      .limit(6 - finalRelated.length);
    
    if (recentData) {
      finalRelated = [...finalRelated, ...recentData];
    }
  }

  const relatedVideos: LibraryVideo[] = finalRelated.map((item) => ({
    id: String(item.id),
    name: String(item.title ?? '').trim() || 'Untitled video',
    video_url: String(item.video_url).trim(),
    img_url: item.img_url?.trim() || null,
    subtitle_file: item.subtitle_file?.trim() || null,
    subtitle_settings: item.subtitle_settings || null,
    created_at: item.created_at || undefined,
    status: item.status as any,
  }));

  // Determine Back Navigation & Breadcrumb
  let returnTo = '/library?page=1';
  let breadcrumbSource = 'Media Library';

  if (searchParams.from === 'category' && searchParams.categoryId) {
    returnTo = `/categories/${searchParams.categoryId}`;
    const { data: catData } = await supabase.from('categories').select('name').eq('id', searchParams.categoryId).single();
    if (catData) breadcrumbSource = catData.name;
  } else if (searchParams.from === 'actor' && searchParams.actorId) {
    returnTo = `/actors/${searchParams.actorId}`;
    const { data: actData } = await supabase.from('actors').select('name').eq('id', searchParams.actorId).single();
    if (actData) breadcrumbSource = actData.name;
  }

  return <VideoDetailPage job={job} relatedVideos={relatedVideos} returnTo={returnTo} breadcrumbSource={breadcrumbSource} />;
}
