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

const saisons: Record<Saison, {
  legumes: string[];
  soupes: string[];
  fruits: string[];
}> = {
  printemps: {
    legumes: [
      "Carotte",
      "Courgette",
      "Brocoli",
      "Petits pois",
      "Haricots verts",
      "Épinard",
      "Fenouil",
      "Chou-fleur",
      "Betterave",
    ],
    soupes: [
      "Soupe carotte-courgette",
      "Soupe brocoli-courgette",
      "Soupe petits pois-carotte",
      "Soupe fenouil-carotte",
    ],
    fruits: [
      "Pomme + poire",
      "Banane + pomme",
      "Pomme + fraise",
      "Poire + kiwi",
      "Banane + fraise",
    ],
  },
  ete: {
    legumes: [
      "Courgette",
      "Tomate cuite douce",
      "Aubergine",
      "Haricots verts",
      "Carotte",
      "Brocoli",
      "Petits pois",
      "Poivron doux cuit",
      "Concombre cuit doux",
    ],
    soupes: [
      "Soupe courgette-pomme de terre",
      "Soupe tomate douce-carotte",
      "Soupe courgette-carotte",
      "Soupe haricots verts-pomme de terre",
    ],
    fruits: [
      "Pêche + pomme",
      "Abricot + pomme",
      "Banane + pêche",
      "Pomme + fraise",
      "Poire + abricot",
    ],
  },
  automne: {
    legumes: [
      "Carotte",
      "Butternut",
      "Potiron",
      "Poireau",
      "Brocoli",
      "Chou-fleur",
      "Courgette",
      "Épinard",
      "Betterave",
    ],
    soupes: [
      "Soupe poireau-butternut",
      "Soupe carotte-potiron",
      "Soupe brocoli-courgette",
      "Soupe chou-fleur-carotte",
    ],
    fruits: [
      "Pomme + poire",
      "Banane + pomme",
      "Poire + kiwi",
      "Pomme + prune",
      "Compote pomme-poire",
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
      "Épinard",
      "Fenouil",
      "Céleri rave",
      "Betterave",
    ],
    soupes: [
      "Soupe poireau-pomme de terre",
      "Soupe carotte-butternut",
      "Soupe chou-fleur-carotte",
      "Soupe potiron-carotte",
    ],
    fruits: [
      "Pomme + poire",
      "Banane + pomme",
      "Poire + mandarine",
      "Pomme + kiwi",
      "Compote pomme-banane",
    ],
  },
};

const feculentsSemaine = [
  "Pommes de terre",
  "Riz",
  "Patate douce",
  "Pâtes",
  "Pommes de terre",
];

const alternativesFeculents = [
  "Semoule",
  "Quinoa",
  "Boulgour",
  "Polenta",
  "Riz",
  "Pâtes",
  "Pommes de terre",
  "Patate douce",
];

const matieresGrasses = ["Huile de colza", "Huile d’olive", "Beurre"];

const proteinesClassiques = [
  "Cabillaud",
  "Poulet",
  "Œuf dur",
  "Saumon",
  "Bœuf",
  "Dinde",
  "Colin",
  "Truite",
  "Porc",
];

const proteinesSansPorc = [
  "Cabillaud",
  "Poulet",
  "Œuf dur",
  "Saumon",
  "Bœuf",
  "Dinde",
  "Colin",
  "Truite",
];

const proteinesVegetariennes = [
  "Repas végétarien",
  "Œuf dur",
  "Repas végétarien",
  "Galette de légumes adaptée",
];

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
];

const conversionCru: Record<string, number> = {
  "Pommes de terre": 1,
  "Patate douce": 1,
  Riz: 0.4,
  Pâtes: 0.4,
  Semoule: 0.4,
  Quinoa: 0.4,
  Boulgour: 0.4,
  Polenta: 0.4,

  Poulet: 1.2,
  Dinde: 1.2,
  Cabillaud: 1.18,
  Colin: 1.18,
  Saumon: 1.18,
  Truite: 1.18,
  Bœuf: 1.18,
  Porc: 1.43,
  "Œuf dur": 1,
  "Repas végétarien": 1.25,
  "Galette de légumes adaptée": 1.25,

  Carotte: 1.1,
  Courgette: 1.16,
  Brocoli: 1.06,
  "Chou-fleur": 1.06,
  Poireau: 1.25,
  Épinard: 1.65,
  Fenouil: 1.2,
  Betterave: 1.07,
  "Petits pois": 1.07,
  Butternut: 1.1,
  Potiron: 1.1,
  "Haricots verts": 1.1,
  "Tomate cuite douce": 1.1,
  Aubergine: 1.07,
  "Poivron doux cuit": 1.15,
  "Concombre cuit doux": 1.15,
  "Céleri rave": 1.16,
};

function saisonActuelle(): Saison {
  const mois = new Date().getMonth() + 1;
  if ([3, 4, 5].includes(mois)) return "printemps";
  if ([6, 7, 8].includes(mois)) return "ete";
  if ([9, 10, 11].includes(mois)) return "automne";
  return "hiver";
}

function prendreDifferent(liste: string[], actuel: string) {
  const possibles = liste.filter((item) => item !== actuel);
  return possibles[Math.floor(Math.random() * possibles.length)] ?? liste[0];
}

function choisirSansRepetition(
  liste: string[],
  utilises: Set<string>,
  interditCourt: Set<string>
) {
  let possibles = liste.filter(
    (item) => !utilises.has(item) && !interditCourt.has(item)
  );

  if (possibles.length === 0) {
    possibles = liste.filter((item) => !interditCourt.has(item));
  }

  if (possibles.length === 0) {
    possibles = liste;
  }

  const choix = possibles[Math.floor(Math.random() * possibles.length)];
  utilises.add(choix);
  return choix;
}

function elementsDepuisTexte(texte: string) {
  return texte
    .replaceAll("Soupe", "")
    .replaceAll("soupe", "")
    .split(/[-+]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ajouter(liste: Record<string, number>, nom: string, quantite: number) {
  liste[nom] = (liste[nom] || 0) + quantite;
}

function convertirEnCru(nom: string, poidsCuit: number) {
  return poidsCuit * (conversionCru[nom] ?? 1.25);
}

function choisirProteine(index: number, preference: Preference) {
  const semaine = Math.floor(index / 5);
  const jour = index % 5;

  if (preference === "vegetarien") {
    return proteinesVegetariennes[jour % proteinesVegetariennes.length];
  }

  if (preference === "sansPorc") {
    return [
      semaine % 2 === 0 ? "Cabillaud" : "Colin",
      semaine % 2 === 0 ? "Poulet" : "Dinde",
      "Œuf dur",
      semaine % 2 === 0 ? "Saumon" : "Truite",
      "Bœuf",
    ][jour];
  }

  return [
    semaine % 2 === 0 ? "Cabillaud" : "Colin",
    semaine % 2 === 0 ? "Poulet" : "Dinde",
    "Œuf dur",
    semaine % 2 === 0 ? "Saumon" : "Truite",
    semaine % 2 === 0 ? "Bœuf" : "Porc",
  ][jour];
}

function genererMenu(
  mode: ModePeriode,
  nombreJours: number,
  preference: Preference,
  saison: Saison
): MenuJour[] {
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

      const jourSoupe = jourIndex === 1 || (mode === "mois" && jourIndex === 4 && semaine % 2 === 0);
      const soupe = jourSoupe
        ? choisirSansRepetition(dataSaison.soupes, utilisesSoupes, legumesDerniersJours)
        : "";

      const legumesSoupe = new Set(elementsDepuisTexte(soupe));

      const legume1 = choisirSansRepetition(
        dataSaison.legumes,
        utilisesLegumes,
        new Set([...legumesDerniersJours, ...legumesSoupe])
      );

      let legumesRepas = legume1;

      if (index % 3 === 0) {
        const legume2 = choisirSansRepetition(
          dataSaison.legumes,
          utilisesLegumes,
          new Set([...legumesDerniersJours, ...legumesSoupe, legume1])
        );

        if (legume2 !== legume1) {
          legumesRepas = `${legume1} + ${legume2}`;
        }
      }

      legumesDerniersJours.clear();
      elementsDepuisTexte(legumesRepas).forEach((l) => legumesDerniersJours.add(l));
      elementsDepuisTexte(soupe).forEach((l) => legumesDerniersJours.add(l));

      const feculent =
        jourIndex === 0 || jourIndex === 2 || jourIndex === 4
          ? feculentsSemaine[jourIndex]
          : semaineIndex % 2 === 0
          ? feculentsSemaine[jourIndex]
          : alternativesFeculents[(semaineIndex + jourIndex) % alternativesFeculents.length];

      const proteine = choisirProteine(index, preference);
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
          plat: jourSoupe ? "Repas avec soupe séparée" : index % 5 === 3 ? "Plat doux adapté" : "Repas simple",
          feculent,
          legumes: legumesRepas,
          proteine,
          matiereGrasse: matieresGrasses[index % matieresGrasses.length],
          remarque: jourSoupe
            ? "Soupe proposée uniquement aux enfants de 12 mois et +. Pour les moins de 12 mois : repas vapeur/mixé simple, sans soupe."
            : index % 5 === 3
            ? "Plat plus construit uniquement si la texture est adaptée. Avant 12 mois : version simple séparée."
            : "Repas simple : féculent + légume + VVP/O + matière grasse.",
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

    if (menu.soupe) {
      elementsDepuisTexte(menu.soupe).forEach((legume) => {
        ajouter(liste.soupes, legume, convertirEnCru(legume, nb * 80));
      });
    }

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

  if (
    nom.includes("Yaourt") ||
    nom.includes("Fromage frais") ||
    nom === "Fromage"
  ) {
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

  function modifier(index: number, champ: "soupe" | "feculent" | "legumes" | "proteine" | "matiereGrasse") {
    setMenus((prev) => {
      const copie = [...prev];
      const menu = copie[index];
      const dataSaison = saisons[saison];

      if (champ === "soupe") {
        menu.soupe = menu.soupe
          ? prendreDifferent(dataSaison.soupes, menu.soupe)
          : dataSaison.soupes[0];
        menu.diner.remarque =
          "Soupe proposée uniquement aux enfants de 12 mois et +. Pour les moins de 12 mois : repas vapeur/mixé simple, sans soupe.";
      }

      if (champ === "feculent") {
        menu.diner.feculent = prendreDifferent(alternativesFeculents, menu.diner.feculent);
      }

      if (champ === "legumes") {
        const liste = [
          ...dataSaison.legumes,
          `${dataSaison.legumes[0]} + ${dataSaison.legumes[1]}`,
          `${dataSaison.legumes[2]} + ${dataSaison.legumes[3]}`,
        ];

        menu.diner.legumes = prendreDifferent(liste, menu.diner.legumes);
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
              Génère des menus plus variés, avec légumes de saison, soupe séparée
              et liste de courses calculée en poids cru à acheter.
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

                      <div className="mt-4 grid gap-4 md:grid-cols-6">
                        <div>
                          💧 {menu.diner.boisson}
                        </div>

                        <div>
                          🍲 {menu.soupe || "Pas de soupe"}
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
                <th>Goûter 18 mois +</th>
              </tr>
            </thead>

            <tbody>
              {menus.map((menu) => (
                <tr key={menu.index}>
                  <td>{menu.jour}</td>
                  <td>{menu.soupe || "-"}</td>
                  <td>{menu.diner.feculent}</td>
                  <td>{menu.diner.legumes}</td>
                  <td>{menu.diner.proteine}</td>
                  <td>{menu.diner.matiereGrasse}</td>
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
      </main>
    </>
  );
}
