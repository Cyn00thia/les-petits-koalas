"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

type Age = "4-12" | "12-18" | "18+";
type Preference = "classique" | "sansPorc" | "vegetarien";
type ModePeriode = "semaine" | "mois";
type Saison = "printemps" | "ete" | "automne" | "hiver";

type Enfant = {
  id: string;
  nom: string;
  date_naissance: string;
  jours_presence: string[];

  fruits_introduits?: string[];
  legumes_introduits?: string[];
  feculents_introduits?: string[];
  vvpo_introduits?: string[];
  matieres_grasses_introduites?: string[];
  herbes_introduites?: string[];
  autres_introduits?: string[];

  allergies?: string[];
  allergies_remarques?: string;
  texture_alimentaire?: string;
  alimentation_diversifiee_complete?: boolean;

  user_id?: string;
};

type MenuSauvegarde = {
  id: string;
  created_at: string;
  user_id: string;
  titre: string;
  periode: string;
  menus: MenuJour[];
  courses: any;
  visible_parents: boolean;
  menu_actif: boolean;
};

type MenuJour = {
  index: number;
  semaine: number;
  jourCourt: string;
  jour: string;
  soupe: string;
  diner: {
    boisson: string;
    plat: string;
    feculent: string;
    legumes: string;
    proteine: string;
    matiereGrasse: string;
    remarque: string;
    herbe: string;
    legumesOrigine?: string;
  };
  gouter: {
    bebe: string;
    fruit: string;
    pain1218: string;
    pain18: string;
    laitier18: string;
  };
};

type ListeCourses = {
  soupes: Record<string, number>;
  legumes: Record<string, number>;
  feculents: Record<string, number>;
  proteines: Record<string, number>;
  fruits: Record<string, number>;
  autres: Record<string, number>;
};
type OrigineAliment = "de saison" | "surgelé" | "stockable" | "hors saison";

type AdaptationEnfant = {
  enfant: string;
  tranche: Age;
  texture: string;
  statut: "diversification_en_cours" | "diversification_complete";
  feculent: string;
  legumes: string;
  proteine: string;
  remarque: string;
};


const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const legumesTous = [
  "Carotte",
  "Courgette",
  "Butternut",
  "Potiron",
  "Potimarron",
  "Haricots verts",
  "Petits pois",
  "Pois mange-tout",
  "Brocoli",
  "Chou-fleur",
  "Romanesco",
  "Épinard",
  "Blette",
  "Navet",
  "Panais",
  "Fenouil",
  "Poireau",
  "Tomate",
  "Concombre",
  "Laitue",
  "Roquette",
  "Betterave",
  "Céleri-rave",
  "Céleri branche",
  "Aubergine",
  "Poivron",
  "Champignon",
  "Chou blanc",
  "Chou rouge",
  "Chou de Bruxelles",
  "Kale",
  "Endive",
  "Artichaut",
  "Radis",
  "Salsifis",
  "Rutabaga",
  "Crosnes",
  "Chou chinois",
  "Chou-rave",
  "Pois chiche",
];

const feculentsTous = [
  "Riz",
  "Semoule de blé",
  "Pâtes",
  "Boulgour",
  "Quinoa",
  "Polenta",
  "Orge perlé",
  "Pain",
  "Flocons d’avoine",
  "Blé tendre",
  "Maïs",
  "Lentilles",
  "Pommes de terre",
  "Patate douce",
];

const viandesVolailles = ["Poulet", "Dinde", "Veau", "Bœuf", "Porc"];

const poissonsMaigres = [
  "Colin",
  "Cabillaud",
  "Lieu noir",
  "Merlan",
  "Bar",
  "Dorade",
  "Turbot",
];

const poissonsGras = [
  "Saumon",
  "Truite",
  "Sardine",
  "Maquereau",
  "Hareng",
  "Thon",
  "Espadon",
];

const poissonsBlancs = [
  "Sole",
  "Plie",
  "Sébaste",
  "Lotte",
  "Limande",
  "Saint-Pierre",
];

const proteinesClassiques = [
  ...viandesVolailles,
  ...poissonsMaigres,
  ...poissonsGras,
  ...poissonsBlancs,
  "Œuf",
];

const proteinesSansPorc = proteinesClassiques.filter((p) => p !== "Porc");

const proteinesVegetariennes = [
  "Œuf",
  "Repas végétarien",
  "Galette de légumes adaptée",
];

const matieresGrasses = ["Huile d’olive", "Huile de colza", "Beurre"];

const herbesAromatiques = [
  "Persil",
  "Ciboulette",
  "Basilic",
  "Thym",
  "Origan",
  "Laurier",
  "Romarin",
  "Aneth",
  "Estragon",
  "Curcuma doux",
  "Gingembre doux",
  "Ail",
  "Oignon",
  "Coriandre",
  "Menthe",
  "Sauge",
  "Marjolaine",
  "Cumin doux",
  "Paprika doux",
  "Muscade",
];

const fruitsTous = [
  "Pomme",
  "Poire",
  "Banane",
  "Abricot",
  "Pêche",
  "Nectarine",
  "Prune",
  "Cerise",
  "Raisin",
  "Fraise",
  "Framboise",
  "Myrtille",
  "Mûre",
  "Groseille",
  "Melon",
  "Pastèque",
  "Orange",
  "Mandarine",
  "Pamplemousse",
  "Kiwi",
  "Mangue",
  "Ananas",
  "Figue",
  "Kaki",
  "Coing",
  "Reine-Claude",
];

const legumesSurgelesAutorises = [
  "Carotte",
  "Courgette",
  "Haricots verts",
  "Petits pois",
  "Brocoli",
  "Chou-fleur",
  "Épinard",
  "Poireau",
  "Butternut",
  "Potiron",
  "Potimarron",
];

const legumesStockables = [
  "Carotte",
  "Butternut",
  "Potiron",
  "Potimarron",
  "Navet",
  "Panais",
  "Céleri-rave",
  "Betterave",
];

const cruditesReservees18Mois = [
  "Laitue",
  "Roquette",
  "Concombre",
  "Radis",
  "Carotte râpée",
  "Tomate crue",
  "Endive crue",
];

const feculentsInterditsDansLegumes = [
  "Pommes de terre",
  "Pomme de terre",
  "Pdt",
  "Patate",
  "Patate douce",
];

function estFeculentCacheDansLegumes(aliment: string) {
  const alimentNormalise = normaliserTexte(aliment);

  return feculentsInterditsDansLegumes.some((feculent) => {
    const feculentNormalise = normaliserTexte(feculent);

    return (
      alimentNormalise === feculentNormalise ||
      alimentNormalise.includes(feculentNormalise) ||
      feculentNormalise.includes(alimentNormalise)
    );
  });
}

function filtrerLegumesSansFeculents(liste: string[]) {
  return liste.filter((aliment) => !estFeculentCacheDansLegumes(aliment));
}

const legumesDouxBebe = [
  "Carotte",
  "Courgette",
  "Brocoli",
  "Haricots verts",
  "Chou-fleur",
  "Potimarron",
  "Butternut",
  "Panais",
  "Poireau",
  "Épinard",
];

const saisons: Record<Saison, { legumes: string[]; soupes: string[]; fruits: string[] }> = {
  printemps: {
    legumes: [
      "Carotte",
      "Courgette",
      "Haricots verts",
      "Petits pois",
      "Pois mange-tout",
      "Brocoli",
      "Chou-fleur",
      "Romanesco",
      "Épinard",
      "Blette",
      "Fenouil",
      "Poireau",
      "Laitue",
      "Roquette",
      "Radis",
      "Artichaut",
    ],
    soupes: [
      "Soupe carotte-courgette",
      "Soupe brocoli-courgette",
      "Soupe petits pois-carotte",
      "Soupe fenouil-carotte",
      "Soupe poireau-pomme de terre",
      "Soupe chou-fleur-pomme de terre",
    ],
    fruits: [
      "Pomme + poire",
      "Banane + pomme",
      "Pomme + fraise",
      "Poire + kiwi",
      "Fraise + banane",
      "Pomme + rhubarbe douce",
    ],
  },
  ete: {
    legumes: [
      "Courgette",
      "Tomate",
      "Concombre",
      "Laitue",
      "Roquette",
      "Aubergine",
      "Poivron",
      "Haricots verts",
      "Carotte",
      "Brocoli",
      "Petits pois",
      "Pois mange-tout",
    ],
    soupes: [
      "Soupe courgette-pomme de terre",
      "Soupe tomate-carotte",
      "Soupe courgette-carotte",
      "Soupe haricots verts-pomme de terre",
      "Soupe aubergine-courgette",
      "Soupe poivron-courgette",
    ],
    fruits: [
      "Pêche + pomme",
      "Abricot + pomme",
      "Banane + pêche",
      "Pomme + fraise",
      "Melon + poire",
      "Pastèque + pomme",
      "Nectarine + abricot",
    ],
  },
  automne: {
    legumes: [
      "Carotte",
      "Butternut",
      "Potiron",
      "Potimarron",
      "Poireau",
      "Brocoli",
      "Chou-fleur",
      "Romanesco",
      "Courgette",
      "Épinard",
      "Blette",
      "Betterave",
      "Navet",
      "Panais",
      "Céleri-rave",
      "Champignon",
    ],
    soupes: [
      "Soupe poireau-butternut",
      "Soupe carotte-potiron",
      "Soupe brocoli-courgette",
      "Soupe chou-fleur-carotte",
      "Soupe potimarron-pomme de terre",
      "Soupe panais-carotte",
    ],
    fruits: [
      "Pomme + poire",
      "Banane + pomme",
      "Poire + kiwi",
      "Pomme + prune",
      "Pomme + coing",
      "Raisin + poire",
      "Figue + pomme",
    ],
  },
  hiver: {
    legumes: [
      "Carotte",
      "Poireau",
      "Chou-fleur",
      "Brocoli",
      "Potiron",
      "Butternut",
      "Potimarron",
      "Épinard",
      "Fenouil",
      "Céleri-rave",
      "Betterave",
      "Navet",
      "Panais",
      "Endive",
      "Chou blanc",
      "Chou rouge",
      "Chou de Bruxelles",
      "Kale",
      "Salsifis",
      "Rutabaga",
      "Crosnes",
      "Chou chinois",
      "Chou-rave",
    ],
    soupes: [
      "Soupe poireau-pomme de terre",
      "Soupe carotte-butternut",
      "Soupe chou-fleur-carotte",
      "Soupe potiron-carotte",
      "Soupe brocoli-pomme de terre",
      "Soupe panais-poireau",
      "Soupe céleri-rave-carotte",
    ],
    fruits: [
      "Pomme + poire",
      "Banane + pomme",
      "Poire + mandarine",
      "Pomme + kiwi",
      "Orange + banane",
      "Kaki + pomme",
      "Pomme + coing",
    ],
  },
};

const laitages18 = [
  "Non nécessaire",
  "Fromage",
  "Non nécessaire",
  "Yaourt nature",
  "Non nécessaire",
  "Verre de lait",
  "Non nécessaire",
  "Fromage frais",
];

const compotesBebe = [
  "Compote pomme-poire",
  "Compote pomme-banane",
  "Compote poire-banane",
  "Compote pomme-abricot",
  "Compote pomme-pêche",
  "Compote poire-kiwi",
  "Compote pomme-coing doux",
];

const conversionCru: Record<string, number> = {
  "Pommes de terre": 1,
  "Patate douce": 1,
  Riz: 0.4,
  "Semoule de blé": 0.4,
  Pâtes: 0.4,
  Boulgour: 0.4,
  Quinoa: 0.4,
  Polenta: 0.4,
  "Orge perlé": 0.4,
  "Blé tendre": 0.4,
  Maïs: 0.9,
  Lentilles: 0.45,
  Pain: 1,
  "Flocons d’avoine": 1,

  Poulet: 1.2,
  Dinde: 1.2,
  Veau: 1.18,
  Bœuf: 1.18,
  Porc: 1.43,
  Colin: 1.18,
  Cabillaud: 1.18,
  "Lieu noir": 1.18,
  Merlan: 1.18,
  Bar: 1.18,
  Dorade: 1.18,
  Turbot: 1.18,
  Saumon: 1.18,
  Truite: 1.18,
  Sardine: 1.18,
  Maquereau: 1.18,
  Hareng: 1.18,
  Thon: 1.18,
  Espadon: 1.18,
  Sole: 1.18,
  Plie: 1.18,
  Sébaste: 1.18,
  Lotte: 1.18,
  Limande: 1.18,
  "Saint-Pierre": 1.18,
  Œuf: 1,
  "Repas végétarien": 1.25,
  "Galette de légumes adaptée": 1.25,

  Carotte: 1.1,
  Courgette: 1.16,
  Butternut: 1.1,
  Potiron: 1.1,
  Potimarron: 1.1,
  "Haricots verts": 1.1,
  "Petits pois": 1.07,
  "Pois mange-tout": 1.07,
  Brocoli: 1.06,
  "Chou-fleur": 1.06,
  Romanesco: 1.06,
  Épinard: 1.65,
  Blette: 1.35,
  Navet: 1.16,
  Panais: 1.16,
  Fenouil: 1.2,
  Poireau: 1.25,
  Tomate: 1.1,
  Concombre: 1.15,
  Laitue: 1.25,
  Roquette: 1.25,
  Betterave: 1.07,
  "Céleri-rave": 1.16,
  "Céleri branche": 1.2,
  Aubergine: 1.07,
  Poivron: 1.15,
  Champignon: 1.65,
  "Chou blanc": 1.2,
  "Chou rouge": 1.2,
  "Chou de Bruxelles": 1.2,
  Kale: 1.25,
  Endive: 1.15,
  Artichaut: 1.5,
  Radis: 1.1,
  Salsifis: 1.2,
  Rutabaga: 1.16,
  Crosnes: 1.2,
  "Chou chinois": 1.2,
  "Chou-rave": 1.16,
  "Pois chiche": 0.45,
};

function saisonActuelle(): Saison {
  const mois = new Date().getMonth() + 1;
  if ([3, 4, 5].includes(mois)) return "printemps";
  if ([6, 7, 8].includes(mois)) return "ete";
  if ([9, 10, 11].includes(mois)) return "automne";
  return "hiver";
}

function nettoyerLegume(nom: string) {
  return nom
    .replaceAll("Soupe", "")
    .replaceAll("soupe", "")
    .replaceAll("cuite", "")
    .replaceAll("cuit", "")
    .replaceAll("douce", "")
    .replaceAll("doux", "")
    .replaceAll("  ", " ")
    .trim();
}

function elementsDepuisTexte(texte: string) {
  return texte
    .replaceAll("Soupe", "")
    .replaceAll("soupe", "")
    .split(/[-+]/)
    .map((item) => nettoyerLegume(item.trim()))
    .filter(Boolean);
}

function prendreDifferent(liste: string[], actuel: string) {
  const possibles = liste.filter((item) => item !== actuel);
  return possibles[Math.floor(Math.random() * possibles.length)] ?? liste[0];
}

function choisirSansRepetition(liste: string[], utilises: Set<string>, interdits: Set<string>) {
  let possibles = liste.filter((item) => {
    const elements = elementsDepuisTexte(item);
    return !utilises.has(item) && elements.every((element) => !interdits.has(element));
  });

  if (possibles.length === 0) {
    possibles = liste.filter((item) => {
      const elements = elementsDepuisTexte(item);
      return elements.every((element) => !interdits.has(element));
    });
  }

  if (possibles.length === 0) {
    possibles = liste;
  }

  const choix = possibles[Math.floor(Math.random() * possibles.length)];
  utilises.add(choix);
  return choix;
}

function choisirSoupeSansRepeter(soupes: string[], utilisesSoupes: Set<string>, legumesDerniersJours: Set<string>) {
  let possibles = soupes.filter((soupe) => {
    const legumesSoupe = elementsDepuisTexte(soupe);
    return !utilisesSoupes.has(soupe) && legumesSoupe.every((legume) => !legumesDerniersJours.has(legume));
  });

  if (possibles.length === 0) {
    possibles = soupes.filter((soupe) => !utilisesSoupes.has(soupe));
  }

  if (possibles.length === 0) {
    possibles = soupes;
  }

  const choix = possibles[Math.floor(Math.random() * possibles.length)];
  utilisesSoupes.add(choix);
  return choix;
}

function ajouter(liste: Record<string, number>, nom: string, quantite: number) {
  liste[nom] = (liste[nom] || 0) + quantite;
}

function convertirEnCru(nom: string, poidsCuit: number) {
  return poidsCuit * (conversionCru[nom] ?? 1.25);
}

function choisirFeculent(index: number) {
  const semaine = Math.floor(index / 5);
  const jour = index % 5;

  const feculentsVariables = [
    ["Riz", "Pâtes"],
    ["Semoule de blé", "Quinoa"],
    ["Boulgour", "Polenta"],
    ["Orge perlé", "Blé tendre"],
  ][semaine % 4];

  return [
    "Pommes de terre",
    feculentsVariables[0],
    "Patate douce",
    feculentsVariables[1],
    "Pommes de terre",
  ][jour];
}

function choisirProteine(index: number, preference: Preference) {
  const semaine = Math.floor(index / 5);
  const jour = index % 5;

  if (preference === "vegetarien") {
    return ["Repas végétarien", "Œuf", "Galette de légumes adaptée", "Repas végétarien", "Œuf"][jour];
  }

  const poissonMaigre = poissonsMaigres[semaine % poissonsMaigres.length];
  const poissonGras = poissonsGras[semaine % poissonsGras.length];
  const poissonBlanc = poissonsBlancs[semaine % poissonsBlancs.length];
  const volaille = semaine % 2 === 0 ? "Poulet" : "Dinde";

  if (preference === "sansPorc") {
    return [poissonMaigre, volaille, "Œuf", poissonGras, semaine % 2 === 0 ? "Bœuf" : poissonBlanc][jour];
  }

  return [poissonMaigre, volaille, "Œuf", poissonGras, semaine % 2 === 0 ? "Bœuf" : "Porc"][jour];
}

function choisirElementAvecMemoire(
  liste: string[],
  utilisesSemaine: Set<string>,
  utilisesRecents: string[],
  interdits: Set<string>
) {
  let possibles = liste.filter((item) => {
    const elements = elementsDepuisTexte(item);
    return (
      !utilisesSemaine.has(item) &&
      !utilisesRecents.includes(item) &&
      elements.every((element) => !interdits.has(element))
    );
  });

  if (possibles.length === 0) {
    possibles = liste.filter((item) => {
      const elements = elementsDepuisTexte(item);
      return !utilisesRecents.includes(item) && elements.every((element) => !interdits.has(element));
    });
  }

  if (possibles.length === 0) {
    possibles = liste.filter((item) => {
      const elements = elementsDepuisTexte(item);
      return elements.every((element) => !interdits.has(element));
    });
  }

  if (possibles.length === 0) {
    possibles = liste;
  }

  const choix = possibles[Math.floor(Math.random() * possibles.length)];
  utilisesSemaine.add(choix);

  return choix;
}

function choisirFruitVarie(fruits: string[], fruitsRecents: string[]) {
  let possibles = fruits.filter((fruit) => !fruitsRecents.includes(fruit));

  if (possibles.length === 0) {
    possibles = fruits;
  }

  return possibles[Math.floor(Math.random() * possibles.length)];
}

function choisirMatiereGrasseVariee(index: number) {
  return index % 2 === 0 ? "Huile de colza" : index % 3 === 0 ? "Beurre" : "Huile d’olive";
}

function planningProteinesSemaine(semaineIndex: number, preference: Preference) {
  if (preference === "vegetarien") {
    return [
      "Repas végétarien",
      "Œuf",
      "Galette de légumes adaptée",
      "Repas végétarien",
      "Œuf",
    ];
  }

  const poissonMaigre = poissonsMaigres[semaineIndex % poissonsMaigres.length];
  const poissonGras = poissonsGras[semaineIndex % poissonsGras.length];
  const poissonBlanc = poissonsBlancs[semaineIndex % poissonsBlancs.length];
  const volaille1 = semaineIndex % 2 === 0 ? "Poulet" : "Dinde";
  const volaille2 = semaineIndex % 2 === 0 ? "Dinde" : "Poulet";

  if (preference === "sansPorc") {
    return [
      poissonMaigre,
      volaille1,
      "Œuf",
      poissonGras,
      semaineIndex % 2 === 0 ? "Bœuf" : poissonBlanc,
    ];
  }

  return [
    poissonMaigre,
    volaille1,
    "Œuf",
    poissonGras,
    semaineIndex % 2 === 0 ? "Bœuf" : "Porc",
  ];
}

function alimentEstCruditeReservee18Mois(aliment: string) {
  const alimentNormalise = normaliserTexte(aliment);

  return cruditesReservees18Mois.some((crudite) =>
    alimentNormalise.includes(normaliserTexte(crudite))
  );
}

function origineLegume(aliment: string, saison: Saison, utiliserSurgeles: boolean): OrigineAliment {
  const nom = nettoyerLegume(aliment);

  if (saisons[saison].legumes.includes(nom)) return "de saison";
  if (legumesStockables.includes(nom)) return "stockable";
  if (utiliserSurgeles && legumesSurgelesAutorises.includes(nom)) return "surgelé";

  return "hors saison";
}

function libelleOrigineLegume(aliment: string, saison: Saison, utiliserSurgeles: boolean) {
  const origine = origineLegume(aliment, saison, utiliserSurgeles);
  if (origine === "hors saison") return "";
  return `(${origine})`;
}

function legumesDisponiblesPourGeneration(saison: Saison, utiliserSurgeles: boolean) {
  const base = filtrerLegumesSansFeculents(saisons[saison].legumes);

  if (!utiliserSurgeles) return base;

  return filtrerLegumesSansFeculents(
    Array.from(new Set([...base, ...legumesStockables, ...legumesSurgelesAutorises]))
  );
}

function legumesAffichesAvecOrigine(legumes: string, saison: Saison, utiliserSurgeles: boolean) {
  return elementsDepuisTexte(legumes)
    .filter((legume) => !estFeculentCacheDansLegumes(legume))
    .map((legume) => {
      const origine = libelleOrigineLegume(legume, saison, utiliserSurgeles);
      return origine ? `${legume} ${origine}` : legume;
    })
    .join(" + ");
}

function choisirAlternativeIntroduite(enfant: Enfant, liste: string[] | undefined, fallback: string[]) {
  const introduits = liste?.filter(Boolean) || [];
  if (introduits.length > 0) return introduits[0];

  const legumesPossibles = fallback.filter((aliment) => !alimentEstCruditeReservee18Mois(aliment));
  return legumesPossibles[0] || fallback[0];
}

function adapterLegumesPourEnfant(menu: MenuJour, enfant: Enfant) {
  const ageMois = calculerAgeEnMois(enfant.date_naissance);
  const legumesMenu = elementsDepuisTexte(menu.diner.legumes);
  const legumesIntroduits = enfant.legumes_introduits || [];

  const legumesAdaptes = legumesMenu.map((legume) => {
    const cruditeNonAdaptee = ageMois < 18 && alimentEstCruditeReservee18Mois(legume);
    const nonIntroduit =
      !enfant.alimentation_diversifiee_complete &&
      legumesIntroduits.length > 0 &&
      !alimentEstIntroduit(legume, legumesIntroduits);

    if (cruditeNonAdaptee || nonIntroduit) {
      return choisirAlternativeIntroduite(enfant, legumesIntroduits, legumesDouxBebe);
    }

    return legume;
  });

  const uniques = Array.from(new Set(legumesAdaptes));
  return uniques.join(" + ");
}

function adapterFeculentPourEnfant(menu: MenuJour, enfant: Enfant) {
  if (enfant.alimentation_diversifiee_complete) return menu.diner.feculent;

  const feculents = enfant.feculents_introduits || [];
  if (feculents.length > 0 && !alimentEstIntroduit(menu.diner.feculent, feculents)) {
    return feculents[0];
  }

  return menu.diner.feculent;
}

function adapterProteinePourEnfant(menu: MenuJour, enfant: Enfant) {
  if (enfant.alimentation_diversifiee_complete) return menu.diner.proteine;

  const proteines = enfant.vvpo_introduits || [];
  if (proteines.length > 0 && !alimentEstIntroduit(menu.diner.proteine, proteines)) {
    return proteines[0];
  }

  return menu.diner.proteine;
}

function genererAdaptationEnfant(menu: MenuJour, enfant: Enfant): AdaptationEnfant {
  const ageMois = calculerAgeEnMois(enfant.date_naissance);
  const tranche = trancheAgeDepuisMois(ageMois);
  const texture = libelleTextureAlimentaire(enfant.texture_alimentaire);
  const diversificationComplete = !!enfant.alimentation_diversifiee_complete;

  const legumes = adapterLegumesPourEnfant(menu, enfant);
  const feculent = adapterFeculentPourEnfant(menu, enfant);
  const proteine = adapterProteinePourEnfant(menu, enfant);

  const cruditesRemplacees =
    ageMois < 18 &&
    elementsDepuisTexte(menu.diner.legumes).some((legume) => alimentEstCruditeReservee18Mois(legume));

  const adaptationNecessaire =
    legumes !== menu.diner.legumes ||
    feculent !== menu.diner.feculent ||
    proteine !== menu.diner.proteine ||
    tranche !== "18+" ||
    !diversificationComplete;

  let remarque = "Même base que le groupe, texture adaptée selon l’enfant.";

  if (!diversificationComplete) {
    remarque = "Diversification en cours : seuls les aliments déjà introduits sont privilégiés.";
  }

  if (cruditesRemplacees) {
    remarque = "Crudité réservée aux plus grands : légume cuit adapté proposé pour cet enfant.";
  }

  if (tranche === "4-12") {
    remarque = `${remarque} Pas de soupe : repas vapeur/mixé ou écrasé simple.`;
  }

  if (!adaptationNecessaire) {
    remarque = "Repas du groupe compatible selon les informations encodées.";
  }

  return {
    enfant: enfant.nom,
    tranche,
    texture,
    statut: diversificationComplete ? "diversification_complete" : "diversification_en_cours",
    feculent,
    legumes,
    proteine,
    remarque,
  };
}

function genererAdaptationsPourGroupe(menu: MenuJour, enfants: Enfant[]) {
  return enfants.map((enfant) => genererAdaptationEnfant(menu, enfant));
}

function genererMenu(mode: ModePeriode, nombreJours: number, preference: Preference, saison: Saison, utiliserSurgeles: boolean): MenuJour[] {
  const total = mode === "mois" ? 20 : nombreJours;
  const dataSaison = saisons[saison];
  const legumesDisponibles = legumesDisponiblesPourGeneration(saison, utiliserSurgeles);
  const menus: MenuJour[] = [];

  const legumesRecentsGlobaux: string[] = [];
  const soupesRecentesGlobales: string[] = [];
  const fruitsRecentsGlobaux: string[] = [];
  const feculentsRecentsGlobaux: string[] = [];
  const proteinesRecentesGlobales: string[] = [];

  for (let semaineIndex = 0; semaineIndex < Math.ceil(total / 5); semaineIndex++) {
    const utilisesLegumesSemaine = new Set<string>();
    const utilisesSoupesSemaine = new Set<string>();
    const utilisesFruitsSemaine = new Set<string>();
    const utilisesFeculentsSemaine = new Set<string>();
    const utilisesProteinesSemaine = new Set<string>();

    const proteinesSemaine = planningProteinesSemaine(semaineIndex, preference);

    for (let jourIndex = 0; jourIndex < 5; jourIndex++) {
      const index = semaineIndex * 5 + jourIndex;
      if (index >= total) break;

      const semaine = semaineIndex + 1;
      const jourCourt = joursSemaine[jourIndex];
      const jour = mode === "mois" ? `Semaine ${semaine} - ${jourCourt}` : jourCourt;

      const soupe = choisirElementAvecMemoire(
        dataSaison.soupes,
        utilisesSoupesSemaine,
        soupesRecentesGlobales,
        new Set()
      );

      const legumesSoupe = new Set(elementsDepuisTexte(soupe));
      const legumesInterdits = new Set([...legumesSoupe, ...legumesRecentsGlobaux]);

      const legume1 = choisirElementAvecMemoire(
        legumesDisponibles,
        utilisesLegumesSemaine,
        legumesRecentsGlobaux,
        legumesInterdits
      );

      let legumesRepas = legume1;

      if (index % 2 === 0) {
        const legume2 = choisirElementAvecMemoire(
          legumesDisponibles,
          utilisesLegumesSemaine,
          legumesRecentsGlobaux,
          new Set([...legumesInterdits, ...elementsDepuisTexte(legume1)])
        );

        if (legume2 !== legume1 && !elementsDepuisTexte(legume1).some((l) => elementsDepuisTexte(legume2).includes(l))) {
          legumesRepas = `${legume1} + ${legume2}`;
        }
      }

      const feculentBase = choisirFeculent(index);
      let feculent = feculentBase;

      if (feculentsRecentsGlobaux.includes(feculentBase)) {
        feculent = choisirElementAvecMemoire(
          feculentsTous,
          utilisesFeculentsSemaine,
          feculentsRecentsGlobaux,
          new Set()
        );
      } else {
        utilisesFeculentsSemaine.add(feculentBase);
      }

      const legumesSansFeculentsCaches = elementsDepuisTexte(legumesRepas).filter(
        (legume) => !estFeculentCacheDansLegumes(legume)
      );

      if (legumesSansFeculentsCaches.length === 0) {
        const legumesSoupeActuelle = new Set(elementsDepuisTexte(soupe));
        const remplacementLegume = choisirElementAvecMemoire(
          legumesDisponibles,
          utilisesLegumesSemaine,
          legumesRecentsGlobaux,
          new Set([...legumesSoupeActuelle])
        );

        legumesRepas = remplacementLegume;
      } else {
        legumesRepas = Array.from(new Set(legumesSansFeculentsCaches)).join(" + ");
      }

      let proteine = proteinesSemaine[jourIndex];

      if (proteinesRecentesGlobales.includes(proteine)) {
        const liste =
          preference === "vegetarien"
            ? proteinesVegetariennes
            : preference === "sansPorc"
            ? proteinesSansPorc
            : proteinesClassiques;

        proteine = choisirElementAvecMemoire(
          liste,
          utilisesProteinesSemaine,
          proteinesRecentesGlobales,
          new Set()
        );
      } else {
        utilisesProteinesSemaine.add(proteine);
      }

      const fruit = choisirFruitVarie(
        dataSaison.fruits.filter((fruit) => !utilisesFruitsSemaine.has(fruit)),
        fruitsRecentsGlobaux
      );

      utilisesFruitsSemaine.add(fruit);

      const laitier18 = laitages18[(index + semaineIndex) % laitages18.length];

      menus.push({
        index,
        semaine,
        jourCourt,
        jour,
        soupe,
        diner: {
          boisson: "Eau",
          plat: "Repas avec soupe séparée",
          feculent,
          legumes: legumesRepas,
          proteine,
          matiereGrasse: choisirMatiereGrasseVariee(index),
          herbe: herbesAromatiques[(index * 2 + semaineIndex) % herbesAromatiques.length],
          legumesOrigine: legumesAffichesAvecOrigine(legumesRepas, saison, utiliserSurgeles),
          remarque: "Soupe proposée uniquement aux enfants de 12 mois et +. Pour les moins de 12 mois : repas vapeur/mixé simple, sans soupe.",
        },
        gouter: {
          bebe: compotesBebe[(index + semaineIndex) % compotesBebe.length],
          fruit,
          pain1218: index % 2 === 0 ? "Pain beurré" : "Pain nature",
          pain18: laitier18 === "Fromage" ? "Pain" : index % 2 === 0 ? "Pain beurré" : "Pain nature",
          laitier18,
        },
      });

      soupesRecentesGlobales.push(soupe);
      if (soupesRecentesGlobales.length > 4) soupesRecentesGlobales.shift();

      elementsDepuisTexte(legumesRepas).forEach((legume) => {
        legumesRecentsGlobaux.push(legume);
      });
      while (legumesRecentsGlobaux.length > 8) legumesRecentsGlobaux.shift();

      fruitsRecentsGlobaux.push(fruit);
      if (fruitsRecentsGlobaux.length > 4) fruitsRecentsGlobaux.shift();

      feculentsRecentsGlobaux.push(feculent);
      if (feculentsRecentsGlobaux.length > 4) feculentsRecentsGlobaux.shift();

      proteinesRecentesGlobales.push(proteine);
      if (proteinesRecentesGlobales.length > 3) proteinesRecentesGlobales.shift();
    }
  }

  return menus;
}

function calculerCourses(menus: MenuJour[], enfantsParJour: Record<string, number>) {
  const result: Record<number, ListeCourses> = {};

  menus.forEach((menu) => {
    const nb = enfantsParJour[menu.jourCourt] || 0;
    if (nb === 0) return;

    if (!result[menu.semaine]) {
      result[menu.semaine] = {
        soupes: {},
        legumes: {},
        feculents: {},
        proteines: {},
        fruits: {},
        autres: {},
      };
    }

    const liste = result[menu.semaine];

    elementsDepuisTexte(menu.soupe).forEach((legume) => {
      ajouter(liste.soupes, legume, convertirEnCru(legume, nb * 80));
    });

    elementsDepuisTexte(menu.diner.legumes)
      .filter((legume) => !estFeculentCacheDansLegumes(legume))
      .forEach((legume) => {
        ajouter(liste.legumes, legume, convertirEnCru(legume, nb * 120));
      });

    ajouter(liste.feculents, menu.diner.feculent, convertirEnCru(menu.diner.feculent, nb * 120));
    ajouter(liste.proteines, menu.diner.proteine, convertirEnCru(menu.diner.proteine, nb * 25));

    menu.gouter.fruit.split("+").forEach((fruit) => {
      ajouter(liste.fruits, fruit.trim(), nb * 125);
    });

    ajouter(liste.autres, "Pain", nb * 40);

    if (menu.gouter.pain1218.includes("beurré") || menu.gouter.pain18.includes("beurré")) {
      ajouter(liste.autres, "Beurre", nb * 8);
    }

    if (menu.gouter.laitier18 === "Verre de lait") {
      ajouter(liste.autres, "Lait", nb * 150);
    } else if (menu.gouter.laitier18 !== "Non nécessaire") {
      ajouter(liste.autres, menu.gouter.laitier18, nb);
    }
  });

  return result;
}

function afficherQuantite(nom: string, quantite: number) {
  if (nom === "Lait") return `${Math.ceil(quantite)} ml`;

  if (nom.includes("Yaourt") || nom.includes("Fromage frais") || nom === "Fromage") {
    return `${Math.ceil(quantite)} portion(s)`;
  }

  if (quantite >= 1000) return `${(quantite / 1000).toFixed(2)} kg`;

  return `${Math.ceil(quantite)} g`;
}


function statutEnfantPourMenu(enfant: Enfant, menu: MenuJour) {
  const ageMois = calculerAgeEnMois(enfant.date_naissance);
  const tranche = trancheAgeDepuisMois(ageMois);
  const legumes = elementsDepuisTexte(menu.diner.legumes);
  const contientCrudite = legumes.some((legume) => cruditesReservees18Mois.includes(legume));
  const doitAdapterCrudite = tranche !== "18+" && contientCrudite;
  const texture = libelleTextureAlimentaire(enfant.texture_alimentaire);

  if (doitAdapterCrudite) {
    return {
      label: "Adaptation douce",
      detail: "Crudité remplacée par un légume cuit adapté.",
      badge: "bg-[#FFF4E6] text-[#A06621]",
      icon: "🔄",
      ok: false,
      texture,
    };
  }

  if (tranche === "4-12") {
    return {
      label: "Version bébé",
      detail: "Repas vapeur/mixé ou écrasé, sans soupe.",
      badge: "bg-[#FFF4E6] text-[#A06621]",
      icon: "👶",
      ok: false,
      texture,
    };
  }

  return {
    label: "Repas commun OK",
    detail: "Compatible selon les informations encodées.",
    badge: "bg-[#E8F2EA] text-[#45654A]",
    icon: "✅",
    ok: true,
    texture,
  };
}

function resumeGroupePourMenu(menu: MenuJour, enfants: Enfant[]) {
  const presents = enfants.length;
  const diversifEnCours = enfants.filter((enfant) => trancheAgeDepuisMois(calculerAgeEnMois(enfant.date_naissance)) === "4-12").length;
  const adaptations = enfants.filter((enfant) => !statutEnfantPourMenu(enfant, menu).ok).length;

  return { presents, diversifEnCours, adaptations };
}


function CoursesBloc({ titre, liste }: { titre: string; liste: Record<string, number> }) {
  const items = Object.entries(liste);
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl bg-[#F7F3EA] p-5">
      <h3 className="text-xl font-bold">{titre}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map(([nom, quantite]) => (
          <li key={nom} className="flex justify-between gap-4">
            <span>{nom}</span>
            <span className="font-bold">{afficherQuantite(nom, quantite)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function calculerAgeEnMois(dateNaissance: string) {
  const naissance = new Date(dateNaissance);
  const aujourdhui = new Date();

  let mois =
    (aujourdhui.getFullYear() - naissance.getFullYear()) * 12 +
    (aujourdhui.getMonth() - naissance.getMonth());

  if (aujourdhui.getDate() < naissance.getDate()) {
    mois--;
  }

  return Math.max(0, mois);
}

function afficherAgeDepuisMois(mois: number) {
  if (mois < 12) return `${mois} mois`;

  const annees = Math.floor(mois / 12);
  const reste = mois % 12;

  if (reste === 0) return `${annees} an${annees > 1 ? "s" : ""}`;

  return `${annees} an${annees > 1 ? "s" : ""} et ${reste} mois`;
}

function trancheAgeDepuisMois(mois: number): Age {
  if (mois < 12) return "4-12";
  if (mois < 18) return "12-18";
  return "18+";
}

function libelleTrancheAge(age: Age) {
  if (age === "4-12") return "4–12 mois";
  if (age === "12-18") return "12–18 mois";
  return "18 mois et +";
}

function libelleTextureAlimentaire(texture?: string) {
  if (texture === "mixe") return "Mixé";
  if (texture === "ecrase") return "Écrasé";
  if (texture === "morceaux_fondants") return "Morceaux fondants";
  if (texture === "morceaux_autonomes") return "Morceaux autonomes";
  return "Non précisée";
}

function resumeIntroductions(enfant: Enfant) {
  return (
    (enfant.fruits_introduits?.length || 0) +
    (enfant.legumes_introduits?.length || 0) +
    (enfant.feculents_introduits?.length || 0) +
    (enfant.vvpo_introduits?.length || 0) +
    (enfant.matieres_grasses_introduites?.length || 0) +
    (enfant.herbes_introduites?.length || 0) +
    (enfant.autres_introduits?.length || 0)
  );
}

function groupeTextures(enfants: Enfant[]) {
  const textures = new Set(
    enfants.map((enfant) => enfant.texture_alimentaire).filter(Boolean)
  );

  if (textures.size === 0) return "Aucune texture précisée";

  return Array.from(textures)
    .map((texture) => libelleTextureAlimentaire(texture))
    .join(" • ");
}

function allergieBloquante(enfant: Enfant, alimentsTexte: string) {
  const allergies = enfant.allergies || [];
  const texte = alimentsTexte.toLowerCase();

  return allergies.some((allergie) => {
    const a = allergie.toLowerCase();

    if (a.includes("œuf") || a.includes("oeuf")) {
      return texte.includes("œuf") || texte.includes("oeuf");
    }

    if (a.includes("poisson")) {
      return (
        poissonsMaigres.some((p) => texte.includes(p.toLowerCase())) ||
        poissonsGras.some((p) => texte.includes(p.toLowerCase())) ||
        poissonsBlancs.some((p) => texte.includes(p.toLowerCase()))
      );
    }

    if (a.includes("lait")) {
      return (
        texte.includes("lait") ||
        texte.includes("fromage") ||
        texte.includes("yaourt") ||
        texte.includes("beurre")
      );
    }

    if (a.includes("gluten") || a.includes("blé")) {
      return (
        texte.includes("pâtes") ||
        texte.includes("semoule") ||
        texte.includes("boulgour") ||
        texte.includes("blé") ||
        texte.includes("pain")
      );
    }

    return texte.includes(a);
  });
}

function verifierMenuPourEnfants(menu: MenuJour, enfants: Enfant[]) {
  const alimentsTexte = [
    menu.soupe,
    menu.diner.feculent,
    menu.diner.legumes,
    menu.diner.proteine,
    menu.diner.matiereGrasse,
    menu.diner.herbe,
    menu.gouter.fruit,
    menu.gouter.bebe,
    menu.gouter.laitier18,
  ].join(" ");

  return enfants.filter((enfant) => allergieBloquante(enfant, alimentsTexte));
}









type AlerteIntroduction = {
  enfant: string;
  aliment: string;
  categorie: "Légume" | "Féculent" | "VVP/O" | "Fruit" | "Matière grasse" | "Herbe / épice";
  alternatives: string[];
};

function normaliserTexte(texte: string) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[œ]/g, "oe")
    .trim();
}

function alimentEstIntroduit(aliment: string, liste: string[]) {
  const alimentNormalise = normaliserTexte(aliment);

  return liste.some((item) => {
    const itemNormalise = normaliserTexte(item);

    return (
      alimentNormalise.includes(itemNormalise) ||
      itemNormalise.includes(alimentNormalise)
    );
  });
}

function alternativesIntroduites(
  enfant: Enfant,
  categorie:
    | "legume"
    | "feculent"
    | "proteine"
    | "fruit"
    | "matiereGrasse"
    | "herbe"
) {
  if (categorie === "legume") return enfant.legumes_introduits || [];
  if (categorie === "feculent") return enfant.feculents_introduits || [];
  if (categorie === "proteine") return enfant.vvpo_introduits || [];
  if (categorie === "fruit") return enfant.fruits_introduits || [];
  if (categorie === "matiereGrasse") {
    return enfant.matieres_grasses_introduites || [];
  }
  return enfant.herbes_introduites || [];
}

function verifierIntroductions(menu: MenuJour, enfants: Enfant[]) {
  const alertes: AlerteIntroduction[] = [];

  enfants.forEach((enfant) => {
    if (enfant.alimentation_diversifiee_complete) return;

    const fruits = enfant.fruits_introduits || [];
    const legumes = enfant.legumes_introduits || [];
    const feculents = enfant.feculents_introduits || [];
    const proteines = enfant.vvpo_introduits || [];
    const matieresGrasses = enfant.matieres_grasses_introduites || [];
    const herbes = enfant.herbes_introduites || [];

    const legumesDuMenu = elementsDepuisTexte(menu.diner.legumes);

    legumesDuMenu.forEach((legume) => {
      if (legumes.length > 0 && !alimentEstIntroduit(legume, legumes)) {
        alertes.push({
          enfant: enfant.nom,
          aliment: legume,
          categorie: "Légume",
          alternatives: alternativesIntroduites(enfant, "legume").slice(0, 4),
        });
      }
    });

    const feculent = menu.diner.feculent;

    if (feculents.length > 0 && !alimentEstIntroduit(feculent, feculents)) {
      alertes.push({
        enfant: enfant.nom,
        aliment: feculent,
        categorie: "Féculent",
        alternatives: alternativesIntroduites(enfant, "feculent").slice(0, 4),
      });
    }

    const proteine = menu.diner.proteine;

    if (proteines.length > 0 && !alimentEstIntroduit(proteine, proteines)) {
      alertes.push({
        enfant: enfant.nom,
        aliment: proteine,
        categorie: "VVP/O",
        alternatives: alternativesIntroduites(enfant, "proteine").slice(0, 4),
      });
    }

    const fruitsDuGouter = [
      ...menu.gouter.fruit.split("+").map((fruit) => fruit.trim()),
      ...menu.gouter.bebe
        .replace("Compote", "")
        .split("-")
        .map((fruit) => fruit.trim()),
    ].filter(Boolean);

    fruitsDuGouter.forEach((fruit) => {
      if (fruits.length > 0 && !alimentEstIntroduit(fruit, fruits)) {
        alertes.push({
          enfant: enfant.nom,
          aliment: fruit,
          categorie: "Fruit",
          alternatives: alternativesIntroduites(enfant, "fruit").slice(0, 4),
        });
      }
    });

    const matiereGrasse = menu.diner.matiereGrasse;

    if (
      matieresGrasses.length > 0 &&
      !alimentEstIntroduit(matiereGrasse, matieresGrasses)
    ) {
      alertes.push({
        enfant: enfant.nom,
        aliment: matiereGrasse,
        categorie: "Matière grasse",
        alternatives: alternativesIntroduites(enfant, "matiereGrasse").slice(0, 4),
      });
    }

    const herbe = menu.diner.herbe;

    if (herbes.length > 0 && !alimentEstIntroduit(herbe, herbes)) {
      alertes.push({
        enfant: enfant.nom,
        aliment: herbe,
        categorie: "Herbe / épice",
        alternatives: alternativesIntroduites(enfant, "herbe").slice(0, 4),
      });
    }
  });

  return alertes;
}

type AlerteAllergie = {
  enfant: string;
  allergies: string[];
  alternatives: string[];
};

function alternativesPourAllergie(enfant: Enfant, alimentTexte: string) {
  const texte = normaliserTexte(alimentTexte);

  if (
    poissonsMaigres.some((p) => texte.includes(normaliserTexte(p))) ||
    poissonsGras.some((p) => texte.includes(normaliserTexte(p))) ||
    poissonsBlancs.some((p) => texte.includes(normaliserTexte(p)))
  ) {
    return (enfant.vvpo_introduits || []).filter(
      (item) =>
        !poissonsMaigres.includes(item) &&
        !poissonsGras.includes(item) &&
        !poissonsBlancs.includes(item)
    );
  }

  if (
    texte.includes("oeuf") ||
    texte.includes("poulet") ||
    texte.includes("dinde") ||
    texte.includes("boeuf") ||
    texte.includes("porc") ||
    texte.includes("veau")
  ) {
    return enfant.vvpo_introduits || [];
  }

  if (
    texte.includes("pomme") ||
    texte.includes("poire") ||
    texte.includes("banane") ||
    texte.includes("kiwi") ||
    texte.includes("fraise")
  ) {
    return enfant.fruits_introduits || [];
  }

  if (
    texte.includes("carotte") ||
    texte.includes("courgette") ||
    texte.includes("brocoli") ||
    texte.includes("chou") ||
    texte.includes("poireau")
  ) {
    return enfant.legumes_introduits || [];
  }

  if (
    texte.includes("riz") ||
    texte.includes("pates") ||
    texte.includes("semoule") ||
    texte.includes("pain") ||
    texte.includes("boulgour")
  ) {
    return enfant.feculents_introduits || [];
  }

  return [
    ...(enfant.fruits_introduits || []),
    ...(enfant.legumes_introduits || []),
    ...(enfant.feculents_introduits || []),
    ...(enfant.vvpo_introduits || []),
  ];
}

function analyserAllergies(menu: MenuJour, enfants: Enfant[]) {
  const alimentsTexte = [
    menu.soupe,
    menu.diner.feculent,
    menu.diner.legumes,
    menu.diner.proteine,
    menu.diner.matiereGrasse,
    menu.diner.herbe,
    menu.gouter.fruit,
    menu.gouter.bebe,
    menu.gouter.laitier18,
  ].join(" ");

  return enfants
    .filter((enfant) => allergieBloquante(enfant, alimentsTexte))
    .map((enfant) => ({
      enfant: enfant.nom,
      allergies: enfant.allergies || [],
      alternatives: alternativesPourAllergie(enfant, alimentsTexte).slice(0, 4),
    }));
}

function compterProteines(menus: MenuJour[]) {
  const result = {
    poisson: 0,
    poissonGras: 0,
    poissonMaigreOuBlanc: 0,
    oeuf: 0,
    volaille: 0,
    viande: 0,
    vegetarien: 0,
  };

  menus.forEach((menu) => {
    const proteine = menu.diner.proteine;

    if (poissonsGras.includes(proteine)) {
      result.poisson += 1;
      result.poissonGras += 1;
    } else if (
      poissonsMaigres.includes(proteine) ||
      poissonsBlancs.includes(proteine)
    ) {
      result.poisson += 1;
      result.poissonMaigreOuBlanc += 1;
    } else if (proteine === "Œuf") {
      result.oeuf += 1;
    } else if (["Poulet", "Dinde"].includes(proteine)) {
      result.volaille += 1;
    } else if (["Bœuf", "Veau", "Porc"].includes(proteine)) {
      result.viande += 1;
    } else {
      result.vegetarien += 1;
    }
  });

  return result;
}

function compterFeculents(menus: MenuJour[]) {
  const result = {
    pommesDeTerre: 0,
    cereales: 0,
    legumineuses: 0,
  };

  menus.forEach((menu) => {
    const feculent = normaliserTexte(menu.diner.feculent);

    if (feculent.includes("pomme") || feculent.includes("patate")) {
      result.pommesDeTerre += 1;
    } else if (
      feculent.includes("lentille") ||
      feculent.includes("pois chiche") ||
      feculent.includes("haricot")
    ) {
      result.legumineuses += 1;
    } else {
      result.cereales += 1;
    }
  });

  return result;
}

function analyseFrequences(menus: MenuJour[]) {
  const proteines = compterProteines(menus);
  const feculents = compterFeculents(menus);

  return [
    {
      label: "Poissons",
      valeur: proteines.poisson,
      objectif: menus.length >= 20 ? "6 à 8 / mois" : "1 à 2 / semaine",
    },
    {
      label: "Œufs",
      valeur: proteines.oeuf,
      objectif: menus.length >= 20 ? "4 / mois" : "environ 1 / semaine",
    },
    {
      label: "Volaille",
      valeur: proteines.volaille,
      objectif: menus.length >= 20 ? "2 à 4 / mois" : "variable",
    },
    {
      label: "Viande bœuf / veau / porc",
      valeur: proteines.viande,
      objectif: menus.length >= 20 ? "2 à 3 / mois" : "occasionnel",
    },
    {
      label: "Pommes de terre / patate douce",
      valeur: feculents.pommesDeTerre,
      objectif: menus.length >= 20 ? "8 à 12 / mois" : "2 à 3 / semaine",
    },
    {
      label: "Céréales et autres féculents",
      valeur: feculents.cereales,
      objectif: menus.length >= 20 ? "8 à 12 / mois" : "2 à 3 / semaine",
    },
    {
      label: "Légumineuses",
      valeur: feculents.legumineuses,
      objectif: menus.length >= 20 ? "2 à 4 / mois" : "occasionnel",
    },
  ];
}


const reglesImportantes = [
  "Eau tous les jours. Jus, sirops et eaux aromatisées de commerce : jamais.",
  "Cubes de bouillon industriels et sel ajouté : à exclure des préparations.",
  "Friture et friteuse : à exclure. Préférer vapeur, four, eau, mijoté doux ou cuisson douce.",
  "Le riz est à cuire dans un grand volume d’eau puis à égoutter, pas façon risotto.",
  "Les repas plus familiaux pour les 18 mois+ restent occasionnels et partagent le même quota que sauces, gratins ou préparations plus riches.",
];

export default function GenerateurPage() {
  const [mode, setMode] = useState<ModePeriode>("semaine");
  const [nombreJours, setNombreJours] = useState(5);
  const [preference, setPreference] = useState<Preference>("classique");
  const [saison, setSaison] = useState<Saison>(saisonActuelle());
  const [utiliserSurgeles, setUtiliserSurgeles] = useState(true);
  const [menus, setMenus] = useState<MenuJour[]>([]);
  const [ages, setAges] = useState<Record<Age, boolean>>({
    "4-12": true,
    "12-18": true,
    "18+": true,
  });


  const [enfantsConnectes, setEnfantsConnectes] = useState<Enfant[]>([]);
  const [modeProActif, setModeProActif] = useState(false);
  const [chargementEnfants, setChargementEnfants] = useState(true);
  const [menusSauvegardes, setMenusSauvegardes] = useState<MenuSauvegarde[]>([]);
  const [chargementMenusSauvegardes, setChargementMenusSauvegardes] = useState(true);

  const [enfantsParJour, setEnfantsParJour] = useState<Record<string, number>>({
    Lundi: 0,
    Mardi: 0,
    Mercredi: 0,
    Jeudi: 0,
    Vendredi: 0,
  });

  useEffect(() => {
    chargerEnfantsConnectes();
    chargerMenusSauvegardes();
  }, []);

  async function chargerEnfantsConnectes() {
    setChargementEnfants(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setChargementEnfants(false);
      return;
    }

    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("user_id", user.id)
      .order("nom");

    if (error) {
      console.log(error);
      setChargementEnfants(false);
      return;
    }

    setEnfantsConnectes(data || []);
    setChargementEnfants(false);
  }

  async function chargerMenusSauvegardes() {
    setChargementMenusSauvegardes(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setChargementMenusSauvegardes(false);
      return;
    }

    const { data, error } = await supabase
      .from("saved_menus")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setChargementMenusSauvegardes(false);
      return;
    }

    setMenusSauvegardes(data || []);
    setChargementMenusSauvegardes(false);
  }

  async function definirMenuActif(menuId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Tu dois être connectée.");
      return;
    }

    const menuChoisi = menusSauvegardes.find((menu) => menu.id === menuId);
    const rendreActif = !menuChoisi?.menu_actif;

    const { error: erreurReset } = await supabase
      .from("saved_menus")
      .update({ menu_actif: false, visible_parents: false })
      .eq("user_id", user.id);

    if (erreurReset) {
      console.log(erreurReset);
      alert("Erreur lors de la mise à jour des menus.");
      return;
    }

    if (rendreActif) {
      const { error } = await supabase
        .from("saved_menus")
        .update({ menu_actif: true, visible_parents: true })
        .eq("id", menuId)
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
        alert("Erreur lors du partage du menu.");
        return;
      }
    }

    await chargerMenusSauvegardes();
  }

  function appliquerEnfantsDuCompte() {
    const presences: Record<string, number> = {
      Lundi: 0,
      Mardi: 0,
      Mercredi: 0,
      Jeudi: 0,
      Vendredi: 0,
    };

    const tranches: Record<Age, boolean> = {
      "4-12": false,
      "12-18": false,
      "18+": false,
    };

    enfantsConnectes.forEach((enfant) => {
      const mois = calculerAgeEnMois(enfant.date_naissance);
      const tranche = trancheAgeDepuisMois(mois);

      tranches[tranche] = true;

      enfant.jours_presence?.forEach((jour) => {
        if (jour in presences) {
          presences[jour] += 1;
        }
      });
    });

    setEnfantsParJour(presences);
    setAges({
      "4-12": tranches["4-12"],
      "12-18": tranches["12-18"],
      "18+": tranches["18+"],
    });
    setModeProActif(true);
  }

  function enfantsPresentsLeJour(jour: string) {
    return enfantsConnectes.filter((enfant) =>
      enfant.jours_presence?.includes(jour)
    );
  }

  const listesCourses = useMemo(
    () => calculerCourses(menus, enfantsParJour),
    [menus, enfantsParJour]
  );

  function toggleAge(age: Age) {
    setAges((prev) => ({ ...prev, [age]: !prev[age] }));
  }


  function modifier(index: number, champ: "soupe" | "feculent" | "legumes" | "proteine" | "matiereGrasse" | "herbe") {
    setMenus((prev) => {
      const copie = [...prev];
      const menu = copie[index];
      const dataSaison = saisons[saison];
      const legumesDisponibles = legumesDisponiblesPourGeneration(saison, utiliserSurgeles);

      if (champ === "soupe") {
        const legumesRepas = new Set(elementsDepuisTexte(menu.diner.legumes));
        const soupesPossibles = dataSaison.soupes.filter((soupe) =>
          elementsDepuisTexte(soupe).every((legume) => !legumesRepas.has(legume))
        );

        menu.soupe = prendreDifferent(soupesPossibles.length > 0 ? soupesPossibles : dataSaison.soupes, menu.soupe);
      }

      if (champ === "feculent") {
        menu.diner.feculent = prendreDifferent(feculentsTous, menu.diner.feculent);
      }

      if (champ === "legumes") {
        const legumesSoupe = new Set(elementsDepuisTexte(menu.soupe));
        const liste = legumesDisponibles.filter((legume) =>
          elementsDepuisTexte(legume).every((element) => !legumesSoupe.has(element))
        );

        menu.diner.legumes = prendreDifferent(liste.length > 0 ? liste : legumesDisponibles, menu.diner.legumes);
        menu.diner.legumesOrigine = legumesAffichesAvecOrigine(menu.diner.legumes, saison, utiliserSurgeles);
      }

      if (champ === "proteine") {
        const liste =
          preference === "vegetarien"
            ? proteinesVegetariennes
            : preference === "sansPorc"
            ? proteinesSansPorc
            : proteinesClassiques;

        menu.diner.proteine = prendreDifferent(liste, menu.diner.proteine);
      }

      if (champ === "matiereGrasse") {
        menu.diner.matiereGrasse = prendreDifferent(matieresGrasses, menu.diner.matiereGrasse);
      }

      if (champ === "herbe") {
        menu.diner.herbe = prendreDifferent(herbesAromatiques, menu.diner.herbe);
      }

      return [...copie];
    });
  }

  function modifierGouter(index: number, champ: "fruit" | "laitier" | "bebe") {
    setMenus((prev) => {
      const copie = [...prev];
      const menu = copie[index];

      if (champ === "fruit") {
        menu.gouter.fruit = prendreDifferent(saisons[saison].fruits, menu.gouter.fruit);
      }

      if (champ === "bebe") {
        menu.gouter.bebe = prendreDifferent(compotesBebe, menu.gouter.bebe);
      }

      if (champ === "laitier") {
        menu.gouter.laitier18 = prendreDifferent(laitages18, menu.gouter.laitier18);
        menu.gouter.pain18 = menu.gouter.laitier18 === "Fromage" ? "Pain" : "Pain beurré";
      }

      return [...copie];
    });
  }

  function imprimer() {
    window.print();
  }

  async function enregistrerMenu() {
    if (menus.length === 0) {
      alert("Génère d’abord un menu avant de l’enregistrer.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Tu dois être connectée pour enregistrer un menu.");
      return;
    }

    const titre = prompt(
      "Nom du menu à enregistrer",
      mode === "mois" ? "Menu mensuel" : "Menu semaine"
    );

    if (!titre) return;

    const { error } = await supabase.from("saved_menus").insert([
      {
        user_id: user.id,
        titre,
        periode: mode,
        menus,
        courses: listesCourses,
        visible_parents: false,
        menu_actif: false,
      },
    ]);

    if (error) {
      console.log(error);
      alert("Erreur lors de l’enregistrement du menu.");
      return;
    }

    alert("Menu enregistré ✅");
    await chargerMenusSauvegardes();
  }

  return (
    <>
      <style jsx global>{`
        .print-only {
          display: none;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 1.2cm;
          }

          body {
            background: white !important;
          }

          main {
            background: white !important;
            padding: 0 !important;
          }

          .screen-only {
            display: none !important;
          }

          .print-only {
            display: block !important;
            background: white !important;
            color: black !important;
          }

          .print-footer {
            display: none !important;
          }

          .print-only table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-bottom: 18px;
            page-break-inside: auto;
          }

          .print-only th,
          .print-only td {
            border: 1px solid #777;
            padding: 5px;
            text-align: left;
            vertical-align: top;
          }

          .print-only th {
            background: #f1f1f1 !important;
            font-weight: bold;
          }

          .print-only h1 {
            font-size: 22px;
            margin: 0 0 12px;
          }

          .print-only h2 {
            font-size: 16px;
            margin: 18px 0 8px;
          }

          .print-page-break {
            page-break-before: always;
          }
        }
      `}</style>

      <main className="min-h-screen bg-[#F7F3EA] p-6 text-[#243024] lg:p-10">
        <section className="screen-only mx-auto max-w-7xl">
          <Link href="/" className="font-bold text-[#6B8F71]">
            ← Retour à l’accueil
          </Link>

          <div className="mt-6 rounded-[2.5rem] bg-white p-10 shadow-sm">
            <p className="font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
              Générateur de menus
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-tight">
              Menus de saison & liste de courses
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
              Génère des menus plus variés, avec alternance des protéines, légumes de saison,
              soupe séparée, goûters adaptés et liste de courses en poids cru.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-[#F1F7EC] p-5 text-sm leading-relaxed text-[#45654A]">
                🌿 Menu commun lisible
              </div>
              <div className="rounded-3xl bg-[#FFF4E6] p-5 text-sm leading-relaxed text-[#A06621]">
                🔄 Adaptations affichées seulement si nécessaire
              </div>
              <div className="rounded-3xl bg-[#F4F0FF] p-5 text-sm leading-relaxed text-[#6E5D8F]">
                👶 Respect des âges, textures et introductions
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Paramètres</h2>

            <div className="mt-6 rounded-[2rem] border border-[#DCEBD6] bg-[#F1F7EC] p-7 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
                Repères professionnels
              </p>
              <h3 className="mt-2 text-2xl font-bold">Règles importantes intégrées au moteur</h3>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {reglesImportantes.map((regle) => (
                  <div key={regle} className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-gray-700">
                    {regle}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[2rem] border border-[#E7E2D8] bg-[#F8F6F2] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
                    Mode professionnel
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Enfants enregistrés dans ton espace pro
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Utilise les enfants encodés dans l’espace pro pour calculer automatiquement
                    les présences par jour et les tranches d’âge.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={appliquerEnfantsDuCompte}
                  disabled={chargementEnfants || enfantsConnectes.length === 0}
                  className="rounded-full bg-[#6B8F71] px-6 py-3 font-bold text-white disabled:opacity-50"
                >
                  Utiliser mes enfants enregistrés
                </button>
              </div>

              {chargementEnfants ? (
                <p className="mt-5 text-gray-600">Chargement des enfants...</p>
              ) : enfantsConnectes.length === 0 ? (
                <p className="mt-5 text-gray-600">
                  Aucun enfant enregistré ou aucun compte pro connecté.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {enfantsConnectes.map((enfant) => {
                    const ageMois = calculerAgeEnMois(enfant.date_naissance);
                    const tranche = trancheAgeDepuisMois(ageMois);

                    return (
                      <div
                        key={enfant.id}
                        className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5"
                      >
                        <p className="text-lg font-bold">{enfant.nom}</p>

                        <p className="mt-1 text-sm text-gray-600">
                          Âge : {afficherAgeDepuisMois(ageMois)} — {libelleTrancheAge(tranche)}
                        </p>

                        <p className="mt-2 text-sm text-gray-700">
                          Présence :{" "}
                          {enfant.jours_presence?.length
                            ? enfant.jours_presence.join(" • ")
                            : "Aucun jour défini"}
                        </p>

                        <p className="mt-2 text-sm text-gray-700">
                          Texture : {libelleTextureAlimentaire(enfant.texture_alimentaire)}
                        </p>

                        <p className="mt-2 text-sm text-gray-700">
                          Introductions :{" "}
                          {enfant.alimentation_diversifiee_complete
                            ? "alimentation diversifiée complète"
                            : `${resumeIntroductions(enfant)} aliment(s)`}
                        </p>

                        {enfant.alimentation_diversifiee_complete && (
                          <p className="mt-2 rounded-full bg-[#E8F2EA] px-3 py-1 text-xs font-bold text-[#56735B]">
                            Tout introduit ✅
                          </p>
                        )}

                        {!!enfant.allergies?.length && (
                          <p className="mt-2 rounded-full bg-[#FFE5E5] px-3 py-1 text-xs font-bold text-red-500">
                            Allergie(s) : {enfant.allergies.join(", ")}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {modeProActif && (
                <div className="mt-6 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <p className="font-bold text-[#6B8F71]">
                    Mode pro activé ✅
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-5">
                    {joursSemaine.map((jour) => {
                      const presents = enfantsPresentsLeJour(jour);

                      return (
                        <div
                          key={jour}
                          className="rounded-2xl bg-[#F7F3EA] p-4"
                        >
                          <p className="font-bold">{jour}</p>

                          <p className="mt-1 text-sm">
                            {presents.length} enfant(s)
                          </p>

                          <p className="mt-2 text-xs text-gray-600">
                            {presents.length
                              ? presents.map((enfant) => enfant.nom).join(", ")
                              : "Aucun"}
                          </p>

                          {presents.length > 0 && (
                            <p className="mt-2 text-xs text-gray-600">
                              Textures : {groupeTextures(presents)}
                            </p>
                          )}

                          {presents.some((enfant) => enfant.alimentation_diversifiee_complete) && (
                            <p className="mt-2 rounded-full bg-[#E8F2EA] px-3 py-1 text-xs font-bold text-[#56735B]">
                              Tout introduit pour certains enfants
                            </p>
                          )}

                          {presents.some((enfant) => enfant.allergies?.length) && (
                            <p className="mt-2 rounded-full bg-[#FFE5E5] px-3 py-1 text-xs font-bold text-red-500">
                              Attention allergie
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-[2rem] border border-[#E7E2D8] bg-[#F8F6F2] p-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
                  Menus enregistrés
                </p>

                <h3 className="text-2xl font-bold">
                  Choisir le menu visible dans l’espace parents
                </h3>

                <p className="text-gray-600">
                  Coche un menu pour l’afficher aux parents. Si tu coches un nouveau menu,
                  l’ancien sera automatiquement retiré.
                </p>
              </div>

              {chargementMenusSauvegardes ? (
                <p className="mt-5 text-gray-600">Chargement des menus enregistrés...</p>
              ) : menusSauvegardes.length === 0 ? (
                <p className="mt-5 text-gray-600">
                  Aucun menu enregistré pour le moment.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {menusSauvegardes.map((menu) => (
                    <label
                      key={menu.id}
                      className={`cursor-pointer rounded-2xl border p-5 transition ${
                        menu.menu_actif
                          ? "border-[#6B8F71] bg-white shadow-sm"
                          : "border-[#E7E2D8] bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={menu.menu_actif}
                          onChange={() => definirMenuActif(menu.id)}
                          className="mt-1 h-5 w-5"
                        />

                        <div>
                          <p className="text-lg font-bold">{menu.titre}</p>

                          <p className="mt-1 text-sm text-gray-600">
                            {menu.periode === "mois" ? "Menu mensuel" : "Menu semaine"}
                          </p>

                          {menu.menu_actif && (
                            <p className="mt-3 rounded-full bg-[#E8F2EA] px-3 py-1 text-sm font-bold text-[#56735B]">
                              Visible parents ✅
                            </p>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setMode("semaine")}
                className={`rounded-full px-5 py-3 font-bold ${
                  mode === "semaine" ? "bg-[#6B8F71] text-white" : "bg-[#F7F3EA]"
                }`}
              >
                Semaine
              </button>

              <button
                onClick={() => setMode("mois")}
                className={`rounded-full px-5 py-3 font-bold ${
                  mode === "mois" ? "bg-[#6B8F71] text-white" : "bg-[#F7F3EA]"
                }`}
              >
                Mois complet
              </button>
            </div>

            {mode === "semaine" && (
              <div className="mt-6 flex gap-3">
                {[3, 5].map((nb) => (
                  <button
                    key={nb}
                    onClick={() => setNombreJours(nb)}
                    className={`rounded-full px-5 py-3 font-bold ${
                      nombreJours === nb ? "bg-[#6B8F71] text-white" : "bg-[#F7F3EA]"
                    }`}
                  >
                    {nb} jours
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6">
              <p className="mb-3 font-bold">Saison</p>

              <div className="flex flex-wrap gap-3">
                {(["printemps", "ete", "automne", "hiver"] as Saison[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSaison(s)}
                    className={`rounded-full px-5 py-3 font-bold ${
                      saison === s ? "bg-[#6B8F71] text-white" : "bg-[#F7F3EA]"
                    }`}
                  >
                    {s === "ete" ? "Été" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#F8F6F2] p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={utiliserSurgeles}
                  onChange={(e) => setUtiliserSurgeles(e.target.checked)}
                  className="mt-1 h-5 w-5"
                />

                <span>
                  <span className="block font-bold text-[#243024]">
                    Autoriser les légumes surgelés nature
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-gray-600">
                    Permet au générateur de varier davantage les menus tout en affichant l’origine :
                    de saison, stockable ou surgelé.
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-6">
              <p className="mb-3 font-bold">Tranches d’âge présentes</p>

              <div className="flex flex-wrap gap-3">
                {(["4-12", "12-18", "18+"] as Age[]).map((age) => (
                  <button
                    key={age}
                    onClick={() => toggleAge(age)}
                    className={`rounded-full px-5 py-3 font-bold ${
                      ages[age] ? "bg-[#6B8F71] text-white" : "bg-[#F7F3EA]"
                    }`}
                  >
                    {age === "4-12"
                      ? "👶 4–12 mois"
                      : age === "12-18"
                      ? "🧒 12–18 mois"
                      : "👧 18 mois et +"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {(["classique", "sansPorc", "vegetarien"] as Preference[]).map((pref) => (
                <button
                  key={pref}
                  onClick={() => setPreference(pref)}
                  className={`rounded-full px-5 py-3 font-bold ${
                    preference === pref ? "bg-[#6B8F71] text-white" : "bg-[#F7F3EA]"
                  }`}
                >
                  {pref === "classique"
                    ? "Classique"
                    : pref === "sansPorc"
                    ? "Sans porc"
                    : "Végétarien"}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {joursSemaine.map((jour) => (
                <div key={jour}>
                  <label className="text-sm font-bold">{jour}</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={enfantsParJour[jour]}
                    onChange={(e) =>
                      setEnfantsParJour((prev) => ({
                        ...prev,
                        [jour]: Number(e.target.value),
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-[#E8E0D5] p-3 outline-none focus:border-[#6B8F71]"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setMenus(genererMenu(mode, nombreJours, preference, saison, utiliserSurgeles))}
              className="mt-8 rounded-full bg-[#6B8F71] px-8 py-4 text-lg font-bold text-white"
            >
              Générer mon menu ✨
            </button>
          </section>

          {menus.length > 0 && (
            <>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={imprimer}
                  className="rounded-full bg-white px-6 py-3 font-bold text-[#6B8F71]"
                >
                  Imprimer menu + liste de courses
                </button>

                <button
                  onClick={enregistrerMenu}
                  className="rounded-full bg-[#6B8F71] px-6 py-3 font-bold text-white"
                >
                  Enregistrer ce menu
                </button>
              </div>

              <section className="mt-10 grid gap-6">
                {menus.map((menu) => {
                  const presents = modeProActif ? enfantsPresentsLeJour(menu.jourCourt) : [];
                  const adaptations = modeProActif ? genererAdaptationsPourGroupe(menu, presents) : [];
                  const allergiesAnalysees = modeProActif ? analyserAllergies(menu, presents) : [];
                  const introductionsDetectees = modeProActif ? verifierIntroductions(menu, presents) : [];
                  const estCompatible = allergiesAnalysees.length === 0 && introductionsDetectees.length === 0;
                  const legumesCommuns =
                    menu.diner.legumesOrigine ||
                    legumesAffichesAvecOrigine(menu.diner.legumes, saison, utiliserSurgeles);

                  const lignesAdaptations =
                    modeProActif && presents.length > 0
                      ? adaptations.map((adaptation) => {
                          const estRepasCommun =
                            adaptation.feculent === menu.diner.feculent &&
                            adaptation.legumes === menu.diner.legumes &&
                            adaptation.proteine === menu.diner.proteine &&
                            adaptation.tranche !== "4-12" &&
                            adaptation.statut === "diversification_complete";

                          const differences: string[] = [];

                          if (adaptation.tranche === "4-12") {
                            differences.push("Pas de soupe");
                          }

                          if (adaptation.feculent !== menu.diner.feculent) {
                            differences.push(`Féculent : ${adaptation.feculent}`);
                          }

                          if (adaptation.legumes !== menu.diner.legumes) {
                            differences.push(`Légumes : ${adaptation.legumes}`);
                          }

                          if (adaptation.proteine !== menu.diner.proteine) {
                            differences.push(`VVP/O : ${adaptation.proteine}`);
                          }

                          if (!differences.length) {
                            differences.push(estRepasCommun ? "Repas commun" : "Texture adaptée");
                          }

                          return {
                            nom: adaptation.enfant,
                            age: libelleTrancheAge(adaptation.tranche),
                            texture: adaptation.texture,
                            statut: estRepasCommun ? "commun" : "adapte",
                            adaptation: differences.join(" • "),
                            remarque: adaptation.remarque,
                          };
                        })
                      : [
                          {
                            nom: "4–12 mois",
                            age: "Repère",
                            texture: "Mixé / écrasé",
                            statut: "adapte",
                            adaptation: "Pas de soupe • Repas vapeur/mixé simple",
                            remarque: "Selon l’avancée de la diversification.",
                          },
                          {
                            nom: "12–18 mois",
                            age: "Repère",
                            texture: "Fondant / mouliné",
                            statut: "adapte",
                            adaptation: "Soupe possible selon texture",
                            remarque: "Texture adaptée à l’enfant.",
                          },
                          {
                            nom: "18 mois et +",
                            age: "Repère",
                            texture: "Texture autonome",
                            statut: "commun",
                            adaptation: "Repas commun",
                            remarque: "Présentation séparée si possible.",
                          },
                        ];

                  const lignesGouter =
                    modeProActif && presents.length > 0
                      ? presents.map((enfant) => {
                          const tranche = trancheAgeDepuisMois(calculerAgeEnMois(enfant.date_naissance));

                          if (tranche === "4-12") {
                            return {
                              nom: enfant.nom,
                              age: libelleTrancheAge(tranche),
                              composition: menu.gouter.bebe,
                              pain: "—",
                              laitier: "—",
                              remarque: "Compote adaptée, sans produit laitier.",
                            };
                          }

                          if (tranche === "12-18") {
                            return {
                              nom: enfant.nom,
                              age: libelleTrancheAge(tranche),
                              composition: menu.gouter.fruit,
                              pain: menu.gouter.pain1218,
                              laitier: "—",
                              remarque: "Fruit + pain selon texture.",
                            };
                          }

                          return {
                            nom: enfant.nom,
                            age: libelleTrancheAge(tranche),
                            composition: menu.gouter.fruit,
                            pain: menu.gouter.pain18,
                            laitier: menu.gouter.laitier18,
                            remarque: "Goûter 18 mois et +.",
                          };
                        })
                      : [
                          {
                            nom: "4–12 mois",
                            age: "Repère",
                            composition: menu.gouter.bebe,
                            pain: "—",
                            laitier: "—",
                            remarque: "Compote adaptée.",
                          },
                          {
                            nom: "12–18 mois",
                            age: "Repère",
                            composition: menu.gouter.fruit,
                            pain: menu.gouter.pain1218,
                            laitier: "—",
                            remarque: "Fruit + pain.",
                          },
                          {
                            nom: "18 mois et +",
                            age: "Repère",
                            composition: menu.gouter.fruit,
                            pain: menu.gouter.pain18,
                            laitier: menu.gouter.laitier18,
                            remarque: "Fruit + pain + laitier selon fréquence.",
                          },
                        ];

                  return (
                    <article key={menu.index} className="rounded-[2rem] bg-white p-8 shadow-sm">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#6B8F71]">
                            {menu.jour}
                          </p>

                          <h2 className="mt-2 text-3xl font-black text-[#243024]">
                            Menu du jour
                          </h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-4 py-2 text-sm font-bold ${
                              estCompatible
                                ? "bg-[#E8F2EA] text-[#56735B]"
                                : "bg-[#FFF4E5] text-[#9A641F]"
                            }`}
                          >
                            {estCompatible ? "✅ Compatible" : "⚠ À vérifier"}
                          </span>

                          {modeProActif && (
                            <span className="rounded-full bg-[#F7F3EA] px-4 py-2 text-sm font-bold text-[#6B8F71]">
                              {presents.length} enfant(s)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 rounded-[1.8rem] bg-[#F8F7F1] p-5 ring-1 ring-black/5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#6B8F71]">
                              Repas commun
                            </p>

                            <h3 className="mt-1 text-2xl font-black">
                              {menu.diner.plat}
                            </h3>
                          </div>

                          <p className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-700">
                            Soupe séparée pour les 12 mois et +.
                          </p>
                        </div>

                        <div className="mt-5 overflow-x-auto rounded-[1.4rem] bg-white">
                          <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-[#F1F7EC] text-[#45654A]">
                              <tr>
                                <th className="px-4 py-3">Eau</th>
                                <th className="px-4 py-3">Soupe</th>
                                <th className="px-4 py-3">Féculent</th>
                                <th className="px-4 py-3">Légumes</th>
                                <th className="px-4 py-3">VVP/O</th>
                                <th className="px-4 py-3">MG</th>
                                <th className="px-4 py-3">Herbe</th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr className="border-t border-[#EFE7DB]">
                                <td className="px-4 py-4">💧 {menu.diner.boisson}</td>
                                <td className="px-4 py-4">
                                  🍲 {menu.soupe}
                                  <button
                                    onClick={() => modifier(menu.index, "soupe")}
                                    className="mt-1 block text-xs font-bold text-[#6B8F71] underline"
                                  >
                                    Modifier
                                  </button>
                                </td>
                                <td className="px-4 py-4">
                                  🥔 {menu.diner.feculent}
                                  <button
                                    onClick={() => modifier(menu.index, "feculent")}
                                    className="mt-1 block text-xs font-bold text-[#6B8F71] underline"
                                  >
                                    Modifier
                                  </button>
                                </td>
                                <td className="px-4 py-4">
                                  🥦 {legumesCommuns}
                                  <button
                                    onClick={() => modifier(menu.index, "legumes")}
                                    className="mt-1 block text-xs font-bold text-[#6B8F71] underline"
                                  >
                                    Modifier
                                  </button>
                                </td>
                                <td className="px-4 py-4">
                                  🍗 {menu.diner.proteine}
                                  <button
                                    onClick={() => modifier(menu.index, "proteine")}
                                    className="mt-1 block text-xs font-bold text-[#6B8F71] underline"
                                  >
                                    Modifier
                                  </button>
                                </td>
                                <td className="px-4 py-4">
                                  🫒 {menu.diner.matiereGrasse}
                                  <button
                                    onClick={() => modifier(menu.index, "matiereGrasse")}
                                    className="mt-1 block text-xs font-bold text-[#6B8F71] underline"
                                  >
                                    Modifier
                                  </button>
                                </td>
                                <td className="px-4 py-4">
                                  🌿 {menu.diner.herbe}
                                  <button
                                    onClick={() => modifier(menu.index, "herbe")}
                                    className="mt-1 block text-xs font-bold text-[#6B8F71] underline"
                                  >
                                    Modifier
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-6 xl:grid-cols-2">
                        <div className="rounded-[1.8rem] border border-[#E4EDDF] bg-[#F7FBF5] p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#6B8F71]">
                                Adaptations repas
                              </p>

                              <h3 className="mt-1 text-2xl font-black">
                                Ce qui change
                              </h3>
                            </div>
                          </div>

                          <div className="mt-5 overflow-x-auto rounded-[1.4rem] bg-white">
                            <table className="w-full min-w-[620px] text-left text-sm">
                              <thead className="bg-[#F1F7EC] text-[#45654A]">
                                <tr>
                                  <th className="px-4 py-3">Enfant</th>
                                  <th className="px-4 py-3">Âge</th>
                                  <th className="px-4 py-3">Texture</th>
                                  <th className="px-4 py-3">Adaptation</th>
                                </tr>
                              </thead>

                              <tbody>
                                {lignesAdaptations.map((ligne) => (
                                  <tr key={`${menu.index}-${ligne.nom}-adaptation`} className="border-t border-[#EFE7DB]">
                                    <td className="px-4 py-4 font-black">{ligne.nom}</td>
                                    <td className="px-4 py-4">
                                      <span className="rounded-full bg-[#F7F3EA] px-3 py-1 text-xs font-bold">
                                        {ligne.age}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4">{ligne.texture}</td>
                                    <td className="px-4 py-4">
                                      <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                                          ligne.statut === "commun"
                                            ? "bg-[#E8F2EA] text-[#56735B]"
                                            : "bg-[#FFF4E5] text-[#9A641F]"
                                        }`}
                                      >
                                        {ligne.statut === "commun" ? "🟢" : "🟠"} {ligne.adaptation}
                                      </span>
                                      <p className="mt-2 text-xs leading-relaxed text-gray-500">
                                        {ligne.remarque}
                                      </p>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="rounded-[1.8rem] bg-[#FFFDF8] p-5 ring-1 ring-black/5">
                          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B2782D]">
                                Goûter
                              </p>

                              <h3 className="mt-1 text-2xl font-black">
                                Par enfant
                              </h3>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => modifierGouter(menu.index, "bebe")}
                                className="text-sm font-bold text-[#6B8F71] underline"
                              >
                                Compote
                              </button>
                              <button
                                onClick={() => modifierGouter(menu.index, "fruit")}
                                className="text-sm font-bold text-[#6B8F71] underline"
                              >
                                Fruits
                              </button>
                              <button
                                onClick={() => modifierGouter(menu.index, "laitier")}
                                className="text-sm font-bold text-[#6B8F71] underline"
                              >
                                Laitier
                              </button>
                            </div>
                          </div>

                          <div className="mt-5 overflow-x-auto rounded-[1.4rem] bg-white">
                            <table className="w-full min-w-[620px] text-left text-sm">
                              <thead className="bg-[#FFF4E5] text-[#9A641F]">
                                <tr>
                                  <th className="px-4 py-3">Enfant</th>
                                  <th className="px-4 py-3">Âge</th>
                                  <th className="px-4 py-3">Fruit / compote</th>
                                  <th className="px-4 py-3">Pain</th>
                                  <th className="px-4 py-3">Laitier</th>
                                </tr>
                              </thead>

                              <tbody>
                                {lignesGouter.map((ligne) => (
                                  <tr key={`${menu.index}-${ligne.nom}-gouter`} className="border-t border-[#EFE7DB]">
                                    <td className="px-4 py-4 font-black">{ligne.nom}</td>
                                    <td className="px-4 py-4">
                                      <span className="rounded-full bg-[#F7F3EA] px-3 py-1 text-xs font-bold">
                                        {ligne.age}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4">🍎 {ligne.composition}</td>
                                    <td className="px-4 py-4">🍞 {ligne.pain}</td>
                                    <td className="px-4 py-4">🥛 {ligne.laitier}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <details className="mt-6 rounded-[1.6rem] bg-[#F8F7F1] p-5">
                        <summary className="cursor-pointer font-black text-[#6B8F71]">
                          Voir les vérifications allergies / introductions
                        </summary>

                        {modeProActif ? (
                          <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
                            {allergiesAnalysees.length > 0 ? (
                              <div className="rounded-2xl bg-[#FFE5E5] p-4 text-red-600">
                                <p className="font-bold">Allergies possibles détectées</p>
                                <div className="mt-3 space-y-2">
                                  {allergiesAnalysees.map((item, index) => (
                                    <div key={`${item.enfant}-allergie-${index}`} className="rounded-xl bg-white p-3">
                                      <p className="font-bold">{item.enfant}</p>
                                      <p>Allergie(s) : {item.allergies.join(", ")}</p>
                                      <p>
                                        Alternative : {item.alternatives.length > 0 ? item.alternatives.join(", ") : "aucune alternative enregistrée"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="rounded-2xl bg-white p-4">
                                Aucune allergie détectée automatiquement.
                              </p>
                            )}

                            {introductionsDetectees.length > 0 ? (
                              <div className="rounded-2xl bg-[#FFF4E5] p-4 text-[#9A641F]">
                                <p className="font-bold">Aliments non introduits détectés</p>
                                <div className="mt-3 space-y-2">
                                  {introductionsDetectees.map((item, index) => (
                                    <div key={`${item.enfant}-${item.aliment}-${index}`} className="rounded-xl bg-white p-3">
                                      <p className="font-bold">{item.aliment} non introduit chez {item.enfant}</p>
                                      <p>Catégorie : {item.categorie}</p>
                                      <p>
                                        Alternative : {item.alternatives.length > 0 ? item.alternatives.join(", ") : "aucune alternative enregistrée"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="rounded-2xl bg-white p-4">
                                Aucun aliment non introduit détecté automatiquement.
                              </p>
                            )}

                            <p className="text-xs leading-relaxed text-gray-500">
                              Cette vérification reste une aide : les consignes des parents, les protocoles médicaux et l’observation de l’enfant restent prioritaires.
                            </p>
                          </div>
                        ) : (
                          <p className="mt-4 text-sm leading-relaxed text-gray-600">
                            Active le mode pro avec les enfants enregistrés pour voir les vérifications automatiques.
                          </p>
                        )}
                      </details>
                    </article>
                  );
                })}
              </section>


              <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-bold">📊 Contrôle des fréquences</h2>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Ce tableau donne un repère rapide sur la répartition du menu généré.
                  Il ne remplace pas une validation professionnelle, mais aide à repérer
                  les grands équilibres.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {analyseFrequences(menus).map((item) => (
                    <div key={item.label} className="rounded-2xl bg-[#F7F3EA] p-5">
                      <p className="text-lg font-bold text-[#243024]">
                        {item.label}
                      </p>

                      <p className="mt-2 text-3xl font-black text-[#6B8F71]">
                        {item.valeur}
                      </p>

                      <p className="mt-2 text-sm text-gray-600">
                        Repère : {item.objectif}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-bold">🛒 Liste de courses</h2>
                <p className="mt-3 text-gray-600">Quantités calculées en poids cru à acheter.</p>

                <div className="mt-6 grid gap-8">
                  {Object.entries(listesCourses).map(([semaine, liste]) => (
                    <div key={semaine}>
                      <h3 className="text-2xl font-bold">Semaine {semaine}</h3>

                      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <CoursesBloc titre="🍲 Légumes pour soupe" liste={liste.soupes} />
                        <CoursesBloc titre="🥦 Légumes repas" liste={liste.legumes} />
                        <CoursesBloc titre="🥔 Féculents" liste={liste.feculents} />
                        <CoursesBloc titre="🍗 VVP/O" liste={liste.proteines} />
                        <CoursesBloc titre="🍎 Fruits" liste={liste.fruits} />
                        <CoursesBloc titre="🧺 Autres" liste={liste.autres} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </section>

        <div className="print-only">
          <h1>Menus générés</h1>
          <p style={{ fontSize: "10px", marginBottom: "10px" }}>
            Astuce impression : activez “En-têtes et pieds de page” dans la fenêtre d’impression du navigateur pour afficher la numérotation automatique des pages.
          </p>

          <table>
            <thead>
              <tr>
                <th>Jour</th>
                <th>Soupe</th>
                <th>Féculent</th>
                <th>Légumes</th>
                <th>VVP/O</th>
                <th>MG</th>
                <th>Herbe</th>
                <th>Goûter 4–12 mois</th>
                <th>Goûter 12–18 mois</th>
                <th>Goûter 18 mois +</th>
              </tr>
            </thead>

            <tbody>
              {menus.map((menu) => (
                <tr key={menu.index}>
                  <td>{menu.jour}</td>
                  <td>{menu.soupe}</td>
                  <td>{menu.diner.feculent}</td>
                  <td>{menu.diner.legumes}</td>
                  <td>{menu.diner.proteine}</td>
                  <td>{menu.diner.matiereGrasse}</td>
                  <td>{menu.diner.herbe}</td>
                  <td>{menu.gouter.bebe}</td>
                  <td>
                    {menu.gouter.fruit}
                    <br />
                    {menu.gouter.pain1218}
                  </td>
                  <td>
                    {menu.gouter.fruit}
                    <br />
                    {menu.gouter.pain18}
                    {menu.gouter.laitier18 !== "Non nécessaire" && (
                      <>
                        <br />
                        {menu.gouter.laitier18}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {Object.entries(listesCourses).map(([semaine, liste]) => (
            <div key={semaine} className="print-page-break">
              <h2>Liste de courses — Semaine {semaine}</h2>

              <table>
                <thead>
                  <tr>
                    <th>Catégorie</th>
                    <th>Aliment</th>
                    <th>Quantité à acheter</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(liste.soupes).map(([nom, q]) => (
                    <tr key={`s-${nom}`}>
                      <td>Soupe</td>
                      <td>{nom}</td>
                      <td>{afficherQuantite(nom, q)}</td>
                    </tr>
                  ))}

                  {Object.entries(liste.legumes).map(([nom, q]) => (
                    <tr key={`l-${nom}`}>
                      <td>Légumes repas</td>
                      <td>{nom}</td>
                      <td>{afficherQuantite(nom, q)}</td>
                    </tr>
                  ))}

                  {Object.entries(liste.feculents).map(([nom, q]) => (
                    <tr key={`f-${nom}`}>
                      <td>Féculents</td>
                      <td>{nom}</td>
                      <td>{afficherQuantite(nom, q)}</td>
                    </tr>
                  ))}

                  {Object.entries(liste.proteines).map(([nom, q]) => (
                    <tr key={`p-${nom}`}>
                      <td>VVP/O</td>
                      <td>{nom}</td>
                      <td>{afficherQuantite(nom, q)}</td>
                    </tr>
                  ))}

                  {Object.entries(liste.fruits).map(([nom, q]) => (
                    <tr key={`fr-${nom}`}>
                      <td>Fruits</td>
                      <td>{nom}</td>
                      <td>{afficherQuantite(nom, q)}</td>
                    </tr>
                  ))}

                  {Object.entries(liste.autres).map(([nom, q]) => (
                    <tr key={`a-${nom}`}>
                      <td>Autres</td>
                      <td>{nom}</td>
                      <td>{afficherQuantite(nom, q)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
