
// ============================================================
// db/seed.ts
// Popolamento iniziale del DB con dati di esempio.
// Responsabilità: SOLO inserimento dati, nessuna logica di business.
// Va eseguito UNA SOLA VOLTA dopo initDatabase().
// ============================================================

import { getDatabase } from './database';

// ─────────────────────────────────────────────────────
// Popolamento ingredienti
// Macros espressi per 100 g/ml di prodotto
// ─────────────────────────────────────────────────────
const INGREDIENTS_SEED = [
  // CARNE BIANCA
  { id:'ing_001', name:'Petto di pollo',          category:'carne_bianca',    unit:'g',  cal:165, prot:31,  carb:0,    fat:3.6,  fiber:0    },
  { id:'ing_002', name:'Coscia di pollo',          category:'carne_bianca',    unit:'g',  cal:215, prot:26,  carb:0,    fat:12,   fiber:0    },
  { id:'ing_003', name:'Tacchino (fesa)',           category:'carne_bianca',    unit:'g',  cal:135, prot:29,  carb:0,    fat:1.5,  fiber:0    },
  { id:'ing_004', name:'Coniglio',                  category:'carne_bianca',    unit:'g',  cal:173, prot:21,  carb:0,    fat:9,    fiber:0    },
  { id:'ing_005', name:'Pollo intero',              category:'carne_bianca',    unit:'g',  cal:239, prot:27,  carb:0,    fat:14,   fiber:0    },
  { id:'ing_006', name:'Petto di tacchino affettato', category:'carne_bianca', unit:'g',  cal:104, prot:22,  carb:1,    fat:1.2,  fiber:0    },
  // CARNE ROSSA
  { id:'ing_007', name:'Manzo macinato',            category:'carne_rossa',     unit:'g',  cal:250, prot:26,  carb:0,    fat:16,   fiber:0    },
  { id:'ing_008', name:'Bistecca di manzo',         category:'carne_rossa',     unit:'g',  cal:271, prot:26,  carb:0,    fat:18,   fiber:0    },
  { id:'ing_009', name:'Lonza di maiale',           category:'carne_rossa',     unit:'g',  cal:242, prot:27,  carb:0,    fat:14,   fiber:0    },
  { id:'ing_010', name:'Agnello coscia',            category:'carne_rossa',     unit:'g',  cal:282, prot:25,  carb:0,    fat:19,   fiber:0    },
  { id:'ing_011', name:'Prosciutto crudo',          category:'carne_rossa',     unit:'g',  cal:268, prot:26,  carb:0,    fat:18,   fiber:0    },
  { id:'ing_012', name:'Salsiccia di maiale',       category:'carne_rossa',     unit:'g',  cal:297, prot:12,  carb:2,    fat:26,   fiber:0    },
  { id:'ing_013', name:'Pancetta tesa',             category:'carne_rossa',     unit:'g',  cal:450, prot:12,  carb:1,    fat:45,   fiber:0    },
  { id:'ing_014', name:'Vitello scaloppine',        category:'carne_rossa',     unit:'g',  cal:172, prot:19,  carb:0,    fat:10,   fiber:0    },
  // PESCE
  { id:'ing_015', name:'Salmone atlantico',         category:'pesce',           unit:'g',  cal:208, prot:20,  carb:0,    fat:13,   fiber:0    },
  { id:'ing_016', name:'Tonno in scatola naturale', category:'pesce',           unit:'g',  cal:116, prot:26,  carb:0,    fat:1,    fiber:0    },
  { id:'ing_017', name:'Merluzzo',                  category:'pesce',           unit:'g',  cal:82,  prot:18,  carb:0,    fat:0.7,  fiber:0    },
  { id:'ing_018', name:'Orata',                     category:'pesce',           unit:'g',  cal:96,  prot:20,  carb:0,    fat:1.8,  fiber:0    },
  { id:'ing_019', name:'Branzino',                  category:'pesce',           unit:'g',  cal:97,  prot:18,  carb:0,    fat:2.5,  fiber:0    },
  { id:'ing_020', name:'Gamberi',                   category:'pesce',           unit:'g',  cal:99,  prot:24,  carb:0,    fat:0.3,  fiber:0    },
  { id:'ing_021', name:'Calamari',                  category:'pesce',           unit:'g',  cal:92,  prot:16,  carb:3,    fat:1.4,  fiber:0    },
  { id:'ing_022', name:'Sgombro',                   category:'pesce',           unit:'g',  cal:205, prot:19,  carb:0,    fat:14,   fiber:0    },
  { id:'ing_023', name:'Vongole',                   category:'pesce',           unit:'g',  cal:148, prot:26,  carb:5,    fat:2,    fiber:0    },
  { id:'ing_024', name:'Cozze',                     category:'pesce',           unit:'g',  cal:86,  prot:12,  carb:4,    fat:2.2,  fiber:0    },
  // LEGUMI
  { id:'ing_025', name:'Ceci cotti',                category:'legumi',          unit:'g',  cal:164, prot:9,   carb:27,   fat:2.6,  fiber:7    },
  { id:'ing_026', name:'Lenticchie cotte',          category:'legumi',          unit:'g',  cal:116, prot:9,   carb:20,   fat:0.4,  fiber:8    },
  { id:'ing_027', name:'Fagioli borlotti cotti',    category:'legumi',          unit:'g',  cal:120, prot:8,   carb:22,   fat:0.5,  fiber:7    },
  { id:'ing_028', name:'Fagioli neri cotti',        category:'legumi',          unit:'g',  cal:132, prot:9,   carb:24,   fat:0.5,  fiber:8.7  },
  { id:'ing_029', name:'Piselli freschi',           category:'legumi',          unit:'g',  cal:81,  prot:5,   carb:14,   fat:0.4,  fiber:5    },
  { id:'ing_030', name:'Fave cotte',                category:'legumi',          unit:'g',  cal:110, prot:8,   carb:20,   fat:0.4,  fiber:5    },
  { id:'ing_031', name:'Semi di soia cotti',        category:'legumi',          unit:'g',  cal:173, prot:17,  carb:10,   fat:9,    fiber:6    },
  { id:'ing_032', name:'Cannellini cotti',          category:'legumi',          unit:'g',  cal:140, prot:9,   carb:26,   fat:0.5,  fiber:6    },
  // FRUTTA
  { id:'ing_033', name:'Mela',                      category:'frutta',          unit:'g',  cal:52,  prot:0.3, carb:14,   fat:0.2,  fiber:2.4  },
  { id:'ing_034', name:'Banana',                    category:'frutta',          unit:'g',  cal:89,  prot:1.1, carb:23,   fat:0.3,  fiber:2.6  },
  { id:'ing_035', name:'Fragole',                   category:'frutta',          unit:'g',  cal:32,  prot:0.7, carb:7.7,  fat:0.3,  fiber:2    },
  { id:'ing_036', name:'Arancia',                   category:'frutta',          unit:'g',  cal:47,  prot:0.9, carb:12,   fat:0.1,  fiber:2.4  },
  { id:'ing_037', name:'Uva',                       category:'frutta',          unit:'g',  cal:69,  prot:0.7, carb:18,   fat:0.2,  fiber:0.9  },
  { id:'ing_038', name:'Pera',                      category:'frutta',          unit:'g',  cal:57,  prot:0.4, carb:15,   fat:0.1,  fiber:3.1  },
  { id:'ing_039', name:'Kiwi',                      category:'frutta',          unit:'g',  cal:61,  prot:1.1, carb:15,   fat:0.5,  fiber:3    },
  { id:'ing_040', name:'Pesca',                     category:'frutta',          unit:'g',  cal:39,  prot:0.9, carb:10,   fat:0.3,  fiber:1.5  },
  { id:'ing_041', name:'Ananas',                    category:'frutta',          unit:'g',  cal:50,  prot:0.5, carb:13,   fat:0.1,  fiber:1.4  },
  { id:'ing_042', name:'Avocado',                   category:'frutta',          unit:'g',  cal:160, prot:2,   carb:9,    fat:15,   fiber:7    },
  { id:'ing_043', name:'Mango',                     category:'frutta',          unit:'g',  cal:60,  prot:0.8, carb:15,   fat:0.4,  fiber:1.6  },
  { id:'ing_044', name:'Limone',                    category:'frutta',          unit:'g',  cal:29,  prot:1.1, carb:9,    fat:0.3,  fiber:2.8  },
  // VERDURA
  { id:'ing_045', name:'Pomodoro',                  category:'verdura',         unit:'g',  cal:18,  prot:0.9, carb:3.9,  fat:0.2,  fiber:1.2  },
  { id:'ing_046', name:'Zucchina',                  category:'verdura',         unit:'g',  cal:17,  prot:1.2, carb:3.1,  fat:0.3,  fiber:1    },
  { id:'ing_047', name:'Carota',                    category:'verdura',         unit:'g',  cal:41,  prot:0.9, carb:10,   fat:0.2,  fiber:2.8  },
  { id:'ing_048', name:'Spinaci',                   category:'verdura',         unit:'g',  cal:23,  prot:2.9, carb:3.6,  fat:0.4,  fiber:2.2  },
  { id:'ing_049', name:'Broccoli',                  category:'verdura',         unit:'g',  cal:34,  prot:2.8, carb:7,    fat:0.4,  fiber:2.6  },
  { id:'ing_050', name:'Cipolla',                   category:'verdura',         unit:'g',  cal:40,  prot:1.1, carb:9,    fat:0.1,  fiber:1.7  },
  { id:'ing_051', name:'Aglio',                     category:'verdura',         unit:'g',  cal:149, prot:6.4, carb:33,   fat:0.5,  fiber:2.1  },
  { id:'ing_052', name:'Peperone rosso',            category:'verdura',         unit:'g',  cal:31,  prot:1,   carb:6,    fat:0.3,  fiber:2.1  },
  { id:'ing_053', name:'Melanzana',                 category:'verdura',         unit:'g',  cal:25,  prot:1,   carb:6,    fat:0.2,  fiber:3    },
  { id:'ing_054', name:'Cavolo cappuccio',          category:'verdura',         unit:'g',  cal:25,  prot:1.3, carb:6,    fat:0.1,  fiber:2.5  },
  { id:'ing_055', name:'Funghi champignon',         category:'verdura',         unit:'g',  cal:22,  prot:3.1, carb:3.3,  fat:0.3,  fiber:1    },
  { id:'ing_056', name:'Sedano',                    category:'verdura',         unit:'g',  cal:16,  prot:0.7, carb:3,    fat:0.2,  fiber:1.6  },
  { id:'ing_057', name:'Lattuga',                   category:'verdura',         unit:'g',  cal:15,  prot:1.4, carb:2.9,  fat:0.2,  fiber:1.3  },
  { id:'ing_058', name:'Patata',                    category:'verdura',         unit:'g',  cal:77,  prot:2,   carb:17,   fat:0.1,  fiber:2.2  },
  // LATTICINI
  { id:'ing_059', name:'Latte intero',              category:'latticini',       unit:'ml', cal:61,  prot:3.2, carb:4.8,  fat:3.3,  fiber:0    },
  { id:'ing_060', name:'Yogurt greco 0%',           category:'latticini',       unit:'g',  cal:59,  prot:10,  carb:4,    fat:0.4,  fiber:0    },
  { id:'ing_061', name:'Mozzarella',                category:'latticini',       unit:'g',  cal:280, prot:22,  carb:2.2,  fat:20,   fiber:0    },
  { id:'ing_062', name:'Parmigiano reggiano',       category:'latticini',       unit:'g',  cal:392, prot:33,  carb:0,    fat:28,   fiber:0    },
  { id:'ing_063', name:'Ricotta vaccina',           category:'latticini',       unit:'g',  cal:174, prot:11,  carb:3.5,  fat:13,   fiber:0    },
  { id:'ing_064', name:'Grana padano',              category:'latticini',       unit:'g',  cal:384, prot:33,  carb:0,    fat:28,   fiber:0    },
  { id:'ing_065', name:'Burro',                     category:'latticini',       unit:'g',  cal:717, prot:0.9, carb:0.1,  fat:81,   fiber:0    },
  { id:'ing_066', name:'Panna fresca',              category:'latticini',       unit:'ml', cal:337, prot:2.3, carb:3.1,  fat:35,   fiber:0    },
  { id:'ing_067', name:'Crescenza',                 category:'latticini',       unit:'g',  cal:265, prot:14,  carb:1.5,  fat:23,   fiber:0    },
  // PRODOTTI ANIMALI
  { id:'ing_068', name:'Uovo intero',               category:'prodotti_animali',unit:'g',  cal:143, prot:13,  carb:0.7,  fat:10,   fiber:0    },
  { id:'ing_069', name:'Albume',                    category:'prodotti_animali',unit:'g',  cal:52,  prot:11,  carb:0.7,  fat:0.2,  fiber:0    },
  { id:'ing_070', name:'Tuorlo',                    category:'prodotti_animali',unit:'g',  cal:322, prot:16,  carb:3.6,  fat:27,   fiber:0    },
  { id:'ing_071', name:'Strutto',                   category:'prodotti_animali',unit:'g',  cal:891, prot:0,   carb:0,    fat:99,   fiber:0    },
  { id:'ing_072', name:'Miele',                     category:'prodotti_animali',unit:'g',  cal:304, prot:0.3, carb:82,   fat:0,    fiber:0.2  },
  { id:'ing_073', name:'Lardo',                     category:'prodotti_animali',unit:'g',  cal:858, prot:1.4, carb:0,    fat:95,   fiber:0    },
  // VEGANO
  { id:'ing_074', name:'Tofu',                      category:'vegano',          unit:'g',  cal:76,  prot:8,   carb:1.9,  fat:4.8,  fiber:0.3  },
  { id:'ing_075', name:'Tempeh',                    category:'vegano',          unit:'g',  cal:193, prot:19,  carb:9,    fat:11,   fiber:9    },
  { id:'ing_076', name:'Seitan',                    category:'vegano',          unit:'g',  cal:370, prot:75,  carb:14,   fat:1.9,  fiber:0.6  },
  { id:'ing_077', name:'Latte di soia',             category:'vegano',          unit:'ml', cal:33,  prot:3,   carb:2.5,  fat:1.8,  fiber:0.4  },
  { id:'ing_078', name:'Latte di mandorla',         category:'vegano',          unit:'ml', cal:17,  prot:0.5, carb:1.4,  fat:1.1,  fiber:0.4  },
  { id:'ing_079', name:'Riso integrale cotto',      category:'vegano',          unit:'g',  cal:111, prot:2.6, carb:23,   fat:0.9,  fiber:1.8  },
  { id:'ing_080', name:'Quinoa cotta',              category:'vegano',          unit:'g',  cal:120, prot:4.4, carb:22,   fat:1.9,  fiber:2.8  },
  { id:'ing_081', name:'Olio extravergine oliva',   category:'vegano',          unit:'ml', cal:884, prot:0,   carb:0,    fat:100,  fiber:0    },
  { id:'ing_082', name:'Pasta di grano duro',       category:'vegano',          unit:'g',  cal:350, prot:13,  carb:70,   fat:1.5,  fiber:3    },
  { id:'ing_083', name:'Farina 00',                 category:'vegano',          unit:'g',  cal:364, prot:10,  carb:76,   fat:1,    fiber:2.7  },
  { id:'ing_084', name:'Riso crudo',                category:'vegano',          unit:'g',  cal:360, prot:7,   carb:80,   fat:0.7,  fiber:1.4  },
  { id:'ing_085', name:'Mandorle',                  category:'vegano',          unit:'g',  cal:579, prot:21,  carb:22,   fat:50,   fiber:12.5 },
  { id:'ing_086', name:'Noci',                      category:'vegano',          unit:'g',  cal:654, prot:15,  carb:14,   fat:65,   fiber:6.7  },
  { id:'ing_087', name:'Pane integrale',            category:'vegano',          unit:'g',  cal:247, prot:9,   carb:44,   fat:3.4,  fiber:6    },
  { id:'ing_088', name:'Tahini pasta di sesamo',    category:'vegano',          unit:'g',  cal:595, prot:17,  carb:21,   fat:54,   fiber:9.3  },
];

// ─────────────────────────────────────────────────────
// Popolamento ricette
// ─────────────────────────────────────────────────────
const RECIPES_SEED = [
  { id:'rec_001', name:'Pasta al pomodoro',              description:'Classica pasta al sugo di pomodoro fresco con basilico.', category:'pranzo',   prep:20, difficulty:'facile', servings:2, notes:'Usare pomodori San Marzano.',
    ingredients:[{ingId:'ing_082',qty:160,unit:'g'},{ingId:'ing_045',qty:300,unit:'g'},{ingId:'ing_081',qty:20,unit:'ml'},{ingId:'ing_051',qty:5,unit:'g'}]},
  { id:'rec_002', name:'Pollo al forno con patate',      description:'Cosce di pollo croccanti al forno con patate e rosmarino.', category:'cena',   prep:60, difficulty:'facile', servings:2, notes:null,
    ingredients:[{ingId:'ing_002',qty:400,unit:'g'},{ingId:'ing_058',qty:300,unit:'g'},{ingId:'ing_081',qty:30,unit:'ml'},{ingId:'ing_051',qty:5,unit:'g'}]},
  { id:'rec_003', name:'Insalata di tonno e ceci',       description:'Piatto proteico con tonno al naturale, ceci e pomodorini.', category:'pranzo',  prep:10, difficulty:'facile', servings:1, notes:null,
    ingredients:[{ingId:'ing_016',qty:80,unit:'g'},{ingId:'ing_025',qty:120,unit:'g'},{ingId:'ing_045',qty:100,unit:'g'},{ingId:'ing_081',qty:10,unit:'ml'}]},
  { id:'rec_004', name:'Omelette con spinaci',           description:'Omelette soffice con spinaci saltati e parmigiano.', category:'colazione', prep:10, difficulty:'facile', servings:1, notes:null,
    ingredients:[{ingId:'ing_068',qty:120,unit:'g'},{ingId:'ing_048',qty:80,unit:'g'},{ingId:'ing_062',qty:15,unit:'g'},{ingId:'ing_081',qty:5,unit:'ml'}]},
  { id:'rec_005', name:'Risotto al salmone',             description:'Risotto cremoso con salmone fresco e panna.', category:'cena', prep:35, difficulty:'media', servings:2, notes:null,
    ingredients:[{ingId:'ing_084',qty:160,unit:'g'},{ingId:'ing_015',qty:200,unit:'g'},{ingId:'ing_066',qty:50,unit:'ml'},{ingId:'ing_050',qty:50,unit:'g'},{ingId:'ing_062',qty:20,unit:'g'}]},
  { id:'rec_006', name:'Zuppa di lenticchie',            description:'Minestra calda di lenticchie con carote e sedano.', category:'cena', prep:40, difficulty:'facile', servings:3, notes:null,
    ingredients:[{ingId:'ing_026',qty:250,unit:'g'},{ingId:'ing_047',qty:100,unit:'g'},{ingId:'ing_056',qty:80,unit:'g'},{ingId:'ing_050',qty:60,unit:'g'},{ingId:'ing_081',qty:20,unit:'ml'}]},
  { id:'rec_007', name:'Yogurt greco con frutta e noci', description:'Colazione proteica con yogurt, banana, fragole e noci.', category:'colazione', prep:5, difficulty:'facile', servings:1, notes:null,
    ingredients:[{ingId:'ing_060',qty:150,unit:'g'},{ingId:'ing_034',qty:80,unit:'g'},{ingId:'ing_035',qty:50,unit:'g'},{ingId:'ing_086',qty:20,unit:'g'},{ingId:'ing_072',qty:10,unit:'g'}]},
  { id:'rec_008', name:'Burger di ceci',                 description:'Polpette di ceci vegane con erbe aromatiche e avocado.', category:'pranzo', prep:30, difficulty:'media', servings:2, notes:null,
    ingredients:[{ingId:'ing_025',qty:240,unit:'g'},{ingId:'ing_083',qty:30,unit:'g'},{ingId:'ing_042',qty:100,unit:'g'},{ingId:'ing_052',qty:80,unit:'g'},{ingId:'ing_081',qty:15,unit:'ml'}]},
  { id:'rec_009', name:'Branzino al forno con verdure',  description:'Filetti di branzino con zucchine, pomodori.', category:'cena', prep:35, difficulty:'facile', servings:2, notes:null,
    ingredients:[{ingId:'ing_019',qty:360,unit:'g'},{ingId:'ing_046',qty:200,unit:'g'},{ingId:'ing_045',qty:150,unit:'g'},{ingId:'ing_081',qty:20,unit:'ml'},{ingId:'ing_051',qty:5,unit:'g'}]},
  { id:'rec_010', name:'Bowl di quinoa e tofu',          description:'Bowl vegana con quinoa, tofu marinato, avocado e spinaci.', category:'pranzo', prep:25, difficulty:'facile', servings:1, notes:null,
    ingredients:[{ingId:'ing_080',qty:150,unit:'g'},{ingId:'ing_074',qty:100,unit:'g'},{ingId:'ing_042',qty:80,unit:'g'},{ingId:'ing_048',qty:60,unit:'g'},{ingId:'ing_088',qty:15,unit:'g'}]},
  { id:'rec_011', name:'Scaloppine al limone',           description:'Scaloppine di vitello con salsa al limone e prezzemolo.', category:'cena', prep:20, difficulty:'facile', servings:2, notes:null,
    ingredients:[{ingId:'ing_014',qty:300,unit:'g'},{ingId:'ing_044',qty:30,unit:'g'},{ingId:'ing_083',qty:20,unit:'g'},{ingId:'ing_065',qty:20,unit:'g'}]},
  { id:'rec_012', name:'Minestrone di verdure',          description:'Minestrone ricco con patate, carote, zucchine e fagioli.', category:'cena', prep:45, difficulty:'facile', servings:4, notes:null,
    ingredients:[{ingId:'ing_058',qty:200,unit:'g'},{ingId:'ing_047',qty:150,unit:'g'},{ingId:'ing_046',qty:150,unit:'g'},{ingId:'ing_045',qty:200,unit:'g'},{ingId:'ing_027',qty:100,unit:'g'},{ingId:'ing_081',qty:20,unit:'ml'}]},
  { id:'rec_013', name:'Pollo con funghi in padella',    description:'Petto di pollo saltato con champignon, aglio e vino.', category:'cena', prep:20, difficulty:'facile', servings:2, notes:null,
    ingredients:[{ingId:'ing_001',qty:300,unit:'g'},{ingId:'ing_055',qty:200,unit:'g'},{ingId:'ing_051',qty:5,unit:'g'},{ingId:'ing_081',qty:15,unit:'ml'}]},
  { id:'rec_014', name:'Frullato proteico al mango',     description:'Smoothie con latte di soia, mango, banana e mandorle.', category:'spuntino', prep:5, difficulty:'facile', servings:1, notes:null,
    ingredients:[{ingId:'ing_077',qty:200,unit:'ml'},{ingId:'ing_043',qty:100,unit:'g'},{ingId:'ing_034',qty:80,unit:'g'},{ingId:'ing_085',qty:20,unit:'g'}]},
  { id:'rec_015', name:'Insalata caprese',               description:'Classica caprese con mozzarella, pomodori e basilico.', category:'spuntino', prep:5, difficulty:'facile', servings:1, notes:null,
    ingredients:[{ingId:'ing_061',qty:125,unit:'g'},{ingId:'ing_045',qty:150,unit:'g'},{ingId:'ing_081',qty:10,unit:'ml'}]},
];

/**
 * Esegue il seed completo del DB in un'unica transazione atomica.
 * Usa INSERT OR IGNORE per idempotenza (chiamabile più volte senza duplicati).
 */
export async function seedDatabase(): Promise<void> {
  const db = getDatabase();

  await db.withTransactionAsync(async () => {
    // ── Ingredienti ──────────────────────────────────
    for (const ing of INGREDIENTS_SEED) {
      await db.runAsync(
        `INSERT OR IGNORE INTO ingredients
           (id, name, category, default_unit, calories, protein, carbohydrates, fats, fiber)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ing.id, ing.name, ing.category, ing.unit,
         ing.cal, ing.prot, ing.carb, ing.fat, ing.fiber ?? null]
      );
    }

    // ── Ricette + ingredienti ricetta ─────────────────
    for (const rec of RECIPES_SEED) {
      await db.runAsync(
        `INSERT OR IGNORE INTO recipes
           (id, name, description, category, prep_time_minutes, difficulty, servings, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [rec.id, rec.name, rec.description, rec.category,
         rec.prep, rec.difficulty, rec.servings, rec.notes ?? null]
      );

      for (const ri of rec.ingredients) {
        await db.runAsync(
          `INSERT OR IGNORE INTO recipe_ingredients
             (recipe_id, ingredient_id, quantity, unit)
           VALUES (?, ?, ?, ?)`,
          [rec.id, ri.ingId, ri.qty, ri.unit]
        );
      }
    }
  });
}