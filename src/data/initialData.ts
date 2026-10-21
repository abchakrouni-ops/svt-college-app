import { AppDataState, CurriculumUnit, ClassRoom, Student, ScheduleSlot, CahierEntry, FichePedagogique, Evaluation, RemediationPlan, LibraryResource } from '../types';

export const OFFICIAL_CURRICULUM: CurriculumUnit[] = [
  // ================= 1AC =================
  {
    id: '1ac-u1',
    level: '1AC',
    semester: 'S1',
    number: 1,
    title: 'Unité 1 : Les relations entre les êtres vivants et leurs interactions avec le milieu naturel',
    totalHours: 32,
    chapters: [
      {
        id: '1ac-u1-ch1',
        code: 'CH 1',
        title: "Découverte d'un milieu naturel et notion de cellule",
        allocatedHours: 8,
        completedHours: 8,
        status: 'TERMINE',
        keyConcepts: ['Milieu naturel', 'Biotope et biocénose', 'Composantes vivantes et non vivantes', 'Microscope optique', 'Cellule végétale et animale', 'Unité structurale du vivant'],
        investigationSituations: [
          'Observation et inventaire sur le terrain dans le jardin du collège ou un milieu local.',
          'Réalisation d’une préparation microscopique d’épiderme d’oignon et de cellules buccales pour découvrir l’unité cellulaire.'
        ]
      },
      {
        id: '1ac-u1-ch2',
        code: 'CH 2',
        title: 'La respiration dans différents milieux de vie',
        allocatedHours: 8,
        completedHours: 8,
        status: 'TERMINE',
        keyConcepts: ['Échanges gazeux respiratoires', 'Eau de chaux & dioxyde de carbone', 'Oxymètre & dioxygène', 'Respiration pulmonaire', 'Respiration trachéenne (criquet)', 'Respiration branchiale (poisson)', 'Respiration cutanée'],
        investigationSituations: [
          'Mise en évidence expérimentale des échanges respiratoires chez l’Homme et les végétaux.',
          'Dissection et observation de branchies de poisson et de trachées d’insecte au microscope.'
        ]
      },
      {
        id: '1ac-u1-ch3',
        code: 'CH 3',
        title: 'L’alimentation chez les êtres vivants et réseaux trophiques',
        allocatedHours: 10,
        completedHours: 6,
        status: 'EN_COURS',
        keyConcepts: ['Régime omnivore', 'Régime herbivore & carnivore', 'Formule dentaire', 'Tube digestif comparé', 'Chaîne alimentaire', 'Réseau trophique', 'Producteurs primaires', 'Niveaux trophiques'],
        investigationSituations: [
          'Comparaison anatomique du crâne et du tube digestif d’un carnivore (chat/chien) et d’un herbivore (lapin/vache).',
          'Construction d’un réseau trophique à partir de l’analyse de pelotes de réjection de chouette.'
        ]
      },
      {
        id: '1ac-u1-ch4',
        code: 'CH 4',
        title: 'Classification des êtres vivants et équilibres naturels',
        allocatedHours: 6,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Clé de détermination', 'Critères de classification emboîtée', 'Biodiversité', 'Impact des activités humaines', 'Protection des écosystèmes'],
        investigationSituations: [
          'Utilisation d’une clé dichotomique pour identifier des arthropodes collectés.',
          'Étude d’impact d’un aménagement local sur l’équilibre de la faune et de la flore.'
        ]
      }
    ]
  },
  {
    id: '1ac-u2',
    level: '1AC',
    semester: 'S2',
    number: 2,
    title: 'Unité 2 : Les phénomènes géologiques externes',
    totalHours: 32,
    chapters: [
      {
        id: '1ac-u2-ch1',
        code: 'CH 1',
        title: 'Érosion et altération des roches',
        allocatedHours: 6,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Érosion mécanique', 'Altération chimique', 'Action de l’eau et du gel', 'Modelé du paysage marocain (ex: cascades d’Ouzoud, gorges du Dadès)'],
        investigationSituations: ['Comparaison d’un granite sain et d’un granite altéré (arène granitique).']
      },
      {
        id: '1ac-u2-ch2',
        code: 'CH 2',
        title: 'Transport des produits de l’érosion',
        allocatedHours: 6,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Agents de transport (eau, vent)', 'Diagramme de Hjulström', 'Granulométrie', 'Morphoscopie des grains de quartz (non usés, émoussés luisants, ronds mats)'],
        investigationSituations: ['Observation à la loupe binoculaire des grains de quartz de rivière et de dune saharienne.']
      },
      {
        id: '1ac-u2-ch3',
        code: 'CH 3',
        title: 'La sédimentation et milieux de sédimentation',
        allocatedHours: 6,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Sédimentation fluviatile', 'Sédimentation lacustre', 'Sédimentation marine', 'Strates géologiques'],
        investigationSituations: ['Modélisation expérimentale du dépôt sédimentaire dans une éprouvette à sédimentation.']
      },
      {
        id: '1ac-u2-ch4',
        code: 'CH 4',
        title: 'La diagénèse et la formation des roches sédimentaires',
        allocatedHours: 4,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Compaction', 'Cimentation', 'Déshydratation', 'Gypse, calcaire, grès, phosphates du Maroc'],
        investigationSituations: ['Étude du calcaire sédimentaire et réaction à l’acide chlorhydrique (HCl).']
      },
      {
        id: '1ac-u2-ch5',
        code: 'CH 5',
        title: 'Les fossiles et l’échelle des temps géologiques',
        allocatedHours: 6,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Fossilisation', 'Fossile de faciès', 'Fossile stratigraphique (Ammonites, Trilobites)', 'Principes de la stratigraphie', 'Échelle des temps'],
        investigationSituations: ['Datation relative de strates géologiques fossilifères marocaines (région d’Erfoud / Khouribga).']
      },
      {
        id: '1ac-u2-ch6',
        code: 'CH 6',
        title: 'Les ressources en eau et leur préservation',
        allocatedHours: 4,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Nappe phréatique', 'Perméabilité et porosité', 'Cycle de l’eau au Maroc', 'Gestion durable des barrages et de l’eau'],
        investigationSituations: ['Calcul du débit et de la perméabilité d’un sol sableux vs un sol argileux.']
      }
    ]
  },

  // ================= 2AC =================
  {
    id: '2ac-u1',
    level: '2AC',
    semester: 'S1',
    number: 1,
    title: 'Unité 1 : Les phénomènes géologiques internes',
    totalHours: 32,
    chapters: [
      {
        id: '2ac-u1-ch1',
        code: 'CH 1',
        title: 'La théorie de la tectonique des plaques',
        allocatedHours: 8,
        completedHours: 8,
        status: 'TERMINE',
        keyConcepts: ['Dérive des continents (Wegener)', 'Arguments morphologiques, paléontologiques, pétrographiques', 'Expansion des fonds océaniques', 'Plaques lithosphériques', 'Limites de plaques convergentes et divergentes'],
        investigationSituations: [
          'Analyse des arguments d’Alfred Wegener à partir de cartes paléogéographiques mondiales.',
          'Mesure par GPS du déplacement relatif des plaques lithosphériques africaine et eurasienne.'
        ]
      },
      {
        id: '2ac-u1-ch2',
        code: 'CH 2',
        title: 'Les séismes et leur relation avec la tectonique des plaques',
        allocatedHours: 6,
        completedHours: 6,
        status: 'TERMINE',
        keyConcepts: ['Foyer et épicentre', 'Ondes sismiques P, S et L', 'Sismogramme', 'Failles actives', 'Séisme d’Al Hoceïma et séisme d’Al Haouz (2023)', 'Dorsales et zones de subduction'],
        investigationSituations: [
          'Exploitation de données accélérométriques et de sismogrammes enregistrés lors de séismes marocains.',
          'Localisation de l’épicentre d’un séisme par la méthode des cercles isoséistes.'
        ]
      },
      {
        id: '2ac-u1-ch3',
        code: 'CH 3',
        title: 'Le volcanisme et sa relation avec la tectonique des plaques',
        allocatedHours: 6,
        completedHours: 4,
        status: 'EN_COURS',
        keyConcepts: ['Volcanisme effusif (hawaïen)', 'Volcanisme explosif (péléen)', 'Viscosité de la lave & teneur en gaz', 'Zones de divergence (dorsales)', 'Zones de subduction (ceinture de feu)'],
        investigationSituations: [
          'Comparaison expérimentale de la viscosité de deux liquides (eau vs purée/glycérine) pour modéliser le comportement de la lave.',
          'Analyse de la répartition mondiale des volcans actifs en superposition avec les plaques.'
        ]
      },
      {
        id: '2ac-u1-ch4',
        code: 'CH 4',
        title: 'La formation des roches magmatiques',
        allocatedHours: 6,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Roche volcanique (basalte)', 'Roche plutonique (granite)', 'Texture microlitique vs texture grenue', 'Vitesse de refroidissement du magma', 'Cristallisation fractionnée'],
        investigationSituations: [
          'Observation au microscope polarisant de lames minces de granite et de basalte.',
          'Modélisation expérimentale de la cristallisation du soufre ou de vanilline selon la vitesse de refroidissement.'
        ]
      },
      {
        id: '2ac-u1-ch5',
        code: 'CH 5',
        title: 'Les déformations tectoniques et la formation des chaînes de montagnes',
        allocatedHours: 6,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Plis (anticlinal, synclinal)', 'Failles normales et inverses', 'Forces compressives et distensives', 'Chaînes de subduction', 'Chaînes de collision (Chaîne de l’Atlas, Rif, Alpes)'],
        investigationSituations: [
          'Modélisation des plis et failles à l’aide de couches d’argile et de pâte à modeler colorée.',
          'Reconstitution des étapes de collision ayant formé les montagnes du Rif et du Haut Atlas.'
        ]
      }
    ]
  },
  {
    id: '2ac-u2',
    level: '2AC',
    semester: 'S2',
    number: 2,
    title: 'Unité 2 : La reproduction chez les êtres vivants et l’hérédité humaine',
    totalHours: 32,
    chapters: [
      {
        id: '2ac-u2-ch1',
        code: 'CH 1',
        title: 'La reproduction sexuée chez les animaux',
        allocatedHours: 8,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Gamètes mâle et femelle', 'Fécondation interne et externe', 'Oviparité et viviparité', 'Développement direct et indirect (métamorphose de la grenouille/papillon)'],
        investigationSituations: ['Mise en évidence de la fécondation chez l’oursin ou la truite à partir de protocoles expérimentaux.']
      },
      {
        id: '2ac-u2-ch2',
        code: 'CH 2',
        title: 'La reproduction chez les végétaux',
        allocatedHours: 8,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Structure de la fleur', 'Pollinisation', 'Germination du grain de pollen', 'Transformation de la fleur en fruit', 'Multiplication végétative asexuée (bouturage, marcottage, bulbes)'],
        investigationSituations: ['Dissection d’une fleur locale (ex: fleur de moutarde ou d’hibiscus) et réalisation de son diagramme floral.']
      },
      {
        id: '2ac-u2-ch3',
        code: 'CH 3',
        title: 'La reproduction chez l’Homme',
        allocatedHours: 10,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Puberté et caractères sexuels', 'Appareil reproducteur masculin et spermatogenèse', 'Appareil reproducteur féminin et ovogenèse', 'Cycle ovarien et cycle utérin', 'Fécondation, nidation et grossesse', 'Accouchement et allaitement', 'Contraception'],
        investigationSituations: [
          'Analyse de graphiques d’évolution des hormones sexuelles au cours du cycle de 28 jours.',
          'Étude des modes d’action des différents contraceptifs (préservatif, pilule oestroprogestative).'
        ]
      },
      {
        id: '2ac-u2-ch4',
        code: 'CH 4',
        title: 'L’hérédité humaine et la génétique',
        allocatedHours: 6,
        completedHours: 0,
        status: 'A_VENIR',
        keyConcepts: ['Caractères héréditaires et acquis', 'Noyau cellulaire et chromosomes', 'Caryotype humain (46 chromosomes, 23 paires, XX/XY)', 'Anomalies chromosomiques (Trisomie 21)', 'Arbres généalogiques et transmission de maladies héréditaires'],
        investigationSituations: [
          'Analyse et appariement de chromosomes pour construire un caryotype humain normal et trisomique.',
          'Résolution d’un arbre généalogique de transmission d’une anomalie (ex: daltonisme ou drépanocytose).'
        ]
      }
    ]
  }
];

export const INITIAL_CLASSES: ClassRoom[] = [
  { id: 'c-1ac-1', name: '1AC-1', level: '1AC', academicYear: '2025/2026', roomName: 'Salle SVT 1', studentCount: 16 },
  { id: 'c-1ac-2', name: '1AC-2', level: '1AC', academicYear: '2025/2026', roomName: 'Salle SVT 1', studentCount: 16 },
  { id: 'c-2ac-1', name: '2AC-1', level: '2AC', academicYear: '2025/2026', roomName: 'Labo Sciences', studentCount: 16 },
  { id: 'c-2ac-2', name: '2AC-2', level: '2AC', academicYear: '2025/2026', roomName: 'Labo Sciences', studentCount: 16 }
];

export const INITIAL_STUDENTS: Student[] = [
  // 1AC-1
  { id: 's1', classId: 'c-1ac-1', massarCode: 'K131092001', lastName: 'El Amrani', firstName: 'Yassine', gender: 'M', group: 'G1', birthDate: '2012-04-12', parentPhone: '0661234567', medicalNotes: 'Aucune' },
  { id: 's2', classId: 'c-1ac-1', massarCode: 'K131092002', lastName: 'Benali', firstName: 'Salma', gender: 'F', group: 'G1', birthDate: '2012-08-23', parentPhone: '0662345678', medicalNotes: 'Port de lunettes' },
  { id: 's3', classId: 'c-1ac-1', massarCode: 'K131092003', lastName: 'Chakrouni', firstName: 'Mehdi', gender: 'M', group: 'G1', birthDate: '2012-01-15', parentPhone: '0663456789' },
  { id: 's4', classId: 'c-1ac-1', massarCode: 'K131092004', lastName: 'Idrissi', firstName: 'Kenza', gender: 'F', group: 'G1', birthDate: '2012-11-05', parentPhone: '0664567890' },
  { id: 's5', classId: 'c-1ac-1', massarCode: 'K131092005', lastName: 'Berrada', firstName: 'Omar', gender: 'M', group: 'G1', birthDate: '2012-03-30', parentPhone: '0665678901' },
  { id: 's6', classId: 'c-1ac-1', massarCode: 'K131092006', lastName: 'Alaoui', firstName: 'Fatima-Zahra', gender: 'F', group: 'G1', birthDate: '2012-07-19', parentPhone: '0666789012' },
  { id: 's7', classId: 'c-1ac-1', massarCode: 'K131092007', lastName: 'Mansouri', firstName: 'Adam', gender: 'M', group: 'G1', birthDate: '2012-09-14', parentPhone: '0667890123' },
  { id: 's8', classId: 'c-1ac-1', massarCode: 'K131092008', lastName: 'Touhami', firstName: 'Aya', gender: 'F', group: 'G1', birthDate: '2012-05-22', parentPhone: '0668901234' },
  
  { id: 's9', classId: 'c-1ac-1', massarCode: 'K131092009', lastName: 'Zouhairi', firstName: 'Hamza', gender: 'M', group: 'G2', birthDate: '2012-02-18', parentPhone: '0669012345' },
  { id: 's10', classId: 'c-1ac-1', massarCode: 'K131092010', lastName: 'Ouazzani', firstName: 'Rim', gender: 'F', group: 'G2', birthDate: '2012-10-10', parentPhone: '0670123456' },
  { id: 's11', classId: 'c-1ac-1', massarCode: 'K131092011', lastName: 'Daoudi', firstName: 'Anas', gender: 'M', group: 'G2', birthDate: '2012-06-08', parentPhone: '0671234567' },
  { id: 's12', classId: 'c-1ac-1', massarCode: 'K131092012', lastName: 'Tazi', firstName: 'Hiba', gender: 'F', group: 'G2', birthDate: '2012-12-01', parentPhone: '0672345678' },
  { id: 's13', classId: 'c-1ac-1', massarCode: 'K131092013', lastName: 'Fassi', firstName: 'Mohamed', gender: 'M', group: 'G2', birthDate: '2012-04-03', parentPhone: '0673456789' },
  { id: 's14', classId: 'c-1ac-1', massarCode: 'K131092014', lastName: 'Bennani', firstName: 'Lina', gender: 'F', group: 'G2', birthDate: '2012-08-16', parentPhone: '0674567890' },
  { id: 's15', classId: 'c-1ac-1', massarCode: 'K131092015', lastName: 'Naciri', firstName: 'Rayane', gender: 'M', group: 'G2', birthDate: '2012-09-29', parentPhone: '0675678901' },
  { id: 's16', classId: 'c-1ac-1', massarCode: 'K131092016', lastName: 'Slaoui', firstName: 'Zineb', gender: 'F', group: 'G2', birthDate: '2012-03-05', parentPhone: '0676789012' },

  // 2AC-1
  { id: 's17', classId: 'c-2ac-1', massarCode: 'K132085001', lastName: 'Boukhriss', firstName: 'Sami', gender: 'M', group: 'G1', birthDate: '2011-03-14', parentPhone: '0661112233' },
  { id: 's18', classId: 'c-2ac-1', massarCode: 'K132085002', lastName: 'Rhazi', firstName: 'Nour', gender: 'F', group: 'G1', birthDate: '2011-07-25', parentPhone: '0662223344' },
  { id: 's19', classId: 'c-2ac-1', massarCode: 'K132085003', lastName: 'Jad', firstName: 'Ayoub', gender: 'M', group: 'G1', birthDate: '2011-10-11', parentPhone: '0663334455' },
  { id: 's20', classId: 'c-2ac-1', massarCode: 'K132085004', lastName: 'Kabbaj', firstName: 'Malak', gender: 'F', group: 'G1', birthDate: '2011-01-20', parentPhone: '0664445566' },
  { id: 's21', classId: 'c-2ac-1', massarCode: 'K132085005', lastName: 'Filali', firstName: 'Othmane', gender: 'M', group: 'G1', birthDate: '2011-05-18', parentPhone: '0665556677' },
  { id: 's22', classId: 'c-2ac-1', massarCode: 'K132085006', lastName: 'Kettani', firstName: 'Marwa', gender: 'F', group: 'G1', birthDate: '2011-09-02', parentPhone: '0666667788' },
  { id: 's23', classId: 'c-2ac-1', massarCode: 'K132085007', lastName: 'Taoufik', firstName: 'Walid', gender: 'M', group: 'G1', birthDate: '2011-12-14', parentPhone: '0667778899' },
  { id: 's24', classId: 'c-2ac-1', massarCode: 'K132085008', lastName: 'Belkadi', firstName: 'Douae', gender: 'F', group: 'G1', birthDate: '2011-04-28', parentPhone: '0668889900' },

  { id: 's25', classId: 'c-2ac-1', massarCode: 'K132085009', lastName: 'Gharbi', firstName: 'Amine', gender: 'M', group: 'G2', birthDate: '2011-06-30', parentPhone: '0669990011' },
  { id: 's26', classId: 'c-2ac-1', massarCode: 'K132085010', lastName: 'Lahlou', firstName: 'Imane', gender: 'F', group: 'G2', birthDate: '2011-08-15', parentPhone: '0671112233' },
  { id: 's27', classId: 'c-2ac-1', massarCode: 'K132085011', lastName: 'Bari', firstName: 'Ilyas', gender: 'M', group: 'G2', birthDate: '2011-02-09', parentPhone: '0672223344' },
  { id: 's28', classId: 'c-2ac-1', massarCode: 'K132085012', lastName: 'Senhaji', firstName: 'Rania', gender: 'F', group: 'G2', birthDate: '2011-11-23', parentPhone: '0673334455' },
  { id: 's29', classId: 'c-2ac-1', massarCode: 'K132085013', lastName: 'Cherkaoui', firstName: 'Taha', gender: 'M', group: 'G2', birthDate: '2011-05-04', parentPhone: '0674445566' },
  { id: 's30', classId: 'c-2ac-1', massarCode: 'K132085014', lastName: 'Hassani', firstName: 'Safae', gender: 'F', group: 'G2', birthDate: '2011-07-12', parentPhone: '0675556677' },
  { id: 's31', classId: 'c-2ac-1', massarCode: 'K132085015', lastName: 'Zaki', firstName: 'Saad', gender: 'M', group: 'G2', birthDate: '2011-10-03', parentPhone: '0676667788' },
  { id: 's32', classId: 'c-2ac-1', massarCode: 'K132085016', lastName: 'Bousbaa', firstName: 'Khadija', gender: 'F', group: 'G2', birthDate: '2011-01-17', parentPhone: '0677778899' }
];

export const INITIAL_SCHEDULE: ScheduleSlot[] = [
  // Lundi
  { id: 'sch-1', dayOfWeek: 'Lundi', timeSlot: '08h30 - 10h20', classId: 'c-1ac-1', group: 'G1', room: 'Labo Sciences', note: 'Séance TP - Dédoublement' },
  { id: 'sch-2', dayOfWeek: 'Lundi', timeSlot: '10h40 - 12h30', classId: 'c-1ac-1', group: 'G2', room: 'Labo Sciences', note: 'Séance TP - Dédoublement' },
  { id: 'sch-3', dayOfWeek: 'Lundi', timeSlot: '14h30 - 16h20', classId: 'c-2ac-1', group: 'CE', room: 'Salle SVT 1', note: 'Cours théorique & investigation' },

  // Mardi
  { id: 'sch-4', dayOfWeek: 'Mardi', timeSlot: '08h30 - 10h20', classId: 'c-2ac-2', group: 'G1', room: 'Labo Sciences', note: 'Séance TP - Dédoublement' },
  { id: 'sch-5', dayOfWeek: 'Mardi', timeSlot: '10h40 - 12h30', classId: 'c-2ac-2', group: 'G2', room: 'Labo Sciences', note: 'Séance TP - Dédoublement' },

  // Mercredi
  { id: 'sch-6', dayOfWeek: 'Mercredi', timeSlot: '08h30 - 10h20', classId: 'c-1ac-2', group: 'CE', room: 'Salle SVT 1', note: 'Cours interactif' },
  { id: 'sch-7', dayOfWeek: 'Mercredi', timeSlot: '10h40 - 12h30', classId: 'c-2ac-1', group: 'G1', room: 'Labo Sciences', note: 'Séance TP - Dédoublement' },

  // Jeudi
  { id: 'sch-8', dayOfWeek: 'Jeudi', timeSlot: '14h30 - 16h20', classId: 'c-2ac-1', group: 'G2', room: 'Labo Sciences', note: 'Séance TP - Dédoublement' },
  { id: 'sch-9', dayOfWeek: 'Jeudi', timeSlot: '16h40 - 18h30', classId: 'c-1ac-1', group: 'CE', room: 'Salle SVT 1', note: 'Synthèse & exercices' },

  // Vendredi
  { id: 'sch-10', dayOfWeek: 'Vendredi', timeSlot: '08h30 - 10h20', classId: 'c-1ac-2', group: 'G1', room: 'Labo Sciences', note: 'Séance TP - Dédoublement' },
  { id: 'sch-11', dayOfWeek: 'Vendredi', timeSlot: '10h40 - 12h30', classId: 'c-1ac-2', group: 'G2', room: 'Labo Sciences', note: 'Séance TP - Dédoublement' },

  // Samedi
  { id: 'sch-12', dayOfWeek: 'Samedi', timeSlot: '08h30 - 10h20', classId: 'c-2ac-2', group: 'CE', room: 'Salle SVT 1', note: 'Évaluation & soutien pédagogique' }
];

export const INITIAL_CAHIER: CahierEntry[] = [
  {
    id: 'cahier-1',
    classId: 'c-1ac-1',
    level: '1AC',
    group: 'G1',
    date: '2026-10-19',
    timeSlot: '08h30 - 10h20',
    unitId: '1ac-u1',
    chapterId: '1ac-u1-ch3',
    title: 'Comparaison des régimes alimentaires carnivore et herbivore',
    activities: 'Observation et manipulation de crânes de chat et de lapin. Établissement des formules dentaires respectives. Comparaison de la longueur des intestins.',
    documents: 'Manuel de SVT 1AC page 34-36 + Moulages crâniens du laboratoire SVT.',
    homework: 'Tracer le tableau récapitulatif comparant la dentition du carnivore et de l’herbivore sur le cahier de cours.',
    homeworkDueDate: '2026-10-22',
    status: 'FAIT'
  },
  {
    id: 'cahier-2',
    classId: 'c-1ac-1',
    level: '1AC',
    group: 'G2',
    date: '2026-10-19',
    timeSlot: '10h40 - 12h30',
    unitId: '1ac-u1',
    chapterId: '1ac-u1-ch3',
    title: 'Comparaison des régimes alimentaires carnivore et herbivore',
    activities: 'Observation et manipulation de crânes de chat et de lapin. Établissement des formules dentaires respectives. Comparaison de la longueur des intestins.',
    documents: 'Manuel de SVT 1AC page 34-36 + Moulages crâniens du laboratoire SVT.',
    homework: 'Tracer le tableau récapitulatif comparant la dentition du carnivore et de l’herbivore sur le cahier de cours.',
    homeworkDueDate: '2026-10-22',
    status: 'FAIT'
  },
  {
    id: 'cahier-3',
    classId: 'c-2ac-1',
    level: '2AC',
    group: 'CE',
    date: '2026-10-19',
    timeSlot: '14h30 - 16h20',
    unitId: '2ac-u1',
    chapterId: '2ac-u1-ch3',
    title: 'Les différents types d’éruptions volcaniques',
    activities: 'Visionnage d’extraits vidéo sur l’éruption de la Soufrière (explosif) et du Kilauea (effusif). Expérience de modélisation de la viscosité avec de l’eau et de la purée sous pression gazeuse.',
    documents: 'Vidéoprojecteur, capsules didactiques, document polycopié n°4.',
    homework: 'Compléter le schéma du volcan avec légende (cratère, cheminée, chambre magmatique, cône volcanique).',
    homeworkDueDate: '2026-10-21',
    status: 'FAIT'
  },
  {
    id: 'cahier-4',
    classId: 'c-2ac-1',
    level: '2AC',
    group: 'G1',
    date: '2026-10-21',
    timeSlot: '10h40 - 12h30',
    unitId: '2ac-u1',
    chapterId: '2ac-u1-ch3',
    title: 'TP : Volcanisme et géodynamique des limites de plaques',
    activities: 'Cartographie mondiale des volcans actifs et confrontation avec la carte des dorsales et des fosses océaniques.',
    documents: 'Logiciel de modélisation / Planche tectonique mondiale.',
    homework: 'Préparer la fiche de synthèse sur la relation subduction / volcanisme explosif.',
    homeworkDueDate: '2026-10-28',
    status: 'PLANIFIE'
  }
];

export const INITIAL_FICHES: FichePedagogique[] = [
  {
    id: 'fiche-1',
    title: 'Découverte de l’unité cellulaire chez les êtres vivants',
    level: '1AC',
    unit: 'Unité 1 : Les relations entre les êtres vivants et leur milieu',
    chapter: 'Chapitre 1 : Découverte d’un milieu naturel',
    duration: '2 heures (Séance TP en dédoublement)',
    targetCompetencies: [
      'Maîtriser l’utilisation du microscope optique à différents grossissements.',
      'Réaliser une préparation microscopique végétale (épiderme d’oignon avec rouge neutre ou eau).',
      'Produire un dessin d’observation scientifique normé avec titre, légende et échelle.'
    ],
    prerequisites: [
      'Notion d’être vivant (végétaux, animaux, micro-organismes).',
      'Distinction entre le vivant et le non-vivant.'
    ],
    learningObjectives: [
      'Identifier les trois constituants fondamentaux de la cellule : membrane plasmique, cytoplasme, noyau.',
      'Constater que tous les êtres vivants (animaux, végétaux, protozoaires) sont constitués d’une ou plusieurs cellules.',
      'Déduire la notion de cellule comme unité structurale et fonctionnelle de tous les êtres vivants.'
    ],
    didacticMaterials: [
      'Microscopes optiques de laboratoire.',
      'Oignons frais, pinces fines, bistouris, lames et lamelles.',
      'Colorant (rouge neutre ou bleu de méthylène), compte-gouttes, papier absorbant.',
      'Planche didactique et grille d’évaluation du dessin d’observation.'
    ],
    startingProblem: 'Les êtres vivants présentent une incroyable diversité morphologique externe (arbres, insectes, vertébrés, champignons). Pourtant, les biologistes affirment qu’ils partagent tous une même unité de structure fondamentale invisible à l’œil nu. Comment observer cette unité et de quoi est-elle constituée ?',
    phases: [
      {
        stage: '1. Situation déclenchante & Problématisation',
        teacherActivity: 'Projette des images d’organismes vivants variés et pose la question directrice. Amène les élèves à formuler des hypothèses sur la structure intime des tissus.',
        studentActivity: 'Observent les documents, expriment leurs représentations initiales et notent le problème scientifique sur leur cahier.',
        duration: '15 min',
        modality: 'Collectif'
      },
      {
        stage: '2. Démarche d’investigation & Manipulation TP',
        teacherActivity: 'Présente la fiche technique d’utilisation du microscope et la technique de prélèvement d’un fragment transparent d’épiderme d’oignon. Guide et sécurise la manipulation.',
        studentActivity: 'En binômes : réalisent le montage entre lame et lamelle, effectuent la mise au point au faible puis fort grossissement, identifient les structures visibles.',
        duration: '50 min',
        modality: 'Binômes en laboratoire'
      },
      {
        stage: '3. Structuration & Trace écrite',
        teacherActivity: 'Anime la mise en commun des observations. Valide les éléments légendés au tableau (noyau, cytoplasme, membrane, paroi pour la cellule végétale).',
        studentActivity: 'Réalisent le dessin d’observation légendé et rédigent la synthèse collective : la cellule est l’unité fondamentale du vivant.',
        duration: '35 min',
        modality: 'Individuel et collectif'
      },
      {
        stage: '4. Évaluation formative',
        teacherActivity: 'Vérifie les critères du dessin (trait continu, légende alignée, titre complet, échelle) à l’aide d’une grille critériée.',
        studentActivity: 'Auto-évaluation du dessin d’observation selon la grille de critères.',
        duration: '20 min',
        modality: 'Individuel'
      }
    ],
    writtenTrace: 'Bilan : Tous les êtres vivants sont constitués d’éléments microscopiques appelés cellules. Une cellule comprend au minimum une membrane plasmique, un cytoplasme et un noyau (la cellule végétale possède en plus une paroi squelettique). Les êtres vivants formés d’une seule cellule sont des unicellulaires (ex : paramécie), ceux formés de plusieurs cellules sont des pluricellulaires (ex : végétaux, animaux, Homme). La cellule est donc l’unité de base de tout être vivant.',
    formativeAssessment: 'Exercice rapide : Identifier sur trois micrographies différentes (cellule de feuille d’élodée, cellule épithéliale humaine, bactérie) les éléments communs et classifier les organismes.',
    createdAt: '2026-09-15',
    updatedAt: '2026-10-18'
  },
  {
    id: 'fiche-2',
    title: 'Les séismes et la structure interne du globe',
    level: '2AC',
    unit: 'Unité 1 : Les phénomènes géologiques internes',
    chapter: 'Chapitre 2 : Les séismes et la tectonique des plaques',
    duration: '2 heures',
    targetCompetencies: [
      'Analyser un sismogramme pour extraire l’heure d’arrivée des ondes P et S.',
      'Mettre en relation la rupture brutale des roches en profondeur avec l’émission d’ondes sismiques.',
      'Expliquer l’origine des séismes dans le contexte des limites de plaques lithosphériques.'
    ],
    prerequisites: [
      'Notion de plaque lithosphérique et mouvement relatif des plaques.',
      'Manifestations superficielles d’un séisme (secousses, dégâts, intensité MSK).'
    ],
    learningObjectives: [
      'Distinguer le foyer (hypocentre) de l’épicentre.',
      'Comprendre la propagation des ondes sismiques à travers le globe terrestre.',
      'Établir le lien direct entre les failles géologiques actives et la sismicité au Maroc (failles du Rif et du Haut-Atlas).'
    ],
    didacticMaterials: [
      'Sismogrammes réels enregistrés lors du séisme d’Al Haouz (8 septembre 2023) et d’Al Hoceïma.',
      'Bloc-diagramme géologique démontrant le jeu d’une faille normale et inverse.',
      'Vidéoprojecteur et carte sismotectonique du Maroc (Institut National de Géophysique).'
    ],
    startingProblem: 'Le 8 septembre 2023, un puissant séisme a frappé la région d’Al Haouz au Maroc, causant d’importantes secousses ressenties jusqu’à Marrakech, Casablanca et Rabat. Comment se déclenche un tremblement de terre à des kilomètres sous terre, et comment cette énergie se propage-t-elle jusqu’aux habitations ?',
    phases: [
      {
        stage: '1. Phase d’accroche & Situation-problème',
        teacherActivity: 'Affiche la carte des intensités macrosismiques du séisme d’Al Haouz et des témoignages.',
        studentActivity: 'Constatent que les dégâts sont maximaux en une zone centrale et diminuent avec l’éloignement.',
        duration: '20 min',
        modality: 'Collectif'
      },
      {
        stage: '2. Investigation documentaire & Analyse de sismogrammes',
        teacherActivity: 'Distribue les enregistrements de stations sismiques (Rabat, Marrakech, Ifrane). Guide le repérage des ondes P (premières, compression) et des ondes S (secondes, cisaillement).',
        studentActivity: 'Mesurent l’intervalle de temps (tS - tP) pour déterminer la distance de chaque station à l’épicentre.',
        duration: '45 min',
        modality: 'Binômes'
      },
      {
        stage: '3. Modélisation de la rupture de faille',
        teacherActivity: 'Réalise l’expérience avec un bloc de polystyrène ou de roche soumis à des contraintes croissantes jusqu’à rupture brutale.',
        studentActivity: 'Relient la contrainte tectonique continue à l’accumulation d’énergie élastique libérée brutalement lors de la rupture.',
        duration: '30 min',
        modality: 'Collectif / Débat'
      },
      {
        stage: '4. Synthèse et institutionnalisation',
        teacherActivity: 'Structuration du schéma bilan : contraintes tectoniques -> accumulation d’énergie -> rupture au foyer (faille) -> ondes sismiques omnidirectionnelles -> dégâts maximaux à l’épicentre.',
        studentActivity: 'Copient le schéma bilan fonctionnel et le paragraphe récapitulatif.',
        duration: '25 min',
        modality: 'Individuel'
      }
    ],
    writtenTrace: 'Bilan : Sous l’effet des mouvements des plaques tectoniques, les roches de la lithosphère sont soumises à de fortes contraintes continues. L’énergie s’accumule jusqu’à dépasser la limite de résistance de la roche : il se produit une cassure brutale au niveau d’une faille. Le point d’origine de la rupture est le foyer (ou hypocentre). La rupture libère une grande quantité d’énergie sous forme d’ondes sismiques qui se propagent dans toutes les directions. L’épicentre est le point de la surface terrestre situé à la verticale du foyer, où les secousses et les dégâts sont les plus intenses.',
    formativeAssessment: 'Calculer la vitesse moyenne des ondes P sachant qu’elles ont mis 18 secondes à parcourir 108 kilomètres.',
    createdAt: '2026-09-20',
    updatedAt: '2026-10-15'
  }
];

export const INITIAL_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval-1',
    classId: 'c-1ac-1',
    semester: 'S1',
    type: 'CC1',
    title: 'Contrôle Continu n°1 : Milieu naturel & Respiration',
    date: '2026-10-10',
    coefficient: 1,
    maxScore: 20,
    grades: {
      s1: 16.5,
      s2: 18.0,
      s3: 14.0,
      s4: 17.5,
      s5: 11.0,
      s6: 15.5,
      s7: 9.5,
      s8: 13.0,
      s9: 12.0,
      s10: 16.0,
      s11: 8.5,
      s12: 14.5,
      s13: 10.0,
      s14: 15.0,
      s15: 7.5,
      s16: 13.5
    },
    absentees: []
  },
  {
    id: 'eval-2',
    classId: 'c-1ac-1',
    semester: 'S1',
    type: 'ACTIVITES_TP',
    title: 'Note d’activités intégrées, TP & Assiduité (S1)',
    date: '2026-10-18',
    coefficient: 1,
    maxScore: 20,
    grades: {
      s1: 17.0,
      s2: 19.0,
      s3: 15.0,
      s4: 18.0,
      s5: 12.0,
      s6: 16.0,
      s7: 11.0,
      s8: 14.0,
      s9: 13.0,
      s10: 17.0,
      s11: 10.0,
      s12: 15.0,
      s13: 11.0,
      s14: 16.0,
      s15: 9.0,
      s16: 14.0
    },
    absentees: []
  },
  {
    id: 'eval-3',
    classId: 'c-2ac-1',
    semester: 'S1',
    type: 'CC1',
    title: 'Contrôle Continu n°1 : Tectonique des plaques & Séismes',
    date: '2026-10-12',
    coefficient: 1,
    maxScore: 20,
    grades: {
      s17: 15.0,
      s18: 18.5,
      s19: 13.0,
      s20: 17.0,
      s21: 12.0,
      s22: 16.5,
      s23: 8.0,
      s24: 14.0,
      s25: 11.5,
      s26: 16.0,
      s27: 9.0,
      s28: 15.5,
      s29: 13.0,
      s30: 17.5,
      s31: 7.0,
      s32: 14.5
    },
    absentees: []
  }
];

export const INITIAL_REMEDIATIONS: RemediationPlan[] = [
  {
    id: 'rem-1',
    title: 'Remédiation : Maîtrise du dessin d’observation microscopique normé',
    level: '1AC',
    domain: 'SCHEMA_DESSIN',
    description: 'Plusieurs élèves éprouvent des difficultés à respecter les normes académiques du dessin scientifique (traits hachurés au lieu d’un trait net et continu, flèches non horizontales, absence de titre ou de grossissement).',
    targetStudents: [
      { studentId: 's7', studentName: 'Adam Mansouri', classId: 'c-1ac-1', initialObservation: 'Dessin à la règle non respecté pour les flèches, trait imprécis.', outcomeStatus: 'EN_COURS' },
      { studentId: 's11', studentName: 'Anas Daoudi', classId: 'c-1ac-1', initialObservation: 'Omission systématique du grossissement et du titre complet.', outcomeStatus: 'ACQUIS' },
      { studentId: 's15', studentName: 'Rayane Naciri', classId: 'c-1ac-1', initialObservation: 'Schéma approximatif ne distinguant pas membrane et paroi végétale.', outcomeStatus: 'NON_ACQUIS' }
    ],
    plannedActivities: 'Atelier pratique de 45 minutes : distribution d’une grille critériée plastifiée. Exercice d’autocorrection sur des dessins anonymisés d’années précédentes. Réalisation guidée pas-à-pas d’un dessin de cellule de pomme de terre avec mise en évidence des grains d’amidon à l’eau iodée.',
    evaluationMethod: 'Production d’un nouveau dessin noté sur 5 critères binaires (respect des proportions, netteté du trait au crayon, horizontalité des flèches, justesse des légendes, présence du titre et grossissement).',
    datePlanned: '2026-10-24',
    completed: false
  },
  {
    id: 'rem-2',
    title: 'Remédiation : Exploitation et analyse de sismogrammes',
    level: '2AC',
    domain: 'ANALYSE_DOCS',
    description: 'Difficulté à lire l’axe des abscisses (temps en secondes ou minutes) et à identifier clairement l’inflexion correspondant à l’arrivée des ondes S par rapport aux ondes P.',
    targetStudents: [
      { studentId: 's23', studentName: 'Walid Taoufik', classId: 'c-2ac-1', initialObservation: 'Confusion entre heure de départ du séisme et heure d’arrivée à la station.', outcomeStatus: 'EN_COURS' },
      { studentId: 's27', studentName: 'Ilyas Bari', classId: 'c-2ac-1', initialObservation: 'Calcul erroné de l’écart (tS - tP) par inversion d’unités.', outcomeStatus: 'ACQUIS' },
      { studentId: 's31', studentName: 'Saad Zaki', classId: 'c-2ac-1', initialObservation: 'Difficulté générale d’abstraction dans la lecture de graphiques temporels.', outcomeStatus: 'EN_COURS' }
    ],
    plannedActivities: 'Fiche d’exercices progressifs en 3 étapes : 1. Repérage couleur (P en bleu, S en rouge). 2. Lecture sur sismogrammes simplifiés à graduation claire. 3. Application sur les données réelles du séisme d’Al Hoceïma.',
    evaluationMethod: 'Test rapide de 15 minutes portant sur la détermination du décalage (tS - tP) de deux stations sismiques différentes.',
    datePlanned: '2026-10-26',
    completed: false
  }
];

export const INITIAL_RESOURCES: LibraryResource[] = [
  {
    id: 'res-1',
    title: 'Schéma normé : La cellule animale vs la cellule végétale',
    level: '1AC',
    category: 'SCHEMA',
    unit: 'Unité 1 (1AC)',
    description: 'Planche comparative haute définition montrant les organites fondamentaux (membrane, cytoplasme, noyau, vacuole et paroi pectocellulosique). Idéale pour impression et projection.',
    format: 'IMAGE',
    tags: ['Cellule', 'Microscope', 'Schéma bilan', '1AC']
  },
  {
    id: 'res-2',
    title: 'Protocole TP : Observation microscopique de l’épiderme d’oignon',
    level: '1AC',
    category: 'FICHE_TP',
    unit: 'Unité 1 (1AC)',
    description: 'Fiche guide élève pas-à-pas avec illustrations pour prélever l’épiderme interne d’écaille d’oignon, colorer au rouge neutre et monter entre lame et lamelle sans bulles d’air.',
    format: 'PDF',
    tags: ['TP', 'Protocole', 'Microscope', 'Labo']
  },
  {
    id: 'res-3',
    title: 'Carte sismotectonique du Royaume du Maroc et failles actives',
    level: '2AC',
    category: 'SCHEMA',
    unit: 'Unité 1 (2AC)',
    description: 'Carte détaillée montrant les zones de contact entre la plaque africaine et la plaque eurasienne, les failles rifaines et atlasiques, et les épicentres historiques majeurs.',
    format: 'IMAGE',
    tags: ['Séismes', 'Tectonique', 'Maroc', 'Al Haouz', 'Al Hoceïma']
  },
  {
    id: 'res-4',
    title: 'Modélisation interactive : Tectonique des plaques et dérive des continents',
    level: '2AC',
    category: 'VIDEO',
    unit: 'Unité 1 (2AC)',
    description: 'Capsule didactique animée en 3D expliquant la dislocation de la Pangée, l’ouverture océanique au niveau des dorsales et la subduction sous la croûte continentale.',
    format: 'LIEN_VIDEO',
    url: 'https://www.youtube.com/watch?v=ryrXAGY1VHs',
    tags: ['Animation 3D', 'Wegener', 'Subduction', 'Dorsale']
  },
  {
    id: 'res-5',
    title: 'Protocole TP : Dissection d’un cœur de mammifère (mouton/bœuf)',
    level: '1AC',
    category: 'FICHE_TP',
    unit: 'Unité 1 (1AC)',
    description: 'Fiche technique de laboratoire pour l’orientation antéro-postérieure, l’incision des ventricules gauche et droit, et l’identification des vaisseaux (artère aorte, artère pulmonaire).',
    format: 'PDF',
    tags: ['Dissection', 'Cœur', 'Circulation', 'Sécurité labo']
  },
  {
    id: 'res-6',
    title: 'Synthèse illustrée : Le cycle ovarien et utérin chez la femme',
    level: '2AC',
    category: 'COURS_RESUME',
    unit: 'Unité 2 (2AC)',
    description: 'Document de synthèse couleur avec synchronisation des phases folliculaire, ovulatoire et lutéale avec les variations de la muqueuse utérine (endomètre).',
    format: 'PDF',
    tags: ['Reproduction', 'Cycles hormonaux', '2AC', 'Synthèse']
  }
];

export const INITIAL_STATE: AppDataState = {
  teacher: {
    name: 'M. Chakrouni',
    schoolName: 'Collège Ibn Al-Haytham',
    directorate: 'Direction Provinciale de Tétouan',
    academy: 'AREF Tanger-Tétouan-Al Hoceïma',
    schoolYear: '2025/2026',
    inspectorName: 'Inspecteur Pédagogique de SVT'
  },
  classes: INITIAL_CLASSES,
  students: INITIAL_STUDENTS,
  cahierEntries: INITIAL_CAHIER,
  schedule: INITIAL_SCHEDULE,
  progression: OFFICIAL_CURRICULUM,
  fiches: INITIAL_FICHES,
  evaluations: INITIAL_EVALUATIONS,
  absences: [
    { id: 'abs-1', studentId: 's7', classId: 'c-1ac-1', date: '2026-10-19', timeSlot: '08h30 - 10h20', isJustified: true, reason: 'Certificat médical', type: 'ABSENCE' },
    { id: 'abs-2', studentId: 's15', classId: 'c-1ac-1', date: '2026-10-19', timeSlot: '08h30 - 10h20', isJustified: false, reason: 'Retard de 20 min', type: 'RETARD' }
  ],
  remediations: INITIAL_REMEDIATIONS,
  resources: INITIAL_RESOURCES,
  lastSavedAt: new Date().toISOString(),
  version: '1.2.0'
};
