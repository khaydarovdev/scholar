import { supabase } from './supabase'
import type { Scholarship, Profile } from './supabase'

export async function fetchScholarships(filters: {
  search?: string
  country?: string
  degree?: string
  funding?: string
  field?: string
  sort?: string
  page?: number
  limit?: number
}) {
  const { search = '', country = '', degree = '', funding = '', field = '', sort = 'deadline', page = 1, limit = 12 } = filters
  let query = supabase.from('scholarships').select('*', { count: 'exact' }).eq('is_active', true)

  if (search) query = query.or(`title.ilike.%${search}%,provider.ilike.%${search}%,description.ilike.%${search}%`)
  if (country && country !== 'all') query = query.eq('country', country)
  if (degree && degree !== 'all') query = query.eq('degree_level', degree)
  if (funding && funding !== 'all') query = query.eq('funding_type', funding)
  if (field && field !== 'all') query = query.contains('field_of_study', [field])

  if (sort === 'deadline') query = query.order('deadline', { ascending: true, nullsFirst: false })
  else if (sort === 'amount') query = query.order('amount', { ascending: false, nullsFirst: false })
  else if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else if (sort === 'popular') query = query.order('views_count', { ascending: false })

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  return query
}

export async function fetchFeaturedScholarships() {
  return supabase.from('scholarships').select('*').eq('is_featured', true).eq('is_active', true).limit(6)
}

export async function fetchScholarshipById(id: string) {
  return supabase.from('scholarships').select('*').eq('id', id).maybeSingle()
}

export async function fetchSimilarScholarships(scholarship: Scholarship) {
  return supabase.from('scholarships')
    .select('*')
    .eq('is_active', true)
    .eq('country', scholarship.country)
    .neq('id', scholarship.id)
    .limit(4)
}

export async function fetchUserSaved(userId: string) {
  return supabase.from('saved_scholarships').select('*, scholarship:scholarships(*)').eq('user_id', userId)
}

export async function fetchUserApplications(userId: string) {
  return supabase.from('applications').select('*, scholarship:scholarships(*)').eq('user_id', userId).order('created_at', { ascending: false })
}

export async function saveScholarship(userId: string, scholarshipId: string) {
  return supabase.from('saved_scholarships').insert({ user_id: userId, scholarship_id: scholarshipId })
}

export async function unsaveScholarship(userId: string, scholarshipId: string) {
  return supabase.from('saved_scholarships').delete().eq('user_id', userId).eq('scholarship_id', scholarshipId)
}

export async function addApplication(userId: string, scholarshipId: string, _scholarshipTitle: string, _provider: string) {
  return supabase.from('applications').insert({
    user_id: userId,
    scholarship_id: scholarshipId,
    status: 'interested'
  })
}

export async function updateApplicationStatus(id: string, status: string) {
  return supabase.from('applications').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
}

export async function deleteApplication(id: string) {
  return supabase.from('applications').delete().eq('id', id)
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  return supabase.from('profiles').upsert({ ...profile, updated_at: new Date().toISOString() })
}

export async function fetchDistinctCountries() {
  return supabase.from('scholarships').select('country').eq('is_active', true).order('country')
}

export function computeMatchScore(scholarship: Scholarship, profile: Profile | null): number {
  if (!profile) return 0
  let score = 0
  const max = 100

  if (profile.target_degree && scholarship.degree_level !== 'all') {
    if (scholarship.degree_level === profile.target_degree) score += 40
  } else {
    score += 20
  }

  if (profile.country_preferences?.length > 0) {
    if (profile.country_preferences.includes(scholarship.country)) score += 30
  } else {
    score += 15
  }

  if (profile.field_of_study && scholarship.field_of_study?.length > 0) {
    const field = profile.field_of_study.toLowerCase()
    const matches = scholarship.field_of_study.some(f => f.toLowerCase().includes(field) || field.includes(f.toLowerCase()))
    if (matches) score += 20
  } else {
    score += 10
  }

  if (profile.gpa && scholarship.min_gpa) {
    if (profile.gpa >= scholarship.min_gpa) score += 10
  } else {
    score += 5
  }

  return Math.min(score, max)
}

export function getMatchReasons(scholarship: Scholarship, profile: Profile | null): string[] {
  if (!profile) return []
  const reasons: string[] = []

  if (profile.target_degree && scholarship.degree_level !== 'all' && scholarship.degree_level === profile.target_degree) {
    reasons.push(`Matches your ${profile.target_degree} degree target`)
  }

  if (profile.country_preferences?.includes(scholarship.country)) {
    reasons.push(`${scholarship.country} is in your preferred countries`)
  }

  if (profile.field_of_study && scholarship.field_of_study?.length > 0) {
    const field = profile.field_of_study.toLowerCase()
    const match = scholarship.field_of_study.find(f => f.toLowerCase().includes(field) || field.includes(f.toLowerCase()))
    if (match) reasons.push(`Matches your field: ${profile.field_of_study}`)
  }

  if (scholarship.funding_type === 'fully-funded') {
    reasons.push('Fully funded opportunity')
  }

  return reasons
}
