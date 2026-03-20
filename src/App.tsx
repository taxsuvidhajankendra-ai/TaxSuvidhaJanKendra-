/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Instagram, 
  Facebook, 
  FileText, 
  CreditCard, 
  User, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Menu,
  X,
  Search,
  Mail,
  Clock,
  ExternalLink,
  ChevronRight,
  Award,
  Users,
  Building2,
  TrendingUp,
  Calculator,
  IndianRupee,
  Palette,
  MessageSquare,
  Layers,
  Tag,
  Video,
  Sparkles,
  Upload,
  Loader2,
  Play,
  Download,
  Plus,
  Minus,
  HelpCircle,
  AlertCircle,
  Send,
  Layout,
  Share2,
  Trash2,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, Timestamp, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { LiveChat } from './components/LiveChat';
import { SocialAds } from './components/SocialAds';
import { GoogleGenAI } from "@google/genai";
import { generateTaxPolicyIllustration } from './services/imageService';

const BUSINESS_NAME = "Tax Suvidha Jan Kendra";

const SERVICE_CATEGORIES = [
  {
    id: 'tax',
    title: { en: "Tax Services", hi: "कर सेवाएं" },
    description: { 
      en: "Professional financial and compliance solutions tailored for your peace of mind.", 
      hi: "आपकी मानसिक शांति के लिए तैयार पेशेवर वित्तीय और अनुपालन समाधान।" 
    },
    icon: <FileText className="w-8 h-8" />,
    color: "bg-blue-50 text-brand-blue",
    services: [
      { 
        name: { en: "GST Registration & Return Filing", hi: "GST पंजीकरण और रिटर्न फाइलिंग" }, 
        desc: { en: "Fast and accurate registration and filing for your business.", hi: "आपके व्यवसाय के लिए तेज़ और सटीक पंजीकरण और फाइलिंग।" },
        icon: "https://picsum.photos/seed/gst/200/200"
      },
      { 
        name: { en: "Income Tax Return (ITR)", hi: "आयकर रिटर्न (ITR)" }, 
        desc: { en: "Expert ITR filing for individuals and businesses.", hi: "व्यक्तियों और व्यवसायों के लिए विशेषज्ञ ITR फाइलिंग।" },
        icon: "https://picsum.photos/seed/itr/200/200"
      },
      { 
        name: { en: "TDS Filing", hi: "TDS फाइलिंग" }, 
        desc: { en: "Timely and accurate TDS return filing services.", hi: "समय पर और सटीक TDS रिटर्न फाइलिंग सेवाएं।" },
        icon: "https://picsum.photos/seed/tds/200/200"
      },
      { 
        name: { en: "Tax Notice Handling", hi: "टैक्स नोटिस हैंडलिंग" }, 
        desc: { en: "Professional assistance in responding to tax notices.", hi: "टैक्स नोटिस का जवाब देने में पेशेवर सहायता।" },
        icon: "https://picsum.photos/seed/notice/200/200"
      },
      { 
        name: { en: "Tax Planning & Saving Advice", hi: "टैक्स प्लानिंग और बचत सलाह" }, 
        desc: { en: "Strategic advice to minimize your tax liability legally.", hi: "कानूनी रूप से आपकी कर देयता को कम करने के लिए रणनीतिक सलाह।" },
        icon: "https://picsum.photos/seed/planning/200/200"
      },
      { 
        name: { en: "Nil Return Filing", hi: "निल रिटर्न फाइलिंग" }, 
        desc: { en: "Zero-hassle Nil return filing for inactive GST/ITR.", hi: "निष्क्रिय GST/ITR के लिए बिना किसी परेशानी के निल रिटर्न फाइलिंग।" },
        icon: "https://picsum.photos/seed/nil/200/200"
      }
    ]
  },
  {
    id: 'business',
    title: { en: "Business Services", hi: "व्यापार सेवाएं" },
    description: { 
      en: "Start and grow your business with our expert registration and licensing services.", 
      hi: "हमारी विशेषज्ञ पंजीकरण और लाइसेंसिंग सेवाओं के साथ अपना व्यवसाय शुरू करें और बढ़ाएं।" 
    },
    icon: <Building2 className="w-8 h-8" />,
    color: "bg-emerald-50 text-emerald-600",
    services: [
      { 
        name: { en: "Company / Firm Registration", hi: "कंपनी / फर्म पंजीकरण" }, 
        desc: { en: "Register your private limited, LLP, or partnership firm.", hi: "अपनी प्राइवेट लिमिटेड, LLP, या पार्टनरशिप फर्म पंजीकृत करें।" },
        icon: "https://picsum.photos/seed/company/200/200"
      },
      { 
        name: { en: "MSME / Udyam Registration", hi: "MSME / उद्यम पंजीकरण" }, 
        desc: { en: "Get MSME benefits with Udyam registration.", hi: "उद्यम पंजीकरण के साथ MSME लाभ प्राप्त करें।" },
        icon: "https://picsum.photos/seed/msme/200/200"
      },
      { 
        name: { en: "Shop Act License", hi: "शॉप एक्ट लाइसेंस" }, 
        desc: { en: "Mandatory license for shops and establishments.", hi: "दुकानों और प्रतिष्ठानों के लिए अनिवार्य लाइसेंस।" },
        icon: "https://picsum.photos/seed/shop/200/200"
      },
      { 
        name: { en: "Startup India Registration", hi: "स्टार्टअप इंडिया पंजीकरण" }, 
        desc: { en: "Register your startup for tax exemptions and benefits.", hi: "कर छूट और लाभों के लिए अपने स्टार्टअप को पंजीकृत करें।" },
        icon: "https://picsum.photos/seed/startup/200/200"
      },
      { 
        name: { en: "Partnership Deed", hi: "पार्टनरशिप डीड" }, 
        desc: { en: "Professional drafting of partnership agreements.", hi: "पार्टनरशिप समझौतों का पेशेवर ड्राफ्टिंग।" },
        icon: "https://picsum.photos/seed/deed/200/200"
      }
    ]
  },
  {
    id: 'financial',
    title: { en: "Financial Services", hi: "वित्तीय सेवाएं" },
    description: { 
      en: "Manage your finances effectively with our accounting and planning solutions.", 
      hi: "हमारे अकाउंटिंग और प्लानिंग समाधानों के साथ अपने वित्त को प्रभावी ढंग से प्रबंधित करें।" 
    },
    icon: <Calculator className="w-8 h-8" />,
    color: "bg-amber-50 text-amber-600",
    services: [
      { 
        name: { en: "Accounting & Bookkeeping", hi: "अकाउंटिंग और बुककीपिंग" }, 
        desc: { en: "Maintain accurate financial records for your business.", hi: "अपने व्यवसाय के लिए सटीक वित्तीय रिकॉर्ड बनाए रखें।" },
        icon: "https://picsum.photos/seed/acc/200/200"
      },
      { 
        name: { en: "Balance Sheet & P/L Statement", hi: "बैलेंस शीट और लाभ/हानि विवरण" }, 
        desc: { en: "Professional preparation of financial statements.", hi: "वित्तीय विवरणों की पेशेवर तैयारी।" },
        icon: "https://picsum.photos/seed/balance/200/200"
      },
      { 
        name: { en: "Loan Consultation", hi: "लोन परामर्श" }, 
        desc: { en: "Expert guidance on business and personal loans.", hi: "बिजनेस और पर्सनल लोन पर विशेषज्ञ मार्गदर्शन।" },
        icon: "https://picsum.photos/seed/loan/200/200"
      },
      { 
        name: { en: "Business Financial Planning", hi: "व्यापार वित्तीय योजना" }, 
        desc: { en: "Strategic planning for your business growth.", hi: "आपके व्यवसाय के विकास के लिए रणनीतिक योजना।" },
        icon: "https://picsum.photos/seed/finplan/200/200"
      }
    ]
  },
  {
    id: 'digital',
    title: { en: "Digital Services", hi: "डिजिटल सेवाएं" },
    description: { 
      en: "Essential digital documentation and verification services.", 
      hi: "आवश्यक डिजिटल दस्तावेज़ीकरण और सत्यापन सेवाएं।" 
    },
    icon: <Globe className="w-8 h-8" />,
    color: "bg-indigo-50 text-indigo-600",
    services: [
      { 
        name: { en: "PAN Card Apply/Correction", hi: "PAN कार्ड आवेदन/सुधार" }, 
        desc: { en: "New PAN card application and existing data correction.", hi: "नया पैन कार्ड आवेदन और मौजूदा डेटा सुधार।" },
        icon: "https://picsum.photos/seed/pan/200/200"
      },
      { 
        name: { en: "Aadhaar Update Services", hi: "आधार अपडेट सेवाएं" }, 
        desc: { en: "Assistance with Aadhaar card updates and corrections.", hi: "आधार कार्ड अपडेट और सुधार में सहायता।" },
        icon: "https://picsum.photos/seed/aadhaar/200/200"
      },
      { 
        name: { en: "Online Form Filling", hi: "ऑनलाइन फॉर्म भरना" }, 
        desc: { en: "Hassle-free online application for various services.", hi: "विभिन्न सेवाओं के लिए परेशानी मुक्त ऑनलाइन आवेदन।" },
        icon: "https://picsum.photos/seed/form/200/200"
      },
      { 
        name: { en: "Digital Signature (DSC)", hi: "डिजिटल सिग्नेचर (DSC)" }, 
        desc: { en: "Get your Class 3 Digital Signature Certificate.", hi: "अपना क्लास 3 डिजिटल सिग्नेचर सर्टिफिकेट प्राप्त करें।" },
        icon: "https://picsum.photos/seed/dsc/200/200"
      }
    ]
  },
  {
    id: 'design',
    title: { en: "Design & IT Services", hi: "डिजाइन और आईटी सेवाएं" },
    description: { 
      en: "Creative visual solutions to help your brand stand out.", 
      hi: "आपके ब्रांड को अलग दिखाने में मदद करने के लिए रचनात्मक दृश्य समाधान।" 
    },
    icon: <Palette className="w-8 h-8" />,
    color: "bg-purple-50 text-purple-600",
    services: [
      { 
        name: { en: "Logo Design", hi: "लोगो डिजाइन" }, 
        desc: { en: "Memorable and unique logos for your brand.", hi: "आपके ब्रांड के लिए यादगार और अनोखे लोगो।" },
        icon: "https://picsum.photos/seed/logo/200/200"
      },
      { 
        name: { en: "Website Design & Development", hi: "वेबसाइट डिजाइन और विकास" }, 
        desc: { en: "Professional and responsive business websites.", hi: "पेशेवर और उत्तरदायी व्यावसायिक वेबसाइटें।" },
        icon: "https://picsum.photos/seed/web/200/200"
      },
      { 
        name: { en: "Social Media Post Design", hi: "सोशल मीडिया पोस्ट डिजाइन" }, 
        desc: { en: "Engaging graphics for your social media handles.", hi: "आपके सोशल मीडिया हैंडल के लिए आकर्षक ग्राफिक्स।" },
        icon: "https://picsum.photos/seed/social/200/200"
      },
      { 
        name: { en: "Business Branding", hi: "बिजनेस ब्रांडिंग" }, 
        desc: { en: "Complete branding solutions for your business.", hi: "आपके व्यवसाय के लिए पूर्ण ब्रांडिंग समाधान।" },
        icon: "https://picsum.photos/seed/branding/200/200"
      }
    ]
  },
  {
    id: 'support',
    title: { en: "Support Services", hi: "सहायता सेवाएं" },
    description: { 
      en: "Dedicated support for all your documentation and consultation needs.", 
      hi: "आपकी सभी दस्तावेज़ीकरण और परामर्श आवश्यकताओं के लिए समर्पित सहायता।" 
    },
    icon: <MessageSquare className="w-8 h-8" />,
    color: "bg-rose-50 text-rose-600",
    services: [
      { 
        name: { en: "24/7 Customer Support", hi: "24/7 ग्राहक सहायता" }, 
        desc: { en: "Always here to help you with your queries.", hi: "आपकी पूछताछ में आपकी मदद करने के लिए हमेशा यहाँ।" },
        icon: "https://picsum.photos/seed/support/200/200"
      },
      { 
        name: { en: "WhatsApp Assistance", hi: "व्हाट्सएप सहायता" }, 
        desc: { en: "Quick support and updates via WhatsApp.", hi: "व्हाट्सएप के माध्यम से त्वरित सहायता और अपडेट।" },
        icon: "https://picsum.photos/seed/whatsapp/200/200"
      },
      { 
        name: { en: "Document Preparation", hi: "दस्तावेज़ तैयार करना" }, 
        desc: { en: "Professional assistance in preparing legal documents.", hi: "कानूनी दस्तावेज तैयार करने में पेशेवर सहायता।" },
        icon: "https://picsum.photos/seed/doc/200/200"
      },
      { 
        name: { en: "Client Consultation", hi: "क्लाइंट परामर्श" }, 
        desc: { en: "One-on-one expert consultation for your needs.", hi: "आपकी आवश्यकताओं के लिए आमने-सामने विशेषज्ञ परामर्श।" },
        icon: "https://picsum.photos/seed/consult/200/200"
      }
    ]
  }
];

const STATS = [
  { label: { en: "Happy Clients", hi: "खुश ग्राहक" }, value: "15,000+", icon: <Users className="w-5 h-5" /> },
  { label: { en: "Services Provided", hi: "प्रदान की गई सेवाएं" }, value: "100+", icon: <Zap className="w-5 h-5" /> },
  { label: { en: "Years Experience", hi: "वर्षों का अनुभव" }, value: "10+", icon: <Award className="w-5 h-5" /> },
  { label: { en: "Centers", hi: "केंद्र" }, value: "10+", icon: <Building2 className="w-5 h-5" /> },
];

const CONTACT_INFO = {
  phone: "+91 98917 69507",
  whatsapp: "+91 98917 69507",
  emails: ["taxsuvidhajankendra@gmail.com", "infotaxsuvidhajankendra@gmail.com"],
  address: "House No 57A, Noida, Gautam Buddha Nagar, Uttar Pradesh, 201301",
  hours: "Mon - Sat: 10:00 AM - 07:00 PM",
  instagram: "https://instagram.com/taxsuvidhaofficial",
  facebook: "https://facebook.com/taxsuvidhajankendra",
  gstin: "09XXXXXXXXXXXXX" // User to provide actual GSTIN
};

// --- Components ---

const Navbar = ({ lang, setLang }: { lang: 'en' | 'hi', setLang: (l: 'en' | 'hi') => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: lang === 'en' ? 'Home' : 'होम', href: '/' },
    { name: lang === 'en' ? 'Services' : 'सेवाएं', href: '/#services' },
    { name: lang === 'en' ? 'Social Media' : 'सोशल मीडिया', href: '/social' },
    { name: lang === 'en' ? 'About' : 'हमारे बारे में', href: '/#about' },
    { name: lang === 'en' ? 'Contact' : 'संपर्क करें', href: '/#contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}>
        <div className="container-custom flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg overflow-hidden border border-slate-100">
              <ShieldCheck className="text-brand-blue w-6 h-6" />
            </div>
            <span className="text-xl font-display font-black tracking-tighter text-slate-900">
              TAX <span className="text-brand-blue">SUVIDHA</span> JAN KENDRA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith('/#') ? (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-sm font-bold text-slate-600 hover:text-brand-blue transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className={`text-sm font-bold transition-colors ${
                    location.pathname === link.href ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-xs font-bold"
              >
                <Globe className="w-3.5 h-3.5" />
                {lang === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="btn-primary py-2 px-5 text-sm"
              >
                {lang === 'en' ? 'Portal Login' : 'पोर्टल लॉगिन'}
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="container-custom py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  link.href.startsWith('/#') ? (
                    <a 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold text-slate-900"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      key={link.name} 
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold text-slate-900"
                    >
                      {link.name}
                    </Link>
                  )
                ))}
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="btn-primary w-full text-center"
                >
                  Portal Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-blue p-8 text-white text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold">{lang === 'en' ? 'Portal Login' : 'पोर्टल लॉगिन'}</h3>
                <p className="text-blue-100 text-sm">{lang === 'en' ? 'Access your applications and documents' : 'अपने आवेदनों और दस्तावेजों तक पहुंचें'}</p>
              </div>
              <div className="p-8">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Username / Email' : 'यूजरनेम / ईमेल'}</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder={lang === 'en' ? "Enter your username" : "अपना यूजरनेम दर्ज करें"} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Password' : 'पासवर्ड'}</label>
                    <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="••••••••" />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                      {lang === 'en' ? 'Remember me' : 'मुझे याद रखें'}
                    </label>
                    <a href="#" className="text-brand-blue font-bold">{lang === 'en' ? 'Forgot Password?' : 'पासवर्ड भूल गए?'}</a>
                  </div>
                  <button className="btn-primary w-full py-4 mt-4">{lang === 'en' ? 'Login to Dashboard' : 'डैशबोर्ड में लॉगिन करें'}</button>
                </form>
                <p className="text-center text-sm text-slate-500 mt-6">
                  {lang === 'en' ? "Don't have an account?" : "खाता नहीं है?"} <a href="#" className="text-brand-blue font-bold">{lang === 'en' ? 'Contact Center' : 'संपर्क केंद्र'}</a>
                </p>
              </div>
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const TrackApplication = ({ lang }: { lang: 'en' | 'hi' }) => {
  const [refNumber, setRefNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = () => {
    if (!refNumber.trim()) return;
    setIsLoading(true);
    setStatus(null);
    
    // Simulate API fetch
    setTimeout(() => {
      setIsLoading(false);
      // Mock status logic
      if (refNumber.toUpperCase().startsWith('TSJK-')) {
        setStatus(lang === 'en' ? 'Application Received & Under Review' : 'आवेदन प्राप्त हुआ और समीक्षा के अधीन है');
      } else {
        setStatus(lang === 'en' ? 'Invalid Reference Number. Please check and try again.' : 'अमान्य संदर्भ संख्या। कृपया जांचें और पुनः प्रयास करें।');
      }
    }, 2000);
  };

  return (
    <section id="track" className="py-24 bg-white">
      <div className="container-custom">
        <div className="bg-brand-blue rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-black mb-6 leading-tight">
                {lang === 'en' ? 'Track Your ' : 'अपने '}<span className="text-blue-200">{lang === 'en' ? 'Application' : 'आवेदन'}</span> {lang === 'en' ? 'Status.' : 'की स्थिति ट्रैक करें।'}
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                {lang === 'en' 
                  ? 'Enter your application reference number to check the real-time status of your service request.' 
                  : 'अपने सेवा अनुरोध की वास्तविक समय स्थिति की जांच करने के लिए अपना आवेदन संदर्भ संख्या दर्ज करें।'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    placeholder={lang === 'en' ? "Reference Number (e.g. TSJK-12345)" : "संदर्भ संख्या (जैसे TSJK-12345)"} 
                    className="w-full bg-white text-slate-900 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
                  />
                </div>
                <button 
                  onClick={handleTrack}
                  disabled={isLoading || !refNumber.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2 min-w-[160px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {lang === 'en' ? 'Tracking...' : 'ट्रैकिंग...'}
                    </>
                  ) : (
                    lang === 'en' ? 'Track Now' : 'अभी ट्रैक करें'
                  )}
                </button>
              </div>

              {/* Status Result */}
              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`mt-6 p-4 rounded-2xl border ${status.includes('Invalid') || status.includes('अमान्य') ? 'bg-red-500/10 border-red-500/20 text-red-100' : 'bg-white/10 border-white/20 text-blue-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      {status.includes('Invalid') || status.includes('अमान्य') ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                      <p className="font-medium">{status}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-bold mb-2">{lang === 'en' ? 'Real-time Updates' : 'वास्तविक समय अपडेट'}</h4>
                <p className="text-xs text-blue-100">{lang === 'en' ? 'Get instant status of your documents.' : 'अपने दस्तावेज़ों की तत्काल स्थिति प्राप्त करें।'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-bold mb-2">{lang === 'en' ? 'Email Alerts' : 'ईमेल अलर्ट'}</h4>
                <p className="text-xs text-blue-100">{lang === 'en' ? 'Receive notifications on completion.' : 'पूरा होने पर सूचनाएं प्राप्त करें।'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = ({ lang }: { lang: 'en' | 'hi' }) => (
  <section id="about" className="py-24 bg-white overflow-hidden">
    <div className="container-custom">
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://ais-dev-upakt36ijtg5l7fkony4t4-72449185845.asia-southeast1.run.app/api/attachments/0" 
              alt="Tax Policy Leadership" 
              className="w-full h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8">
              <div>
                <p className="text-white font-display font-bold text-2xl">{lang === 'en' ? 'Strategic Tax Governance' : 'रणनीतिक कर शासन'}</p>
                <p className="text-blue-200">{lang === 'en' ? "Supporting India's Economic Growth" : 'भारत की आर्थिक वृद्धि का समर्थन'}</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">{lang === 'en' ? 'Welcome to Tax Suvidha Jan Kendra' : 'टैक्स सुविधा जन केंद्र में आपका स्वागत है'}</h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
            <p>
              {lang === 'en' 
                ? <>At <strong>Tax Suvidha Jan Kendra</strong>, we believe that financial compliance should be accessible, transparent, and stress-free for everyone. Based in the heart of Noida, we are a dedicated team of professionals committed to providing top-notch tax and business solutions to individuals and small businesses alike.</>
                : <><strong>टैक्स सुविधा जन केंद्र</strong> में, हमारा मानना है कि वित्तीय अनुपालन सभी के लिए सुलभ, पारदर्शी और तनाव मुक्त होना चाहिए। नोएडा के केंद्र में स्थित, हम पेशेवरों की एक समर्पित टीम हैं जो व्यक्तियों और छोटे व्यवसायों को समान रूप से शीर्ष स्तर के कर और व्यावसायिक समाधान प्रदान करने के लिए प्रतिबद्ध हैं।</>}
            </p>
            <p>
              {lang === 'en'
                ? 'Our journey began with a simple mission: to bridge the gap between complex government regulations and the everyday citizen. Whether you are a budding entrepreneur looking for GST registration or an established business needing expert tax consulting, we are here to guide you every step of the way.'
                : 'हमारी यात्रा एक साधारण मिशन के साथ शुरू हुई: जटिल सरकारी नियमों और आम नागरिक के बीच की खाई को पाटना। चाहे आप जीएसटी पंजीकरण की तलाश में एक उभरते हुए उद्यमी हों या विशेषज्ञ कर परामर्श की आवश्यकता वाला एक स्थापित व्यवसाय, हम हर कदम पर आपका मार्गदर्शन करने के लिए यहां हैं।'}
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-2">{lang === 'en' ? 'Our Vision' : 'हमारा दृष्टिकोण'}</h4>
              <p className="text-sm text-slate-500">{lang === 'en' ? 'To be the most reliable digital service portal in India, empowering citizens through financial literacy and ease of compliance.' : 'भारत में सबसे विश्वसनीय डिजिटल सेवा पोर्टल बनना, वित्तीय साक्षरता और अनुपालन में आसानी के माध्यम से नागरिकों को सशक्त बनाना।'}</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-2">{lang === 'en' ? 'Our Mission' : 'हमारा मिशन'}</h4>
              <p className="text-sm text-slate-500">{lang === 'en' ? 'To provide efficient, accurate, and affordable tax and government services with a focus on client satisfaction and integrity.' : 'ग्राहक संतुष्टि और अखंडता पर ध्यान देने के साथ कुशल, सटीक और किफायती कर और सरकारी सेवाएं प्रदान करना।'}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100"
        >
          <h3 className="text-3xl font-display font-black text-slate-900 mb-8">Why Choose Us?</h3>
          <div className="space-y-8">
            {[
              { 
                title: "Expert Guidance", 
                icon: <ShieldCheck className="w-6 h-6" />,
                desc: "Our team consists of seasoned tax consultants and financial experts who stay ahead of the curve. We don't just file papers; we provide strategic insights that help you navigate the ever-changing landscape of Indian tax laws and regulations with absolute confidence." 
              },
              { 
                title: "Approachable Service", 
                icon: <MessageSquare className="w-6 h-6" />,
                desc: "We believe in humanizing financial services. Our experts speak your language, breaking down complex legal jargon into simple, actionable advice. Whether you visit us in person or connect digitally, you'll find a friendly partner ready to listen and help." 
              },
              { 
                title: "End-to-End Solutions", 
                icon: <Layers className="w-6 h-6" />,
                desc: "From initial business registration to monthly compliance, annual filings, and long-term financial advisory, we provide a holistic suite of services. We handle the administrative heavy lifting so you can dedicate your energy to what truly matters—growing your business." 
              },
              { 
                title: "Transparent Pricing", 
                icon: <Tag className="w-6 h-6" />,
                desc: "Integrity is at the heart of our pricing model. We offer professional-grade services at competitive, flat rates with zero hidden costs. You'll always know exactly what you're paying for, ensuring high-value consulting that respects your hard-earned budget." 
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-12 h-12 bg-white text-brand-blue rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 text-lg">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-3xl font-display font-black text-slate-900 mb-6">Our Specialized Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "GST Registration",
                "Nil Return Filing",
                "Tax Consulting & Advisory",
                "Business Tax Solutions",
                "ITR Filing",
                "PAN & Aadhaar Services"
              ].map((service, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-2 h-2 bg-brand-blue rounded-full" />
                  <span className="font-bold text-slate-700 text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-brand-blue rounded-[2.5rem] text-white">
            <h4 className="text-xl font-bold mb-4">Ready to simplify your taxes?</h4>
            <p className="text-blue-100 mb-6 text-sm">Join thousands of satisfied clients who trust us with their financial compliance.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact" className="bg-white text-brand-blue px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">Contact Us Today</a>
              <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\s+/g, '')}`} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Future
            </div>
            <h3 className="text-3xl md:text-4xl font-display font-black mb-6">Leading the Digital Revolution</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              We don't just follow trends; we set them. Our <strong>AI Creative Studio</strong> is a testament to our commitment to the Digital India vision. By integrating cutting-edge AI like Google's Veo, we empower our clients to visualize their financial and business goals with cinematic clarity.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#ai-studio" className="btn-primary py-3 px-6 text-sm">Explore AI Studio</a>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Powered by Veo AI
              </div>
            </div>
          </div>
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
            >
              <img 
                src="https://ais-dev-upakt36ijtg5l7fkony4t4-72449185845.asia-southeast1.run.app/api/attachments/1" 
                alt="Digital India Success" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </motion.div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
          </div>
        </div>
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />
      </div>
    </div>
  </section>
);

const AdminLogin = ({ onLogin, onBack, lang }: { onLogin: () => void, onBack: () => void, lang: 'en' | 'hi' }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (password === 'tax78') {
        onLogin();
      } else {
        setError(lang === 'en' ? 'Invalid Admin Password' : 'अमान्य एडमिन पासवर्ड');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full -ml-48 -mb-48 blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-brand-blue p-10 text-white text-center relative">
            <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-display font-black tracking-tight">{lang === 'en' ? 'Admin Access' : 'एडमिन एक्सेस'}</h2>
            <p className="text-blue-100 mt-2 font-medium">{lang === 'en' ? 'Tax Suvidha Jan Kendra Portal' : 'टैक्स सुविधा जन केंद्र पोर्टल'}</p>
          </div>
          
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{lang === 'en' ? 'Secure Password' : 'सुरक्षित पासवर्ड'}</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all font-mono" 
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-500 text-xs font-bold ml-1">{error}</p>}
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (lang === 'en' ? "Access Dashboard" : "डैशबोर्ड एक्सेस करें")}
              </button>
              
              <button 
                type="button"
                onClick={onBack}
                className="w-full text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
              >
                {lang === 'en' ? "Return to Website" : "वेबसाइट पर वापस जाएं"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
const AdminPanel = ({ services, setServices, onBack, onLogout }: { 
  services: typeof SERVICE_CATEGORIES, 
  setServices: React.Dispatch<React.SetStateAction<typeof SERVICE_CATEGORIES>>,
  onBack: () => void,
  onLogout: () => void
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingService, setEditingService] = useState<{catId: string, serviceIdx: number, name: string, desc: string} | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalMessages: 0,
    totalLeads: 0,
    revenue: "₹4,52,000"
  });

  useEffect(() => {
    const unsubLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadsData);
      setStats(prev => ({ ...prev, totalLeads: leadsData.length, totalCustomers: leadsData.length }));
    }, (error) => {
      console.error('Firestore Error (Leads):', error);
    });

    const unsubChats = onSnapshot(collection(db, 'chatMessages'), (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatsData);
      setStats(prev => ({ ...prev, totalMessages: chatsData.length }));
    }, (error) => {
      console.error('Firestore Error (Chats):', error);
    });

    const unsubSocial = onSnapshot(collection(db, 'socialPosts'), (snapshot) => {
      const socialData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSocialPosts(socialData);
    }, (error) => {
      console.error('Firestore Error (Social):', error);
    });

    setLoading(false);

    return () => {
      unsubLeads();
      unsubChats();
      unsubSocial();
    };
  }, []);

  const handleEditService = (catId: string, serviceIdx: number) => {
    const category = services.find(c => c.id === catId);
    if (category) {
      const service = category.services[serviceIdx];
      setEditingService({
        catId,
        serviceIdx,
        name: service.name,
        desc: service.desc
      });
    }
  };

  const saveServiceChanges = () => {
    if (!editingService) return;
    
    setServices(prev => prev.map(cat => {
      if (cat.id === editingService.catId) {
        const newServices = [...cat.services];
        newServices[editingService.serviceIdx] = {
          ...newServices[editingService.serviceIdx],
          name: editingService.name,
          desc: editingService.desc
        };
        return { ...cat, services: newServices };
      }
      return cat;
    }));
    setEditingService(null);
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleUploadSocial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const caption = formData.get('caption') as string;

    if (!url) return;

    try {
      await addDoc(collection(db, 'socialPosts'), {
        url,
        type,
        caption,
        timestamp: serverTimestamp()
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding social post:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'leads', name: 'Customers & Leads', icon: <Users className="w-5 h-5" /> },
    { id: 'chats', name: 'Live Support', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'services', name: 'Manage Services', icon: <Zap className="w-5 h-5" /> },
    { id: 'social', name: 'Social Media', icon: <Share2 className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xl font-display font-black text-slate-900">Admin Panel</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Tax Suvidha</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-xl font-bold text-sm transition-all border border-red-100">
            <X className="w-4 h-4" />
            Logout Session
          </button>
          <button onClick={onBack} className="w-full btn-secondary py-3 text-sm">
            Exit Admin Mode
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              <header>
                <h1 className="text-3xl font-display font-black text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Real-time summary of your portal's performance.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Customers</p>
                  <p className="text-2xl font-display font-bold text-slate-900">{stats.totalCustomers}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Messages</p>
                  <p className="text-2xl font-display font-bold text-slate-900">{stats.totalMessages}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Leads</p>
                  <p className="text-2xl font-display font-bold text-slate-900">{stats.totalLeads}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Revenue</p>
                  <p className="text-2xl font-display font-bold text-slate-900">{stats.revenue}</p>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Recent Leads</h3>
                  <button onClick={() => setActiveTab('leads')} className="text-brand-blue font-bold text-sm">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-8 py-4">Name</th>
                        <th className="px-8 py-4">Phone</th>
                        <th className="px-8 py-4">Message</th>
                        <th className="px-8 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.slice(0, 5).map((lead, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-4 font-bold text-slate-700">{lead.name}</td>
                          <td className="px-8 py-4 text-slate-600">{lead.phone}</td>
                          <td className="px-8 py-4 text-slate-500 truncate max-w-[200px]">{lead.message}</td>
                          <td className="px-8 py-4 text-xs text-slate-400">
                            {lead.timestamp?.toDate().toLocaleDateString() || 'Just now'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-8">
              <header>
                <h1 className="text-3xl font-display font-black text-slate-900">Customer Leads</h1>
                <p className="text-slate-500">View and manage all customer inquiries received through the contact form.</p>
              </header>
              
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-8 py-4">Name</th>
                      <th className="px-8 py-4">Phone</th>
                      <th className="px-8 py-4">Message</th>
                      <th className="px-8 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-4 font-bold text-slate-700">{lead.name}</td>
                        <td className="px-8 py-4 text-slate-600">{lead.phone}</td>
                        <td className="px-8 py-4 text-slate-500">{lead.message}</td>
                        <td className="px-8 py-4">
                          <button 
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="space-y-8">
              <header>
                <h1 className="text-3xl font-display font-black text-slate-900">Live Support Chats</h1>
                <p className="text-slate-500">Real-time messages from the website's live chat system.</p>
              </header>
              
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {chats.length === 0 ? (
                    <div className="p-20 text-center text-slate-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No active chats found.</p>
                    </div>
                  ) : (
                    chats.map((chat, i) => (
                      <div key={i} className="p-8 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                            {chat.sender === 'admin' ? 'You' : 'Customer'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {chat.timestamp?.toDate().toLocaleTimeString() || 'Just now'}
                          </span>
                        </div>
                        <p className="text-slate-700">{chat.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-8">
              <header>
                <h1 className="text-3xl font-display font-black text-slate-900">Manage Services</h1>
                <p className="text-slate-500">Edit service names and descriptions shown on the website.</p>
              </header>
              
              <div className="grid md:grid-cols-2 gap-8">
                {services.map((cat) => (
                  <div key={cat.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">{cat.title}</h3>
                    <div className="space-y-4">
                      {cat.services.map((s, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand-blue/20 transition-all">
                          <div>
                            <p className="font-bold text-slate-900">{s.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Active</p>
                          </div>
                          <button 
                            onClick={() => handleEditService(cat.id, i)}
                            className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-8">
              <header>
                <h1 className="text-3xl font-display font-black text-slate-900">Social Media Management</h1>
                <p className="text-slate-500">Upload and manage posts for the "Our Ads / Social Media" page.</p>
              </header>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Upload New Post</h3>
                <form onSubmit={handleUploadSocial} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Media URL</label>
                      <input name="url" type="text" placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-blue/20" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                      <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-blue/20">
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Caption</label>
                    <textarea name="caption" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-blue/20" placeholder="Enter post caption..."></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full py-4">Upload Post</button>
                </form>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {socialPosts.map((post, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group relative">
                    {post.type === 'video' ? (
                      <video src={post.url} className="w-full aspect-square object-cover" />
                    ) : (
                      <img src={post.url} alt="" className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
                    )}
                    <div className="p-4">
                      <p className="text-sm text-slate-600 line-clamp-2">{post.caption}</p>
                    </div>
                    <button 
                      onClick={async () => await deleteDoc(doc(db, 'socialPosts', post.id))}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Service Modal */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingService(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-blue p-8 text-white">
                <h3 className="text-2xl font-display font-bold">Edit Service</h3>
                <p className="text-blue-100 text-sm">Modify service details below</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Service Name</label>
                  <input 
                    type="text" 
                    value={editingService.name}
                    onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue/20 outline-none" 
                    placeholder="Service Name" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea 
                    value={editingService.desc}
                    onChange={(e) => setEditingService({...editingService, desc: e.target.value})}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue/20 outline-none" 
                    placeholder="Service Description" 
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setEditingService(null)}
                    className="flex-1 btn-secondary py-4"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveServiceChanges}
                    className="flex-1 btn-primary py-4"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setEditingService(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
const AICreativeStudio = ({ lang }: { lang: 'en' | 'hi' }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      setError(lang === 'en' ? 'Please upload an image first.' : 'कृपया पहले एक छवि अपलोड करें।');
      return;
    }

    setGenerating(true);
    setError(null);
    setVideoUrl(null);
    setStatus(lang === 'en' ? 'Initializing AI engine...' : 'AI इंजन शुरू किया जा रहा है...');

    try {
      // Check for API key
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }

      // Create a new instance right before the call to ensure up-to-date key
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(';')[0].split(':')[1];

      setStatus(lang === 'en' ? 'Uploading image and starting generation...' : 'छवि अपलोड की जा रही है और निर्माण शुरू किया जा रहा है...');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || (lang === 'en' ? 'Animate this image with cinematic motion' : 'इस छवि को सिनेमाई गति के साथ एनिमेट करें'),
        image: {
          imageBytes: base64Data,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatus(lang === 'en' ? 'AI is dreaming up your video... This may take a few minutes.' : 'AI आपके वीडियो का सपना देख रहा है... इसमें कुछ मिनट लग सकते हैं।');
      
      // Poll for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        // @ts-ignore
        operation = await ai.operations.getVideosOperation({ operation: operation });
        
        // Update status messages to keep user engaged
        const messages = lang === 'en' ? [
          "Still dreaming...",
          "Adding cinematic details...",
          "Rendering motion paths...",
          "Almost there...",
          "Finalizing pixels..."
        ] : [
          "अभी भी सपना देख रहा हूँ...",
          "सिनेमाई विवरण जोड़ रहा हूँ...",
          "मोशन पाथ रेंडर कर रहा हूँ...",
          "बस पहुँचने ही वाला हूँ...",
          "पिक्सेल को अंतिम रूप दे रहा हूँ..."
        ];
        setStatus(messages[Math.floor(Math.random() * messages.length)]);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setStatus(lang === 'en' ? 'Fetching your masterpiece...' : 'आपकी उत्कृष्ट कृति प्राप्त की जा रही है...');
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.GEMINI_API_KEY || '',
          },
        });
        
        if (!response.ok) throw new Error(lang === 'en' ? 'Failed to download video' : 'वीडियो डाउनलोड करने में विफल');
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setStatus(lang === 'en' ? 'Generation complete!' : 'निर्माण पूरा हुआ!');
      } else {
        throw new Error(lang === 'en' ? 'No video URL returned from AI' : 'AI से कोई वीडियो URL नहीं मिला');
      }
    } catch (err: any) {
      console.error('Veo Error:', err);
      if (err.message?.includes('Requested entity was not found')) {
        setError(lang === 'en' ? 'API Key error. Please re-select your key.' : 'API कुंजी त्रुटि। कृपया अपनी कुंजी फिर से चुनें।');
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } else {
        setError(err.message || (lang === 'en' ? 'An unexpected error occurred during generation.' : 'निर्माण के दौरान एक अप्रत्याशित त्रुटि हुई।'));
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section id="ai-studio" className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-500/30"
          >
            <Sparkles className="w-4 h-4" />
            {lang === 'en' ? 'AI Creative Studio' : 'AI क्रिएटिव स्टूडियो'}
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6">
            {lang === 'en' ? 'Animate Your ' : 'अपने '}<span className="text-blue-400">{lang === 'en' ? 'Business Vision' : 'व्यावसायिक दृष्टिकोण'}</span> {lang === 'en' ? '' : 'को एनिमेट करें'}
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            {lang === 'en' 
              ? 'Experience the future of digital content. Upload any image—a logo, a team photo, or a business concept—and let our advanced Veo AI bring it to life with cinematic motion.' 
              : 'डिजिटल सामग्री के भविष्य का अनुभव करें। कोई भी छवि अपलोड करें—एक लोगो, एक टीम फोटो, या एक व्यावसायिक अवधारणा—और हमारे उन्नत Veo AI को इसे सिनेमाई गति के साथ जीवंत करने दें।'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-white/10"
          >
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {lang === 'en' ? '1. Upload Image' : '1. छवि अपलोड करें'}
                </label>
                <div 
                  className={`relative h-64 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden ${
                    selectedImage ? 'border-blue-500 bg-blue-500/5' : 'border-white/20 hover:border-white/40'
                  }`}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">
                        {lang === 'en' ? 'Click to upload or drag & drop' : 'अपलोड करने के लिए क्लिक करें या खींचें और छोड़ें'}
                      </p>
                    </>
                  )}
                  <input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {lang === 'en' ? '2. Describe Motion (Optional)' : '2. गति का वर्णन करें (वैकल्पिक)'}
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={lang === 'en' ? "e.g. Cinematic camera zoom, subtle movement in the clouds, professional lighting..." : "जैसे सिनेमाई कैमरा ज़ूम, बादलों में सूक्ष्म हलचल, पेशेवर लाइटिंग..."}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[120px]"
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={generating || !selectedImage}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                  generating || !selectedImage 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-95'
                }`}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {lang === 'en' ? 'Generating Masterpiece...' : 'उत्कृष्ट कृति बनाई जा रही है...'}
                  </>
                ) : (
                  <>
                    <Video className="w-6 h-6" />
                    {lang === 'en' ? 'Generate AI Video' : 'AI वीडियो बनाएं'}
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
            </div>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-slate-800 rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl flex flex-col items-center justify-center relative">
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-full object-cover"
                />
              ) : generating ? (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <Sparkles className="w-10 h-10 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">{lang === 'en' ? 'AI is Working...' : 'AI काम कर रहा है...'}</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">{status}</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="w-10 h-10 text-slate-700" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-600 mb-2">{lang === 'en' ? 'Your Video Will Appear Here' : 'आपका वीडियो यहाँ दिखाई देगा'}</h4>
                  <p className="text-slate-700 text-sm max-w-xs mx-auto">
                    {lang === 'en' ? 'Upload an image and hit generate to see the magic happen.' : 'एक छवि अपलोड करें और जादू देखने के लिए जनरेट पर क्लिक करें।'}
                  </p>
                </div>
              )}
            </div>

            {videoUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-center"
              >
                <a 
                  href={videoUrl} 
                  download="ai-vision.mp4"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-5 h-5" />
                  {lang === 'en' ? 'Download Video' : 'वीडियो डाउनलोड करें'}
                </a>
              </motion.div>
            )}

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Hero = ({ lang }: { lang: 'en' | 'hi' }) => (
  <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
    {/* Background Elements */}
    <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -z-10 rounded-l-[100px]" />
    <div className="absolute top-1/4 left-10 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -z-10" />
    
    <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-blue-100 text-brand-blue px-4 py-1.5 rounded-full text-xs font-bold mb-6">
          <CheckCircle2 className="w-4 h-4" />
          {lang === 'en' ? 'ISO 9001:2015 Certified Center' : 'ISO 9001:2015 प्रमाणित केंद्र'}
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[1.05] mb-6">
          {lang === 'en' ? 'All Online ' : 'सभी ऑनलाइन '}<span className="text-brand-blue">{lang === 'en' ? 'Government' : 'सरकारी'}</span> {lang === 'en' ? ' Services in One Place.' : ' सेवाएं एक ही स्थान पर।'}
        </h1>
        <p className="text-slate-600 text-lg mb-10 max-w-lg leading-relaxed">
          {lang === 'en' 
            ? 'We provide professional assistance for ITR, GST, PAN, Aadhaar, and 100+ other digital services. Fast, secure, and reliable.' 
            : 'हम ITR, GST, PAN, Aadhaar और 100+ अन्य डिजिटल सेवाओं के लिए पेशेवर सहायता प्रदान करते हैं। तेज़, सुरक्षित और विश्वसनीय।'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn-primary text-lg px-8 py-4">
            {lang === 'en' ? 'Get Started Now' : 'अभी शुरू करें'} <ArrowRight className="w-5 h-5" />
          </button>
          <a href="#services" className="btn-secondary text-lg px-8 py-4">
            {lang === 'en' ? 'Our Services' : 'हमारी सेवाएं'}
          </a>
        </div>
        
        <div className="mt-12 flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <div className="text-sm">
            <p className="font-bold text-slate-900">{lang === 'en' ? 'Trusted by 15k+ users' : '15k+ उपयोगकर्ताओं द्वारा विश्वसनीय'}</p>
            <p className="text-slate-500">{lang === 'en' ? 'across India' : 'पूरे भारत में'}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop" 
            alt="Professional Financial Services" 
            className="w-full h-auto"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="text-white font-bold text-center">{lang === 'en' ? 'Digital India Services' : 'डिजिटल इंडिया सेवाएं'}</p>
            <p className="text-blue-100 text-[10px] text-center uppercase tracking-widest">{lang === 'en' ? 'Empowering Citizens through Technology' : 'प्रौद्योगिकी के माध्यम से नागरिकों को सशक्त बनाना'}</p>
          </div>
        </div>
        
        {/* Floating Card */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[240px] z-20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">{lang === 'en' ? 'Security' : 'सुरक्षा'}</p>
              <p className="font-bold text-slate-900">{lang === 'en' ? '100% Secure' : '100% सुरक्षित'}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">{lang === 'en' ? 'Your data is encrypted and handled with utmost confidentiality.' : 'आपका डेटा एन्क्रिप्टेड है और अत्यंत गोपनीयता के साथ संभाला जाता है।'}</p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Services = ({ services, lang }: { services: typeof SERVICE_CATEGORIES, lang: 'en' | 'hi' }) => (
  <section id="services" className="py-24 bg-slate-50">
    <div className="container-custom">
      <div className="text-center mb-20">
        <h2 className="section-title">{lang === 'en' ? 'Our Professional Services' : 'हमारी पेशेवर सेवाएं'}</h2>
        <p className="section-subtitle mx-auto">
          {lang === 'en' 
            ? 'At Tax Suvidha Jan Kendra, we provide expert solutions to simplify your financial compliance and enhance your brand\'s visual identity.' 
            : 'टैक्स सुविधा जन केंद्र में, हम आपके वित्तीय अनुपालन को सरल बनाने और आपके ब्रांड की दृश्य पहचान को बढ़ाने के लिए विशेषज्ञ समाधान प्रदान करते हैं।'}
        </p>
      </div>

      <div className="space-y-24">
        {services.map((category, catIdx) => (
          <div key={category.id}>
            <div className="flex items-center gap-4 mb-12">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${category.color}`}>
                {category.icon}
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-slate-900">{category.title[lang]}</h3>
                <p className="text-slate-500">{category.description[lang]}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.services.map((service, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl mb-6 overflow-hidden border border-slate-100 group-hover:border-brand-blue/20 transition-all p-2">
                    <img 
                      src={(service as any).icon} 
                      alt={service.name[lang]} 
                      className="w-full h-full object-contain rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-blue transition-colors">
                    {service.name[lang]}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {service.desc[lang]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20 bg-brand-blue rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-display font-black mb-4">{lang === 'en' ? 'Need Expert Support?' : 'विशेषज्ञ सहायता की आवश्यकता है?'}</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            {lang === 'en' 
              ? 'Whether it\'s a complex tax query or a creative design project, our team is ready to assist you with professional and friendly service.' 
              : 'चाहे वह एक जटिल टैक्स प्रश्न हो या एक रचनात्मक डिजाइन प्रोजेक्ट, हमारी टीम पेशेवर और मैत्रीपूर्ण सेवा के साथ आपकी सहायता के लिए तैयार है।'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="bg-white text-brand-blue px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors">
              {lang === 'en' ? 'Contact us today for support' : 'सहायता के लिए आज ही हमसे संपर्क करें'}
            </a>
            <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> {lang === 'en' ? 'Chat on WhatsApp' : 'व्हाट्सएप पर चैट करें'}
            </a>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
      </div>
    </div>
  </section>
);

const Stats = ({ lang }: { lang: 'en' | 'hi' }) => (
  <section className="py-20 bg-brand-blue text-white">
    <div className="container-custom">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {STATS.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-4">
              {stat.icon}
            </div>
            <p className="text-4xl md:text-5xl font-display font-black mb-2">{stat.value}</p>
            <p className="text-blue-100 font-medium uppercase tracking-widest text-xs">{stat.label[lang]}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = ({ lang }: { lang: 'en' | 'hi' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: { 
        en: "What documents are required for ITR filing?", 
        hi: "ITR फाइलिंग के लिए कौन से दस्तावेज आवश्यक हैं?" 
      },
      answer: { 
        en: "Basic documents include PAN card, Aadhaar card, Form 16 (for salaried individuals), bank statements, and investment proofs (80C, 80D, etc.). For business income, balance sheets and P&L accounts are also required.", 
        hi: "बुनियादी दस्तावेजों में पैन कार्ड, आधार कार्ड, फॉर्म 16 (वेतनभोगी व्यक्तियों के लिए), बैंक स्टेटमेंट और निवेश प्रमाण (80C, 80D, आदि) शामिल हैं। व्यावसायिक आय के लिए, बैलेंस शीट और P&L खाते भी आवश्यक हैं।" 
      }
    },
    {
      question: { 
        en: "How long does GST registration take?", 
        hi: "GST पंजीकरण में कितना समय लगता है?" 
      },
      answer: { 
        en: "Typically, GST registration takes 3-7 working days, subject to government approval and document verification. We ensure your application is filed correctly to avoid delays.", 
        hi: "आमतौर पर, GST पंजीकरण में 3-7 कार्य दिवस लगते हैं, जो सरकारी अनुमोदन और दस्तावेज़ सत्यापन के अधीन है। हम यह सुनिश्चित करते हैं कि देरी से बचने के लिए आपका आवेदन सही ढंग से दायर किया गया है।" 
      }
    },
    {
      question: { 
        en: "What are your service charges?", 
        hi: "आपके सेवा शुल्क क्या हैं?" 
      },
      answer: { 
        en: "Our pricing is transparent and depends on the complexity of the service. We offer competitive rates for individuals, startups, and established businesses. Contact us for a custom quote based on your specific needs.", 
        hi: "हमारी कीमतें पारदर्शी हैं और सेवा की जटिलता पर निर्भर करती हैं। हम व्यक्तियों, स्टार्टअप और स्थापित व्यवसायों के लिए प्रतिस्पर्धी दरों की पेशकश करते हैं। अपनी विशिष्ट आवश्यकताओं के आधार पर कस्टम कोट के लिए हमसे संपर्क करें।" 
      }
    },
    {
      question: { 
        en: "Do you provide digital signature certificates (DSC)?", 
        hi: "क्या आप डिजिटल सिग्नेचर सर्टिफिकेट (DSC) प्रदान करते हैं?" 
      },
      answer: { 
        en: "Yes, we provide Class 3 Digital Signature Certificates (DSC) for individuals and organizations for various purposes like ITR, GST, and MCA filings.", 
        hi: "हाँ, हम ITR, GST और MCA फाइलिंग जैसे विभिन्न उद्देश्यों के लिए व्यक्तियों और संगठनों के लिए क्लास 3 डिजिटल सिग्नेचर सर्टिफिकेट (DSC) प्रदान करते हैं।" 
      }
    },
    {
      question: { 
        en: "Can I track my application status online?", 
        hi: "क्या मैं अपने आवेदन की स्थिति ऑनलाइन ट्रैक कर सकता हूँ?" 
      },
      answer: { 
        en: "Yes, you can use our 'Track Application' section on the website or contact our support team via WhatsApp for real-time updates on your filing status.", 
        hi: "हाँ, आप वेबसाइट पर हमारे 'ट्रैक एप्लिकेशन' अनुभाग का उपयोग कर सकते हैं या अपनी फाइलिंग स्थिति पर रीयल-टाइम अपडेट के लिए व्हाट्सएप के माध्यम से हमारी सहायता टीम से संपर्क कर सकते हैं।" 
      }
    },
    {
      question: { 
        en: "What is the process for company registration?", 
        hi: "कंपनी पंजीकरण की प्रक्रिया क्या है?" 
      },
      answer: { 
        en: "The process involves obtaining DSC, DIN, name approval, and filing incorporation documents with the MCA. We handle the entire end-to-end process, including drafting MOA and AOA.", 
        hi: "प्रक्रिया में DSC, DIN प्राप्त करना, नाम अनुमोदन और MCA के साथ निगमन दस्तावेज दाखिल करना शामिल है। हम MOA और AOA तैयार करने सहित पूरी एंड-टू-एंड प्रक्रिया को संभालते हैं।" 
      }
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue px-4 py-2 rounded-full text-sm font-bold mb-6">
            <HelpCircle className="w-4 h-4" />
            {lang === 'en' ? 'Common Queries' : 'सामान्य प्रश्न'}
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-6">
            {lang === 'en' ? 'Frequently Asked ' : 'अक्सर पूछे जाने वाले '}<span className="text-brand-blue">{lang === 'en' ? 'Questions' : 'प्रश्न'}</span>
          </h2>
          <p className="text-slate-600 text-lg">
            {lang === 'en' 
              ? 'Find quick answers to common questions about our tax, GST, and business services.' 
              : 'हमारे टैक्स, GST और व्यावसायिक सेवाओं के बारे में सामान्य प्रश्नों के त्वरित उत्तर खोजें।'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-2xl border-2 transition-all duration-300 ${
                  openIndex === index 
                    ? 'border-brand-blue bg-blue-50/30' 
                    : 'border-slate-100 bg-white hover:border-blue-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`text-lg font-bold ${openIndex === index ? 'text-brand-blue' : 'text-slate-900'}`}>
                    {faq.question[lang]}
                  </span>
                  <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index ? 'bg-brand-blue text-white rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-blue-100/50 pt-4">
                        {faq.answer[lang]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 mb-6">Still have questions?</p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            Contact Our Experts
          </a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 -right-24 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10" />
    </section>
  );
};

const Contact = ({ services }: { services: typeof SERVICE_CATEGORIES }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Select a service',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, 'leads'), {
          ...formData,
          createdAt: Timestamp.now(),
          status: 'new'
        });
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', phone: '', service: 'Select a service', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } catch (error) {
        console.error("Error submitting lead:", error);
        setIsSubmitting(false);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle">
              Have questions about our services? Visit our center or contact us through any of the following channels.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Call Us</p>
                  <p className="text-xl font-bold text-slate-900">{CONTACT_INFO.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Email Us</p>
                  {CONTACT_INFO.emails.map((email, i) => (
                    <p key={i} className="text-lg font-bold text-slate-900">{email}</p>
                  ))}
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp</p>
                  <p className="text-xl font-bold text-slate-900">{CONTACT_INFO.whatsapp}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Office Address</p>
                  <p className="text-xl font-bold text-slate-900 leading-relaxed">{CONTACT_INFO.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Working Hours</p>
                  <p className="text-xl font-bold text-slate-900">{CONTACT_INFO.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">GSTIN</p>
                  <p className="text-xl font-bold text-slate-900">{CONTACT_INFO.gstin}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Send a Message</h3>
            
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{lang === 'en' ? 'Message Sent!' : 'संदेश भेज दिया गया!'}</h4>
                <p className="text-slate-600">{lang === 'en' ? 'Thank you for reaching out. Our team will contact you shortly.' : 'संपर्क करने के लिए धन्यवाद। हमारी टीम जल्द ही आपसे संपर्क करेगी।'}</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-brand-blue font-bold hover:underline"
                >
                  {lang === 'en' ? 'Send another message' : 'एक और संदेश भेजें'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{lang === 'en' ? 'Full Name' : 'पूरा नाम'}</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border ${errors.name ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all`} 
                      placeholder={lang === 'en' ? 'John Doe' : 'जॉन डो'} 
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{lang === 'en' ? 'Phone Number' : 'फ़ोन नंबर'}</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border ${errors.phone ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all`} 
                      placeholder="9876543210" 
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{lang === 'en' ? 'Service Required' : 'आवश्यक सेवा'}</label>
                  <select 
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  >
                    <option disabled>{lang === 'en' ? 'Select a service' : 'एक सेवा चुनें'}</option>
                    {services.flatMap(cat => cat.services).map((s, i) => <option key={i} value={s.name[lang]}>{s.name[lang]}</option>)}
                    <option value="Other">{lang === 'en' ? 'Other' : 'अन्य'}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{lang === 'en' ? 'Message' : 'संदेश'}</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4} 
                    className={`w-full bg-slate-50 border ${errors.message ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all`} 
                    placeholder={lang === 'en' ? 'How can we help you?' : 'हम आपकी किस प्रकार सहायता कर सकते हैं?'}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-4 text-lg flex items-center justify-center gap-2 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed text-white/80' 
                      : 'bg-brand-blue text-white hover:bg-blue-800 shadow-blue-200'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{lang === 'en' ? 'Sending Message...' : 'संदेश भेजा जा रहा है...'}</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="normal"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        <span>{lang === 'en' ? 'Send Message' : 'संदेश भेजें'}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ lang }: { lang: 'en' | 'hi' }) => (
  <footer className="bg-slate-900 text-white pt-20 pb-10">
    <div className="container-custom">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-blue overflow-hidden border border-white/10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-2xl font-display font-black tracking-tighter">
              TAX <span className="text-brand-blue">SUVIDHA</span> JAN KENDRA
            </span>
          </div>
          <p className="text-slate-400 max-w-sm mb-4 leading-relaxed">
            {lang === 'en' 
              ? 'Tax Suvidha Jan Kendra is your one-stop destination for all digital and financial government services. We simplify complex processes for you.' 
              : 'टैक्स सुविधा जन केंद्र सभी डिजिटल और वित्तीय सरकारी सेवाओं के लिए आपका वन-स्टॉप डेस्टिनेशन है। हम आपके लिए जटिल प्रक्रियाओं को सरल बनाते हैं।'}
          </p>
          <p className="text-slate-500 text-xs mb-8">GSTIN: {CONTACT_INFO.gstin}</p>
          <div className="flex gap-4">
            <a href={CONTACT_INFO.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={`mailto:${CONTACT_INFO.emails[0]}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-all">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-6">{lang === 'en' ? 'Quick Links' : 'त्वरित लिंक'}</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">{lang === 'en' ? 'Home' : 'होम'}</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">{lang === 'en' ? 'Our Services' : 'हमारी सेवाएं'}</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">{lang === 'en' ? 'About Us' : 'हमारे बारे में'}</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">{lang === 'en' ? 'Contact Us' : 'संपर्क करें'}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{lang === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-6">{lang === 'en' ? 'Popular Services' : 'लोकप्रिय सेवाएं'}</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">{lang === 'en' ? 'ITR Filing' : 'ITR फाइलिंग'}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{lang === 'en' ? 'GST Registration' : 'GST पंजीकरण'}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{lang === 'en' ? 'PAN Card' : 'पैन कार्ड'}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{lang === 'en' ? 'Aadhaar Update' : 'आधार अपडेट'}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{lang === 'en' ? 'Bill Payments' : 'बिल भुगतान'}</a></li>
          </ul>
        </div>
      </div>
      
      <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
        <p>© 2026 {BUSINESS_NAME}. {lang === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}</p>
        <div className="flex gap-8">
          <span>{lang === 'en' ? 'Designed with ❤️ for Digital India' : 'डिजिटल इंडिया के लिए ❤️ के साथ डिज़ाइन किया गया'}</span>
        </div>
      </div>
    </div>
  </footer>
);

const PolicyVision = ({ lang }: { lang: 'en' | 'hi' }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await generateTaxPolicyIllustration();
        setImageUrl(url);
      } catch (error) {
        console.error("Failed to generate illustration:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
  }, []);

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
              <TrendingUp className="w-4 h-4" />
              {lang === 'en' ? 'National Economic Vision' : 'राष्ट्रीय आर्थिक दृष्टिकोण'}
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-8 leading-tight">
              {lang === 'en' ? 'Shaping the Future of ' : 'डिजिटल इंडिया के '}<span className="text-brand-blue">{lang === 'en' ? 'Digital India' : 'भविष्य को आकार देना'}</span>{lang === 'en' ? '.' : '।'}
            </h2>
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                {lang === 'en' 
                  ? 'Our portal aligns with the national vision of a digitally empowered India. We work tirelessly to ensure that every citizen can navigate the evolving tax landscape with confidence and ease.' 
                  : 'हमारा पोर्टल डिजिटल रूप से सशक्त भारत के राष्ट्रीय दृष्टिकोण के अनुरूप है। हम यह सुनिश्चित करने के लिए अथक प्रयास करते हैं कि प्रत्येक नागरिक आत्मविश्वास और सहजता के साथ बदलते कर परिदृश्य को समझ सके।'}
              </p>
              <p>
                {lang === 'en' 
                  ? "Through professional guidance and state-of-the-art digital tools, we support the government's initiatives in simplifying GST, ITR, and other essential compliance procedures for businesses and individuals." 
                  : 'पेशेवर मार्गदर्शन और अत्याधुनिक डिजिटल उपकरणों के माध्यम से, हम व्यवसायों और व्यक्तियों के लिए GST, ITR और अन्य आवश्यक अनुपालन प्रक्रियाओं को सरल बनाने में सरकार की पहल का समर्थन करते हैं।'}
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <h4 className="font-bold text-white mb-2">{lang === 'en' ? 'Policy Compliance' : 'नीति अनुपालन'}</h4>
                <p className="text-sm text-slate-500">
                  {lang === 'en' ? 'Ensuring 100% adherence to the latest government tax regulations and guidelines.' : 'नवीनतम सरकारी कर नियमों और दिशानिर्देशों का 100% पालन सुनिश्चित करना।'}
                </p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <h4 className="font-bold text-white mb-2">{lang === 'en' ? 'Economic Growth' : 'आर्थिक विकास'}</h4>
                <p className="text-sm text-slate-500">
                  {lang === 'en' ? "Contributing to the nation's economy by facilitating seamless business tax filings." : 'निर्बाध व्यावसायिक कर फाइलिंग की सुविधा प्रदान करके देश की अर्थव्यवस्था में योगदान देना।'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10 aspect-video bg-slate-800 flex items-center justify-center">
              {isLoading ? (
                <div className="text-center p-8">
                  <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-blue-200 font-bold">{lang === 'en' ? 'Generating Professional Illustration...' : 'पेशेवर चित्रण तैयार किया जा रहा है...'}</p>
                  <p className="text-slate-500 text-xs mt-2 italic">{lang === 'en' ? "Visualizing India's Economic Vision" : 'भारत के आर्थिक दृष्टिकोण की कल्पना'}</p>
                </div>
              ) : imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={lang === 'en' ? "Narendra Modi and Nirmala Sitharaman discussing tax policy" : "नरेंद्र मोदी और निर्मला सीतारमण कर नीति पर चर्चा करते हुए"} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-8">
                  <ShieldCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">{lang === 'en' ? 'Policy Vision Illustration' : 'नीति विजन चित्रण'}</p>
                </div>
              )}
              
              {!isLoading && imageUrl && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-8">
                  <p className="text-white font-display font-bold text-lg">{lang === 'en' ? 'Strategic Policy Discussion' : 'सामरिक नीति चर्चा'}</p>
                  <p className="text-blue-300 text-xs uppercase tracking-widest">{lang === 'en' ? 'Leadership & Economic Governance' : 'नेतृत्व और आर्थिक शासन'}</p>
                </div>
              )}
            </div>
            
            {/* Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const AnimatedFloatingIcon = ({ lang }: { lang: 'en' | 'hi' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className="fixed bottom-8 left-8 z-50 hidden md:block"
  >
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative group cursor-pointer"
    >
      {/* Main Container */}
      <div className="w-16 h-16 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
        <div className="grid grid-cols-2 gap-1 p-2">
          <Calculator className="w-5 h-5 text-brand-blue" />
          <FileText className="w-5 h-5 text-emerald-500" />
          <IndianRupee className="w-5 h-5 text-emerald-600" />
          <Palette className="w-5 h-5 text-brand-blue" />
        </div>
        
        {/* Glow Effect */}
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-brand-blue/5 rounded-2xl -z-10"
        />
      </div>

      {/* Tooltip */}
      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
        {lang === 'en' ? 'Tax & Design Solutions' : 'टैक्स और डिजाइन समाधान'}
      </div>
    </motion.div>
  </motion.div>
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [services, setServices] = useState(SERVICE_CATEGORIES);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('isAdminLoggedIn') === 'true';
  });

  // Hidden admin access: Press 'Ctrl + Shift + A'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="relative">
      {!location.pathname.startsWith('/admin') && <Navbar lang={lang} setLang={setLang} />}
      
      <Routes>
        <Route path="/" element={
          <main>
            <Hero lang={lang} />
            <About lang={lang} />
            <AICreativeStudio lang={lang} />
            <PolicyVision lang={lang} />
            <Services services={services} lang={lang} />
            <TrackApplication lang={lang} />
            <Stats lang={lang} />
            <FAQ lang={lang} />
            <Contact services={services} lang={lang} />
            <Footer lang={lang} />
          </main>
        } />
        
        <Route path="/social" element={
          <>
            <SocialAds lang={lang} />
            <Footer lang={lang} />
          </>
        } />

        <Route path="/admin" element={
          isAdminLoggedIn ? (
            <AdminPanel 
              services={services}
              setServices={setServices}
              onLogout={() => {
                setIsAdminLoggedIn(false);
                sessionStorage.removeItem('isAdminLoggedIn');
                navigate('/');
              }}
              onBack={() => navigate('/')}
            />
          ) : (
            <AdminLogin 
              lang={lang}
              onLogin={() => {
                setIsAdminLoggedIn(true);
                sessionStorage.setItem('isAdminLoggedIn', 'true');
              }}
              onBack={() => navigate('/')}
            />
          )
        } />
      </Routes>
      
      {!location.pathname.startsWith('/admin') && (
        <>
          <LiveChat lang={lang} />
          <AnimatedFloatingIcon lang={lang} />
        </>
      )}
    </div>
  );
}
