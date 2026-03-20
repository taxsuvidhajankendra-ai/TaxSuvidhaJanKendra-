import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Facebook, Play, Image as ImageIcon, ExternalLink, Sparkles, Filter, Grid, Layout } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const SocialAds = ({ lang }: { lang: 'en' | 'hi' }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'instagram' | 'facebook' | 'manual'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'social_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(fetchedPosts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.source === filter);

  return (
    <section className="py-24 bg-slate-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue px-4 py-1.5 rounded-full text-xs font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            {lang === 'en' ? 'Our Digital Presence' : 'हमारी डिजिटल उपस्थिति'}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-6">
            {lang === 'en' ? 'Our Ads & ' : 'हमारे विज्ञापन और '}<span className="text-brand-blue">{lang === 'en' ? 'Social Media' : 'सोशल मीडिया'}</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            {lang === 'en' 
              ? 'Stay updated with our latest professional insights, tax tips, and creative design showcases directly from our social channels.' 
              : 'हमारे सोशल चैनलों से सीधे हमारे नवीनतम पेशेवर अंतर्दृष्टि, टैक्स टिप्स और रचनात्मक डिजाइन शोकेस के साथ अपडेट रहें।'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'all', label: { en: 'All Posts', hi: 'सभी पोस्ट' }, icon: <Grid className="w-4 h-4" /> },
            { id: 'instagram', label: { en: 'Instagram', hi: 'इंस्टाग्राम' }, icon: <Instagram className="w-4 h-4" /> },
            { id: 'facebook', label: { en: 'Facebook', hi: 'फेसबुक' }, icon: <Facebook className="w-4 h-4" /> },
            { id: 'manual', label: { en: 'Manual Uploads', hi: 'मैनुअल अपलोड' }, icon: <Layout className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                filter === item.id 
                  ? 'bg-brand-blue text-white shadow-xl shadow-blue-200' 
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              {item.icon}
              {item.label[lang]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">{lang === 'en' ? 'Fetching latest posts...' : 'नवीनतम पोस्ट प्राप्त की जा रही हैं...'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {post.type === 'video' ? (
                      <div className="relative w-full h-full">
                        <video 
                          src={post.url} 
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={post.url} 
                        alt={post.caption} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    
                    {/* Source Badge */}
                    <div className="absolute top-6 left-6">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 ${
                        post.source === 'instagram' ? 'bg-pink-500/80 text-white' :
                        post.source === 'facebook' ? 'bg-blue-600/80 text-white' :
                        'bg-slate-900/80 text-white'
                      }`}>
                        {post.source === 'instagram' && <Instagram className="w-3 h-3" />}
                        {post.source === 'facebook' && <Facebook className="w-3 h-3" />}
                        {post.source === 'manual' && <ImageIcon className="w-3 h-3" />}
                        {post.source}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.caption || (lang === 'en' ? "Stay connected with Tax Suvidha Jan Kendra for the latest updates." : "नवीनतम अपडेट के लिए टैक्स सुविधा जन केंद्र से जुड़े रहें।")}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : (lang === 'en' ? 'Recently' : 'हाल ही में')}
                      </span>
                      <button className="flex items-center gap-2 text-brand-blue font-bold text-sm hover:underline">
                        {lang === 'en' ? 'View Post' : 'पोस्ट देखें'} <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredPosts.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Layout className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{lang === 'en' ? 'No posts found' : 'कोई पोस्ट नहीं मिली'}</h3>
            <p className="text-slate-500">{lang === 'en' ? "We haven't shared any posts in this category yet." : "हमने अभी तक इस श्रेणी में कोई पोस्ट साझा नहीं की है।"}</p>
          </div>
        )}
      </div>
    </section>
  );
};
