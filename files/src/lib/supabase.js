import { createClient } from '@supabase/supabase-js';

// Environment variable retrieval
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-supabase-project.supabase.co');

// Initialize Supabase Client if credentials exist
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Upload document metadata to Supabase DB / LocalStorage
 */
export async function saveDocumentMetadata(doc) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          file_name: doc.fileName,
          file_type: doc.type,
          file_size: doc.fileSize,
          parsed_text: doc.text,
          word_count: doc.wordCount,
        }])
        .select();

      if (error) throw error;
      if (data && data[0]) return { ...doc, id: data[0].id };
    } catch (err) {
      console.warn('Supabase DB save error, falling back to LocalStorage:', err);
    }
  }

  // Fallback to LocalStorage
  const existingDocs = JSON.parse(localStorage.getItem('studypulse_documents') || '[]');
  const updatedDocs = [doc, ...existingDocs];
  localStorage.setItem('studypulse_documents', JSON.stringify(updatedDocs));
  return doc;
}

/**
 * Fetch all documents for active session
 */
export async function getDocuments() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          fileName: d.file_name,
          type: d.file_type,
          fileSize: d.file_size,
          text: d.parsed_text,
          wordCount: d.word_count,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch error, using LocalStorage:', err);
    }
  }

  return JSON.parse(localStorage.getItem('studypulse_documents') || '[]');
}

/**
 * Save Generated AI Study Plan
 */
export async function saveStudyPlan(plan) {
  if (supabase) {
    try {
      await supabase
        .from('study_plans')
        .insert([{
          title: plan.title,
          summary: plan.summary,
          plan_data: plan,
        }]);
    } catch (err) {
      console.warn('Supabase plan save fallback:', err);
    }
  }

  localStorage.setItem('studypulse_study_plan', JSON.stringify(plan));
}

/**
 * Get Saved AI Study Plans
 */
export async function getStudyPlans() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(p => p.plan_data);
      }
    } catch (err) {
      console.warn('Supabase plan fetch fallback:', err);
    }
  }

  const stored = localStorage.getItem('studypulse_study_plan');
  return stored ? [JSON.parse(stored)] : [];
}

/**
 * Delete Generated AI Study Plan
 */
export async function deleteStudyPlan() {
  if (supabase) {
    try {
      await supabase
        .from('study_plans')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (err) {
      console.warn('Supabase plan delete fallback:', err);
    }
  }

  localStorage.removeItem('studypulse_study_plan');
}

/**
 * Fetch Real Platform System Analytics for Admin Dashboard
 */
export async function getAdminPlatformMetrics() {
  let docCount = 0;
  let planCount = 0;
  let totalWordCount = 0;

  if (supabase) {
    try {
      const { data: docs } = await supabase.from('documents').select('word_count');
      if (docs) {
        docCount = docs.length;
        totalWordCount = docs.reduce((acc, d) => acc + (d.word_count || 0), 0);
      }

      const { data: plans } = await supabase.from('study_plans').select('id');
      if (plans) {
        planCount = plans.length;
      }
    } catch (err) {
      console.warn('Supabase admin metrics error:', err);
    }
  }

  // Fallback/Merge with LocalStorage
  const localDocs = JSON.parse(localStorage.getItem('studypulse_documents') || '[]');
  const localPlan = localStorage.getItem('studypulse_study_plan');

  if (docCount === 0 && localDocs.length > 0) {
    docCount = localDocs.length;
    totalWordCount = localDocs.reduce((acc, d) => acc + (d.wordCount || 0), 0);
  }

  if (planCount === 0 && localPlan) {
    planCount = 1;
  }

  return {
    totalDocuments: docCount,
    totalPlans: planCount,
    totalWords: totalWordCount
  };
}
