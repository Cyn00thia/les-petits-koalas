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

function genererMenu(mode: ModePeriode, nombreJours: number, preference: Preference, saison: Saison): MenuJour[] {
  const total = mode === "mois" ? 20 : nombreJours;
  const dataSaison = saisons[saison];
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
        dataSaison.legumes,
        utilisesLegumesSemaine,
        legumesRecentsGlobaux,
        legumesInterdits
      );

      let legumesRepas = legume1;

      if (index % 2 === 0) {
        const legume2 = choisirElementAvecMemoire(
          dataSaison.legumes,
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

    elementsDepuisTexte(menu.diner.legumes).forEach((legume) => {
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









function alternativesIntroduites(
  enfant: Enfant,
  categorie: "legume" | "feculent" | "proteine"
) {
  if (categorie === "legume") return enfant.legumes_introduits || [];
  if (categorie === "feculent") return enfant.feculents_introduits || [];
  return enfant.vvpo_introduits || [];
}

function verifierIntroductions(menu: MenuJour, enfants: Enfant[]) {
  const alertes: any[] = [];

  enfants.forEach((enfant) => {
    const legumes = enfant.legumes_introduits || [];
    const feculents = enfant.feculents_introduits || [];
    const proteines = enfant.vvpo_introduits || [];

    if (legumes.length > 0 && !legumes.includes(menu.diner.legumes)) {
      alertes.push({
        enfant: enfant.nom,
        aliment: menu.diner.legumes,
        alternatives: alternativesIntroduites(enfant, "legume"),
      });
    }

    if (feculents.length > 0 && !feculents.includes(menu.diner.feculent)) {
      alertes.push({
        enfant: enfant.nom,
        aliment: menu.diner.feculent,
        alternatives: alternativesIntroduites(enfant, "feculent"),
      });
    }

    if (proteines.length > 0 && !proteines.includes(menu.diner.proteine)) {
      alertes.push({
        enfant: enfant.nom,
        aliment: menu.diner.proteine,
        alternatives: alternativesIntroduites(enfant, "proteine"),
      });
    }
  });

  return alertes;
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
        const liste = dataSaison.legumes.filter((legume) =>
          elementsDepuisTexte(legume).every((element) => !legumesSoupe.has(element))
        );

        menu.diner.legumes = prendreDifferent(liste.length > 0 ? liste : dataSaison.legumes, menu.diner.legumes);
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

            <div className="mt-6 rounded-3xl bg-[#F1F7EC] p-5 text-sm leading-relaxed text-[#45654A]">
              🌿 Les propositions restent adaptables : chaque enfant évolue à son propre rythme,
              et chaque professionnelle adapte selon son groupe, son temps et la réalité du jour.
            </div>
          </div>

          <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Paramètres</h2>

            <div className="mt-6 rounded-[2rem] border border-[#DCEBD6] bg-[#F1F7EC] p-6">
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
                        className="rounded-2xl bg-white p-4 shadow-sm"
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
                          Introductions : {resumeIntroductions(enfant)} aliment(s)
                        </p>

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
                <div className="mt-6 rounded-2xl bg-white p-5">
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
              onClick={() => setMenus(genererMenu(mode, nombreJours, preference, saison))}
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
                {menus.map((menu) => (
                  <article key={menu.index} className="rounded-[2rem] bg-white p-8 shadow-sm">
                    <h2 className="text-3xl font-bold">{menu.jour}</h2>

                    <div className="mt-6 rounded-3xl bg-[#F8F8F4] p-6">
                      <p className="font-bold text-[#6B8F71]">Dîner commun</p>
                      <h3 className="mt-3 text-2xl font-bold">{menu.diner.plat}</h3>

                      <div className="mt-4 grid gap-4 md:grid-cols-7">
                        <div>💧 {menu.diner.boisson}</div>

                        <div>
                          🍲 {menu.soupe}
                          <button onClick={() => modifier(menu.index, "soupe")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier soupe
                          </button>
                        </div>

                        <div>
                          🥔 {menu.diner.feculent}
                          <button onClick={() => modifier(menu.index, "feculent")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier féculent
                          </button>
                        </div>

                        <div>
                          🥦 {menu.diner.legumes}
                          <button onClick={() => modifier(menu.index, "legumes")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier légumes
                          </button>
                        </div>

                        <div>
                          🍗 {menu.diner.proteine}
                          <button onClick={() => modifier(menu.index, "proteine")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier VVP/O
                          </button>
                        </div>

                        <div>
                          🫒 {menu.diner.matiereGrasse}
                          <button onClick={() => modifier(menu.index, "matiereGrasse")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier MG
                          </button>
                        </div>

                        <div>
                          🌿 {menu.diner.herbe}
                          <button onClick={() => modifier(menu.index, "herbe")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier herbe
                          </button>
                        </div>
                      </div>

                      <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-gray-700">
                        {menu.diner.remarque}
                      </p>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      {ages["4-12"] && (
                        <div className="rounded-2xl bg-[#F7F3EA] p-5">
                          <p className="font-bold">👶 4–12 mois</p>
                          <p className="mt-2 text-sm text-gray-700">
                            Pas de soupe. Repas vapeur/mixé simple : féculent + légumes + VVP/O selon l’avancée de la diversification.
                          </p>
                          <p className="mt-3">Goûter : {menu.gouter.bebe}</p>
                          <button onClick={() => modifierGouter(menu.index, "bebe")} className="mt-2 text-sm font-bold text-[#6B8F71] underline">
                            Modifier compote
                          </button>
                        </div>
                      )}

                      {ages["12-18"] && (
                        <div className="rounded-2xl bg-[#F7F3EA] p-5">
                          <p className="font-bold">🧒 12–18 mois</p>
                          <p className="mt-2 text-sm text-gray-700">
                            Soupe possible si texture adaptée. Morceaux fondants ou mouliné selon l’enfant.
                          </p>
                          <p className="mt-3">Goûter : {menu.gouter.fruit} + {menu.gouter.pain1218}</p>
                          <button onClick={() => modifierGouter(menu.index, "fruit")} className="mt-2 text-sm font-bold text-[#6B8F71] underline">
                            Modifier fruits
                          </button>
                        </div>
                      )}

                      {ages["18+"] && (
                        <div className="rounded-2xl bg-[#F7F3EA] p-5">
                          <p className="font-bold">👧 18 mois et +</p>
                          <p className="mt-2 text-sm text-gray-700">
                            Soupe possible. Repas présenté séparé si possible avec textures fondantes.
                          </p>
                          <p className="mt-3">
                            Goûter : {menu.gouter.fruit} + {menu.gouter.pain18}
                            {menu.gouter.laitier18 !== "Non nécessaire" ? ` + ${menu.gouter.laitier18}` : ""}
                          </p>
                          <div className="mt-2 flex gap-4">
                            <button onClick={() => modifierGouter(menu.index, "fruit")} className="text-sm font-bold text-[#6B8F71] underline">
                              Modifier fruits
                            </button>
                            <button onClick={() => modifierGouter(menu.index, "laitier")} className="text-sm font-bold text-[#6B8F71] underline">
                              Modifier laitier
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {modeProActif && (
                      <div className="mt-6 rounded-2xl bg-[#FFF8E8] p-5">
                        <p className="font-bold text-[#B2782D]">
                          Vérification automatique du groupe
                        </p>

                        {(() => {
                          const presents = enfantsPresentsLeJour(menu.jourCourt);
                          const allergiesDetectees = verifierMenuPourEnfants(menu, presents);

                          return (
                            <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
                              <p>
                                Enfants présents :{" "}
                                {presents.length
                                  ? presents.map((enfant) => enfant.nom).join(", ")
                                  : "aucun enfant renseigné ce jour"}
                              </p>

                              {presents.length > 0 && (
                                <p>Textures du groupe : {groupeTextures(presents)}</p>
                              )}

                              {allergiesDetectees.length > 0 ? (
                                <div className="rounded-2xl bg-[#FFE5E5] p-4 text-red-600">
                                  <p className="font-bold">
                                    Attention : allergie possible détectée
                                  </p>
                                  <p className="mt-1">
                                    {allergiesDetectees
                                      .map((enfant) => enfant.nom)
                                      .join(", ")}
                                  </p>
                                </div>
                              ) : (
                                <p className="rounded-2xl bg-white p-4">
                                  Aucune allergie détectée automatiquement pour ce menu.
                                </p>
                              )}

                              <p className="rounded-2xl bg-white p-4 text-xs text-gray-600">
                                Cette vérification reste une aide : les consignes des parents,
                                les protocoles médicaux et l’observation de l’enfant restent prioritaires.
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div className="mt-6 rounded-2xl bg-[#F1F7EC] p-5">
                      <p className="font-bold text-[#6B8F71]">🌿 Adaptation des repas</p>

                      <p className="mt-3 text-sm leading-relaxed text-gray-700">
                        Les textures, allergies et introductions alimentaires sont définies dans chaque fiche enfant.
                        Le générateur récupère ces informations pour aider à vérifier la cohérence du menu,
                        tout en gardant les idées de présentation dans l’onglet Recettes et les informations
                        pédagogiques dans l’onglet Le savais-tu.
                      </p>
                    </div>
                  </article>
                ))}
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
