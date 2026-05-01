/* ── Catégories, sous-catégories et marques (source : AgriCorner PDF) ── */

export const EQUIPMENT_CATEGORIES = [
  {
    id: 'tracteur',
    label: 'Tracteur',
    icon: 'tractor',
    subcategories: [{ id: 'tracteur', label: 'Tracteur' }],
    brands: [
      'AGCO','Aebi','Agrifull','Allis Chalmers','Antonio Carraro','Arbos','Avto','BCS',
      'Barreiros','Basak','Belarus','Branson','Carraro','Case IH','Challenger','Claas',
      'Cockshutt','David Brown','Deutz-Fahr','Dexheimer','Dong Feng','Ebro','Eicher',
      'Ensign','Farmall','Farmtrac','Fendt','Ferrari','Fiat','Fiatagri','Ford','Fordson',
      'Fortschritt','Guldner','Hanomag','Holder','Hürlimann','International Harvester',
      'Iseki','Jinma','John Deere','Kioti','Kirovets','Knegt','Kubota','LS Tractor',
      'Lamborghini','Landini','Leyland','Lindner','Lovol','MTZ','Mahindra',
      'Massey Ferguson','Massey Harris','McCormick','McCormick-Deering','Mercedes-Benz',
      'Mitsubishi','Montana Tractors','New Holland','OM','Pasquali','Porsche','Reform',
      'Renault','Same','Schlüter','Solis','Someca','Steiger','Steiner','Steyr','Tafe',
      'Track Marshall','Tym','UTB','Ursus','Valmet','Valpadana','Valtra','Versatile',
      'Yanmar','Yto','Zetor',
    ],
  },
  {
    id: 'recolte',
    label: 'Matériels de récolte',
    icon: 'wheat',
    subcategories: [
      { id: 'moissonneuse', label: 'Moissonneuse-batteuse' },
      { id: 'ensileuse', label: 'Ensileuse' },
      { id: 'arracheuse_pdT', label: 'Arracheuse de pomme de terre' },
      { id: 'betteravier', label: 'Matériel betteravier' },
      { id: 'linier', label: 'Matériel linier' },
    ],
    brands: [
      'AGCO','Agram','Biso','Bourgoin','Braud','Capello','Case IH','Challenger','Claas',
      'Clayson','Cressoni','Dehondt','Depoortere','Deutz-Fahr','Dewulf','Dominoni',
      'Dronningborg','Elibol','Fantini','Fahr','Fendt','Fiatagri','Fortschritt','Franquet',
      'Gaspardo','Geringhoff','Gleaner','Grimme','Haldrup','Hesston','Holmer','Honey Bee',
      'Idass','International Harvester','John Deere','Kemper','Kleine','Krone','Kubota',
      'Laverda','MacDon','Maizco','Marangon','Massey Ferguson','Matrot','Moreau','Moresil',
      'New Holland','Olimac','Oros','Oxbo','Pellenc','Perard','Ploeger','ROPA',
      'Rivière Casalis','Rostselmash','Sampo Rosenlew','Shelbourne Reynolds','Standen',
      'Tecnomais','Unverferth','Vermeer','Vervaet','Wintersteiger','Zaffrani','Ziegler','Zürn',
    ],
  },
  {
    id: 'travail_sol',
    label: 'Outil de travail du sol',
    icon: 'harrow',
    subcategories: [
      { id: 'dechaumeur', label: 'Déchaumeur' },
      { id: 'cover_crop', label: 'Cover-Crop' },
      { id: 'charrue', label: 'Charrue' },
      { id: 'herse', label: 'Herse' },
      { id: 'herse_rotative', label: 'Herse rotative' },
      { id: 'vibroculteur', label: 'Vibroculteur' },
      { id: 'decompacteur', label: 'Décompacteur' },
      { id: 'sous_soleuse', label: 'Sous-soleuse' },
      { id: 'cultivateur', label: 'Cultivateur' },
      { id: 'billon', label: 'Billonneur' },
    ],
    brands: [
      'ABK','AMJ Agro','APV','Agrisem','Amazone','Bednar','Bomford','Breviglieri',
      'Carre','Chanoine','Duro France','EHN','Eco-Mulch','Einböck','Emy Eurl',
      'Erth Engineering','Evo','Expom','Falc','Farmet','Frandsen','Gamberini',
      'Gregoire Besson','Horsch','Huard','Jourdain','Kerner','Kongskilde','Kuhn',
      'Lemken','Maschio','Mc Connel','Moro','Naud','Omarv','Ovlac','Pottinger',
      'Quivogne','Rabe','Rau','Reabe','Setra','Simtech','Sky','Sly','Supertino',
      'Unia','Vaderstad','Vibro Mulch','Vogel Noot','Wifo',
    ],
  },
  {
    id: 'semoir',
    label: 'Semoirs',
    icon: 'seeder',
    subcategories: [
      { id: 'semoir_combinaison', label: 'Semoir de combinaison' },
      { id: 'semoir_mono', label: 'Semoir monograine' },
      { id: 'semoir_pneumatique', label: 'Semoir pneumatique' },
      { id: 'semoir_direct', label: 'Semoir direct' },
    ],
    brands: [
      'Accord','Agrisem','Amazone','Bourgoin','Caruelle','Clemens','Cressoni','Gaspardo',
      'Horsch','Kinze','Kleine','Kuhn','Lemken','Maschio','Monosem','Nodet','Nordsten',
      'Pottinger','Rabe','Sky','Sulky','Sund','Vaderstad','Vogel Noot',
    ],
  },
  {
    id: 'fenaison',
    label: 'Matériel de fenaison',
    icon: 'bale',
    subcategories: [
      { id: 'presse_ballots', label: 'Presse à balles rondes' },
      { id: 'presse_carrees', label: 'Presse à balles carrées' },
      { id: 'faucheuse', label: 'Faucheuse' },
      { id: 'andaineur', label: 'Andaineur / Faneur' },
      { id: 'enrubanneuse', label: 'Enrubanneuse' },
      { id: 'autochargeuse', label: 'Autochargeuse' },
    ],
    brands: [
      'ABBriata','Aebi','Agronic','Agram','Amazone','Armer','Bcs','Bergmann','Bonino',
      'Bugnot','Case IH','Class','Claas','Deutz-Fahr','Fendt','Fahr','Gallignani',
      'Göweil','Hesston','JF Fabriken','Kuhn','Lely','Lizard','McHale','Massey Ferguson',
      'New Holland','Niemeyer','Orkel','Pöttinger','Rasspe','Reiter','Roc','Sitrex',
      'Stoll','Supertino','Taarup','Tarup','Tonutti','Valtra','Welger','Wicon','Ziegler',
    ],
  },
  {
    id: 'pulverisation',
    label: 'Pulvérisation & Fertilisation',
    icon: 'sprayBoom',
    subcategories: [
      { id: 'pulve_traine', label: 'Pulvérisateur traîné' },
      { id: 'pulve_porte', label: 'Pulvérisateur porté' },
      { id: 'pulve_automoteur', label: 'Pulvérisateur automoteur' },
      { id: 'epandeur_engrais', label: 'Épandeur à engrais' },
      { id: 'epandeur_fumier', label: 'Épandeur à fumier' },
      { id: 'tonne_lisier', label: 'Tonne à lisier' },
    ],
    brands: [
      'Abbey','Accord','Ag-Chem','Agifac','Agriflex','Agrimetal','Agrotop',
      'Agrozet','Amazone','Apache','Bargam','Bateman','Bertoud','Bogballe',
      'Berthoud','Caruelle','Challenger','Dammann','Douven','Duport','Evrard',
      'Exel Industries','Fede','Fendt','Gaspardo','Gregoire','GT','Hardi',
      'Horsch','Jacto','John Deere','Kuhn','Lemken','Lely','Liebherr','Mazzotti',
      'Mc Connel','Metos','Munckhof','New Holland','Nodet','PLA','Pro','Rau',
      'Sabe','Seguip','Spreads','Sulky','Tecnoma','Unimog','Unigreen',
      'Uster','Vicon','Willmar',
    ],
  },
  {
    id: 'telescopique',
    label: 'Télescopiques & Chargeurs',
    icon: 'telehandler',
    subcategories: [
      { id: 'telescopique', label: 'Télescopique' },
      { id: 'chargeur_frontal', label: 'Chargeur frontal' },
      { id: 'mini_chargeur', label: 'Mini chargeur' },
    ],
    brands: [
      'Ahlmann','Ausa','Avant Tecno','Bobcat','Case IH','Claas','Deutz-Fahr','Dieci',
      'Everun','Faresin','Fendt','Gehl','Genie','Giant','Gradall','JCB','JLG',
      'John Deere','Kramer','Kubota','LGMG','Liebherr','Lull','Magni','Manitou',
      'Massey Ferguson','Matbro','Merlo','New Holland','Paus','Pettibone','Sambron',
      'Sany','Schäffer','Sennebogen','Skyjack','Skytrak','Snorkel','Terex','Thaler',
      'Toyota','Wacker Neuson','Weidemann','XCMG','XTrem Manufacturing','Zoomlion',
    ],
  },
  {
    id: 'transport',
    label: 'Transport & Manutention',
    icon: 'dump',
    subcategories: [
      { id: 'benne', label: 'Benne agricole' },
      { id: 'plateau', label: 'Plateau / Porte-char' },
      { id: 'remorque_citerne', label: 'Remorque citerne' },
      { id: 'chariot_elevateur', label: 'Chariot élévateur' },
    ],
    brands: [
      'Agroliner','Beco','Bergmann','Bourgoin','Brochard','Bunning','Dard',
      'Fautras','Fliegl','Gilibert','Joskin','Lobbe','Maupu','Metal-Fach',
      'Pichon','Poettinger','Richard Western','Rolland','Samson','Schuitemaker',
      'Strautmann','Teko','Vaia','Zunhammer',
    ],
  },
];

/* ── Régions agronomiques Aube (dpt 10) — 431 communes officielles (geo.api.gouv.fr) ── */
export const REGIONS_AUBE = [
  {
    id: 'champagne_crayeuse',
    label: 'Champagne Crayeuse',
    color: '#C8D840',
    typeSol: 'Sol calcaire superficiel sur craie — grandes cultures céréalières',
    keywords: [
      'allibaudieres','amance','arcis-sur-aube','assencieres','aubeterre','aulnay','auxon','avant-les-marcilly',
      'avant-les-ramerupt','avreuil','barberey-saint-sulpice','barbuise','bernon','bessy','beurey',
      'blaincourt-sur-aube','blignicourt','boulages','bouranton','bouy-luxembourg','braux','briel-sur-barse',
      'brienne-la-vieille','brienne-le-chateau','brillecourt','breviandes','brevonnes','bucheres','betignicourt',
      'chalette-sur-voire','champ-sur-barse','champfleury','champigny-sur-aube','chapelle-vallon','chappes',
      'charmont-sous-barbuise','charny-le-bachot','chauchigny','chaudrey','chaumesnil','chessy-les-pres','chatres',
      'clerey','coclois','cormost','courcelles-sur-voire','courteranges','creney-pres-troyes','crespy-le-neuf',
      'dampierre','dienville','dommartin-le-coq','dosches','dosnon','droupt-saint-basle','droupt-sainte-marie',
      'feuges','fontaine-les-gres','foucheres','fresnoy-le-chateau','grandville','geraudot','hampigny','herbisse',
      'isle-aubigny','isle-aumont','jessains','juvanze','juzanvigny','la-chaise','la-chapelle-saint-luc',
      'la-loge-aux-chevres','la-riviere-de-corps','la-rothiere','la-vendue-mignot','la-villeneuve-au-chene',
      'laines-aux-bois','lassicourt','laubressel','lavau','le-chene','le-pavillon-sainte-julie','les-bordes-aumont',
      'les-grandes-chapelles','les-noes-pres-troyes','lesmont','lhuitre','longpre-le-sec','longsols',
      'longueville-sur-aube','lusigny-sur-barse','luyeres','macey','magnicourt','magny-fouchard','mailly-le-camp',
      'maizieres-la-grande-paroisse','maizieres-les-brienne','mathaux','mergey','mesgrigny','mesnil-lettre',
      'mesnil-saint-pere','mesnil-sellieres','mesnil-la-comtesse','molins-sur-aube','montaulin','montceaux-les-vaudes',
      'montgueux','montieramey','montmartin-le-haut','montreuil-sur-barse','montsuzain','morembert','morvilliers',
      'moussey','mery-sur-seine','nogent-sur-aube','nozay','onjon','origny-le-sec','ormes','ortillon',
      'orvilliers-saint-julien','payns','pel-et-der','perthes-les-brienne','petit-mesnil','piney','plancy-l-abbaye',
      'poivres','pont-sainte-marie','pouan-les-vallees','pougy','prunay-belleville','precy-notre-dame',
      'precy-saint-martin','premierfait','puits-et-nuisement','radonvilliers','ramerupt','rances','rheges',
      'rilly-sainte-syre','rosieres-pres-troyes','rosnay-l-hopital','rouilly-sacey','rouilly-saint-loup',
      'rumilly-les-vaudes','ruvigny','saint-andre-les-vergers','saint-benoit-sur-seine','saint-christophe-dodinicourt',
      'saint-flavy','saint-germain','saint-julien-les-villas','saint-lye','saint-leger-pres-troyes',
      'saint-leger-sous-brienne','saint-mesmin','saint-nabord-sur-aube','saint-oulph','saint-parres-aux-tertres',
      'saint-parres-les-vaudes','saint-pouange','saint-remy-sous-barbuise','saint-thibault',
      'saint-etienne-sous-barbuise','sainte-maure','sainte-savine','salon','savieres','semoine','thennelieres',
      'thieffrain','torcy-le-grand','torcy-le-petit','torvilliers','trannes','trouans','troyes','unienville','vailly',
      'val-d-auzon','vallant-saint-georges','vallentigny','vaucogne','vaudes','vaupoisson','vendeuvre-sur-barse',
      'verricourt','verrieres','villacerf','ville-aux-bois','villechetif','villemereuil','villemoyenne',
      'villette-sur-aube','villiers-herbisse','villy-en-trodes','villy-le-bois','villy-le-marechal','vinets',
      'viapres-le-petit','vosnon','voue','yevres-le-petit','epagne','epothemont','etrelles-sur-aube',
    ],
  },
  {
    id: 'champagne_humide',
    label: 'Champagne Humide',
    color: '#4CAF50',
    typeSol: 'Sol argileux profond, forêts, humide — polyculture élevage',
    keywords: [
      'ailleville','arconville','argancon','arrembecourt','arrentieres','arsonval','bailly-le-franc','balignicourt',
      'bar-sur-aube','baroville','bayel','bergeres','bligny','bossancourt','chaource','chaserey','chavanges','chesley',
      'colombe-la-fosse','colombe-le-sec','courtenot','coussegrey','couvignon','cussangy','dolancourt','donnement',
      'engente','fontaine','fravaux','fresnay','fuligny','jasseines','jaucourt','joncreuil','juvancourt',
      'la-loge-pomblin','lantages','lentilles','lignol-le-chateau','longchamp-sur-aujon','levigny','maison-des-champs',
      'maisons-les-chaource','maisons-les-soulaines','meurville','montier-en-l-isle','montmorency-beaufort',
      'pars-les-chavanges','praslin','proverville','prusy','rouvres-les-vignes','saint-leger-sous-margerie','saulcy',
      'soulaines-dhuys','spoy','thil','thors','turgy','urville','vauchonvilliers','vernonvilliers',
      'ville-sous-la-ferte','ville-sur-terre','villeret','villiers-le-bois','villiers-sous-praslin','voigny','vougrey',
      'eclance','etourvy',
    ],
  },
  {
    id: 'pays_othe',
    label: "Pays d'Othe",
    color: '#FF8C00',
    typeSol: 'Sol argileux limoneux, bocage, polyculture-élevage',
    keywords: [
      'aix-villemaur-palis','assenay','avon-la-peze','bercenay-en-othe','bercenay-le-hayer','bouilly','bucey-en-othe',
      'berulle','chamoy','chennegy','coursan-en-othe','courtaoult','cresantignes','davrey','dierrey-saint-julien',
      'dierrey-saint-pierre','eaux-puiseaux','ervy-le-chatel','estissac','faux-villecerf','fays-la-chapelle',
      'fontvannes','javernant','jeugny','les-croutes','lignieres','lirey','longeville-sur-mogne','machy',
      'maraye-en-othe','marigny-le-chatel','marolles-sous-lignieres','maupas','mesnil-saint-loup','messon','montfey',
      'montigny-les-monts','neuville-sur-vanne','nogent-en-othe','paisy-cosdon','planty','prugny','racines',
      'rigny-la-nonneuse','rigny-le-ferron','roncenay','saint-benoist-sur-vanne','saint-jean-de-bonneval',
      'saint-lupien','saint-mards-en-othe','saint-phal','soligny-les-etangs','sommeval','souligny','vauchassis',
      'villadin','villemoiron-en-othe','villeneuve-au-chemin','villery','vulaines',
    ],
  },
  {
    id: 'nogentais',
    label: 'Nogentais',
    color: '#E53935',
    typeSol: 'Limons profonds, polyculture intensive — vallée de la Seine',
    keywords: [
      'bourdenay','bouy-sur-orvin','charmoy','courceroy','crancey','fay-les-marcilly','ferreux-quincey',
      'fontaine-macon','fontenay-de-bossery','gumery','gelannes','la-fosse-corduan','la-louptiere-thenard',
      'la-motte-tilly','la-saulsotte','la-villeneuve-au-chatelot','le-meriot','marcilly-le-hayer','marnay-sur-seine',
      'montpothier','nogent-sur-seine','ossey-les-trois-maisons','pars-les-romilly','plessis-barbuise',
      'pont-sur-seine','pouy-sur-vannes','perigny-la-rose','romilly-sur-seine','saint-aubin',
      'saint-hilaire-sous-romilly','saint-loup-de-buffigny','saint-martin-de-bossenay','saint-nicolas-la-chapelle',
      'trancault','trainel','villeloup','villenauxe-la-grande','echemines',
    ],
  },
  {
    id: 'barrois',
    label: 'Barrois',
    color: '#9C27B0',
    typeSol: 'Argilo-calcaire, relief vallonné — élevage et cultures mixtes',
    keywords: [
      'arrelles','avirey-lingey','bagneux-la-fosse','balnot-la-grange','balnot-sur-laignes','bar-sur-seine',
      'bertignolles','bourguignons','bragelogne-beauvoir','buxeuil','buxieres-sur-arce','celles-sur-ource','chacenay',
      'champignol-lez-mondeville','channes','chauffour-les-bailly','chervey','courteron','cunfin','essoyes','fontette',
      'fralignes','gye-sur-seine','jully-sur-sarce','lagesse','landreville','les-granges','les-loges-margueron',
      'les-riceys','loches-sur-ource','magnant','marolles-les-bailly','merrey-sur-arce','metz-robert',
      'mussy-sur-seine','neuville-sur-seine','noe-les-mallets','pargues','plaines-saint-lange','poligny','polisot',
      'polisy','saint-usage','vallieres','vanlay','verpillieres-sur-ource','ville-sur-arce','villemorien',
      'virey-sous-bar','vitry-le-croise','viviers-sur-artaut','eguilly-sous-bois',
    ],
  },
];

/* Correspondance codes postaux → région (source : carte INSEE Aube) */
const CP_REGION = {
  '10000': 'champagne_crayeuse', // Troyes
  '10100': 'nogentais',          // Romilly-sur-Seine
  '10110': 'barrois',            // Bar-sur-Seine
  '10120': 'champagne_crayeuse', // Saint-André-les-Vergers
  '10130': 'champagne_crayeuse', // Auxon
  '10140': 'champagne_crayeuse', // Vendeuvre-sur-Barse
  '10150': 'champagne_crayeuse', // Charmont-sous-Barbuise
  '10160': 'pays_othe',          // Aix-en-Othe
  '10170': 'champagne_crayeuse', // Piney
  '10190': 'pays_othe',          // Estissac
  '10200': 'champagne_humide',   // Bar-sur-Aube
  '10210': 'champagne_humide',   // Chaource
  '10220': 'champagne_crayeuse', // Brienne area
  '10230': 'champagne_crayeuse', // Mailly-le-Camp
  '10240': 'nogentais',          // Romilly secteur sud
  '10250': 'barrois',            // Gyé-sur-Seine
  '10260': 'champagne_crayeuse', // Saint-Parres-aux-Tertres
  '10270': 'champagne_crayeuse', // Lusigny-sur-Barse
  '10300': 'champagne_crayeuse', // Saint-Flavy
  '10310': 'champagne_crayeuse', // Braux / Dampierre
  '10320': 'pays_othe',          // Bouilly
  '10330': 'pays_othe',          // Ervy-le-Châtel
  '10340': 'barrois',            // Les Riceys
  '10350': 'nogentais',          // Traînel / La Saulsotte
  '10360': 'barrois',            // Essoyes
  '10370': 'champagne_crayeuse', // Méry-sur-Seine
  '10380': 'barrois',            // Loches-sur-Ource / Verpillières
  '10390': 'champagne_crayeuse', // Sainte-Savine
  '10400': 'nogentais',          // Nogent-sur-Seine
  '10410': 'pays_othe',          // Saint-Loup-de-Buffigny
  '10420': 'champagne_crayeuse', // Rilly-Sainte-Syre
  '10430': 'champagne_crayeuse', // Rosières-près-Troyes
  '10440': 'champagne_crayeuse', // La Chapelle-Saint-Luc
  '10450': 'champagne_crayeuse', // Bréviandes
  '10460': 'champagne_crayeuse', // Torvilliers
  '10470': 'champagne_crayeuse', // Luyères
  '10480': 'champagne_crayeuse', // Radonvilliers / Dienville
  '10490': 'barrois',            // Mussy-sur-Seine
  '10500': 'champagne_crayeuse', // Brienne-le-Château
  '10510': 'champagne_crayeuse', // Dienville / Radonvilliers
  '10520': 'barrois',            // Les Loges-Margueron
};

const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['\s-]/g,'');

export function detectRegion(city, postCode) {
  if (!city && !postCode) return null;
  const cp = (postCode || '').toString().trim();

  // Must be Aube (10xxx)
  if (cp && !cp.startsWith('10')) return null;
  if (!cp.startsWith('10') && !city) return null;

  // 1. Keyword matching on commune name — takes priority over postcode
  // (administrative groupings don't always match agronomic regions)
  if (city) {
    const s = norm(city);
    for (const region of REGIONS_AUBE) {
      if (region.keywords.some(k => s.includes(norm(k)))) {
        return region;
      }
    }
  }

  // 2. Postcode lookup as fallback
  if (cp && CP_REGION[cp]) {
    const regionId = CP_REGION[cp];
    return REGIONS_AUBE.find(r => r.id === regionId) || null;
  }

  // 3. No default — unknown commune shows nothing rather than wrong region
  return null;
}
