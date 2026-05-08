"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Age = "4-12" | "12-18" | "18+";
type Preference = "classique" | "sansPorc" | "vegetarien";
type ModePeriode = "semaine" | "mois";
type Saison = "printemps" | "ete" | "automne" | "hiver";

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

function genererMenu(mode: ModePeriode, nombreJours: number, preference: Preference, saison: Saison): MenuJour[] {
  const total = mode === "mois" ? 20 : nombreJours;
  const dataSaison = saisons[saison];
  const menus: MenuJour[] = [];

  for (let semaineIndex = 0; semaineIndex < Math.ceil(total / 5); semaineIndex++) {
    const utilisesLegumes = new Set<string>();
    const utilisesSoupes = new Set<string>();
    const legumesDerniersJours = new Set<string>();

    for (let jourIndex = 0; jourIndex < 5; jourIndex++) {
      const index = semaineIndex * 5 + jourIndex;
      if (index >= total) break;

      const semaine = semaineIndex + 1;
      const jourCourt = joursSemaine[jourIndex];
      const jour = mode === "mois" ? `Semaine ${semaine} - ${jourCourt}` : jourCourt;

      const soupe = choisirSoupeSansRepeter(dataSaison.soupes, utilisesSoupes, legumesDerniersJours);
      const legumesSoupe = new Set(elementsDepuisTexte(soupe));

      const legumesInterdits = new Set([...legumesDerniersJours, ...legumesSoupe]);

      const legume1 = choisirSansRepetition(dataSaison.legumes, utilisesLegumes, legumesInterdits);

      let legumesRepas = legume1;

      if (index % 3 === 0) {
        const legume2 = choisirSansRepetition(
          dataSaison.legumes,
          utilisesLegumes,
          new Set([...legumesInterdits, ...elementsDepuisTexte(legume1)])
        );

        if (legume2 !== legume1) {
          legumesRepas = `${legume1} + ${legume2}`;
        }
      }

      legumesDerniersJours.clear();
      elementsDepuisTexte(legumesRepas).forEach((l) => legumesDerniersJours.add(l));
      elementsDepuisTexte(soupe).forEach((l) => legumesDerniersJours.add(l));

      const laitier18 = laitages18[index % laitages18.length];
      const fruit = dataSaison.fruits[index % dataSaison.fruits.length];

      menus.push({
        index,
        semaine,
        jourCourt,
        jour,
        soupe,
        diner: {
          boisson: "Eau",
          plat: "Repas avec soupe séparée",
          feculent: choisirFeculent(index),
          legumes: legumesRepas,
          proteine: choisirProteine(index, preference),
          matiereGrasse: matieresGrasses[index % matieresGrasses.length],
          herbe: herbesAromatiques[index % herbesAromatiques.length],
          remarque: "Soupe proposée uniquement aux enfants de 12 mois et +. Pour les moins de 12 mois : repas vapeur/mixé simple, sans soupe.",
        },
        gouter: {
          bebe: compotesBebe[index % compotesBebe.length],
          fruit,
          pain1218: "Pain beurré",
          pain18: laitier18 === "Fromage" ? "Pain" : "Pain beurré",
          laitier18,
        },
      });
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

  const [enfantsParJour, setEnfantsParJour] = useState<Record<string, number>>({
    Lundi: 0,
    Mardi: 0,
    Mercredi: 0,
    Jeudi: 0,
    Vendredi: 0,
  });

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

  return (
    <>
      <style jsx global>{`
        .print-only {
          display: none;
        }

        @media print {
          body * {
            visibility: hidden;
          }

          @page {
            margin: 1.5cm;
          }

          .page-number::after {
            content: counter(page);
          }

          .print-footer {
            position: fixed;
            bottom: 0;
            right: 0;
            font-size: 10px;
            color: #666;
          }

          .print-only,
          .print-only * {
            visibility: visible;
          }

          .print-only {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 16px;
          }

          .screen-only {
            display: none !important;
          }

          .print-only table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-bottom: 20px;
          }

          .print-only th,
          .print-only td {
            border: 1px solid #999;
            padding: 5px;
            text-align: left;
            vertical-align: top;
          }

          .print-only h1 {
            font-size: 22px;
            margin-bottom: 12px;
          }

          .print-only h2 {
            font-size: 16px;
            margin: 18px 0 8px;
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
              Génère des menus variés avec soupe séparée tous les jours, légumes de saison,
              herbes aromatiques et liste de courses en poids cru.
            </p>
          </div>

          <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Paramètres</h2>

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
            <div key={semaine}>
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

        <div className="print-footer print-only">
          Page <span className="page-number"></span>
        </div>
      </main>
    </>
  );
}
