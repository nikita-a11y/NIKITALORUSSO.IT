import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, User, Briefcase, GraduationCap, Wrench, Palette, 
  LayoutTemplate, Type, Plus, Trash2, Mail, Phone, MapPin, 
  Globe, RotateCcw, Upload, Image as ImageIcon, ZoomIn
} from 'lucide-react';

// --- CONFIGURAZIONE COSTANTI ---
const FONTS = {
  inter: { name: 'Inter (Standard)', family: "'Inter', sans-serif" },
  poppins: { name: 'Poppins (Moderno)', family: "'Poppins', sans-serif" },
  serif: { name: 'Merriweather (Elegante)', family: "'Merriweather', serif" },
  mono: { name: 'Roboto Mono (Tech)', family: "'Roboto Mono', monospace" },
};

const COLORS = [
  '#2563eb', // Blue
  '#059669', // Emerald
  '#dc2626', // Red
  '#0f172a', // Slate
  '#7c3aed', // Violet
  '#d97706', // Amber
];

const INITIAL_DATA = {
  personal: {
    name: 'Mario Rossi',
    title: 'Digital Marketing Manager',
    email: 'mario.rossi@example.com',
    phone: '+39 333 1234567',
    location: 'Milano, Italia',
    summary: 'Professionista con oltre 5 anni di esperienza nella gestione di campagne digitali e team creativi. Appassionato di dati, ROI e strategie di crescita innovative.',
    photo: null
  },
  experience: [
    { id: 1, role: 'Senior Manager', company: 'Tech Agency', start: '2020', end: 'Oggi', desc: 'Gestione budget 50k/mese. Coordinamento team di 5 persone e pianificazione strategica trimestrale.' }
  ],
  education: [
    { id: 1, degree: 'Laurea in Economia', school: 'Università Bocconi', year: '2019' }
  ],
  skills: 'SEO, SEM, Google Analytics, Leadership, Inglese C1, React Basic, Project Management',
};

const INITIAL_CONFIG = {
  template: 'modern',
  color: '#2563eb',
  font: 'inter',
  scale: 1
};

export default function CVCreatorPlatinum() {
  const [data, setData] = useState(INITIAL_DATA);
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [activeTab, setActiveTab] = useState('content');
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const previewRef = useRef(null);
  const pageRef = useRef(null);

  // --- AUTO-ZOOM LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      if (previewRef.current && pageRef.current) {
        const containerWidth = previewRef.current.offsetWidth - 40; // padding
        const a4Width = 794; // 210mm @ 96dpi approx
        let scale = containerWidth / a4Width;
        if (scale > 1) scale = 1;
        
        pageRef.current.style.transform = `scale(${scale})`;
        
        // Adjust height container to fit scaled page + margin
        const scaledHeight = 1123 * scale;
        pageRef.current.style.marginBottom = `-${1123 - scaledHeight}px`; 
        
        setZoomLevel(Math.round(scale * 100));
      }
    };

    const observer = new ResizeObserver(handleResize);
    if (previewRef.current) observer.observe(previewRef.current);
    
    // Initial call
    setTimeout(handleResize, 100);

    return () => observer.disconnect();
  }, []);

  // --- HANDLERS ---
  const handlePrint = () => window.print();

  const handleReset = () => {
    if (confirm('Cancellare tutto e ricominciare?')) {
      setData(INITIAL_DATA);
      setConfig(INITIAL_CONFIG);
    }
  };

  const updatePersonal = (field, value) => {
    setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const updateItem = (section, id, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = (section) => {
    const newItem = section === 'experience' 
      ? { id: Date.now(), role: 'Nuovo Ruolo', company: 'Azienda', start: '', end: '', desc: '' }
      : { id: Date.now(), degree: 'Titolo Studio', school: 'Istituto', year: '' };
    setData(prev => ({ ...prev, [section]: [newItem, ...prev[section]] }));
  };

  const removeItem = (section, id) => {
    setData(prev => ({ ...prev, [section]: prev[section].filter(item => item.id !== id) }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => updatePersonal('photo', ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // --- RENDER HELPERS ---
  // Questo componente interno gestisce il rendering dei diversi template
  const CVContent = () => {
    const { personal, experience, education, skills } = data;
    const { color, template, font, scale } = config;
    const fontFamily = FONTS[font].family;
    const skillsList = skills.split(',').filter(s => s.trim());

    // Stili base dinamici
    const baseStyle = { fontFamily, fontSize: `${14 * scale}px`, lineHeight: 1.5, color: '#333' };
    
    // --- TEMPLATE MODERN ---
    if (template === 'modern') {
      return (
        <div className="flex h-full" style={baseStyle}>
          {/* Sidebar */}
          <div className="w-[35%] text-white p-8 flex flex-col" style={{ backgroundColor: color }}>
            <div className="text-center mb-8">
              {personal.photo ? (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-cover bg-center border-4 border-white/20" style={{ backgroundImage: `url(${personal.photo})` }} />
              ) : (
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">{personal.name.charAt(0)}</div>
              )}
              <h1 className="text-2xl font-bold leading-tight mb-2 break-words">{personal.name}</h1>
              <p className="opacity-90 text-sm uppercase tracking-wider">{personal.title}</p>
            </div>

            <div className="space-y-3 text-sm mb-8 leading-relaxed opacity-90">
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 shrink-0"/> <span className="break-all">{personal.email}</span></div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 shrink-0"/> {personal.phone}</div>
              <div className="flex items-center gap-3"><MapPin className="w-4 h-4 shrink-0"/> {personal.location}</div>
            </div>

            <div className="mt-auto">
              <h3 className="uppercase text-xs font-bold border-b border-white/20 pb-2 mb-3 tracking-widest">Competenze</h3>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((s, i) => (
                  <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs">{s.trim()}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-[65%] p-10 bg-white">
            <section className="mb-8">
              <h3 className="uppercase text-sm font-bold border-b-2 pb-2 mb-4 tracking-widest" style={{ color: color, borderColor: `${color}33` }}>Profilo</h3>
              <p className="text-gray-600 text-justify leading-relaxed">{personal.summary}</p>
            </section>

            <section className="mb-8">
              <h3 className="uppercase text-sm font-bold border-b-2 pb-2 mb-6 tracking-widest" style={{ color: color, borderColor: `${color}33` }}>Esperienza</h3>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-gray-100">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-gray-800 text-lg">{exp.role}</h4>
                      <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{exp.start} - {exp.end}</span>
                    </div>
                    <div className="text-sm font-bold mb-2" style={{ color }}>{exp.company}</div>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="uppercase text-sm font-bold border-b-2 pb-2 mb-6 tracking-widest" style={{ color: color, borderColor: `${color}33` }}>Formazione</h3>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="font-bold text-gray-800">{edu.degree}</div>
                    <div className="text-sm text-gray-500">{edu.school}, {edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      );
    }

    // --- TEMPLATE CLASSIC ---
    if (template === 'classic') {
      return (
        <div className="p-12 h-full bg-white" style={baseStyle}>
          <header className="text-center border-b-2 pb-8 mb-8" style={{ borderColor: '#333' }}>
            {personal.photo && <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${personal.photo})` }} />}
            <h1 className="text-4xl font-bold uppercase tracking-wide mb-2 text-gray-900">{personal.name}</h1>
            <p className="text-xl font-medium mb-4" style={{ color }}>{personal.title}</p>
            <div className="flex justify-center gap-4 text-sm text-gray-600 flex-wrap">
              <span>{personal.email}</span>
              <span>•</span>
              <span>{personal.phone}</span>
              <span>•</span>
              <span>{personal.location}</span>
            </div>
          </header>

          <section className="mb-8">
            <h3 className="uppercase font-bold text-lg border-b mb-4 pb-1" style={{ color, borderColor: '#eee' }}>Profilo</h3>
            <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
          </section>

          <section className="mb-8">
            <h3 className="uppercase font-bold text-lg border-b mb-6 pb-1" style={{ color, borderColor: '#eee' }}>Esperienza Professionale</h3>
            {experience.map(exp => (
              <div key={exp.id} className="grid grid-cols-[1fr_3fr] gap-6 mb-6">
                <div className="text-right text-sm font-bold text-gray-500 pt-1">{exp.start} - {exp.end}</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{exp.role}</h4>
                  <div className="text-sm italic mb-2" style={{ color }}>{exp.company}</div>
                  <p className="text-gray-700 text-sm">{exp.desc}</p>
                </div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-2 gap-8">
            <section>
              <h3 className="uppercase font-bold text-lg border-b mb-4 pb-1" style={{ color, borderColor: '#eee' }}>Istruzione</h3>
              {education.map(edu => (
                <div key={edu.id} className="mb-4">
                  <div className="font-bold text-gray-900">{edu.degree}</div>
                  <div className="text-sm text-gray-600">{edu.school}, {edu.year}</div>
                </div>
              ))}
            </section>
            <section>
              <h3 className="uppercase font-bold text-lg border-b mb-4 pb-1" style={{ color, borderColor: '#eee' }}>Competenze</h3>
              <p className="text-gray-700 text-sm">{skills}</p>
            </section>
          </div>
        </div>
      );
    }

    // --- TEMPLATE MINIMAL ---
    return (
      <div className="p-12 h-full bg-white grid grid-cols-[2fr_1fr] gap-12" style={baseStyle}>
        <div>
          <h1 className="text-5xl font-light text-gray-900 mb-2 leading-none">{personal.name}</h1>
          <p className="text-lg uppercase tracking-widest font-bold mb-10" style={{ color }}>{personal.title}</p>
          
          <div className="mb-10 pl-6 border-l-4" style={{ borderColor: color }}>
            <p className="text-gray-600 italic">{personal.summary}</p>
          </div>

          <section>
            <h3 className="text-sm font-bold uppercase text-gray-400 tracking-widest mb-6">Esperienza</h3>
            <div className="space-y-8">
              {experience.map(exp => (
                <div key={exp.id}>
                  <h4 className="text-xl font-bold text-gray-800">{exp.role}</h4>
                  <div className="text-sm font-bold mb-2 mt-1" style={{ color }}>{exp.company}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="text-right pt-2">
          {personal.photo && <div className="w-32 h-32 ml-auto mb-8 bg-cover bg-center grayscale" style={{ backgroundImage: `url(${personal.photo})` }} />}
          
          <div className="mb-10 space-y-2 text-sm">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-3">Contatti</h3>
            <div className="break-all font-medium">{personal.email}</div>
            <div className="font-medium">{personal.phone}</div>
            <div className="font-medium">{personal.location}</div>
          </div>

          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4 border-b pb-2">Istruzione</h3>
            {education.map(edu => (
              <div key={edu.id} className="mb-4">
                <div className="font-bold text-gray-900">{edu.degree}</div>
                <div className="text-xs text-gray-500">{edu.school}</div>
                <div className="text-xs text-gray-400">{edu.year}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4 border-b pb-2">Skills</h3>
            <div className="flex flex-wrap justify-end gap-2">
              {skillsList.map((s, i) => (
                <span key={i} className="border px-2 py-1 text-xs text-gray-600 border-gray-300">{s.trim()}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center z-20 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <LayoutTemplate size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">CV Platinum <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">React</span></h1>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <RotateCcw size={16} /> <span className="hidden sm:inline">Reset</span>
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all hover:shadow-md">
            <Download size={16} /> Scarica PDF
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* EDITOR (LEFT) */}
        <div className="w-full md:w-[450px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-xl print:hidden">
          {/* TABS */}
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('content')} 
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <User size={18} /> Contenuto
            </button>
            <button 
              onClick={() => setActiveTab('design')} 
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'design' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Palette size={18} /> Design
            </button>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            
            {activeTab === 'content' ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {/* PHOTO */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Foto Profilo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {data.personal.photo ? (
                        <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-slate-300" size={24} />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="cursor-pointer bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors inline-flex items-center gap-2">
                        <Upload size={12} /> Carica Foto
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                      </label>
                      {data.personal.photo && (
                        <button onClick={() => updatePersonal('photo', null)} className="text-xs text-red-500 hover:underline">Rimuovi foto</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* PERSONAL INFO */}
                <section className="space-y-3">
                  <div className="flex justify-between items-center"><h3 className="font-bold text-slate-700">Dati Personali</h3></div>
                  <input type="text" value={data.personal.name} onChange={(e) => updatePersonal('name', e.target.value)} placeholder="Nome Completo" className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  <input type="text" value={data.personal.title} onChange={(e) => updatePersonal('title', e.target.value)} placeholder="Job Title" className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={data.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} placeholder="Email" className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="text" value={data.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} placeholder="Telefono" className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <input type="text" value={data.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} placeholder="Città / Indirizzo" className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  <textarea value={data.personal.summary} onChange={(e) => updatePersonal('summary', e.target.value)} placeholder="Profilo professionale..." rows={4} className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </section>

                {/* EXPERIENCE */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2"><Briefcase size={16}/> Esperienza</h3>
                    <button onClick={() => addItem('experience')} className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1"><Plus size={12}/> Aggiungi</button>
                  </div>
                  <div className="space-y-3">
                    {data.experience.map(item => (
                      <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                        <button onClick={() => removeItem('experience', item.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                        <input value={item.role} onChange={(e) => updateItem('experience', item.id, 'role', e.target.value)} placeholder="Ruolo" className="w-full font-bold text-sm bg-transparent border-b border-transparent focus:border-blue-500 outline-none mb-1" />
                        <input value={item.company} onChange={(e) => updateItem('experience', item.id, 'company', e.target.value)} placeholder="Azienda" className="w-full text-xs text-slate-500 bg-transparent border-b border-transparent focus:border-blue-500 outline-none mb-2" />
                        <div className="flex gap-2 mb-2">
                          <input value={item.start} onChange={(e) => updateItem('experience', item.id, 'start', e.target.value)} placeholder="Da" className="w-1/2 text-xs p-1 bg-slate-50 rounded" />
                          <input value={item.end} onChange={(e) => updateItem('experience', item.id, 'end', e.target.value)} placeholder="A" className="w-1/2 text-xs p-1 bg-slate-50 rounded" />
                        </div>
                        <textarea value={item.desc} onChange={(e) => updateItem('experience', item.id, 'desc', e.target.value)} placeholder="Descrizione..." rows={2} className="w-full text-xs p-2 bg-slate-50 rounded border-none focus:ring-1 focus:ring-blue-500 resize-none" />
                      </div>
                    ))}
                  </div>
                </section>

                {/* EDUCATION */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2"><GraduationCap size={16}/> Istruzione</h3>
                    <button onClick={() => addItem('education')} className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1"><Plus size={12}/> Aggiungi</button>
                  </div>
                  <div className="space-y-3">
                    {data.education.map(item => (
                      <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                        <button onClick={() => removeItem('education', item.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                        <input value={item.degree} onChange={(e) => updateItem('education', item.id, 'degree', e.target.value)} placeholder="Titolo di Studio" className="w-full font-bold text-sm bg-transparent border-b border-transparent focus:border-blue-500 outline-none mb-1" />
                        <input value={item.school} onChange={(e) => updateItem('education', item.id, 'school', e.target.value)} placeholder="Istituto" className="w-full text-xs text-slate-500 bg-transparent border-b border-transparent focus:border-blue-500 outline-none mb-2" />
                        <input value={item.year} onChange={(e) => updateItem('education', item.id, 'year', e.target.value)} placeholder="Anno" className="w-full text-xs p-1 bg-slate-50 rounded" />
                      </div>
                    ))}
                  </div>
                </section>

                {/* SKILLS */}
                <section className="space-y-2">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2"><Wrench size={16}/> Skills</h3>
                  <textarea value={data.skills} onChange={(e) => setData({...data, skills: e.target.value})} placeholder="Lista competenze separate da virgola..." rows={3} className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  <p className="text-xs text-slate-400">Separa le competenze con una virgola.</p>
                </section>

              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* TEMPLATE SELECTOR */}
                <section>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Modello</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['modern', 'classic', 'minimal'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setConfig({...config, template: t})}
                        className={`border-2 rounded-lg p-2 text-center transition-all ${config.template === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
                      >
                        <div className={`h-10 w-full bg-slate-200 mb-2 rounded ${t === 'modern' ? 'bg-gradient-to-r from-slate-400 to-white' : t === 'classic' ? 'border-t-4 border-slate-400 bg-white' : 'bg-white border border-slate-100'}`}></div>
                        <span className="text-xs font-bold capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* COLOR PICKER */}
                <section>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Colore Principale</label>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map(c => (
                      <button 
                        key={c} 
                        onClick={() => setConfig({...config, color: c})}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${config.color === c ? 'border-slate-800 ring-2 ring-slate-200' : 'border-white shadow-sm'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm">
                      <input type="color" value={config.color} onChange={(e) => setConfig({...config, color: e.target.value})} className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0" />
                    </div>
                  </div>
                </section>

                {/* FONT SELECTOR */}
                <section>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Carattere</label>
                  <select 
                    value={config.font} 
                    onChange={(e) => setConfig({...config, font: e.target.value})}
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {Object.entries(FONTS).map(([k, v]) => (
                      <option key={k} value={k}>{v.name}</option>
                    ))}
                  </select>
                </section>

                {/* SCALE SLIDER */}
                <section>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex justify-between">
                    Dimensione Testo <span>{Math.round(config.scale * 100)}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.8" max="1.2" step="0.05" 
                    value={config.scale} 
                    onChange={(e) => setConfig({...config, scale: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </section>
              </div>
            )}
          </div>
        </div>

        {/* PREVIEW (RIGHT) */}
        <div ref={previewRef} className="flex-1 bg-slate-700 relative overflow-hidden flex justify-center items-start p-8 print:p-0 print:bg-white">
          
          <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2 pointer-events-none print:hidden z-20">
            <ZoomIn size={12} /> {zoomLevel}%
          </div>

          {/* A4 PAGE CONTAINER */}
          <div 
            ref={pageRef}
            className="bg-white shadow-2xl origin-top transition-transform duration-200 print:shadow-none print:transform-none print:w-full print:h-auto"
            style={{ 
              width: '210mm', 
              minHeight: '297mm',
              // Force print styles
              '@media print': { margin: 0, boxShadow: 'none' }
            }}
          >
            <CVContent />
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; }
          header, .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:transform-none { transform: none !important; margin: 0 !important; }
          .print\\:w-full { width: 100% !important; max-width: none !important; }
          .print\\:h-auto { height: auto !important; min-height: 100vh !important; }
          .print\\:p-0 { padding: 0 !important; }
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
