'use server';

import { createClient } from '@/lib/supabase/server';
import { Job, Category, Actor, JobWithMetadata } from '@/lib/types/database';

export async function getJobWithMetadata(
  jobId: string
): Promise<{ data?: JobWithMetadata; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', user.id)
      .single();

    if (jobError || !job) return { error: jobError?.message || 'Video not found' };

    // Fetch categories
    const { data: catJunctions } = await supabase
      .from('job_categories')
      .select('category_id')
      .eq('job_id', jobId);

    let categories: Category[] = [];
    const catIds = (catJunctions || []).map((r: { category_id: string }) => r.category_id);
    if (catIds.length > 0) {
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .in('id', catIds)
        .order('name', { ascending: true });
      categories = (catData as Category[]) || [];
    }

    // Fetch actors
    const { data: actorJunctions } = await supabase
      .from('job_actors')
      .select('actor_id')
      .eq('job_id', jobId);

    let actors: Actor[] = [];
    const actorIds = (actorJunctions || []).map((r: { actor_id: string }) => r.actor_id);
    if (actorIds.length > 0) {
      const { data: actorData } = await supabase
        .from('actors')
        .select('*')
        .in('id', actorIds)
        .order('name', { ascending: true });
      actors = (actorData as Actor[]) || [];
    }

    return {
      data: {
        ...(job as Job),
        categories,
        actors,
      },
    };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to fetch video metadata' };
  }
}

export async function updateJobDescription(
  jobId: string,
  description: string | null
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { error } = await supabase
      .from('jobs')
      .update({ description: description?.trim() || null })
      .eq('id', jobId)
      .eq('user_id', user.id);

    if (error) return { error: error.message };
    return {};
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to update description' };
  }
}

export async function updateJobCategories(
  jobId: string,
  categoryIds: string[]
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    // Verify user owns this job
    const { data: job } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', jobId)
      .eq('user_id', user.id)
      .single();

    if (!job) return { error: 'Video not found' };

    // Delete existing associations
    await supabase.from('job_categories').delete().eq('job_id', jobId);

    // Insert new associations
    if (categoryIds.length > 0) {
      const rows = categoryIds.map((categoryId) => ({ job_id: jobId, category_id: categoryId }));
      const { error } = await supabase.from('job_categories').insert(rows);
      if (error) return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to update categories' };
  }
}

export async function updateJobActors(
  jobId: string,
  actorIds: string[]
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data: job } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', jobId)
      .eq('user_id', user.id)
      .single();

    if (!job) return { error: 'Video not found' };

    await supabase.from('job_actors').delete().eq('job_id', jobId);

    if (actorIds.length > 0) {
      const rows = actorIds.map((actorId) => ({ job_id: jobId, actor_id: actorId }));
      const { error } = await supabase.from('job_actors').insert(rows);
      if (error) return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to update actors' };
  }
}

export async function updateJobMetadata(
  jobId: string,
  description: string | null,
  categoryIds: string[],
  actorIds: string[]
): Promise<{ error?: string }> {
  const descResult = await updateJobDescription(jobId, description);
  if (descResult.error) return descResult;

  const catResult = await updateJobCategories(jobId, categoryIds);
  if (catResult.error) return catResult;

  const actorResult = await updateJobActors(jobId, actorIds);
  if (actorResult.error) return actorResult;

  return {};
}

export async function getJobMetadataForList(
  jobIds: string[]
): Promise<{
  categories: Record<string, Category[]>;
  actors: Record<string, Actor[]>;
}> {
  if (jobIds.length === 0) return { categories: {}, actors: {} };

  try {
    const supabase = await createClient();

    // Batch fetch all category associations
    const { data: catJunctions } = await supabase
      .from('job_categories')
      .select('job_id, category_id')
      .in('job_id', jobIds);

    const catIds = Array.from(new Set((catJunctions || []).map((r: { category_id: string }) => r.category_id)));
    let allCategories: Category[] = [];
    if (catIds.length > 0) {
      const { data } = await supabase.from('categories').select('*').in('id', catIds);
      allCategories = (data as Category[]) || [];
    }

    const catMap: Record<string, Category> = {};
    allCategories.forEach((c) => { catMap[c.id] = c; });

    const categoriesByJob: Record<string, Category[]> = {};
    (catJunctions || []).forEach((r: { job_id: string; category_id: string }) => {
      if (!categoriesByJob[r.job_id]) categoriesByJob[r.job_id] = [];
      if (catMap[r.category_id]) categoriesByJob[r.job_id].push(catMap[r.category_id]);
    });

    // Batch fetch all actor associations
    const { data: actorJunctions } = await supabase
      .from('job_actors')
      .select('job_id, actor_id')
      .in('job_id', jobIds);

    const actorIdSet = Array.from(new Set((actorJunctions || []).map((r: { actor_id: string }) => r.actor_id)));
    let allActors: Actor[] = [];
    if (actorIdSet.length > 0) {
      const { data } = await supabase.from('actors').select('*').in('id', actorIdSet);
      allActors = (data as Actor[]) || [];
    }

    const actorMap: Record<string, Actor> = {};
    allActors.forEach((a) => { actorMap[a.id] = a; });

    const actorsByJob: Record<string, Actor[]> = {};
    (actorJunctions || []).forEach((r: { job_id: string; actor_id: string }) => {
      if (!actorsByJob[r.job_id]) actorsByJob[r.job_id] = [];
      if (actorMap[r.actor_id]) actorsByJob[r.job_id].push(actorMap[r.actor_id]);
    });

    return { categories: categoriesByJob, actors: actorsByJob };
  } catch (error) {
    console.error('Server action error:', error);
    return { categories: {}, actors: {} };
  }
}
