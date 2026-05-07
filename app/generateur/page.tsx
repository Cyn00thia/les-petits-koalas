"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Age = "4-12" | "12-18" | "18+";
type Preference = "classique" | "sansPorc" | "vegetarien";
type ModePeriode = "semaine" | "mois";
type StyleRepas = "simple" | "soupe" | "platFamilial";

type Quantites = {
  feculent: string;
  legumes: string;
  proteine: string;
  matiereGrasse: string;
};

type MenuJour = {
  index: number;
  semaine: number;
  jourCourt: string;
  jour: string;
  style: StyleRepas;
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
  textures: Record<Age, string>;
  quantites: Record<Age, Quantites>;
};

type ListeCourses = {
  legumes: Record<string, number>;
  feculents: Record<string, number>;
  proteines: Record<string, number>;
  fruits: Record<string, number>;
  autres: Record<string, number>;
};

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const legumesSimples = [
  "Carotte",
  "Courgette",
  "Brocoli",
  "Haricots verts",
  "Chou-fleur",
  "Épinard",
  "Poireau",
  "Potiron",
  "Butternut",
  "Petits pois",
  "Fenouil",
  "Betterave",
];

const associationsLegumes = [
  "Carotte + courgette",
  "Brocoli + courgette",
  "Poireau + butternut",
  "Carotte + chou-fleur",
  "Courgette + tomate cuite douce",
  "Potiron + carotte",
  "Épinard + pomme de terre",
];

const soupes = [
  "Soupe poireau + butternut",
  "Soupe carotte + potiron",
  "Soupe courgette + pomme de terre",
  "Soupe brocoli + courgette",
];

const feculentsPommesDeTerre = [
  "Pommes de terre",
  "Patate douce",
];

const autresFeculents = [
  "Riz",
  "Pâtes",
  "Semoule",
  "Quinoa",
  "Boulgour",
  "Polenta",
];

const tousFeculents = [
  ...feculentsPommesDeTerre,
  ...autresFeculents,
];

const proteinesClassiques = [
  "Cabillaud",
  "Colin",
  "Saumon",
  "Truite",
  "Poulet",
  "Dinde",
  "Bœuf",
  "Porc",
  "Œuf dur",
];

const proteinesSansPorc = [
  "Cabillaud",
  "Colin",
  "Saumon",
  "Truite",
  "Poulet",
  "Dinde",
  "Bœuf",
  "Œuf dur",
];

const proteinesVegetariennes = [
  "Repas végétarien",
  "Œuf dur",
];

const matieresGrasses = [
  "Huile de colza",
  "Huile d’olive",
  "Beurre",
];

const compotesBebe = [
  "Compote pomme-banane-poire",
  "Compote pomme-poire",
  "Compote banane-fraise-pomme",
  "Compote pomme-abricot",
  "Compote poire-banane-kiwi",
  "Compote pomme-pêche",
  "Compote poire-mangue",
];

const fruitsGouter = [
  "Pomme + poire",
  "Banane + pomme",
  "Poire + kiwi",
  "Pomme + fraise",
  "Banane + pêche",
  "Pomme + abricot",
  "Poire + mandarine",
];

const laitagesMois18 = [
  "Non nécessaire",
  "Fromage",
  "Non nécessaire",
  "Yaourt nature",
  "Non nécessaire",
  "Verre de lait",
  "Non nécessaire",
  "Fromage frais",
  "Non nécessaire",
  "Yaourt nature",
  "Non nécessaire",
  "Fromage",
  "Non nécessaire",
  "Verre de lait",
  "Non nécessaire",
  "Fromage frais",
  "Non nécessaire",
  "Non nécessaire",
  "Yaourt nature",
  "Non nécessaire",
];

const facteursCruPour100gCuit: Record<string, number> = {
  "Pommes de terre": 100,
  "Patate douce": 100,

  "Pâtes": 40,
  "Riz": 40,
  "Semoule": 40,
  "Quinoa": 40,
  "Boulgour": 40,
  "Polenta": 40,

  "Poulet": 120,
  "Dinde": 120,
  "Cabillaud": 118,
  "Colin": 118,
  "Saumon": 118,
  "Truite": 118,
  "Bœuf": 118,
  "Porc": 143,
  "Œuf dur": 100,

  "Brocoli": 106,
  "Chou-fleur": 106,
  "Carotte": 110,
  "Courgette": 116,
  "Céleri rave": 116,
  "Fenouil": 120,
  "Poireau": 125,
  "Épinard": 165,
  "Champignons": 165,
  "Betterave": 107,
  "Petits pois": 107,
  "Haricots verts": 110,
  "Potiron": 110,
  "Butternut": 110,
  "Tomate cuite douce": 110,
};

function prendreDifferent(liste: string[], actuel: string) {
  const possibles = liste.filter((item) => item !== actuel);
  return possibles[Math.floor(Math.random() * possibles.length)] ?? liste[0];
}

function convertirCuitVersCru(aliment: string, poidsCuit: number) {
  const facteur = facteursCruPour100gCuit[aliment] ?? 125;
  return (poidsCuit * facteur) / 100;
}

function ajouterQuantite(
  liste: Record<string, number>,
  nom: string,
  quantite: number
) {
  if (!liste[nom]) liste[nom] = 0;
  liste[nom] += quantite;
}

function extraireElements(texte: string) {
  return texte
    .replaceAll("Soupe", "")
    .split("+")
    .map((item) => item.trim())
    .filter(Boolean);
}

function choisirFeculent(index: number) {
  const semaine = Math.floor(index / 5);
  const jourSemaine = index % 5;

  const autresParSemaine = [
    ["Riz", "Pâtes"],
    ["Semoule", "Quinoa"],
    ["Boulgour", "Polenta"],
    ["Riz", "Semoule"],
  ];

  const autres = autresParSemaine[semaine % autresParSemaine.length];

  const plan = [
    "Pommes de terre",
    autres[0],
    "Patate douce",
    autres[1],
    "Pommes de terre",
  ];

  return plan[jourSemaine];
}

function choisirProteine(index: number, preference: Preference) {
  const semaine = Math.floor(index / 5);
  const jourSemaine = index % 5;

  if (preference === "vegetarien") {
    return [
      "Repas végétarien",
      "Œuf dur",
      "Repas végétarien",
      "Repas végétarien",
      "Repas végétarien",
    ][jourSemaine];
  }

  if (preference === "sansPorc") {
    return [
      semaine % 2 === 0 ? "Cabillaud" : "Colin",
      semaine % 2 === 0 ? "Poulet" : "Dinde",
      "Œuf dur",
      semaine % 2 === 0 ? "Saumon" : "Truite",
      "Bœuf",
    ][jourSemaine];
  }

  return [
    semaine % 2 === 0 ? "Cabillaud" : "Colin",
    semaine % 2 === 0 ? "Poulet" : "Dinde",
    "Œuf dur",
    semaine % 2 === 0 ? "Saumon" : "Truite",
    semaine % 2 === 0 ? "Bœuf" : "Porc",
  ][jourSemaine];
}

function choisirStyle(index: number): StyleRepas {
  if (index % 5 === 1) return "soupe";
  if (index % 5 === 3) return "platFamilial";
  return "simple";
}

function quantitesONE(): Record<Age, Quantites> {
  return {
    "4-12": {
      feculent: "70 à 125 g",
      legumes: "70 à 125 g",
      proteine: "5 à 15 g",
      matiereGrasse: "5 à 15 ml d’huile / beurre selon préparation",
    },
    "12-18": {
      feculent: "100 à 125 g",
      legumes: "100 à 125 g",
      proteine: "10 à 15 g",
      matiereGrasse: "15 ml d’huile ou 20 g de beurre selon préparation",
    },
    "18+": {
      feculent: "100 à 125 g",
      legumes: "100 à 125 g",
      proteine: "20 à 30 g",
      matiereGrasse: "10 ml d’huile ou 15 g de beurre selon préparation",
    },
  };
}function genererMenu(
  modePeriode: ModePeriode,
  nombreJours: number,
  preference: Preference
): MenuJour[] {
  const total = modePeriode === "mois" ? 20 : nombreJours;

  return Array.from({ length: total }, (_, index) => {
    const semaine = Math.floor(index / 5) + 1;
    const jourCourt = joursSemaine[index % 5];
    const jour =
      modePeriode === "mois" ? `Semaine ${semaine} - ${jourCourt}` : jourCourt;

    const style = choisirStyle(index);

    let plat = "Repas simple";
    let legumes = legumesSimples[index % legumesSimples.length];
    let remarque =
      "Repas simple : féculent + légume + VVP/O + matière grasse. Adaptation selon l’âge.";

    if (style === "soupe") {
      plat = soupes[index % soupes.length];
      legumes = `${plat} + ${
        associationsLegumes[index % associationsLegumes.length]
      }`;
      remarque =
        "Repas avec soupe possible. Avant 12 mois : version vapeur/mixée simple, sans sauce.";
    }

    if (style === "platFamilial") {
      plat =
        index % 2 === 0
          ? "Pâtes sauce légumes maison"
          : "Couscous doux adapté";
      legumes = associationsLegumes[index % associationsLegumes.length];
      remarque =
        "Plat plus construit uniquement pour les 12 mois et +. Avant 12 mois : repas simple séparé.";
    }

    const laitier18 = laitagesMois18[index % laitagesMois18.length];

    return {
      index,
      semaine,
      jourCourt,
      jour,
      style,
      diner: {
        boisson: "Eau",
        plat,
        feculent: choisirFeculent(index),
        legumes,
        proteine: choisirProteine(index, preference),
        matiereGrasse: index % 2 === 0 ? "Huile de colza" : "Huile d’olive",
        remarque,
      },
      gouter: {
        bebe: compotesBebe[index % compotesBebe.length],
        fruit: fruitsGouter[index % fruitsGouter.length],
        pain1218: "Pain beurré",
        pain18: laitier18 === "Fromage" ? "Pain" : "Pain beurré",
        laitier18,
      },
      textures: {
        "4-12":
          "Repas simple uniquement : vapeur, purée lisse ou très finement écrasée. Pas de sauce ni plat familial avant 12 mois.",
        "12-18":
          "Texture écrasée, moulinée ou petits morceaux fondants. Plats doux possibles si adaptés.",
        "18+":
          "Morceaux fondants, aliments séparés si besoin. Plats plus construits possibles, sans sauce industrielle.",
      },
      quantites: quantitesONE(),
    };
  });
}

function calculerListeCourses(
  menus: MenuJour[],
  enfantsParJour: Record<string, number>
): Record<number, ListeCourses> {
  const result: Record<number, ListeCourses> = {};

  menus.forEach((menu) => {
    const nbEnfants =
      enfantsParJour[menu.jour] ?? enfantsParJour[menu.jourCourt] ?? 0;

    if (nbEnfants === 0) return;

    if (!result[menu.semaine]) {
      result[menu.semaine] = {
        legumes: {},
        feculents: {},
        proteines: {},
        fruits: {},
        autres: {},
      };
    }

    const liste = result[menu.semaine];

    extraireElements(menu.diner.legumes).forEach((legume) => {
      const poidsCuit = nbEnfants * 120;
      const poidsCru = convertirCuitVersCru(legume, poidsCuit);
      ajouterQuantite(liste.legumes, legume, poidsCru);
    });

    ajouterQuantite(
      liste.feculents,
      menu.diner.feculent,
      convertirCuitVersCru(menu.diner.feculent, nbEnfants * 120)
    );

    ajouterQuantite(
      liste.proteines,
      menu.diner.proteine,
      convertirCuitVersCru(menu.diner.proteine, nbEnfants * 25)
    );

    menu.gouter.fruit.split("+").forEach((fruit) => {
      ajouterQuantite(liste.fruits, fruit.trim(), nbEnfants * 100 * 1.25);
    });

    ajouterQuantite(liste.autres, "Pain", nbEnfants * 40);

    if (
      menu.gouter.pain1218.includes("beurré") ||
      menu.gouter.pain18.includes("beurré")
    ) {
      ajouterQuantite(liste.autres, "Beurre", nbEnfants * 8);
    }

    if (menu.gouter.laitier18 !== "Non nécessaire") {
      if (menu.gouter.laitier18 === "Verre de lait") {
        ajouterQuantite(liste.autres, "Lait", nbEnfants * 150);
      } else {
        ajouterQuantite(liste.autres, menu.gouter.laitier18, nbEnfants);
      }
    }
  });

  return result;
}

function afficherQuantite(nom: string, quantite: number) {
  if (
    nom.includes("Yaourt") ||
    nom.includes("Fromage frais") ||
    nom.includes("Petit suisse") ||
    nom === "Fromage"
  ) {
    return `${Math.ceil(quantite)} portion(s)`;
  }

  if (nom === "Lait") {
    return `${Math.ceil(quantite)} ml`;
  }

  if (quantite >= 1000) {
    return `${(quantite / 1000).toFixed(2)} kg`;
  }

  return `${Math.ceil(quantite)} g`;
}

function CoursesBloc({
  titre,
  liste,
}: {
  titre: string;
  liste: Record<string, number>;
}) {
  const entrees = Object.entries(liste);

  if (entrees.length === 0) return null;

  return (
    <div className="rounded-2xl bg-[#F7F3EA] p-5">
      <h3 className="text-xl font-bold">{titre}</h3>

      <ul className="mt-3 space-y-2 text-sm">
        {entrees.map(([nom, quantite]) => (
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
  const [ages, setAges] = useState<Record<Age, boolean>>({
    "4-12": true,
    "12-18": true,
    "18+": true,
  });

  const [modePeriode, setModePeriode] = useState<ModePeriode>("semaine");
  const [nombreJours, setNombreJours] = useState(5);
  const [preference, setPreference] = useState<Preference>("classique");
  const [menus, setMenus] = useState<MenuJour[]>([]);

  const [enfantsParJour, setEnfantsParJour] = useState<Record<string, number>>({
    Lundi: 0,
    Mardi: 0,
    Mercredi: 0,
    Jeudi: 0,
    Vendredi: 0,
  });

  const listesCourses = useMemo(
    () => calculerListeCourses(menus, enfantsParJour),
    [menus, enfantsParJour]
  );

  function toggleAge(age: Age) {
    setAges((prev) => ({ ...prev, [age]: !prev[age] }));
  }

  function modifierNombreEnfants(jour: string, valeur: string) {
    setEnfantsParJour((prev) => ({
      ...prev,
      [jour]: Number(valeur),
    }));
  }

  function modifierFeculent(index: number) {
    setMenus((prev) => {
      const copie = [...prev];
      copie[index].diner.feculent = prendreDifferent(
        tousFeculents,
        copie[index].diner.feculent
      );
      return [...copie];
    });
  }

  function modifierLegumes(index: number) {
    setMenus((prev) => {
      const copie = [...prev];
      const liste = [...legumesSimples, ...associationsLegumes];
      copie[index].diner.legumes = prendreDifferent(
        liste,
        copie[index].diner.legumes
      );
      return [...copie];
    });
  }

  function modifierProteine(index: number) {
    setMenus((prev) => {
      const copie = [...prev];

      const liste =
        preference === "vegetarien"
          ? proteinesVegetariennes
          : preference === "sansPorc"
          ? proteinesSansPorc
          : proteinesClassiques;

      copie[index].diner.proteine = prendreDifferent(
        liste,
        copie[index].diner.proteine
      );

      return [...copie];
    });
  }

  function modifierMatiereGrasse(index: number) {
    setMenus((prev) => {
      const copie = [...prev];
      copie[index].diner.matiereGrasse = prendreDifferent(
        matieresGrasses,
        copie[index].diner.matiereGrasse
      );
      return [...copie];
    });
  }

  function modifierCompote(index: number) {
    setMenus((prev) => {
      const copie = [...prev];
      copie[index].gouter.bebe = prendreDifferent(
        compotesBebe,
        copie[index].gouter.bebe
      );
      return [...copie];
    });
  }

  function modifierFruit(index: number) {
    setMenus((prev) => {
      const copie = [...prev];
      copie[index].gouter.fruit = prendreDifferent(
        fruitsGouter,
        copie[index].gouter.fruit
      );
      return [...copie];
    });
  }

  function modifierLaitier18(index: number) {
    setMenus((prev) => {
      const copie = [...prev];

      const nouveauLaitier = prendreDifferent(
        ["Non nécessaire", "Yaourt nature", "Fromage frais", "Fromage", "Verre de lait"],
        copie[index].gouter.laitier18
      );

      copie[index].gouter.laitier18 = nouveauLaitier;
      copie[index].gouter.pain18 =
        nouveauLaitier === "Fromage" ? "Pain" : "Pain beurré";

      return [...copie];
    });
  }

  function sauvegarderMenu() {
    localStorage.setItem("menuSemaine", JSON.stringify(menus));
    alert("Menu sauvegardé sur cet appareil ✅");
  }

  function imprimerMenu() {
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
              Menus & liste de courses
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
              Génère une semaine ou un mois de repas variés, puis calcule les
              courses en poids cru à acheter.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <section className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Paramètres</h2>

              <div className="mt-6">
                <p className="mb-3 font-bold">Période</p>

                <div className="flex flex-wrap gap-3">
                  {(["semaine", "mois"] as ModePeriode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setModePeriode(mode)}
                      className={`rounded-full px-5 py-3 font-bold ${
                        modePeriode === mode
                          ? "bg-[#6B8F71] text-white"
                          : "bg-[#F7F3EA]"
                      }`}
                    >
                      {mode === "semaine" ? "Semaine" : "Mois complet"}
                    </button>
                  ))}
                </div>
              </div>

              {modePeriode === "semaine" && (
                <div className="mt-6">
                  <p className="mb-3 font-bold">Nombre de jours</p>

                  <div className="flex gap-3">
                    {[3, 5].map((nb) => (
                      <button
                        key={nb}
                        onClick={() => setNombreJours(nb)}
                        className={`rounded-full px-5 py-3 font-bold ${
                          nombreJours === nb
                            ? "bg-[#6B8F71] text-white"
                            : "bg-[#F7F3EA]"
                        }`}
                      >
                        {nb} jours
                      </button>
                    ))}
                  </div>
                </div>
              )}

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

              <div className="mt-6">
                <p className="mb-3 font-bold">Préférences</p>

                <div className="flex flex-wrap gap-3">
                  {(["classique", "sansPorc", "vegetarien"] as Preference[]).map(
                    (pref) => (
                      <button
                        key={pref}
                        onClick={() => setPreference(pref)}
                        className={`rounded-full px-5 py-3 font-bold ${
                          preference === pref
                            ? "bg-[#6B8F71] text-white"
                            : "bg-[#F7F3EA]"
                        }`}
                      >
                        {pref === "classique"
                          ? "Classique"
                          : pref === "sansPorc"
                          ? "Sans porc"
                          : "Végétarien"}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 font-bold">Nombre d’enfants par jour</p>

                <div className="grid gap-3 md:grid-cols-5">
                  {joursSemaine.map((jour) => (
                    <div key={jour}>
                      <label className="text-sm font-bold">{jour}</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={enfantsParJour[jour]}
                        onChange={(e) =>
                          modifierNombreEnfants(jour, e.target.value)
                        }
                        className="mt-2 w-full rounded-2xl border border-[#E8E0D5] p-3 outline-none focus:border-[#6B8F71]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  setMenus(genererMenu(modePeriode, nombreJours, preference))
                }
                className="mt-8 rounded-full bg-[#6B8F71] px-8 py-4 text-lg font-bold text-white"
              >
                Générer mon menu ✨
              </button>
            </section>

            <aside className="rounded-[2rem] bg-[#E8F2EA] p-8 shadow-sm">
              <div className="text-6xl">🐨</div>

              <h2 className="mt-5 text-2xl font-bold">Règles intégrées</h2>

              <ul className="mt-4 space-y-3 text-gray-700">
                <li>✔ Courses calculées en poids cru</li>
                <li>✔ Semaine ou mois complet</li>
                <li>✔ Classique, sans porc ou végétarien</li>
                <li>✔ Féculent, légume, VVP/O et MG modifiables</li>
                <li>✔ Liste de courses par semaine</li>
              </ul>
            </aside>
          </div>          {menus.length > 0 && (
            <>
              <div className="screen-only mt-10 flex flex-wrap gap-4">
                <button
                  onClick={sauvegarderMenu}
                  className="rounded-full bg-[#243024] px-6 py-3 font-bold text-white"
                >
                  Sauvegarder
                </button>

                <button
                  onClick={imprimerMenu}
                  className="rounded-full bg-[#6B8F71] px-6 py-3 font-bold text-white"
                >
                  Imprimer
                </button>
              </div>

              <section className="mt-10 space-y-10">
                {menus.map((menu) => (
                  <article
                    key={menu.index}
                    className="rounded-[2rem] bg-white p-8 shadow-sm"
                  >
                    <h2 className="text-4xl font-bold">{menu.jour}</h2>

                    <div className="mt-8 rounded-3xl bg-[#F7F3EA] p-6">
                      <p className="text-sm font-bold uppercase tracking-wide text-[#6B8F71]">
                        Dîner commun
                      </p>

                      <h3 className="mt-3 text-3xl font-bold">
                        {menu.diner.plat}
                      </h3>

                      <div className="mt-6 grid gap-4 md:grid-cols-5">
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-sm text-gray-500">💧 Boisson</p>
                          <p className="mt-2 font-bold">
                            {menu.diner.boisson}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-sm text-gray-500">🥔 Féculent</p>

                          <p className="mt-2 font-bold">
                            {menu.diner.feculent}
                          </p>

                          <button
                            onClick={() => modifierFeculent(menu.index)}
                            className="mt-2 text-sm font-bold text-[#6B8F71]"
                          >
                            Modifier
                          </button>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-sm text-gray-500">🥦 Légumes</p>

                          <p className="mt-2 font-bold">
                            {menu.diner.legumes}
                          </p>

                          <button
                            onClick={() => modifierLegumes(menu.index)}
                            className="mt-2 text-sm font-bold text-[#6B8F71]"
                          >
                            Modifier
                          </button>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-sm text-gray-500">🍗 VVP/O</p>

                          <p className="mt-2 font-bold">
                            {menu.diner.proteine}
                          </p>

                          <button
                            onClick={() => modifierProteine(menu.index)}
                            className="mt-2 text-sm font-bold text-[#6B8F71]"
                          >
                            Modifier
                          </button>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-sm text-gray-500">
                            🫒 Matière grasse
                          </p>

                          <p className="mt-2 font-bold">
                            {menu.diner.matiereGrasse}
                          </p>

                          <button
                            onClick={() => modifierMatiereGrasse(menu.index)}
                            className="mt-2 text-sm font-bold text-[#6B8F71]"
                          >
                            Modifier
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-gray-700">
                        {menu.diner.remarque}
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                      {ages["4-12"] && (
                        <div className="rounded-3xl bg-[#FFF7E7] p-6">
                          <h3 className="text-2xl font-bold">
                            👶 4–12 mois
                          </h3>

                          <p className="mt-4 text-gray-700">
                            {menu.textures["4-12"]}
                          </p>

                          <div className="mt-6 rounded-2xl bg-white p-5">
                            <p className="font-bold">
                              Quantités de référence
                            </p>

                            <ul className="mt-3 space-y-2 text-sm">
                              <li>
                                🥔 Féculent :{" "}
                                {menu.quantites["4-12"].feculent}
                              </li>

                              <li>
                                🥦 Légumes :{" "}
                                {menu.quantites["4-12"].legumes}
                              </li>

                              <li>
                                🍗 VVP/O :{" "}
                                {menu.quantites["4-12"].proteine}
                              </li>

                              <li>
                                🫒 MG :{" "}
                                {menu.quantites["4-12"].matiereGrasse}
                              </li>
                            </ul>
                          </div>

                          <div className="mt-5 rounded-2xl bg-white p-5">
                            <p className="font-bold">Goûter</p>

                            <p className="mt-3">
                              🍎 {menu.gouter.bebe}
                            </p>

                            <button
                              onClick={() => modifierCompote(menu.index)}
                              className="mt-3 text-sm font-bold text-[#6B8F71]"
                            >
                              Modifier
                            </button>
                          </div>
                        </div>
                      )}

                      {ages["12-18"] && (
                        <div className="rounded-3xl bg-[#FFF7E7] p-6">
                          <h3 className="text-2xl font-bold">
                            🧒 12–18 mois
                          </h3>

                          <p className="mt-4 text-gray-700">
                            {menu.textures["12-18"]}
                          </p>

                          <div className="mt-6 rounded-2xl bg-white p-5">
                            <p className="font-bold">
                              Quantités de référence
                            </p>

                            <ul className="mt-3 space-y-2 text-sm">
                              <li>
                                🥔 Féculent :{" "}
                                {menu.quantites["12-18"].feculent}
                              </li>

                              <li>
                                🥦 Légumes :{" "}
                                {menu.quantites["12-18"].legumes}
                              </li>

                              <li>
                                🍗 VVP/O :{" "}
                                {menu.quantites["12-18"].proteine}
                              </li>

                              <li>
                                🫒 MG :{" "}
                                {menu.quantites["12-18"].matiereGrasse}
                              </li>
                            </ul>
                          </div>

                          <div className="mt-5 rounded-2xl bg-white p-5">
                            <p className="font-bold">Goûter</p>

                            <p className="mt-3">
                              🍎 {menu.gouter.fruit}
                            </p>

                            <p className="mt-2">
                              🍞 {menu.gouter.pain1218}
                            </p>

                            <button
                              onClick={() => modifierFruit(menu.index)}
                              className="mt-3 text-sm font-bold text-[#6B8F71]"
                            >
                              Modifier fruits
                            </button>
                          </div>
                        </div>
                      )}

                      {ages["18+"] && (
                        <div className="rounded-3xl bg-[#FFF7E7] p-6">
                          <h3 className="text-2xl font-bold">
                            👧 18 mois et +
                          </h3>

                          <p className="mt-4 text-gray-700">
                            {menu.textures["18+"]}
                          </p>

                          <div className="mt-6 rounded-2xl bg-white p-5">
                            <p className="font-bold">
                              Quantités de référence
                            </p>

                            <ul className="mt-3 space-y-2 text-sm">
                              <li>
                                🥔 Féculent :{" "}
                                {menu.quantites["18+"].feculent}
                              </li>

                              <li>
                                🥦 Légumes :{" "}
                                {menu.quantites["18+"].legumes}
                              </li>

                              <li>
                                🍗 VVP/O :{" "}
                                {menu.quantites["18+"].proteine}
                              </li>

                              <li>
                                🫒 MG :{" "}
                                {menu.quantites["18+"].matiereGrasse}
                              </li>
                            </ul>
                          </div>

                          <div className="mt-5 rounded-2xl bg-white p-5">
                            <p className="font-bold">Goûter</p>

                            <p className="mt-3">
                              🍎 {menu.gouter.fruit}
                            </p>

                            <p className="mt-2">
                              🍞 {menu.gouter.pain18}
                            </p>

                            {menu.gouter.laitier18 !==
                              "Non nécessaire" && (
                              <p className="mt-2">
                                🥛 {menu.gouter.laitier18}
                              </p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-4">
                              <button
                                onClick={() => modifierFruit(menu.index)}
                                className="text-sm font-bold text-[#6B8F71]"
                              >
                                Modifier fruits
                              </button>

                              <button
                                onClick={() => modifierLaitier18(menu.index)}
                                className="text-sm font-bold text-[#6B8F71]"
                              >
                                Modifier laitier
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </section>

              <section className="mt-12 rounded-[2rem] bg-white p-8 shadow-sm">
                <h2 className="text-4xl font-bold">
                  🛒 Liste de courses
                </h2>

                <p className="mt-3 text-gray-600">
                  Quantités calculées en poids cru à acheter.
                </p>

                <div className="mt-8 space-y-10">
                  {Object.entries(listesCourses).map(
                    ([semaine, contenu]) => (
                      <div key={semaine}>
                        <h3 className="text-3xl font-bold">
                          Semaine {semaine}
                        </h3>

                        <div className="mt-6 grid gap-5 lg:grid-cols-2">
                          <CoursesBloc
                            titre="🥦 Légumes"
                            liste={contenu.legumes}
                          />

                          <CoursesBloc
                            titre="🥔 Féculents"
                            liste={contenu.feculents}
                          />

                          <CoursesBloc
                            titre="🍗 VVP/O"
                            liste={contenu.proteines}
                          />

                          <CoursesBloc
                            titre="🍎 Fruits & goûters"
                            liste={contenu.fruits}
                          />

                          <CoursesBloc
                            titre="🧈 Autres"
                            liste={contenu.autres}
                          />
                        </div>
                      </div>
                    )
                  )}
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
                <th>Féculent</th>
                <th>Légumes</th>
                <th>VVP/O</th>
                <th>MG</th>
                <th>Goûter</th>
              </tr>
            </thead>

            <tbody>
              {menus.map((menu) => (
                <tr key={menu.index}>
                  <td>{menu.jour}</td>

                  <td>{menu.diner.feculent}</td>

                  <td>{menu.diner.legumes}</td>

                  <td>{menu.diner.proteine}</td>

                  <td>{menu.diner.matiereGrasse}</td>

                  <td>
                    {menu.gouter.fruit}
                    <br />
                    {menu.gouter.pain18}
                    {menu.gouter.laitier18 !==
                      "Non nécessaire" && (
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
        </div>
      </main>
    </>
  );
}