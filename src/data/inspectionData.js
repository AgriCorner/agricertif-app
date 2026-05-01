/* ── Sections d'inspection par type de matériel ── */

const E = 'etat';   // rating 5 niveaux
const C = 'check';  // conforme / non conforme
const P = 'pneu';   // dimensions + usure
const N = 'num';    // valeur numérique
const T = 'text';   // texte libre

/* ══ TRACTEUR ══ */
export const INSPECTION_TRACTEUR = [
  {
    id: 'presentation', label: 'Présentation', icon: 'paint',
    guide: [
      { title: 'Peinture', txt: "Vérifier si la peinture est d'origine ou si le matériel a été repeint (uniformité, traces de reprise)" },
      { title: 'Tôlerie', txt: 'Identifier les chocs, bosses ou déformations sur l\'ensemble de la carrosserie' },
      { title: 'Jantes', txt: 'Vérifier l\'état des soudures et l\'absence de fissures sur les jantes' },
    ],
    items: [
      { id: 'general',     label: 'État général',        type: E },
      { id: 'peinture',    label: 'Peinture',            type: E },
      { id: 'tolerie',     label: 'Tôlerie',             type: E },
      { id: 'calandre',    label: 'Calandre',            type: E },
      { id: 'capot',       label: 'Capot moteur',        type: E },
      { id: 'ailes_av',    label: 'Ailes avant',         type: E },
      { id: 'cabine_ext',  label: 'Cabine extérieure',   type: E },
      { id: 'jantes',      label: 'Jantes',              type: E },
    ],
  },
  {
    id: 'cabine', label: 'Cabine', icon: 'seat',
    guide: [
      { title: 'Climatisation', txt: 'Mettre en route et vérifier que l\'air refroidit effectivement. Vérifier les filtres cabine.' },
      { title: 'Siège', txt: 'Contrôler les réglages en hauteur/profondeur, l\'état du revêtement et la suspension pneumatique/mécanique' },
      { title: 'Électricité', txt: 'Tester tous les circuits : tableau de bord, prises 12V, écrans de gestion, gyrophare' },
    ],
    items: [
      { id: 'cabine_int',  label: 'Intérieur cabine',         type: E },
      { id: 'siege',       label: 'Siège (état + réglages)',  type: E },
      { id: 'plancher',    label: 'Plancher / moquette',      type: E },
      { id: 'ventil',      label: 'Ventilation / chauffage',  type: C },
      { id: 'clim',        label: 'Climatisation',            type: C },
      { id: 'elec',        label: 'Circuits électriques',     type: E },
      { id: 'tableau',     label: 'Tableau de bord / écrans', type: E },
      { id: 'essuie',      label: 'Essuie-glace AR',          type: C },
      { id: 'toit',        label: 'Toit de cabine / vitres',  type: E },
    ],
  },
  {
    id: 'mecanique', label: 'Mécanique', icon: 'engine',
    guide: [
      { title: 'Moteur', txt: 'Démarrer à froid, écouter les bruits anormaux (claquements, sifflements), observer la couleur des fumées, chercher des fuites huile/liquide de refroidissement. Vérifier filtres air et cabine.' },
      { title: 'Transmission', txt: 'Passer toutes les vitesses AV et AR, vérifier douceur de l\'embrayage, passage des rapports, inverseur sous charge' },
      { title: 'Freins / PDF', txt: 'Freiner en avançant à ~10 km/h, essayer le relevage (secousse = OK), vérifier arrêt et relance de la PDF, gyrophare' },
    ],
    items: [
      { id: 'moteur',      label: 'Moteur',                     type: E },
      { id: 'batterie',    label: 'Batterie / démarrage',       type: C },
      { id: 'echappement', label: 'Gaz d\'échappement',         type: 'exhaust' },
      { id: 'embrayage',   label: 'Embrayage',                  type: E },
      { id: 'boite',       label: 'Boîte de vitesse',           type: E },
      { id: 'pont_ar',     label: 'Pont arrière',               type: E },
      { id: 'train_av',    label: 'Train avant',                type: E },
      { id: 'freins',      label: 'Freins',                     type: E },
      { id: 'relevage',    label: 'Relevage arrière',           type: E },
      { id: 'pdf',         label: 'Prise de force (PDF)',       type: C },
      { id: 'direction',   label: 'Direction',                  type: E },
      { id: 'eclairage',   label: 'Éclairage + gyrophare',      type: C },
    ],
  },
  {
    id: 'pneus', label: 'Pneus', icon: 'wheel',
    guide: [
      { title: 'Marque & Dimension', txt: 'Vérifier que la même marque est montée sur un même pont. Contrôler que les dimensions correspondent à la fiche technique.' },
      { title: 'Usure des crampons', txt: 'Contrôler visuellement les flancs et l\'usure des crampons. Un pneu < 20% d\'usure est HS.' },
      { title: 'Pression & gonflage', txt: 'S\'assurer que les roues ne sont pas dégonflées. Vérifier l\'absence de coupures ou de bourrelets sur les flancs.' },
    ],
    items: [
      { id: 'pneu_avd', label: 'Avant droit',    type: P },
      { id: 'pneu_avg', label: 'Avant gauche',   type: P },
      { id: 'pneu_ard', label: 'Arrière droit',  type: P },
      { id: 'pneu_arg', label: 'Arrière gauche', type: P },
    ],
  },
  {
    id: 'hydraulique', label: 'Hydraulique', icon: 'drop',
    guide: [
      { title: 'Relevage & vérins', txt: 'Tester la commande mécanique et électronique du relevage. Lever et descendre plusieurs fois. Chercher des fuites sur les vérins et raccords.' },
      { title: 'Distributeurs', txt: 'Actionner chaque distributeur séquentiellement, vérifier les débits et l\'absence de fuites au niveau des flexibles.' },
    ],
    items: [
      { id: 'relev_meca',  label: 'Relevage commande méca.',   type: C },
      { id: 'relev_elec',  label: 'Relevage électronique',     type: C },
      { id: 'relev_avant', label: 'Relevage avant (si équipé)', type: C },
      { id: 'verins',      label: 'Vérins additionnels',       type: E },
      { id: 'distrib',     label: 'Distributeurs hydrauliques', type: E },
      { id: 'fuites',      label: 'Absence de fuites',         type: C },
    ],
  },
];

/* ══ MOISSONNEUSE-BATTEUSE ══ */
export const INSPECTION_MOISSONNEUSE = [
  {
    id: 'presentation', label: 'Présentation', icon: 'paint',
    guide: [
      { title: 'État général', txt: 'Contrôle visuel de l\'ensemble de la machine. Vérifier la peinture d\'origine, les chocs sur la tôlerie et l\'état du châssis.' },
      { title: 'Cabine', txt: 'Contrôle visuel de l\'état général, l\'usure du siège, des garnitures. Faire fonctionner la machine, essai climatisation.' },
    ],
    items: [
      { id: 'general',    label: 'État général',      type: E },
      { id: 'peinture',   label: 'Peinture',          type: E },
      { id: 'cabine',     label: 'Cabine',            type: E },
      { id: 'tolerie',    label: 'Tôlerie',           type: E },
      { id: 'chassis',    label: 'Châssis',           type: E },
    ],
  },
  {
    id: 'coupe', label: 'Coupe / Convoyeur', icon: 'blade',
    guide: [
      { title: 'Gestion', txt: 'Préciser s\'il s\'agit d\'une coupe à commande manuelle ou automatique (autofloat). Faire un essai pour s\'assurer du bon fonctionnement.' },
      { title: 'Rabatteurs', txt: 'Contrôle visuel de l\'état des griffes, supports et flasques de rabatteurs. Vérifier s\'il y a présence de fuite sur les vérins.' },
      { title: 'Fond de coupe/vis', txt: 'Contrôle visuel sur l\'usure inférieure et supérieure du fond de coupe. Signaler si bosses sur la vis.' },
      { title: 'Convoyeur', txt: 'Contrôler les chaînes, barrettes, et roulement. S\'assurer du bon fonctionnement de l\'inverseur de coupe / convoyeur.' },
    ],
    items: [
      { id: 'gestion',      label: 'Gestion (Manuel/Auto)',     type: C },
      { id: 'rabatteur',    label: 'Rabatteur',                 type: E },
      { id: 'diviseurs',    label: 'Diviseurs',                 type: E },
      { id: 'releveurs',    label: 'Releveurs',                 type: C },
      { id: 'fond_coupe',   label: 'Fond de coupe / vis',      type: E },
      { id: 'convoyeur',    label: 'Convoyeur',                 type: E },
      { id: 'carter',       label: 'Carter / protection',      type: E },
      { id: 'scie_colza',   label: 'Scie à colza (si équipée)', type: C },
    ],
  },
  {
    id: 'battage', label: 'Battage', icon: 'engine',
    guide: [
      { title: 'Batteur/Rotor', txt: 'Vérifier l\'usure des battes, l\'état des fils de contre-batteur/rotor. Trappes d\'accès disponibles sur le côté. Embrayer la machine pour contrôler l\'équilibrage.' },
      { title: 'Séparateur rotatif', txt: 'Contrôler l\'usure des plots du séparateur. Accès par trémie en enlevant une trappe : OK ou HS.' },
      { title: 'Courroie', txt: 'Vérifier l\'état d\'usure des courroies d\'entraînement du système de battage.' },
    ],
    items: [
      { id: 'batteur',     label: 'Batteur / Rotor',         type: E },
      { id: 'contre_bat',  label: 'Contre-batteur',          type: E },
      { id: 'courroie',    label: 'Courroie / Boîtier',      type: E },
      { id: 'sep_rotatif', label: 'Séparateur rotatif',      type: C },
    ],
  },
  {
    id: 'nettoyage', label: 'Nettoyage / Secoueurs', icon: 'filter',
    guide: [
      { title: 'Caisson', txt: 'Préciser si la machine est équipée d\'un caisson fixe ou auto (contrôler son fonctionnement).' },
      { title: 'Grilles', txt: 'Préciser si machine en grilles à réglages manuels ou électriques. Contrôler leur état et les faire fonctionner.' },
      { title: 'Secoueurs', txt: 'Contrôler état : crête de coq (partie supérieure), vilebrequin (contrôle de jeu, palier roulement ou palier bois). Sur machine à rotor : contrôle visuel de l\'état du tapis.' },
    ],
    items: [
      { id: 'caisson',     label: 'Caisson (Fixe/Auto)',      type: C },
      { id: 'grilles',     label: 'Grilles',                  type: E },
      { id: 'grilles_comp',label: 'Grilles complémentaires',  type: C },
      { id: 'courr_chaines',label:'Courroies / Chaînes',      type: E },
      { id: 'mais',        label: 'Équipement maïs',          type: C },
    ],
  },
  {
    id: 'broyeur', label: 'Broyeur / Éparpilleur', icon: 'fan',
    guide: [
      { title: 'Broyeur', txt: 'Vérifier l\'état des couteaux / contre-couteaux. Faire un essai pour contrôler l\'équilibrage et le système d\'embrayage.' },
      { title: 'Éparpilleur', txt: 'Si entraînement par cardan, vérifier l\'étanchéité des boîtiers. Si entraînement par courroie, vérifier leur état.' },
    ],
    items: [
      { id: 'broyeur',     label: 'Broyeur',                  type: C },
      { id: 'couteaux',    label: 'Couteaux / contre-couteaux',type: E },
      { id: 'eparpilleur', label: 'Éparpilleur',              type: C },
    ],
  },
  {
    id: 'mecanique_mb', label: 'Mécanique & Roues', icon: 'wheel',
    guide: [
      { title: 'Moteur', txt: 'Contrôle visuel, fuites. Contrôler les niveaux, l\'état des courroies et des filtres.' },
      { title: 'Roues', txt: 'Vérifier la marque et la dimension des roues motrices et directrices. Contrôle visuel de l\'usure et de l\'état des flancs.' },
    ],
    items: [
      { id: 'etat_meca',   label: 'État mécanique général',   type: E },
      { id: 'freins_mb',   label: 'Freins',                   type: E },
      { id: 'courroies_mb',label: 'Courroies',                type: E },
      { id: 'chaines_mb',  label: 'Chaînes',                  type: E },
      { id: 'roues_av',    label: 'Roues avant',              type: P },
      { id: 'roues_ar',    label: 'Roues arrière',            type: P },
    ],
  },
  {
    id: 'equipements_mb', label: 'Équipements', icon: 'star',
    guide: [
      { title: 'Électronique & Guidage', txt: 'Vérifier l\'état et le fonctionnement de la console, du contrôle de rendement, du taux d\'humidité et du système de guidage.' },
      { title: 'Accessoires', txt: 'Lister avec précision : chariot de coupe, contrôle de rendement, humidité, système de guidage, traitement de semences…' },
    ],
    items: [
      { id: 'clim_mb',     label: 'Climatisation',            type: C },
      { id: 'humidite',    label: 'Humidimètre',              type: C },
      { id: 'rendement',   label: 'Contrôle de rendement',   type: C },
      { id: 'guidage',     label: 'Guidage GPS',              type: C },
      { id: 'tremie',      label: 'Capacité trémie',          type: E },
    ],
  },
];

/* ══ OUTIL DE TRAVAIL DU SOL (charrue, herse, déchaumeur…) ══ */
export const INSPECTION_SOL = [
  {
    id: 'structure', label: 'Structure & Châssis', icon: 'bench',
    guide: [
      { title: 'Châssis', txt: 'Contrôler l\'état de la structure principale, des soudures et de la géométrie. Repérer tout voilage ou déformation.' },
      { title: 'Peinture', txt: 'Vérifier l\'état de la protection anticorrosion. La corrosion avancée peut indiquer un matériel ancien ou mal entretenu.' },
    ],
    items: [
      { id: 'chassis',    label: 'Châssis / bâti',           type: E },
      { id: 'soudures',   label: 'Soudures (état / fissures)',type: E },
      { id: 'peinture',   label: 'Peinture / anticorrosion',  type: E },
      { id: 'attelage',   label: 'Attelage 3 points',        type: E },
    ],
  },
  {
    id: 'organes', label: 'Organes travaillants', icon: 'blade',
    guide: [
      { title: 'Dents / Socs', txt: 'Contrôler l\'usure des dents, socs ou disques. Un soc usé à moins de 30% de sa surface d\'origine est à remplacer.' },
      { title: 'Rouleau / Planche', txt: 'Vérifier l\'état des pièces de rappui (rouleau packer, planche billonneuse) et le réglage de la profondeur.' },
    ],
    items: [
      { id: 'dents',      label: 'Dents / Socs / Disques',   type: E },
      { id: 'rouleau',    label: 'Rouleau / Packer',         type: E },
      { id: 'ressorts',   label: 'Ressorts / Amortisseurs',  type: E },
      { id: 'racleurs',   label: 'Racleurs',                 type: E },
    ],
  },
  {
    id: 'hydraulique_sol', label: 'Hydraulique & Commandes', icon: 'drop',
    guide: [
      { title: 'Vérins', txt: 'Tester les vérins de dépli/repli et de réglage de profondeur. Vérifier l\'absence de fuites et la fluidité des mouvements.' },
    ],
    items: [
      { id: 'verins',     label: 'Vérins hydrauliques',      type: C },
      { id: 'fuites',     label: 'Absence de fuites',        type: C },
      { id: 'commandes',  label: 'Commandes / boîtier',      type: E },
    ],
  },
];

/* ══ PRESSE À BALLES ══ */
export const INSPECTION_PRESSE = [
  {
    id: 'structure_p', label: 'Structure & Roues', icon: 'bench',
    guide: [
      { title: 'Châssis', txt: 'Contrôler le châssis, les soudures, les essieux et l\'état des roues/pneus.' },
    ],
    items: [
      { id: 'chassis_p',  label: 'Châssis',                  type: E },
      { id: 'pneus_p',    label: 'Pneus / roues',            type: E },
      { id: 'attelage_p', label: 'Attelage',                 type: E },
    ],
  },
  {
    id: 'pickup', label: 'Pick-up & Rotor', icon: 'fan',
    guide: [
      { title: 'Pick-up', txt: 'Contrôler l\'état des doigts du pick-up (dents absentes, courbées). Vérifier le déflecteur et les peignes.' },
      { title: 'Rotor / couteaux', txt: 'Vérifier l\'usure des couteaux (si coupe), l\'état du rotor et de ses battes. Contrôler les contres-couteaux.' },
    ],
    items: [
      { id: 'pickup',     label: 'Pick-up (doigts)',         type: E },
      { id: 'rotor',      label: 'Rotor / couteaux',         type: E },
      { id: 'courroies',  label: 'Courroies / chaînes',      type: E },
    ],
  },
  {
    id: 'liage', label: 'Liage / Filet / Film', icon: 'roll',
    guide: [
      { title: 'Système de liage', txt: 'Pour les balles carrées : vérifier les aiguilles, les noueurs et l\'état de la ficelle/filet. Pour les rondes : vérifier le système d\'enroulement.' },
    ],
    items: [
      { id: 'liage',      label: 'Système de liage/filet',   type: C },
      { id: 'aiguilles',  label: 'Aiguilles (balles carrées)',type: E },
      { id: 'chambre',    label: 'Chambre de compactage',    type: E },
    ],
  },
  {
    id: 'hydraulique_p', label: 'Hydraulique & Électronique', icon: 'drop',
    items: [
      { id: 'verins_p',   label: 'Vérins',                   type: C },
      { id: 'compteur',   label: 'Compteur de balles',       type: C },
      { id: 'boitier',    label: 'Boîtier de contrôle',      type: E },
    ],
  },
];

/* ══ PULVÉRISATEUR ══ */
export const INSPECTION_PULVE = [
  {
    id: 'structure_pv', label: 'Structure & Cuve', icon: 'drop',
    guide: [
      { title: 'Cuve', txt: 'Vérifier l\'état de la cuve (fissures, dépôts). Contrôler l\'agitateur et le rinçage interne. Vérifier la cuve d\'eau propre.' },
    ],
    items: [
      { id: 'cuve',       label: 'Cuve principale',          type: E },
      { id: 'cuve_clean', label: 'Cuve eau propre',          type: E },
      { id: 'agitateur',  label: 'Agitateur',                type: C },
      { id: 'chassis_pv', label: 'Châssis / essieux',        type: E },
    ],
  },
  {
    id: 'rampe', label: 'Rampe & Buses', icon: 'spray',
    guide: [
      { title: 'Rampe', txt: 'Dépli/repli de la rampe. Vérifier les buses (usure, débit uniforme), les porte-buses et l\'état des flexibles.' },
    ],
    items: [
      { id: 'rampe',      label: 'Rampe (dépli/repli)',      type: E },
      { id: 'buses',      label: 'Buses (uniformité débit)', type: E },
      { id: 'flex_rampe', label: 'Flexibles de rampe',       type: E },
    ],
  },
  {
    id: 'pompe_pv', label: 'Pompe & Filtres', icon: 'engine',
    items: [
      { id: 'pompe',      label: 'Pompe (débit, pression)',  type: E },
      { id: 'filtres_pv', label: 'Filtres',                  type: E },
      { id: 'manometre',  label: 'Manomètre',                type: C },
      { id: 'rince_ext',  label: 'Rinceur extérieur',        type: C },
    ],
  },
  {
    id: 'elec_pv', label: 'Électronique & GPS', icon: 'star',
    items: [
      { id: 'ordinateur', label: 'Ordinateur de bord',       type: E },
      { id: 'modulation', label: 'Modulation de dose',       type: C },
      { id: 'guidage_pv', label: 'Guidage GPS',              type: C },
    ],
  },
];

/* ══ TÉLESCOPIQUE ══ */
export const INSPECTION_TELESCOPIQUE = [
  {
    id: 'structure_t', label: 'Structure & Cabine', icon: 'crane',
    items: [
      { id: 'chassis_t',  label: 'Châssis / bâti',           type: E },
      { id: 'cabine_t',   label: 'Cabine',                   type: E },
      { id: 'peinture_t', label: 'Peinture',                 type: E },
      { id: 'pneus_t',    label: 'Pneus',                    type: P },
    ],
  },
  {
    id: 'bras', label: 'Bras & Flèche', icon: 'lift',
    guide: [
      { title: 'Bras télescopique', txt: 'Déployer le bras à l\'horizontal puis au maximum. Vérifier la dérive lente (fuite vérins). Contrôler les patins de guidage du bras.' },
    ],
    items: [
      { id: 'bras',       label: 'Bras télescopique',        type: E },
      { id: 'verins_t',   label: 'Vérins de bras',           type: C },
      { id: 'patins',     label: 'Patins de guidage',        type: E },
      { id: 'attache',    label: 'Tête d\'attache rapide',   type: E },
    ],
  },
  {
    id: 'moteur_t', label: 'Moteur & Hydraulique', icon: 'engine',
    items: [
      { id: 'moteur_t',   label: 'Moteur',                   type: E },
      { id: 'hydraul_t',  label: 'Circuit hydraulique',      type: E },
      { id: 'stabilos',   label: 'Stabilisateurs',           type: C },
    ],
  },
];

/* ══ BENNE / TRANSPORT ══ */
export const INSPECTION_BENNE = [
  {
    id: 'benne_caisse', label: 'Benne & Caisse', icon: 'trailer',
    guide: [
      { title: 'Fond & Ridelles', txt: 'Vérifier l\'usure du fond de benne (plaques de fond, rayures profondes). Contrôler les ridelles et les charnières.' },
    ],
    items: [
      { id: 'fond',       label: 'Fond de benne (usure)',    type: E },
      { id: 'ridelles',   label: 'Ridelles / hayons',        type: E },
      { id: 'bache',      label: 'Bâche (si équipée)',       type: C },
      { id: 'chassis_b',  label: 'Châssis / longeron',       type: E },
    ],
  },
  {
    id: 'essieux', label: 'Essieux & Freins', icon: 'wheel',
    items: [
      { id: 'pneus_b',    label: 'Pneus',                   type: P },
      { id: 'freins_b',   label: 'Freins pneumatiques',     type: C },
      { id: 'essieux_b',  label: 'Essieux',                 type: E },
      { id: 'timon',      label: 'Timon / attelage',        type: E },
    ],
  },
  {
    id: 'hydraulique_b', label: 'Hydraulique', icon: 'drop',
    items: [
      { id: 'verin_b',    label: 'Vérin de benne',          type: C },
      { id: 'fuites_b',   label: 'Absence de fuites',       type: C },
    ],
  },
];

/* ══ SEMOIR ══ */
export const INSPECTION_SEMOIR = [
  {
    id: 'structure_s', label: 'Structure & Tramage', icon: 'seed',
    items: [
      { id: 'chassis_s',  label: 'Châssis',                  type: E },
      { id: 'tramage',    label: 'Tramage (roues)',           type: E },
      { id: 'socs_s',     label: 'Socs / disques semeurs',   type: E },
      { id: 'releveurs_s',label: 'Releveurs / presse-sol',   type: E },
    ],
  },
  {
    id: 'distribution', label: 'Distribution & Trémie', icon: 'fan',
    guide: [
      { title: 'Distribution', txt: 'Tester la distribution par roulement à vide. Vérifier l\'uniformité du débit sur tous les rangs. Contrôler l\'état des turbines/roues doseuses.' },
    ],
    items: [
      { id: 'tremie_s',   label: 'Trémie (étanchéité)',      type: E },
      { id: 'distrib_s',  label: 'Distribution (turbines)',  type: E },
      { id: 'flexible_s', label: 'Flexibles / descentes',    type: E },
      { id: 'boitier_s',  label: 'Boîtier de contrôle',      type: E },
    ],
  },
];

/* ══ FAUCHEUSE ══ */
export const INSPECTION_FAUCHEUSE = [
  {
    id: 'structure_f', label: 'Structure & Attelage', icon: 'hay',
    items: [
      { id: 'chassis_f',  label: 'Châssis / bâti',           type: E },
      { id: 'attelage_f', label: 'Attelage / cardan',        type: E },
    ],
  },
  {
    id: 'barre_coupe', label: 'Barre de coupe', icon: 'blade',
    guide: [
      { title: 'Couteaux', txt: 'Vérifier l\'état et l\'usure des couteaux (lamelles, disques). Contrôler les contre-couteaux et les sabots de protection.' },
    ],
    items: [
      { id: 'couteaux_f', label: 'Couteaux / disques',       type: E },
      { id: 'contres_f',  label: 'Contre-couteaux',          type: E },
      { id: 'courroies_f',label: 'Courroies / cardans',      type: E },
      { id: 'conditionneur',label:'Conditionneur (si équipé)',type: C },
    ],
  },
  {
    id: 'hydraulique_f', label: 'Hydraulique & Délestage', icon: 'drop',
    items: [
      { id: 'verin_f',    label: 'Vérins',                   type: C },
      { id: 'delestage',  label: 'Délestage',                type: C },
    ],
  },
];

/* ══ MAP par type ══ */
export const INSPECTION_BY_TYPE = {
  tracteur:       INSPECTION_TRACTEUR,
  moissonneuse:   INSPECTION_MOISSONNEUSE,
  ensileuse:      INSPECTION_MOISSONNEUSE,
  herse_rotative: INSPECTION_SOL,
  dechaumeur:     INSPECTION_SOL,
  charrue:        INSPECTION_SOL,
  cover_crop:     INSPECTION_SOL,
  vibroculteur:   INSPECTION_SOL,
  decompacteur:   INSPECTION_SOL,
  presse_ballots: INSPECTION_PRESSE,
  presse_carrees: INSPECTION_PRESSE,
  faucheuse:      INSPECTION_FAUCHEUSE,
  andaineur:      INSPECTION_SOL,
  pulve_traine:   INSPECTION_PULVE,
  pulve_porte:    INSPECTION_PULVE,
  pulve_automoteur: INSPECTION_PULVE,
  telescopique:   INSPECTION_TELESCOPIQUE,
  benne:          INSPECTION_BENNE,
  semoir_mono:    INSPECTION_SEMOIR,
  semoir_pneumatique: INSPECTION_SEMOIR,
  semoir_direct:  INSPECTION_SEMOIR,
};

export function getInspectionSections(subcategoryId) {
  return INSPECTION_BY_TYPE[subcategoryId] || INSPECTION_TRACTEUR;
}
