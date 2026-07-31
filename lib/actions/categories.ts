'use server';

import { createClient } from '@/lib/supabase/server';
import { Category, CategoryWithCount, Job } from '@/lib/types/database';

export async function getCategories(
  search?: string,
  page: number = 1,
  limit: number = 12
): Promise<{ data?: CategoryWithCount[]; count?: number; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    let query = supabase.from('categories').select('*', { count: 'exact' }).eq('user_id', user.id);

    if (search?.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    query = query.order('created_at', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query.range(from, to);
    if (error) return { error: error.message };

    const categories = data as Category[];

    // Get video counts for each category
    const categoriesWithCounts: CategoryWithCount[] = await Promise.all(
      categories.map(async (cat) => {
        const { count: videoCount } = await supabase
          .from('job_categories')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id);
        return { ...cat, video_count: videoCount || 0 };
      })
    );

    return { data: categoriesWithCounts, count: count || 0 };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to fetch categories' };
  }
}

export async function getAllCategories(): Promise<{ data?: Category[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (error) return { error: error.message };
    return { data: data as Category[] };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to fetch categories' };
  }
}

export async function getCategoryById(
  id: string
): Promise<{ data?: CategoryWithCount & { jobs: Job[] }; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (catError || !category) return { error: catError?.message || 'Category not found' };

    // Get linked jobs
    const { data: junctionRows } = await supabase
      .from('job_categories')
      .select('job_id')
      .eq('category_id', id);

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
        ...(category as Category),
        video_count: jobs.length,
        jobs,
      },
    };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to fetch category' };
  }
}

export async function createCategory(
  name: string,
  description: string | null,
  color: string
): Promise<{ data?: Category; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id: user.id, name: name.trim(), description: description?.trim() || null, color })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return { error: 'A category with this name already exists.' };
      return { error: error.message };
    }

    return { data: data as Category };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to create category' };
  }
}

export async function updateCategory(
  id: string,
  name: string,
  description: string | null,
  color: string
): Promise<{ data?: Category; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('categories')
      .update({ name: name.trim(), description: description?.trim() || null, color })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') return { error: 'A category with this name already exists.' };
      return { error: error.message };
    }
    if (!data) return { error: 'Category not found or unauthorized' };

    return { data: data as Category };
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle();
      
    if (error) return { error: error.message };
    if (!data) return { error: 'Category not found or unauthorized' };

    return {};
  } catch (error) {
    console.error('Server action error:', error);
    return { error: 'Failed to delete category' };
  }
}
