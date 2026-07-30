'use server';

import { createClient } from '@/lib/supabase/server';
import { Actor, ActorWithCount, Job } from '@/lib/types/database';

export async function getActors(
  search?: string,
  page: number = 1,
  limit: number = 12
): Promise<{ data?: ActorWithCount[]; count?: number; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    let query = supabase.from('actors').select('*', { count: 'exact' });

    if (search?.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    query = query.order('created_at', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query.range(from, to);
    if (error) return { error: error.message };

    const actors = data as Actor[];

    const actorsWithCounts: ActorWithCount[] = await Promise.all(
      actors.map(async (actor) => {
        const { count: videoCount } = await supabase
          .from('job_actors')
          .select('*', { count: 'exact', head: true })
          .eq('actor_id', actor.id);
        return { ...actor, video_count: videoCount || 0 };
      })
    );

    return { data: actorsWithCounts, count: count || 0 };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to fetch actors' };
  }
}

export async function getAllActors(): Promise<{ data?: Actor[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('actors')
      .select('*')
      .order('name', { ascending: true });

    if (error) return { error: error.message };
    return { data: data as Actor[] };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to fetch actors' };
  }
}

export async function getActorById(
  id: string
): Promise<{ data?: ActorWithCount & { jobs: Job[] }; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data: actor, error: actorError } = await supabase
      .from('actors')
      .select('*')
      .eq('id', id)
      .single();

    if (actorError || !actor) return { error: actorError?.message || 'Actor not found' };

    const { data: junctionRows } = await supabase
      .from('job_actors')
      .select('job_id')
      .eq('actor_id', id);

    const jobIds = (junctionRows || []).map((r: { job_id: string }) => r.job_id);

    let jobs: Job[] = [];
    if (jobIds.length > 0) {
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .in('id', jobIds)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      jobs = (jobData as Job[]) || [];
    }

    return {
      data: {
        ...(actor as Actor),
        video_count: jobs.length,
        jobs,
      },
    };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to fetch actor' };
  }
}

export async function createActor(
  name: string,
  image_url: string | null,
  biography: string | null,
  birth_date: string | null,
  nationality: string | null
): Promise<{ data?: Actor; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('actors')
      .insert({
        name: name.trim(),
        image_url: image_url?.trim() || null,
        biography: biography?.trim() || null,
        birth_date: birth_date || null,
        nationality: nationality?.trim() || null,
      })
      .select()
      .single();

    if (error) return { error: error.message };
    return { data: data as Actor };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to create actor' };
  }
}

export async function updateActor(
  id: string,
  name: string,
  image_url: string | null,
  biography: string | null,
  birth_date: string | null,
  nationality: string | null
): Promise<{ data?: Actor; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('actors')
      .update({
        name: name.trim(),
        image_url: image_url?.trim() || null,
        biography: biography?.trim() || null,
        birth_date: birth_date || null,
        nationality: nationality?.trim() || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { error: error.message };
    return { data: data as Actor };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to update actor' };
  }
}

export async function deleteActor(id: string): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('actors').delete().eq('id', id);
    if (error) return { error: error.message };

    return {};
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to delete actor' };
  }
}
