import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { AdminTableSkeleton } from '@/components/ui/skeleton-shimmer';
import { cn } from '@/lib/utils';
import { 
  Home, 
  User, 
  Building2, 
  Lightbulb, 
  BarChart3,
  Award,
  Heart,
  Quote,
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  Copy,
  Video,
  Volume2,
  VolumeX,
  Play,
  Mail,
  MessageSquare,
  Search,
  Globe,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { VideoPlayer } from '@/components/ui/video-player';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

type AdminTab = 'hero' | 'biography' | 'quotes' | 'milestones' | 'markets' | 'insights' | 'achievements' | 'charity' | 'interviews' | 'stats' | 'media' | 'cta' | 'contact' | 'seo';

const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'hero', label: 'Hero', icon: Home },
  { id: 'biography', label: 'Biography', icon: User },
  { id: 'quotes', label: 'Quotes', icon: Quote },
  { id: 'milestones', label: 'Milestones', icon: BarChart3 },
  { id: 'markets', label: 'Markets', icon: Building2 },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'charity', label: 'Charity', icon: Heart },
  { id: 'interviews', label: 'Interviews', icon: MessageSquare },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'media', label: 'Media', icon: Video },
  { id: 'cta', label: 'Newsletter', icon: Heart },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'seo', label: 'SEO & Tracking', icon: Search },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');
  const { isLoading } = useAdminData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="frame-outer min-h-screen">
      <Navigation />
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="display-md mb-2">Admin Panel</h1>
            <p className="body-md text-muted-foreground">Manage your dynamic content from Supabase</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-56 flex-shrink-0">
              <div className="frame-container frame-container-light p-4 sticky top-24">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors',
                        activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors text-destructive hover:bg-destructive/10 mt-4 pt-4 border-t border-border/50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </nav>
              </div>
            </aside>

            <div className="flex-1">
              <div className="frame-container frame-container-light p-6 sm:p-8 min-h-[400px]">
                {isLoading ? <AdminTableSkeleton /> : <TabContent activeTab={activeTab} />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TabContent({ activeTab }: { activeTab: AdminTab }) {
  const data = useAdminData();
  switch (activeTab) {
    case 'hero': return <HeroEditor data={data.hero} />;
    case 'biography': return <BiographyEditor data={data.biography} quotes={data.bioQuotes} />;
    case 'quotes': return <QuotesManager data={data.bioQuotes} />;
    case 'milestones': return <MilestonesEditor data={data.milestones} />;
    case 'markets': return <MarketsEditor data={data.markets} />;
    case 'insights': return <InsightsEditor data={data.insights} />;
    case 'achievements': return <AchievementsEditor data={data.achievements} />;
    case 'charity': return <CharityEditor works={data.charityWorks} quotes={data.charityQuotes} />;
    case 'interviews': return <InterviewsEditor content={data.interviewsContent} qa={data.interviewsQA} />;
    case 'stats': return <StatsEditor data={data.stats} />;
    case 'media': return <MediaEditor data={data.media} />;
    case 'cta': return <CTAEditor data={data.cta} subscribers={data.newsletterSubscribers} />;
    case 'contact': return <ContactEditor settings={data.contactSettings} submissions={data.contactSubmissions} />;
    case 'seo': return <SEOEditor global={data.seoGlobal} pages={data.seoPages} />;
    default: return null;
  }
}

function useAdminData() {
  const hero = useQuery({ queryKey: ['admin', 'hero'], queryFn: async () => (await supabase.from('hero_content').select('*').single()).data });
  const biography = useQuery({ queryKey: ['admin', 'biography'], queryFn: async () => (await supabase.from('biography_content').select('*').single()).data });
  const bioQuotes = useQuery({ queryKey: ['admin', 'biography_quotes'], queryFn: async () => (await supabase.from('biography_quotes').select('*').order('order_index')).data || [] });
  const milestones = useQuery({ queryKey: ['admin', 'biography_milestones'], queryFn: async () => (await supabase.from('biography_milestones').select('*').order('order_index')).data || [] });
  const markets = useQuery({ queryKey: ['admin', 'markets'], queryFn: async () => (await supabase.from('markets').select('*').order('order_index')).data || [] });
  const insights = useQuery({ queryKey: ['admin', 'insights'], queryFn: async () => (await supabase.from('insights').select('*').order('created_at', { ascending: false })).data || [] });
  const achievements = useQuery({ queryKey: ['admin', 'achievements'], queryFn: async () => (await supabase.from('achievements').select('*').order('order_index')).data || [] });
  const charityWorks = useQuery({ queryKey: ['admin', 'charity_works'], queryFn: async () => (await supabase.from('charity_works').select('*').order('order_index')).data || [] });
  const charityQuotes = useQuery({ queryKey: ['admin', 'charity_quotes'], queryFn: async () => (await supabase.from('charity_quotes').select('*').order('order_index')).data || [] });
  const stats = useQuery({ queryKey: ['admin', 'stats'], queryFn: async () => (await supabase.from('stats').select('*').order('order_index')).data || [] });
  const media = useQuery({ queryKey: ['admin', 'media'], queryFn: async () => (await supabase.from('media_settings').select('*')).data || [] });
  const cta = useQuery({ queryKey: ['admin', 'cta'], queryFn: async () => (await supabase.from('newsletter_settings').select('*').single()).data });
  const subscribers = useQuery({ queryKey: ['admin', 'subscribers'], queryFn: async () => (await supabase.from('newsletter_subscriptions').select('*').order('created_at', { ascending: false })).data || [] });
  const contactSettings = useQuery({ queryKey: ['admin', 'contact_settings'], queryFn: async () => (await supabase.from('contact_settings').select('*').single()).data });
  const contactSubmissions = useQuery({ queryKey: ['admin', 'contact_submissions'], queryFn: async () => (await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })).data || [] });
  const seoGlobal = useQuery({ queryKey: ['admin', 'seo_settings'], queryFn: async () => (await supabase.from('seo_settings').select('*').single()).data });
  const seoPages = useQuery({ queryKey: ['admin', 'page_metadata'], queryFn: async () => (await supabase.from('page_metadata').select('*')).data || [] });
  const interviewsContent = useQuery({ queryKey: ['admin', 'interviews_content'], queryFn: async () => (await supabase.from('interviews_content').select('*').single()).data });
  const interviewsQA = useQuery({ queryKey: ['admin', 'interviews_qa'], queryFn: async () => (await supabase.from('interviews_qa').select('*').order('order_index')).data || [] });

  return {
    hero: hero.data,
    biography: biography.data,
    bioQuotes: bioQuotes.data || [],
    milestones: milestones.data || [],
    markets: markets.data || [],
    insights: insights.data || [],
    achievements: achievements.data || [],
    charityWorks: charityWorks.data || [],
    charityQuotes: charityQuotes.data || [],
    interviewsContent: interviewsContent.data,
    interviewsQA: interviewsQA.data || [],
    stats: stats.data || [],
    media: media.data || [],
    cta: cta.data,
    newsletterSubscribers: subscribers.data || [],
    contactSettings: contactSettings.data,
    contactSubmissions: contactSubmissions.data || [],
    seoGlobal: seoGlobal.data,
    seoPages: seoPages.data || [],
    isLoading: hero.isLoading || biography.isLoading || bioQuotes.isLoading || milestones.isLoading || markets.isLoading || insights.isLoading || achievements.isLoading || charityWorks.isLoading || charityQuotes.isLoading || stats.isLoading || media.isLoading || cta.isLoading || subscribers.isLoading || contactSettings.isLoading || contactSubmissions.isLoading || seoGlobal.isLoading || seoPages.isLoading || interviewsContent.isLoading || interviewsQA.isLoading
  };
}

function useAdminActions(tableName: string, queryKey: any[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleSelectAll = (items: any[]) => setSelectedIds(selectedIds.length === items.length ? [] : items.map(i => i.id));

  const bulkDeleteMutation = useMutation({
    mutationFn: async () => { await supabase.from(tableName).delete().in('id', selectedIds); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey }); setSelectedIds([]); toast({ title: 'Success', description: 'Selected items deleted.' }); }
  });

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (data) {
        const { id: _, created_at: __, updated_at: ___, ...rest } = data;
        await supabase.from(tableName).insert({ ...rest, title: (rest.title || rest.name || 'Copy') + ' (Copy)' });
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey }); toast({ title: 'Duplicated', description: 'Item duplicated successfully.' }); }
  });

  return { selectedIds, toggleSelect, toggleSelectAll, bulkDeleteMutation, duplicateMutation };
}

function HeroEditor({ data }: { data: any }) {
  const [formData, setFormData] = useState(data || {});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: async (newData: any) => { await supabase.from('hero_content').upsert({ ...newData, id: data?.id || undefined }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'hero'] }); toast({ title: 'Hero Updated' }); }
  });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="font-serif text-xl font-medium">Hero Section</h2><Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending}>{mutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} Save Changes</Button></div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2"><Label>Name</Label><Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
        <div className="space-y-2"><Label>Title Line 1</Label><Input value={formData.title_line1 || ''} onChange={e => setFormData({ ...formData, title_line1: e.target.value })} /></div>
        <div className="space-y-2"><Label>Title Line 2</Label><Input value={formData.title_line2 || ''} onChange={e => setFormData({ ...formData, title_line2: e.target.value })} /></div>
        <div className="space-y-2"><Label>Bottom Text</Label><Input value={formData.bottom_left_text || ''} onChange={e => setFormData({ ...formData, bottom_left_text: e.target.value })} /></div>
        <div className="space-y-2"><Label>Bottom Subtext</Label><Input value={formData.bottom_left_subtext || ''} onChange={e => setFormData({ ...formData, bottom_left_subtext: e.target.value })} /></div>
      </div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
    </div>
  );
}

function QuotesManager({ data }: { data: any[] }) {
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (item: any) => {
      if (item.id) await supabase.from('biography_quotes').update(item).eq('id', item.id);
      else await supabase.from('biography_quotes').insert({ ...item, order_index: data.length });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'biography_quotes'] });
      setIsDialogOpen(false);
      toast({ title: 'Quote Saved' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('biography_quotes').delete().eq('id', id); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'biography_quotes'] });
      toast({ title: 'Quote Deleted' });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-xl font-medium">Manage Quotes</h2>
        <Button onClick={() => { setEditingItem({ quote: '', tags: [] }); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Quote
        </Button>
      </div>

      <div className="space-y-4">
        {data.map((q) => (
          <div key={q.id} className="p-4 bg-secondary/50 rounded-lg group relative">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <p className="body-md italic font-serif text-foreground">"{q.quote}"</p>
                <div className="flex flex-wrap gap-2">
                  {q.tags?.map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase font-bold tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingItem(q); setIsDialogOpen(true); }} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteMutation.mutate(q.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingItem?.id ? 'Edit Quote' : 'Add Quote'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Quote Text</Label>
              <Textarea 
                value={editingItem?.quote || ''} 
                onChange={e => setEditingItem({ ...editingItem, quote: e.target.value })} 
                rows={4} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Tags (comma separated)</Label>
              <Input 
                value={editingItem?.tags?.join(', ') || ''} 
                onChange={e => setEditingItem({ ...editingItem, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                placeholder="e.g. homepage, biography, charity"
              />
            </div>
          </div>
          <Button onClick={() => mutation.mutate(editingItem)}>Save Quote</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BiographyEditor({ data, quotes }: { data: any; quotes: any[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState(data || {});
  const bioMutation = useMutation({
    mutationFn: async (newData: any) => { await supabase.from('biography_content').upsert({ ...newData, id: data?.id || undefined }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'biography'] }); toast({ title: 'Biography Updated' }); }
  });
  const quoteMutation = useMutation({
    mutationFn: async ({ id, quote, tags }: { id?: string; quote: string; tags?: string[] }) => {
      if (id) await supabase.from('biography_quotes').update({ quote, tags }).eq('id', id);
      else await supabase.from('biography_quotes').insert({ quote, tags: tags || [], order_index: quotes.length });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'biography_quotes'] })
  });
  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from('biography_quotes').delete().eq('id', id); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'biography_quotes'] })
  });
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h2 className="font-serif text-xl font-medium">Biography</h2><Button onClick={() => bioMutation.mutate(formData)} disabled={bioMutation.isPending}>{bioMutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} Save Changes</Button></div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2"><Label>Name</Label><Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
        <div className="space-y-2"><Label>Title</Label><Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
      </div>
      <div className="pt-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4" />
            <h3>Quotes Preview (Page Specific)</h3>
          </div>
        </div>
        <div className="space-y-4">
          {quotes.filter(q => q.tags?.includes('biography')).map((q, i) => (
            <div key={q.id} className="p-4 bg-secondary/50 rounded-lg">
              <p className="body-md italic font-serif">"{q.quote}"</p>
            </div>
          ))}
          {quotes.filter(q => q.tags?.includes('biography')).length === 0 && (
            <p className="text-sm text-muted-foreground italic">No quotes tagged with 'biography' yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MarketsEditor({ data }: { data: any[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();
  const { selectedIds, toggleSelect, toggleSelectAll, bulkDeleteMutation, duplicateMutation } = useAdminActions('markets', ['admin', 'markets']);
  const mutation = useMutation({
    mutationFn: async (item: any) => { if (item.id) await supabase.from('markets').update(item).eq('id', item.id); else await supabase.from('markets').insert({ ...item, order_index: data.length }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'markets'] }); setIsDialogOpen(false); }
  });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div className="flex items-center gap-4"><h2 className="font-serif text-xl font-medium">Markets</h2>{selectedIds.length > 0 && <Button variant="destructive" size="sm" onClick={() => bulkDeleteMutation.mutate()}>Delete ({selectedIds.length})</Button>}</div><Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add Market</Button></div>
      <div className="space-y-2">
        <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-muted-foreground"><Checkbox checked={selectedIds.length === data.length && data.length > 0} onCheckedChange={() => toggleSelectAll(data)} /><span className="flex-1">Market Info</span><span>Actions</span></div>
        {data.map((m) => (
          <div key={m.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg group">
            <Checkbox checked={selectedIds.includes(m.id)} onCheckedChange={() => toggleSelect(m.id)} />
            <div className="flex-1"><p className="font-medium">{m.name}</p><p className="text-sm text-muted-foreground line-clamp-1">{m.description}</p></div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => duplicateMutation.mutate(m.id)}><Copy className="w-4 h-4" /></button><button onClick={() => { setEditingItem(m); setIsDialogOpen(true); }}><Pencil className="w-4 h-4" /></button></div>
          </div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingItem ? 'Edit Market' : 'Add Market'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>Name</Label><Input id="mName" defaultValue={editingItem?.name} /></div>
            <div className="grid gap-2"><Label>Title</Label><Input id="mTitle" defaultValue={editingItem?.title} /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="grid gap-2"><Label>Year</Label><Input id="mYear" defaultValue={editingItem?.year} placeholder="e.g. 2024" /></div>
            <div className="grid gap-2"><Label>Industry</Label><Input id="mIndustry" defaultValue={editingItem?.industry} placeholder="e.g. Luxury" /></div>
            <div className="grid gap-2"><Label>Timeline</Label><Input id="mTimeline" defaultValue={editingItem?.timeline} placeholder="e.g. Ongoing" /></div>
          </div>
          <div className="grid gap-2"><Label>Description (Home Page)</Label><Textarea id="mDesc" defaultValue={editingItem?.description} rows={3} /></div>
          <div className="grid gap-2"><Label>Image URL</Label><Input id="mImg" defaultValue={editingItem?.image_url} placeholder="/assets/..." /></div>
          <div className="grid gap-2">
            <Label>Page Content (Rich Text)</Label>
            <div className="bg-white min-h-[300px] text-black">
              <ReactQuill 
                theme="snow"
                value={editingItem?.page_content || ''}
                onChange={(content) => {
                  if (editingItem) setEditingItem({ ...editingItem, page_content: content });
                  else setEditingItem({ page_content: content });
                }}
                className="h-[250px] mb-12"
              />
            </div>
          </div>
        </div>
        <Button onClick={() => {
          const name = (document.getElementById('mName') as HTMLInputElement).value;
          const title = (document.getElementById('mTitle') as HTMLInputElement).value;
          const description = (document.getElementById('mDesc') as HTMLTextAreaElement).value;
          const image_url = (document.getElementById('mImg') as HTMLInputElement).value;
          const year = (document.getElementById('mYear') as HTMLInputElement).value;
          const industry = (document.getElementById('mIndustry') as HTMLInputElement).value;
          const timeline = (document.getElementById('mTimeline') as HTMLInputElement).value;
          
          mutation.mutate({ 
            ...editingItem, 
            name, 
            title, 
            description, 
            image_url,
            year,
            industry,
            timeline,
            page_content: editingItem?.page_content 
          });
        }}>Save Market</Button>
      </DialogContent></Dialog>
    </div>
  );
}

function InsightsEditor({ data }: { data: any[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();
  const { selectedIds, toggleSelect, toggleSelectAll, bulkDeleteMutation, duplicateMutation } = useAdminActions('insights', ['admin', 'insights']);
  const mutation = useMutation({
    mutationFn: async (item: any) => { 
      if (item.is_featured) {
        // Unset other featured insights first
        await supabase.from('insights').update({ is_featured: false }).neq('id', item.id || '00000000-0000-0000-0000-000000000000');
      }
      if (item.id) await supabase.from('insights').update(item).eq('id', item.id); 
      else await supabase.from('insights').insert(item); 
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'insights'] }); setIsDialogOpen(false); }
  });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div className="flex items-center gap-4"><h2 className="font-serif text-xl font-medium">Insights</h2>{selectedIds.length > 0 && <Button variant="destructive" size="sm" onClick={() => bulkDeleteMutation.mutate()}>Delete ({selectedIds.length})</Button>}</div><Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add Insight</Button></div>
      <div className="space-y-2">
        <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-muted-foreground"><Checkbox checked={selectedIds.length === data.length && data.length > 0} onCheckedChange={() => toggleSelectAll(data)} /><span className="flex-1">Insight Title</span><span>Actions</span></div>
        {data.map((i) => (
          <div key={i.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg group">
            <Checkbox checked={selectedIds.includes(i.id)} onCheckedChange={() => toggleSelect(i.id)} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{i.title}</p>
                {i.is_featured && <span className="text-[10px] bg-accent text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Featured</span>}
              </div>
              <p className="text-xs text-accent uppercase">{i.category}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => duplicateMutation.mutate(i.id)}><Copy className="w-4 h-4" /></button><button onClick={() => { setEditingItem(i); setIsDialogOpen(true); }}><Pencil className="w-4 h-4" /></button></div>
          </div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingItem ? 'Edit Insight' : 'Add Insight'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4 px-1">
          <div className="grid gap-2"><Label>Title</Label><Input id="insTitle" defaultValue={editingItem?.title} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>Category</Label><Input id="insCat" defaultValue={editingItem?.category} /></div>
            <div className="grid gap-2"><Label>Image URL</Label><Input id="insImg" defaultValue={editingItem?.image_url} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>Read Time</Label><Input id="insRead" defaultValue={editingItem?.read_time} placeholder="e.g. 5 min read" /></div>
            <div className="grid gap-2"><Label>Author Name</Label><Input id="insAuth" defaultValue={editingItem?.author_name || 'Mohsin Salya'} /></div>
          </div>
          <div className="grid gap-2"><Label>Excerpt</Label><Textarea id="insExc" defaultValue={editingItem?.excerpt} rows={2} /></div>
          
          <div className="grid gap-2">
            <Label>Content (Rich Text)</Label>
            <div className="bg-white min-h-[300px] text-black">
              <ReactQuill 
                theme="snow"
                value={editingItem?.content || ''}
                onChange={(content) => {
                  if (editingItem) setEditingItem({ ...editingItem, content: content });
                  else setEditingItem({ content: content });
                }}
                className="h-[250px] mb-12"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="insPub" 
                defaultChecked={editingItem?.published ?? true} 
              />
              <Label htmlFor="insPub">Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="insFeat" 
                checked={editingItem?.is_featured ?? false}
                onCheckedChange={(checked) => {
                  setEditingItem(prev => ({ ...prev, is_featured: checked === true }));
                }}
              />
              <Label htmlFor="insFeat">Featured (Only one will be active)</Label>
            </div>
          </div>
        </div>
        <Button onClick={() => {
          const title = (document.getElementById('insTitle') as HTMLInputElement).value;
          const category = (document.getElementById('insCat') as HTMLInputElement).value;
          const excerpt = (document.getElementById('insExc') as HTMLTextAreaElement).value;
          const image_url = (document.getElementById('insImg') as HTMLInputElement).value;
          const read_time = (document.getElementById('insRead') as HTMLInputElement).value;
          const author_name = (document.getElementById('insAuth') as HTMLInputElement).value;
          const published = (document.getElementById('insPub') as HTMLInputElement).checked;
          
          mutation.mutate({ 
            ...editingItem, 
            title, 
            category, 
            excerpt, 
            image_url, 
            read_time,
            author_name,
            published,
            content: editingItem?.content || ''
          });
        }}>Save Insight</Button>
      </DialogContent></Dialog>
    </div>
  );
}

function AchievementsEditor({ data }: { data: any[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();
  const { selectedIds, toggleSelect, toggleSelectAll, bulkDeleteMutation, duplicateMutation } = useAdminActions('achievements', ['admin', 'achievements']);
  const mutation = useMutation({
    mutationFn: async (item: any) => { if (item.id) await supabase.from('achievements').update(item).eq('id', item.id); else await supabase.from('achievements').insert({ ...item, order_index: data.length }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'achievements'] }); setIsDialogOpen(false); }
  });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div className="flex items-center gap-4"><h2 className="font-serif text-xl font-medium">Achievements</h2>{selectedIds.length > 0 && <Button variant="destructive" size="sm" onClick={() => bulkDeleteMutation.mutate()}>Delete ({selectedIds.length})</Button>}</div><Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add Achievement</Button></div>
      <div className="space-y-2">
        <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-muted-foreground"><Checkbox checked={selectedIds.length === data.length && data.length > 0} onCheckedChange={() => toggleSelectAll(data)} /><span className="flex-1">Title</span><span>Actions</span></div>
        {data.map((ach) => (
          <div key={ach.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg group">
            <Checkbox checked={selectedIds.includes(ach.id)} onCheckedChange={() => toggleSelect(ach.id)} />
            <div className="flex-1"><p className="font-medium">{ach.title}</p><p className="text-xs text-accent uppercase">{ach.subtitle}</p></div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => duplicateMutation.mutate(ach.id)}><Copy className="w-4 h-4" /></button><button onClick={() => { setEditingItem(ach); setIsDialogOpen(true); }}><Pencil className="w-4 h-4" /></button></div>
          </div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editingItem ? 'Edit Achievement' : 'Add Achievement'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2"><Label>Title</Label><Input id="aTitle" defaultValue={editingItem?.title} /></div>
          <div className="grid sm:grid-cols-2 gap-4"><div className="grid gap-2"><Label>Subtitle</Label><Input id="aSub" defaultValue={editingItem?.subtitle} /></div><div className="grid gap-2"><Label>Category</Label><Input id="aCat" defaultValue={editingItem?.category || 'ACHIEVEMENT'} /></div></div>
          <div className="grid gap-2"><Label>Image URL</Label><Input id="aImg" defaultValue={editingItem?.image_url} /></div>
        </div>
        <Button onClick={() => {
          const title = (document.getElementById('aTitle') as HTMLInputElement).value;
          const subtitle = (document.getElementById('aSub') as HTMLInputElement).value;
          const category = (document.getElementById('aCat') as HTMLInputElement).value;
          const image_url = (document.getElementById('aImg') as HTMLInputElement).value;
          mutation.mutate({ ...editingItem, title, subtitle, category, image_url });
        }}>Save Achievement</Button>
      </DialogContent></Dialog>
    </div>
  );
}

function CharityEditor({ works, quotes }: { works: any[]; quotes: any[] }) {
  const [isWorkDialogOpen, setIsWorkDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<any>(null);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const queryClient = useQueryClient();
  const worksActions = useAdminActions('charity_works', ['admin', 'charity_works']);
  const quotesActions = useAdminActions('charity_quotes', ['admin', 'charity_quotes']);
  const workMutation = useMutation({
    mutationFn: async (item: any) => { if (item.id) await supabase.from('charity_works').update(item).eq('id', item.id); else await supabase.from('charity_works').insert({ ...item, order_index: works.length }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'charity_works'] }); setIsWorkDialogOpen(false); }
  });
  const quoteMutation = useMutation({
    mutationFn: async (item: any) => { if (item.id) await supabase.from('charity_quotes').update(item).eq('id', item.id); else await supabase.from('charity_quotes').insert({ ...item, order_index: quotes.length }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'charity_quotes'] }); setIsQuoteDialogOpen(false); }
  });
  return (
    <div className="space-y-12">
      <div className="space-y-6"><div className="flex justify-between items-center"><div className="flex items-center gap-4"><h2 className="font-serif text-xl font-medium">Charity Works</h2>{worksActions.selectedIds.length > 0 && <Button variant="destructive" size="sm" onClick={() => worksActions.bulkDeleteMutation.mutate()}>Delete ({worksActions.selectedIds.length})</Button>}</div><Button onClick={() => { setEditingWork(null); setIsWorkDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add Work</Button></div>
        <div className="space-y-2">{works.map((w) => (<div key={w.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg group"><Checkbox checked={worksActions.selectedIds.includes(w.id)} onCheckedChange={() => worksActions.toggleSelect(w.id)} /><div className="flex-1"><p className="font-medium">{w.title}</p><p className="text-xs text-muted-foreground">{w.location} • {w.work_date}</p></div><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => worksActions.duplicateMutation.mutate(w.id)}><Copy className="w-4 h-4" /></button><button onClick={() => { setEditingWork(w); setIsWorkDialogOpen(true); }}><Pencil className="w-4 h-4" /></button></div></div>))}</div>
      </div>
      <div className="space-y-6 pt-8 border-t">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <h3>Charity Quotes Preview</h3>
          </div>
        </div>
        <div className="space-y-2">
          {quotes.filter(q => q.tags?.includes('charity')).map((q) => (
            <div key={q.id} className="p-4 bg-secondary/50 rounded-lg group">
              <p className="body-md italic font-serif">"{q.quote}"</p>
            </div>
          ))}
          {quotes.filter(q => q.tags?.includes('charity')).length === 0 && (
            <p className="text-sm text-muted-foreground italic">No quotes tagged with 'charity' yet.</p>
          )}
        </div>
      </div>
      <Dialog open={isWorkDialogOpen} onOpenChange={setIsWorkDialogOpen}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{editingWork ? 'Edit Work' : 'Add Work'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2"><Label>Title</Label><Input id="wTitle" defaultValue={editingWork?.title} /></div>
          <div className="grid sm:grid-cols-2 gap-4"><div className="grid gap-2"><Label>Subtitle</Label><Input id="wSub" defaultValue={editingWork?.subtitle} /></div><div className="grid gap-2"><Label>Category</Label><Input id="wCat" defaultValue={editingWork?.category || 'CHARITY'} /></div></div>
          <div className="grid sm:grid-cols-2 gap-4"><div className="grid gap-2"><Label>Location</Label><Input id="wLoc" defaultValue={editingWork?.location} /></div><div className="grid gap-2"><Label>Date</Label><Input id="wDate" type="date" defaultValue={editingWork?.work_date} /></div></div>
          <div className="grid gap-2"><Label>Description</Label><Textarea id="wDesc" defaultValue={editingWork?.description} rows={4} /></div>
          <div className="grid gap-2"><Label>Image URL</Label><Input id="wImg" defaultValue={editingWork?.image_url} /></div>
        </div>
        <Button onClick={() => {
          const data = {
            title: (document.getElementById('wTitle') as HTMLInputElement).value,
            subtitle: (document.getElementById('wSub') as HTMLInputElement).value,
            category: (document.getElementById('wCat') as HTMLInputElement).value,
            location: (document.getElementById('wLoc') as HTMLInputElement).value,
            work_date: (document.getElementById('wDate') as HTMLInputElement).value,
            description: (document.getElementById('wDesc') as HTMLTextAreaElement).value,
            image_url: (document.getElementById('wImg') as HTMLInputElement).value,
          };
          workMutation.mutate({ ...editingWork, ...data });
        }}>Save Work</Button>
      </DialogContent></Dialog>
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editingQuote ? 'Edit Quote' : 'Add Quote'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2"><Label>Quote</Label><Textarea id="qText" defaultValue={editingQuote?.quote} rows={4} /></div>
          <div className="grid gap-2"><Label>Author</Label><Input id="qAuth" defaultValue={editingQuote?.author_name || 'Mohsin Salya'} /></div>
          <div className="grid gap-2"><Label>Author Title</Label><Input id="qTit" defaultValue={editingQuote?.author_title || 'Faith in Action'} /></div>
        </div>
        <Button onClick={() => {
          const quote = (document.getElementById('qText') as HTMLTextAreaElement).value;
          const author_name = (document.getElementById('qAuth') as HTMLInputElement).value;
          const author_title = (document.getElementById('qTit') as HTMLInputElement).value;
          quoteMutation.mutate({ ...editingQuote, quote, author_name, author_title });
        }}>Save Quote</Button>
      </DialogContent></Dialog>
    </div>
  );
}

function StatsEditor({ data }: { data: any[] }) {
  const queryClient = useQueryClient();
  const { selectedIds, toggleSelect, toggleSelectAll, bulkDeleteMutation, duplicateMutation } = useAdminActions('stats', ['admin', 'stats']);
  const mutation = useMutation({
    mutationFn: async (item: any) => { if (item.id) await supabase.from('stats').update(item).eq('id', item.id); else await supabase.from('stats').insert({ ...item, order_index: data.length }); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
  });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div className="flex items-center gap-4"><h2 className="font-serif text-xl font-medium">Statistics</h2>{selectedIds.length > 0 && <Button variant="destructive" size="sm" onClick={() => bulkDeleteMutation.mutate()}>Delete ({selectedIds.length})</Button>}</div><Button onClick={() => mutation.mutate({ value: '0', label: 'NEW STAT' })}><Plus className="w-4 h-4 mr-2" /> Add Stat</Button></div>
      <div className="grid sm:grid-cols-3 gap-4">
        {data.map((s) => (
          <div key={s.id} className="p-4 bg-secondary/50 rounded-lg space-y-3 relative group">
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"><Checkbox checked={selectedIds.includes(s.id)} onCheckedChange={() => toggleSelect(s.id)} /></div>
            <Input defaultValue={s.value} onBlur={e => mutation.mutate({ id: s.id, value: e.target.value })} className="text-2xl font-serif text-center" />
            <Input defaultValue={s.label} onBlur={e => mutation.mutate({ id: s.id, label: e.target.value })} className="text-xs uppercase text-center" />
            <div className="flex justify-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => duplicateMutation.mutate(s.id)}><Copy className="w-4 h-4" /></button><button onClick={() => supabase.from('stats').delete().eq('id', s.id).then(() => queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }))} className="text-destructive text-xs">Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaEditor({ data }: { data: any[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from('media_settings').update({ url: item.url }).eq('id', item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
      toast({ title: 'Media Updated' });
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-xl font-medium">Media Settings</h2>
      </div>
      <div className="grid gap-6">
        {data.map((item) => (
          <div key={item.id} className="p-6 bg-secondary/50 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">{item.key.replace('_', ' ')}</Label>
                <p className="text-sm font-medium mt-1">{item.description}</p>
              </div>
              <Button size="sm" onClick={() => mutation.mutate(item)} disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`url-${item.id}`}>Video URL (Direct link to .mp4)</Label>
              <Input 
                id={`url-${item.id}`}
                defaultValue={item.url} 
                onChange={(e) => { item.url = e.target.value; }}
                placeholder="https://example.com/video.mp4" 
              />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden bg-black/10 relative group">
              <VideoPlayer 
                src={item.url} 
                className="w-full h-full"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-sans">Preview</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestonesEditor({ data }: { data: any[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();
  const { selectedIds, toggleSelect, toggleSelectAll, bulkDeleteMutation, duplicateMutation } = useAdminActions('biography_milestones', ['admin', 'biography_milestones']);
  const mutation = useMutation({
    mutationFn: async (item: any) => { if (item.id) await supabase.from('biography_milestones').update(item).eq('id', item.id); else await supabase.from('biography_milestones').insert({ ...item, order_index: data.length }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'biography_milestones'] }); setIsDialogOpen(false); }
  });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div className="flex items-center gap-4"><h2 className="font-serif text-xl font-medium">Biography Milestones</h2>{selectedIds.length > 0 && <Button variant="destructive" size="sm" onClick={() => bulkDeleteMutation.mutate()}>Delete ({selectedIds.length})</Button>}</div><Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add Milestone</Button></div>
      <div className="space-y-2">
        <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-muted-foreground"><Checkbox checked={selectedIds.length === data.length && data.length > 0} onCheckedChange={() => toggleSelectAll(data)} /><span className="flex-1">Milestone Info</span><span>Actions</span></div>
        {data.map((m) => (
          <div key={m.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg group">
            <Checkbox checked={selectedIds.includes(m.id)} onCheckedChange={() => toggleSelect(m.id)} />
            <div className="flex-1"><p className="font-medium">{m.milestone_number} - {m.title}</p><div className="text-sm text-muted-foreground line-clamp-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: m.content }} /></div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => duplicateMutation.mutate(m.id)}><Copy className="w-4 h-4" /></button><button onClick={() => { setEditingItem(m); setIsDialogOpen(true); }}><Pencil className="w-4 h-4" /></button></div>
          </div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingItem ? 'Edit Milestone' : 'Add Milestone'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4 px-1">
          <div className="grid gap-2"><Label>Milestone Number (e.g. 01)</Label><Input id="msNum" defaultValue={editingItem?.milestone_number} /></div>
          <div className="grid gap-2"><Label>Title</Label><Input id="msTitle" defaultValue={editingItem?.title} /></div>
          <div className="grid gap-2">
            <Label>Content (Rich Text)</Label>
            <div className="bg-white min-h-[300px] text-black rounded-md overflow-hidden border">
              <ReactQuill 
                theme="snow"
                value={editingItem?.content || ''}
                onChange={(content) => {
                  setEditingItem((prev: any) => ({ ...prev, content }));
                }}
                className="h-[250px] mb-12"
              />
            </div>
          </div>
        </div>
        <Button onClick={() => {
          const milestone_number = (document.getElementById('msNum') as HTMLInputElement).value;
          const title = (document.getElementById('msTitle') as HTMLInputElement).value;
          mutation.mutate({ 
            ...editingItem, 
            milestone_number, 
            title, 
            content: editingItem?.content || ''
          });
        }}>Save Milestone</Button>
      </DialogContent></Dialog>
    </div>
  );
}

function CTAEditor({ data, subscribers }: { data: any; subscribers: any[] }) {
  const [formData, setFormData] = useState(data || {});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { selectedIds, toggleSelect, toggleSelectAll, bulkDeleteMutation } = useAdminActions('newsletter_subscriptions', ['admin', 'subscribers']);
  
  const mutation = useMutation({
    mutationFn: async (newData: any) => {
      await supabase.from('newsletter_settings').upsert({ ...newData, id: data?.id || undefined });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cta'] });
      toast({ title: 'Newsletter CTA Updated' });
    }
  });

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-xl font-medium">Newsletter CTA Section</h2>
          <Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
            Save Changes
          </Button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Textarea 
              value={formData.title || ''} 
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              rows={2}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Placeholder Text</Label>
              <Input 
                value={formData.placeholder_text || ''} 
                onChange={e => setFormData({ ...formData, placeholder_text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input 
                value={formData.button_text || ''} 
                onChange={e => setFormData({ ...formData, button_text: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Disclaimer Text</Label>
            <Textarea 
              value={formData.disclaimer || ''} 
              onChange={e => setFormData({ ...formData, disclaimer: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-12 border-t">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-xl font-medium">Newsletter Subscribers</h2>
            {selectedIds.length > 0 && (
              <Button variant="destructive" size="sm" onClick={() => bulkDeleteMutation.mutate()}>
                Delete ({selectedIds.length})
              </Button>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-accent">{subscribers.length} Total Subscribers</p>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-muted-foreground bg-secondary/30 rounded-t-lg">
            <Checkbox checked={selectedIds.length === subscribers.length && subscribers.length > 0} onCheckedChange={() => toggleSelectAll(subscribers)} />
            <span className="flex-1">Email Address</span>
            <span>Joined Date</span>
          </div>
          {subscribers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 bg-secondary/10 rounded-b-lg">No subscribers yet.</p>
          ) : (
            subscribers.map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 p-4 bg-secondary/50 hover:bg-secondary/70 transition-colors group relative">
                <Checkbox checked={selectedIds.includes(sub.id)} onCheckedChange={() => toggleSelect(sub.id)} />
                <div className="flex-1 font-medium text-sm">{sub.email}</div>
                <div className="text-[10px] font-sans font-bold tracking-widest text-black/20 uppercase">
                  {new Date(sub.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ContactEditor({ settings, submissions }: { settings: any; submissions: any[] }) {
  const [formData, setFormData] = useState(settings || {});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { selectedIds, toggleSelect, toggleSelectAll, bulkDeleteMutation } = useAdminActions('contact_submissions', ['admin', 'contact_submissions']);

  const settingsMutation = useMutation({
    mutationFn: async (newData: any) => {
      await supabase.from('contact_settings').upsert({ ...newData, id: settings?.id || undefined });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact_settings'] });
      toast({ title: 'Contact Settings Updated' });
    }
  });

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-xl font-medium">Contact Settings</h2>
          <Button onClick={() => settingsMutation.mutate(formData)} disabled={settingsMutation.isPending}>
            {settingsMutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
            Save Settings
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Receive Email</Label>
            <Input 
              value={formData.receive_email || ''} 
              onChange={e => setFormData({ ...formData, receive_email: e.target.value })}
              placeholder="office@mohsinsalya.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Page Title</Label>
            <Input 
              value={formData.title || ''} 
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Page Description</Label>
          <Textarea 
            value={formData.description || ''} 
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-6 pt-12 border-t">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-xl font-medium">Contact Submissions</h2>
            {selectedIds.length > 0 && (
              <Button variant="destructive" size="sm" onClick={() => bulkDeleteMutation.mutate()}>
                Delete ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
          ) : (
            submissions.map((sub) => (
              <div key={sub.id} className="p-6 bg-secondary/50 rounded-xl space-y-4 group relative">
                <div className="absolute top-4 left-4">
                  <Checkbox checked={selectedIds.includes(sub.id)} onCheckedChange={() => toggleSelect(sub.id)} />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pl-8">
                  <div className="space-y-1">
                    <p className="font-bold text-sm uppercase tracking-wider">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">{sub.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-sans font-bold tracking-widest text-black/20 uppercase">
                      {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-sm font-serif font-medium underline underline-offset-4">{sub.subject}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{sub.message}"</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SEOEditor({ global, pages }: { global: any; pages: any[] }) {
  const [globalData, setGlobalData] = useState(global || {});
  const [editingPage, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const globalMutation = useMutation({
    mutationFn: async (newData: any) => {
      await supabase.from('seo_settings').upsert({ ...newData, id: global?.id || undefined });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'seo_settings'] });
      toast({ title: 'Global SEO Updated' });
    }
  });

  const pageMutation = useMutation({
    mutationFn: async (item: any) => {
      await supabase.from('page_metadata').upsert(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page_metadata'] });
      setIsDialogOpen(false);
      toast({ title: 'Page SEO Updated' });
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-xl font-medium">SEO & Tracking</h2>
      </div>

      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="bg-secondary/50 mb-8">
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Globe className="w-4 h-4" /> Tracking
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> Global Meta
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <Search className="w-4 h-4" /> Page SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Analytics & Scripts</h3>
            <Button size="sm" onClick={() => globalMutation.mutate(globalData)} disabled={globalMutation.isPending}>
              {globalMutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} Save Changes
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>GA4 Measurement ID</Label>
              <div className="flex gap-2">
                <Input 
                  value={globalData.ga_measurement_id || ''} 
                  onChange={e => setGlobalData({ ...globalData, ga_measurement_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
                <div className={cn("w-3 h-3 rounded-full mt-4", globalData.ga_measurement_id ? "bg-green-500" : "bg-red-500")} title={globalData.ga_measurement_id ? "Active" : "Not Set"} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Microsoft Clarity ID</Label>
              <div className="flex gap-2">
                <Input 
                  value={globalData.clarity_id || ''} 
                  onChange={e => setGlobalData({ ...globalData, clarity_id: e.target.value })}
                  placeholder="XXXXXXXXXX"
                />
                <div className={cn("w-3 h-3 rounded-full mt-4", globalData.clarity_id ? "bg-green-500" : "bg-red-500")} title={globalData.clarity_id ? "Active" : "Not Set"} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Search Console Verification ID</Label>
              <Input 
                value={globalData.google_search_console_id || ''} 
                onChange={e => setGlobalData({ ...globalData, google_search_console_id: e.target.value })}
                placeholder="google-site-verification=..."
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Default Meta Information</h3>
            <Button size="sm" onClick={() => globalMutation.mutate(globalData)} disabled={globalMutation.isPending}>
              {globalMutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} Save Changes
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Global Site Name</Label>
              <Input 
                value={globalData.site_name || ''} 
                onChange={e => setGlobalData({ ...globalData, site_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter Handle (without @)</Label>
              <Input 
                value={globalData.twitter_handle || ''} 
                onChange={e => setGlobalData({ ...globalData, twitter_handle: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Default OG Image URL</Label>
              <Input 
                value={globalData.default_og_image || ''} 
                onChange={e => setGlobalData({ ...globalData, default_og_image: e.target.value })}
                placeholder="/assets/..."
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Static Page Overrides</h3>
          </div>
          <div className="space-y-2">
            {pages.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg group">
                <div className="flex-1">
                  <p className="font-bold text-xs uppercase tracking-widest text-accent mb-1">{p.page_path === '/' ? 'HOME' : p.page_path.replace('/', '').toUpperCase()}</p>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                </div>
                <button onClick={() => { setEditingItem(p); setIsDialogOpen(true); }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Page Metadata: {editingPage?.page_path}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>SEO Title</Label>
              <Input id="pTitle" defaultValue={editingPage?.title} />
            </div>
            <div className="grid gap-2">
              <Label>SEO Description</Label>
              <Textarea id="pDesc" defaultValue={editingPage?.description} rows={4} />
            </div>
            <div className="grid gap-2">
              <Label>OG Image Override URL</Label>
              <Input id="pImg" defaultValue={editingPage?.og_image} placeholder="/assets/..." />
            </div>
          </div>
          <Button onClick={() => {
            const title = (document.getElementById('pTitle') as HTMLInputElement).value;
            const description = (document.getElementById('pDesc') as HTMLTextAreaElement).value;
            const og_image = (document.getElementById('pImg') as HTMLInputElement).value;
            pageMutation.mutate({ ...editingPage, title, description, og_image });
          }}>Save Page SEO</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InterviewsEditor({ content, qa }: { content: any; qa: any[] }) {
  const [formData, setFormData] = useState(content || {});
  const [isQADialogOpen, setIsQADialogOpen] = useState(false);
  const [editingQA, setEditingQA] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const qaActions = useAdminActions('interviews_qa', ['admin', 'interviews_qa']);

  const contentMutation = useMutation({
    mutationFn: async (newData: any) => {
      await supabase.from('interviews_content').upsert({ ...newData, id: content?.id || undefined });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'interviews_content'] });
      toast({ title: 'Interviews Content Updated' });
    }
  });

  const qaMutation = useMutation({
    mutationFn: async (item: any) => {
      if (item.id) await supabase.from('interviews_qa').update(item).eq('id', item.id);
      else await supabase.from('interviews_qa').insert({ ...item, order_index: qa.length + 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'interviews_qa'] });
      setIsQADialogOpen(false);
      toast({ title: editingQA ? 'Q&A Updated' : 'Q&A Added' });
    }
  });

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-xl font-medium">Interviews Page Content</h2>
          <Button onClick={() => contentMutation.mutate(formData)} disabled={contentMutation.isPending}>
            {contentMutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
            Save Changes
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2"><Label>Hero Title</Label><Input value={formData.hero_title || ''} onChange={e => setFormData({ ...formData, hero_title: e.target.value })} /></div>
          <div className="space-y-2"><Label>Hero Subtitle</Label><Input value={formData.hero_subtitle || ''} onChange={e => setFormData({ ...formData, hero_subtitle: e.target.value })} /></div>
          <div className="sm:col-span-2 space-y-2"><Label>Hero Description</Label><Textarea value={formData.hero_description || ''} onChange={e => setFormData({ ...formData, hero_description: e.target.value })} rows={3} /></div>
          <div className="space-y-2"><Label>Hero Image URL</Label><Input value={formData.hero_image_url || ''} onChange={e => setFormData({ ...formData, hero_image_url: e.target.value })} /></div>
          
          <div className="sm:col-span-2 pt-6 border-t"><h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-4">Philosophy Section</h3></div>
          <div className="sm:col-span-2 space-y-2"><Label>Philosophy Title</Label><Input value={formData.philosophy_title || ''} onChange={e => setFormData({ ...formData, philosophy_title: e.target.value })} /></div>
          <div className="sm:col-span-2 space-y-2"><Label>Philosophy Subtitle</Label><Textarea value={formData.philosophy_subtitle || ''} onChange={e => setFormData({ ...formData, philosophy_subtitle: e.target.value })} rows={3} /></div>

          <div className="sm:col-span-2 pt-6 border-t"><h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-4">Growth Section</h3></div>
          <div className="sm:col-span-2 space-y-2"><Label>Growth Title</Label><Input value={formData.growth_title || ''} onChange={e => setFormData({ ...formData, growth_title: e.target.value })} /></div>
          <div className="sm:col-span-2 space-y-2"><Label>Growth Subtitle</Label><Textarea value={formData.growth_subtitle || ''} onChange={e => setFormData({ ...formData, growth_subtitle: e.target.value })} rows={3} /></div>
        </div>
      </div>

      <div className="space-y-6 pt-12 border-t">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-xl font-medium">Questions & Answers</h2>
            {qaActions.selectedIds.length > 0 && (
              <Button variant="destructive" size="sm" onClick={() => qaActions.bulkDeleteMutation.mutate()}>
                Delete ({qaActions.selectedIds.length})
              </Button>
            )}
          </div>
          <Button onClick={() => { setEditingQA(null); setIsQADialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Question
          </Button>
        </div>
        <div className="space-y-4">
          {qa.map((item, index) => (
            <div key={item.id} className="p-4 bg-secondary/50 rounded-lg group relative flex gap-4">
              <div className="pt-1">
                <Checkbox checked={qaActions.selectedIds.includes(item.id)} onCheckedChange={() => qaActions.toggleSelect(item.id)} />
              </div>
              <div className="flex-1">
                <p className="font-medium">Q{index + 1}: {item.question}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.answer}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingQA(item); setIsQADialogOpen(true); }}><Pencil className="w-4 h-4" /></button>
                <button onClick={() => qaActions.duplicateMutation.mutate(item.id)}><Copy className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isQADialogOpen} onOpenChange={setIsQADialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQA ? 'Edit Question' : 'Add Question'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Question</Label>
              <Input id="qQuestion" defaultValue={editingQA?.question} />
            </div>
            <div className="grid gap-2">
              <Label>Answer</Label>
              <Textarea id="qAnswer" defaultValue={editingQA?.answer} rows={8} />
            </div>
            <div className="grid gap-2">
              <Label>Order Index</Label>
              <Input id="qOrder" type="number" defaultValue={editingQA?.order_index ?? qa.length + 1} />
            </div>
          </div>
          <Button onClick={() => {
            const question = (document.getElementById('qQuestion') as HTMLInputElement).value;
            const answer = (document.getElementById('qAnswer') as HTMLTextAreaElement).value;
            const order_index = parseInt((document.getElementById('qOrder') as HTMLInputElement).value);
            qaMutation.mutate({ ...editingQA, question, answer, order_index });
          }}>Save Q&A</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

