import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LibraryResource, LevelType } from '../../types';
import {
  FolderArchive,
  Plus,
  Search,
  ExternalLink,
  Printer,
  Trash2,
  FileText,
  Image as ImageIcon,
  Video,
  Presentation,
  FlaskConical,
  Eye,
  X
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const { state, addLibraryResource, deleteLibraryResource } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(state.resources[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [resTitle, setResTitle] = useState('');
  const [resLevel, setResLevel] = useState<LevelType | 'TOUS'>('1AC');
  const [resCategory, setResCategory] = useState<LibraryResource['category']>('SCHEMA');
  const [resUnit, setResUnit] = useState('Unité 1');
  const [resDescription, setResDescription] = useState('');
  const [resFormat, setResFormat] = useState<LibraryResource['format']>('PDF');
  const [resUrl, setResUrl] = useState('');
  const [resTags, setResTags] = useState('');

  const filteredResources = state.resources.filter((res) => {
    const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory;
    const matchesLvl = selectedLevel === 'ALL' || res.level === selectedLevel || res.level === 'TOUS';
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesLvl && matchesSearch;
  });

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    addLibraryResource({
      title: resTitle.trim(),
      level: resLevel,
      category: resCategory,
      unit: resUnit.trim(),
      description: resDescription.trim(),
      format: resFormat,
      url: resUrl.trim() || undefined,
      tags: resTags.split(',').map((t) => t.trim()).filter(Boolean)
    });

    setResTitle('');
    setResDescription('');
    setResUrl('');
    setResTags('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (cat: LibraryResource['category']) => {
    switch (cat) {
      case 'SCHEMA': return <ImageIcon className="w-4 h-4 text-emerald-700" />;
      case 'FICHE_TP': return <FlaskConical className="w-4 h-4 text-sky-700" />;
      case 'VIDEO': return <Video className="w-4 h-4 text-rose-700" />;
      case 'PRESENTATION': return <Presentation className="w-4 h-4 text-amber-700" />;
      default: return <FileText className="w-4 h-4 text-indigo-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-emerald-800 tracking-wide uppercase">
              Ressources Didactiques & Documents SVT (1AC & 2AC)
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Bibliothèque Pédagogique SVT Collège Maroc
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              Planches anatomiques, schémas bilan normés, fiches protocoles TP, présentations et capsules vidéo.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une ressource</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes les catégories
            </button>
            <button
              onClick={() => setSelectedCategory('SCHEMA')}
              className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'SCHEMA'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Schémas normés
            </button>
            <button
              onClick={() => setSelectedCategory('FICHE_TP')}
              className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'FICHE_TP'
                  ? 'bg-white text-sky-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Protocoles TP
            </button>
            <button
              onClick={() => setSelectedCategory('COURS_RESUME')}
              className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'COURS_RESUME'
                  ? 'bg-white text-indigo-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Résumés de cours
            </button>
            <button
              onClick={() => setSelectedCategory('VIDEO')}
              className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'VIDEO'
                  ? 'bg-white text-rose-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vidéos & Animations
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ALL">Tous niveaux</option>
              <option value="1AC">Niveau 1AC</option>
              <option value="2AC">Niveau 2AC</option>
            </select>

            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main split: Library Cards on Left, Interactive Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Resource Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Documents ({filteredResources.length})
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredResources.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-xs">
                Aucune ressource trouvée pour cette recherche.
              </div>
            ) : (
              filteredResources.map((res) => {
                const isSelected = activeResource?.id === res.id;
                return (
                  <div
                    key={res.id}
                    onClick={() => setActiveResource(res)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(res.category)}
                        <span className="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-800">
                          {res.level}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {res.format}
                        </span>
                      </div>
                      {res.isCustom && (
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Perso
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">
                      {res.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400">
                      <div className="flex flex-wrap gap-1">
                        {res.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-slate-500">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {res.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Supprimer la ressource "${res.title}" ?`)) {
                              deleteLibraryResource(res.id);
                              if (activeResource?.id === res.id) {
                                setActiveResource(null);
                              }
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Visual Resource Viewer */}
        <div className="lg:col-span-7">
          {activeResource ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {activeResource.level}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {activeResource.unit}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1.5">
                    {activeResource.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => window.print()}
                    className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Imprimer cette planche didactique"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  {activeResource.url && (
                    <a
                      href={activeResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                    >
                      <span>Ouvrir source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                <strong className="text-slate-900 block mb-1">Notice pédagogique :</strong>
                {activeResource.description}
              </div>

              {/* Interactive Visual Display for Diagrams */}
              {activeResource.category === 'SCHEMA' && activeResource.title.includes('cellule') && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="text-xs font-bold text-slate-800 text-center uppercase tracking-wider">
                    Planche Comparative : Cellule Animale vs Cellule Végétale
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Animal Cell SVG Diagram */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-2">
                      <span className="text-xs font-bold text-slate-900 block">1. Cellule Animale (Buccale)</span>
                      <svg viewBox="0 0 200 160" className="w-full max-h-48 mx-auto">
                        <ellipse cx="100" cy="80" rx="80" ry="60" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
                        <circle cx="100" cy="80" r="24" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" />
                        <circle cx="106" cy="76" r="6" fill="#1E3A8A" />
                        <line x1="100" y1="80" x2="160" y2="40" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                        <text x="165" y="42" fontSize="9" fill="#1E293B" fontWeight="bold">Noyau</text>
                        <line x1="70" y1="60" x2="30" y2="30" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                        <text x="5" y="32" fontSize="9" fill="#1E293B" fontWeight="bold">Cytoplasme</text>
                        <line x1="170" y1="100" x2="175" y2="135" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                        <text x="120" y="145" fontSize="9" fill="#1E293B" fontWeight="bold">Membrane plasmique</text>
                      </svg>
                      <div className="text-[10px] text-slate-500 font-mono">Grossissement : x400</div>
                    </div>

                    {/* Plant Cell SVG Diagram */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-2">
                      <span className="text-xs font-bold text-slate-900 block">2. Cellule Végétale (Épiderme d’oignon)</span>
                      <svg viewBox="0 0 200 160" className="w-full max-h-48 mx-auto">
                        <rect x="25" y="25" width="150" height="110" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="3.5" />
                        <rect x="30" y="30" width="140" height="100" rx="6" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
                        <ellipse cx="100" cy="80" rx="50" ry="35" fill="#A7F3D0" opacity="0.6" stroke="#059669" strokeWidth="1" strokeDasharray="3,3" />
                        <circle cx="140" cy="65" r="14" fill="#34D399" stroke="#047857" strokeWidth="2" />
                        <circle cx="142" cy="63" r="4" fill="#064E3B" />
                        <line x1="140" y1="65" x2="175" y2="40" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                        <text x="150" y="35" fontSize="9" fill="#064E3B" fontWeight="bold">Noyau</text>
                        <line x1="100" y1="80" x2="100" y2="120" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                        <text x="75" y="132" fontSize="9" fill="#064E3B" fontWeight="bold">Grande vacuole</text>
                        <line x1="25" y1="50" x2="5" y2="50" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                        <text x="0" y="62" fontSize="8" fill="#064E3B" fontWeight="bold">Paroi squelettique</text>
                      </svg>
                      <div className="text-[10px] text-slate-500 font-mono">Grossissement : x400</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tectonique des plaques / Séismes SVG Display */}
              {activeResource.category === 'SCHEMA' && activeResource.title.includes('Carte') && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="text-xs font-bold text-slate-800 text-center uppercase tracking-wider">
                    Schéma Didactique : Zone de Subduction & Collision Tectonique (Région Méditerranée / Maroc)
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <svg viewBox="0 0 400 180" className="w-full max-h-56 mx-auto">
                      {/* Ocean */}
                      <path d="M0,60 Q100,60 200,60 L200,140 L0,140 Z" fill="#BAE6FD" opacity="0.4" />
                      {/* Oceanic Lithosphere dipping */}
                      <path d="M0,60 L180,60 L250,160 L220,170 L160,80 L0,80 Z" fill="#475569" />
                      {/* Continental Lithosphere */}
                      <path d="M200,60 L400,60 L400,120 L240,120 L190,60 Z" fill="#CA8A04" opacity="0.8" />
                      {/* Mountain range */}
                      <polygon points="260,60 290,20 320,60" fill="#78350F" />
                      <polygon points="300,60 330,10 360,60" fill="#92400E" />
                      <polygon points="340,60 365,30 390,60" fill="#78350F" />
                      {/* Volcano */}
                      <polygon points="230,60 245,35 260,60" fill="#DC2626" />
                      <circle cx="245" cy="30" r="4" fill="#F87171" />
                      {/* Earthquakes stars */}
                      <circle cx="190" cy="75" r="3" fill="#EF4444" />
                      <circle cx="215" cy="110" r="3" fill="#EF4444" />
                      <circle cx="235" cy="140" r="3" fill="#EF4444" />
                      {/* Labels */}
                      <text x="10" y="55" fontSize="10" fill="#0369A1" fontWeight="bold">Océan Atlantique</text>
                      <text x="280" y="15" fontSize="10" fill="#78350F" fontWeight="bold">Chaîne de montagnes (Rif / Atlas)</text>
                      <text x="170" y="170" fontSize="9" fill="#1E293B" fontWeight="bold">Plan de Wadati-Benioff (Foyers sismiques)</text>
                      <text x="210" y="32" fontSize="9" fill="#DC2626" fontWeight="bold">Volcanisme</text>
                    </svg>
                  </div>
                </div>
              )}

              {/* Protocol sheet details for TP */}
              {activeResource.category === 'FICHE_TP' && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 text-xs">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Protocole de Travaux Pratiques en Laboratoire
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                    <li><strong>Étape 1 :</strong> Prélèvement minutieux de l'échantillon à l'aide de la pince fine sans écraser les tissus.</li>
                    <li><strong>Étape 2 :</strong> Déposer une gouttelette de réactif colorant au centre d'une lame de verre propre et dégraissée.</li>
                    <li><strong>Étape 3 :</strong> Poser délicatement l'échantillon sur la gouttelette pour éviter toute formation de repli.</li>
                    <li><strong>Étape 4 :</strong> Abaisser la lamelle couvre-objet à 45° pour chasser les bulles d'air avec une aiguille montée.</li>
                    <li><strong>Étape 5 :</strong> Absorber l'excédent de liquide sur les bords avec du papier filtre.</li>
                    <li><strong>Étape 6 :</strong> Mise au point au faible grossissement (x40), puis centrage et basculement au fort grossissement (x400).</li>
                  </ol>
                </div>
              )}

              {/* Video Link Capsule */}
              {activeResource.category === 'VIDEO' && activeResource.url && (
                <div className="border border-slate-200 rounded-xl p-4 bg-rose-50/30 text-center space-y-3">
                  <div className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                    Capsule Vidéo & Animation Interactive 3D
                  </div>
                  <p className="text-xs text-rose-900">
                    Cette ressource vidéo est accessible directement pour projection en classe ou pour révision des élèves :
                  </p>
                  <a
                    href={activeResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors shadow-xs"
                  >
                    <Video className="w-4 h-4" />
                    <span>Lancer la capsule vidéo didactique</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
              <FolderArchive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Sélectionnez une ressource didactique dans la liste à gauche.
            </div>
          )}
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Ajouter une ressource didactique
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Titre de la ressource *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Schéma fonctionnel de l'appareil digestif du lapin"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Niveau *</label>
                  <select
                    value={resLevel}
                    onChange={(e) => setResLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="1AC">1AC</option>
                    <option value="2AC">2AC</option>
                    <option value="TOUS">Tous niveaux</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Catégorie *</label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="SCHEMA">Schéma normé / Planche</option>
                    <option value="FICHE_TP">Protocole / Fiche TP</option>
                    <option value="COURS_RESUME">Résumé de cours</option>
                    <option value="VIDEO">Vidéo / Animation</option>
                    <option value="PRESENTATION">Présentation PowerPoint</option>
                    <option value="EXERCICE">Fiche d'exercices</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Format</label>
                  <select
                    value={resFormat}
                    onChange={(e) => setResFormat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="PDF">Document PDF</option>
                    <option value="IMAGE">Image / Schéma (PNG/JPG)</option>
                    <option value="PPT">PowerPoint (PPT/PPTX)</option>
                    <option value="LIEN_VIDEO">Lien Vidéo / Web</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unité associée</label>
                  <input
                    type="text"
                    value={resUnit}
                    onChange={(e) => setResUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description / Objectif d'utilisation</label>
                <textarea
                  rows={3}
                  placeholder="Expliquer en quelques lignes comment cette ressource est exploitée en cours..."
                  value={resDescription}
                  onChange={(e) => setResDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Lien externe / URL de la ressource (optionnel)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mots-clés / Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  placeholder="TP, Microscope, Cellule, Oignon"
                  value={resTags}
                  onChange={(e) => setResTags(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  Ajouter à la bibliothèque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
