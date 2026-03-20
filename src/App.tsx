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
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BUSINESS_NAME = "Tax Suvidha Jan Kendra";

const SERVICES = [
  { 
    id: 'itr',
    name: "Income Tax Return", 
    description: "Professional ITR filing for individuals, businesses, and professionals with maximum tax savings.",
    icon: <FileText className="w-8 h-8" />,
    color: "bg-blue-50 text-blue-600"
  },
  { 
    id: 'gst',
    name: "GST Services", 
    description: "New GST registration, monthly/quarterly returns, and compliance management for your business.",
    icon: <ShieldCheck className="w-8 h-8" />,
    color: "bg-emerald-50 text-emerald-600"
  },
  { 
    id: 'pan',
    name: "PAN Card", 
    description: "Apply for new PAN card, corrections, or reprint. Fast processing and door-step delivery.",
    icon: <CreditCard className="w-8 h-8" />,
    color: "bg-orange-50 text-orange-600"
  },
  { 
    id: 'aadhaar',
    name: "Aadhaar Services", 
    description: "Aadhaar updates, address changes, and mobile number linking assistance at our center.",
    icon: <User className="w-8 h-8" />,
    color: "bg-purple-50 text-purple-600"
  },
  { 
    id: 'gov-forms',
    name: "Government Forms", 
    description: "Online application for various state and central government schemes, certificates, and forms.",
    icon: <Globe className="w-8 h-8" />,
    color: "bg-cyan-50 text-cyan-600"
  },
  { 
    id: 'bills',
    name: "Bill Payments", 
    description: "Electricity, water, gas, and mobile recharge services. Instant receipt and secure processing.",
    icon: <Zap className="w-8 h-8" />,
    color: "bg-yellow-50 text-yellow-600"
  },
  { 
    id: 'passport',
    name: "Passport Services", 
    description: "New passport application, renewal, and document verification assistance.",
    icon: <Globe className="w-8 h-8" />,
    color: "bg-indigo-50 text-indigo-600"
  },
  { 
    id: 'voter',
    name: "Voter ID", 
    description: "New Voter ID registration, corrections, and digital download services.",
    icon: <CheckCircle2 className="w-8 h-8" />,
    color: "bg-red-50 text-red-600"
  },
  { 
    id: 'license',
    name: "Driving License", 
    description: "Learning license, permanent license, and renewal application assistance.",
    icon: <ShieldCheck className="w-8 h-8" />,
    color: "bg-slate-50 text-slate-600"
  }
];

const STATS = [
  { label: "Happy Clients", value: "15,000+", icon: <Users className="w-5 h-5" /> },
  { label: "Services Provided", value: "100+", icon: <Zap className="w-5 h-5" /> },
  { label: "Years Experience", value: "10+", icon: <Award className="w-5 h-5" /> },
  { label: "Centers", value: "10+", icon: <Building2 className="w-5 h-5" /> },
];

const CONTACT_INFO = {
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "info@taxsuvidhajankendra.in",
  address: "D 655, Loni Road, Balram Nagar, Tronica City, Ghaziabad, Uttar Pradesh - 201102",
  hours: "Mon - Sat: 10:00 AM - 07:00 PM",
  instagram: "https://instagram.com/taxsuvidhajankendra",
  facebook: "https://facebook.com/taxsuvidhajankendra",
  gstin: "09XXXXXXXXXXXXX" // User to provide actual GSTIN
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Track', href: '#track' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}>
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-white shadow-lg overflow-hidden border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=200&h=200&auto=format&fit=crop" 
                alt="Tax Suvidha Jan Kendra Logo" 
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className={`text-xl font-display font-black tracking-tighter ${
              isScrolled ? 'text-slate-900' : 'text-slate-900'
            }`}>
              TAX <span className="text-brand-blue">SUVIDHA</span> JAN KENDRA
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-bold text-slate-600 hover:text-brand-blue transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="btn-primary py-2 px-5 text-sm"
            >
              Login Portal
            </button>
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
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-bold text-slate-900"
                  >
                    {link.name}
                  </a>
                ))}
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="btn-primary w-full"
                >
                  Login Portal
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
                <h3 className="text-2xl font-display font-bold">Portal Login</h3>
                <p className="text-blue-100 text-sm">Access your applications and documents</p>
              </div>
              <div className="p-8">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username / Email</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="Enter your username" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-blue/20 outline-none" placeholder="••••••••" />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                      Remember me
                    </label>
                    <a href="#" className="text-brand-blue font-bold">Forgot Password?</a>
                  </div>
                  <button className="btn-primary w-full py-4 mt-4">Login to Dashboard</button>
                </form>
                <p className="text-center text-sm text-slate-500 mt-6">
                  Don't have an account? <a href="#" className="text-brand-blue font-bold">Contact Center</a>
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

const TrackApplication = () => (
  <section id="track" className="py-24 bg-white">
    <div className="container-custom">
      <div className="bg-brand-blue rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black mb-6 leading-tight">
              Track Your <span className="text-blue-200">Application</span> Status.
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Enter your application reference number to check the real-time status of your service request.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Reference Number (e.g. TSJK-12345)" 
                  className="w-full bg-white text-slate-900 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
                />
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                Track Now
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold mb-2">Real-time Updates</h4>
              <p className="text-xs text-blue-100">Get instant status of your documents.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-bold mb-2">Email Alerts</h4>
              <p className="text-xs text-blue-100">Receive notifications on completion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-24 bg-white overflow-hidden">
    <div className="container-custom">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Nirmala_Sitharaman_Official_Portrait.jpg/800px-Nirmala_Sitharaman_Official_Portrait.jpg" 
              alt="Nirmala Sitharaman" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-8">
              <p className="text-white font-display font-bold text-xl">Smt. Nirmala Sitharaman</p>
              <p className="text-blue-200 text-sm">Minister of Finance, India</p>
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
          <h2 className="section-title">About Tax Suvidha Jan Kendra</h2>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">
            Tax Suvidha Jan Kendra is a premier digital service provider dedicated to simplifying government compliance and financial services for every citizen. Our mission is to bridge the gap between complex government procedures and the common man.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Authorized Service Provider",
              "Expert Financial Consultants",
              "Transparent & Secure Process",
              "End-to-End Compliance Support"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-500 italic border-l-4 border-brand-blue pl-6 py-2">
            "Our goal is to empower every individual and business with the right tools and guidance to navigate the digital landscape of modern India."
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const AdminPage = ({ onBack }: { onBack: () => void }) => {
  const [stats, setStats] = useState({
    totalApplications: 1245,
    pending: 84,
    completed: 1161,
    revenue: "₹4,52,000"
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Welcome back, Administrator</p>
          </div>
          <button onClick={onBack} className="btn-secondary py-2 px-4 text-sm">
            Back to Portal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-2xl font-display font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Recent Applications</h3>
            <button className="text-brand-blue font-bold text-sm">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-8 py-4">Ref ID</th>
                  <th className="px-8 py-4">Client Name</th>
                  <th className="px-8 py-4">Service</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'TFC-1024', name: 'Rahul Sharma', service: 'ITR Filing', status: 'Pending' },
                  { id: 'TFC-1023', name: 'Priya Gupta', service: 'GST Registration', status: 'Completed' },
                  { id: 'TFC-1022', name: 'Amit Kumar', service: 'PAN Card', status: 'In Progress' },
                  { id: 'TFC-1021', name: 'Suresh Singh', service: 'Aadhaar Update', status: 'Completed' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-4 font-mono text-sm">{row.id}</td>
                    <td className="px-8 py-4 font-bold text-slate-700">{row.name}</td>
                    <td className="px-8 py-4 text-slate-600">{row.service}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        row.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                        row.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <button className="text-slate-400 hover:text-brand-blue transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => (
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
          ISO 9001:2015 Certified Center
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[1.05] mb-6">
          All Online <span className="text-brand-blue">Government</span> Services in One Place.
        </h1>
        <p className="text-slate-600 text-lg mb-10 max-w-lg leading-relaxed">
          We provide professional assistance for ITR, GST, PAN, Aadhaar, and 100+ other digital services. Fast, secure, and reliable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn-primary text-lg px-8 py-4">
            Get Started Now <ArrowRight className="w-5 h-5" />
          </button>
          <a href="#services" className="btn-secondary text-lg px-8 py-4">
            Our Services
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
            <p className="font-bold text-slate-900">Trusted by 15k+ users</p>
            <p className="text-slate-500">across India</p>
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
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Narendra_Modi_Official_Portrait_2022.jpg/800px-Narendra_Modi_Official_Portrait_2022.jpg" 
            alt="PM Narendra Modi" 
            className="w-full h-auto"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="text-white font-bold text-center">Shri Narendra Modi</p>
            <p className="text-blue-100 text-[10px] text-center uppercase tracking-widest">Hon'ble Prime Minister of India</p>
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
              <p className="text-xs font-bold text-slate-400 uppercase">Security</p>
              <p className="font-bold text-slate-900">100% Secure</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Your data is encrypted and handled with utmost confidentiality.</p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Services = () => (
  <section id="services" className="py-24 bg-slate-50">
    <div className="container-custom">
      <div className="text-center mb-16">
        <h2 className="section-title">Our Expert Services</h2>
        <p className="section-subtitle mx-auto">
          We offer a wide range of digital and financial services to help you stay compliant and access government benefits easily.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service, idx) => (
          <motion.div
            key={service.id}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-slate-100"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${service.color}`}>
              {service.icon}
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">{service.name}</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              {service.description}
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all">
              Learn More <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <button className="btn-secondary mx-auto">
          View All 100+ Services
        </button>
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="py-20 bg-brand-blue text-white">
    <div className="container-custom">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {STATS.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-4">
              {stat.icon}
            </div>
            <p className="text-4xl md:text-5xl font-display font-black mb-2">{stat.value}</p>
            <p className="text-blue-100 font-medium uppercase tracking-widest text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
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
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone Number</label>
                <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="+91 00000 00000" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Service Required</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all">
                <option>Select a service</option>
                {SERVICES.map(s => <option key={s.id}>{s.name}</option>)}
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Message</label>
              <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-900 text-white pt-20 pb-10">
    <div className="container-custom">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-white overflow-hidden border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=200&h=200&auto=format&fit=crop" 
                alt="Tax Suvidha Jan Kendra Logo" 
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-2xl font-display font-black tracking-tighter">
              TAX <span className="text-brand-blue">SUVIDHA</span> JAN KENDRA
            </span>
          </div>
          <p className="text-slate-400 max-w-sm mb-4 leading-relaxed">
            Tax Suvidha Jan Kendra is your one-stop destination for all digital and financial government services. We simplify complex processes for you.
          </p>
          <p className="text-slate-500 text-xs mb-8">GSTIN: {CONTACT_INFO.gstin}</p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue transition-all">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-6">Popular Services</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">ITR Filing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">GST Registration</a></li>
            <li><a href="#" className="hover:text-white transition-colors">PAN Card</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Aadhaar Update</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Bill Payments</a></li>
          </ul>
        </div>
      </div>
      
      <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
        <p>© 2026 {BUSINESS_NAME}. All rights reserved.</p>
        <div className="flex gap-8">
          <span>Designed with ❤️ for Digital India</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Hidden admin access: Press 'Ctrl + Shift + A'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdminMode(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isAdminMode) {
    return <AdminPage onBack={() => setIsAdminMode(false)} />;
  }

  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <TrackApplication />
        <Stats />
        <Contact />
      </main>
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40 group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-white text-slate-900 px-4 py-2 rounded-xl shadow-xl font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
          Chat with us
        </span>
      </a>
    </div>
  );
}
