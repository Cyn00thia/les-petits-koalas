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
  { label: "Carotte + courgette", principaux: ["Carotte", "Courgette"] },
  { label: "Brocoli + courgette", principaux: ["Brocoli", "Courgette"] },
  { label: "Poireau + butternut", principaux: ["Poireau", "Butternut"] },
  { label: "Carotte + chou-fleur", principaux: ["Carotte", "Chou-fleur"] },
  { label: "Courgette + tomate cuite douce", principaux: ["Courgette", "Tomate cuite"] },
  { label: "Potiron + carotte", principaux: ["Potiron", "Carotte"] },
  { label: "Épinard + pomme de terre", principaux: ["Épinard"] },
];

const soupes = [
  { plat: "Soupe poireau + butternut", principaux: ["Poireau", "Butternut"] },
  { plat: "Soupe carotte + potiron", principaux: ["Carotte", "Potiron"] },
  { plat: "Soupe courgette + pomme de terre", principaux: ["Courgette"] },
  { plat: "Soupe brocoli + courgette", principaux: ["Brocoli", "Courgette"] },
];

const autresFeculentsParSemaine = [
  ["Riz", "Pâtes"],
  ["Semoule", "Quinoa"],
  ["Boulgour", "Polenta"],
  ["Riz", "Semoule"],
];

const poissonsMaigres = ["Cabillaud", "Colin"];
const poissonsGras = ["Saumon", "Truite"];
const volailles = ["Poulet", "Dinde"];

const platsFamiliaux = [
  {
    plat: "Couscous doux légumes-poulet",
    legumes: "Carotte + courgette + légumes fondants",
    principaux: ["Carotte", "Courgette"],
    remarque:
      "Plat proposé uniquement aux 12 mois et +. Pour les moins de 12 mois : garder une version vapeur simple.",
  },
  {
    plat: "Pâtes sauce légumes maison",
    legumes: "Tomate cuite + carotte + courgette mixées",
    principaux: ["Tomate cuite", "Carotte", "Courgette"],
    remarque:
      "Sauce uniquement à base de légumes cuits mixés, sans ketchup, mayonnaise ni sauce industrielle.",
  },
  {
    plat: "Riz doux courgette-carotte",
    legumes: "Courgette + carotte",
    principaux: ["Courgette", "Carotte"],
    remarque: "Texture adaptée selon l’âge.",
  },
  {
    plat: "Polenta légumes fondants",
    legumes: "Butternut + courgette",
    principaux: ["Butternut", "Courgette"],
    remarque: "Texture souple, adaptée aux petits morceaux fondants.",
  },
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

function prendreDifferent(liste: string[], actuel: string) {
  const possibles = liste.filter((item) => item !== actuel);
  return possibles[Math.floor(Math.random() * possibles.length)] ?? liste[0];
}

function choisirFeculent(index: number) {
  const semaine = Math.floor(index / 5);
  const jourSemaine = index % 5;
  const autres = autresFeculentsParSemaine[semaine % autresFeculentsParSemaine.length];

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
    return ["Repas végétarien", "Œuf dur", "Repas végétarien", "Repas végétarien", "Repas végétarien"][jourSemaine];
  }

  const poissonMaigre = poissonsMaigres[semaine % poissonsMaigres.length];
  const poissonGras = poissonsGras[semaine % poissonsGras.length];
  const volaille = volailles[semaine % volailles.length];

  if (preference === "sansPorc") {
    return [poissonMaigre, volaille, "Œuf dur", poissonGras, "Bœuf"][jourSemaine];
  }

  return [
    poissonMaigre,
    volaille,
    "Œuf dur",
    poissonGras,
    semaine % 2 === 0 ? "Bœuf" : "Porc",
  ][jourSemaine];
}

function choisirStyle(index: number): StyleRepas {
  if (index % 5 === 1) return "soupe";
  if (index % 5 === 3) return "platFamilial";
  return "simple";
}

function choisirLegumeSimple(legumesDominants: string[]) {
  const disponibles = legumesSimples.filter((legume) => !legumesDominants.includes(legume));
  const source = disponibles.length > 0 ? disponibles : legumesSimples;
  return source[Math.floor(Math.random() * source.length)];
}

function choisirAssociationLegumes(legumesDominants: string[]) {
  const disponibles = associationsLegumes.filter((association) =>
    association.principaux.every((legume) => !legumesDominants.includes(legume))
  );
  const source = disponibles.length > 0 ? disponibles : associationsLegumes;
  return source[Math.floor(Math.random() * source.length)];
}

function choisirSoupe(legumesDominants: string[]) {
  const disponibles = soupes.filter((soupe) =>
    soupe.principaux.every((legume) => !legumesDominants.includes(legume))
  );
  const source = disponibles.length > 0 ? disponibles : soupes;
  return source[Math.floor(Math.random() * source.length)];
}

function choisirPlatFamilial(legumesDominants: string[]) {
  const disponibles = platsFamiliaux.filter((plat) =>
    plat.principaux.every((legume) => !legumesDominants.includes(legume))
  );
  const source = disponibles.length > 0 ? disponibles : platsFamiliaux;
  return source[Math.floor(Math.random() * source.length)];
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
}

function genererMenu(
  modePeriode: ModePeriode,
  nombreJours: number,
  preference: Preference
): MenuJour[] {
  const total = modePeriode === "mois" ? 20 : nombreJours;
  let legumesDominants: string[] = [];

  return Array.from({ length: total }, (_, index) => {
    if (index % 5 === 0) legumesDominants = [];

    const semaine = Math.floor(index / 5) + 1;
    const jourCourt = joursSemaine[index % 5];
    const jour = modePeriode === "mois" ? `Semaine ${semaine} - ${jourCourt}` : jourCourt;

    const style = choisirStyle(index);
    let plat = "Repas simple";
    let feculent = choisirFeculent(index);
    let legumes = "";
    let legumesPrincipaux: string[] = [];
    let proteine = choisirProteine(index, preference);
    let remarque =
      "Repas simple : féculent + légume + VVP/O + matière grasse. Adaptation selon l’âge.";

    if (style === "simple") {
      const legume = choisirLegumeSimple(legumesDominants);
      legumes = legume;
      legumesPrincipaux = [legume];
    }

    if (style === "soupe") {
      const soupe = choisirSoupe(legumesDominants);
      const association = choisirAssociationLegumes([
        ...legumesDominants,
        ...soupe.principaux,
      ]);

      plat = soupe.plat;
      legumes = `${soupe.plat} + ${association.label}`;
      legumesPrincipaux = [...soupe.principaux, ...association.principaux];
      feculent = "Pommes de terre";
      remarque =
        "Repas avec soupe possible : soupe de légumes + féculent + VVP/O. Avant 12 mois : version vapeur/mixée simple.";
    }

    if (style === "platFamilial") {
      const choisi = choisirPlatFamilial(legumesDominants);
      plat = choisi.plat;
      legumes = choisi.legumes;
      legumesPrincipaux = choisi.principaux;
      remarque = choisi.remarque;
    }

    legumesDominants = [...legumesDominants, ...legumesPrincipaux];

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
        feculent,
        legumes,
        proteine,
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
          "Texture écrasée, moulinée ou petits morceaux fondants. Plats familiaux doux possibles si adaptés.",
        "18+":
          "Morceaux fondants, aliments séparés si besoin. Plats plus construits possibles, sans sauce industrielle.",
      },
      quantites: quantitesONE(),
    };
  });
}

function extraireElements(texte: string) {
  return texte
    .replaceAll("Soupe", "")
    .split("+")
    .map((item) => item.trim())
    .filter(Boolean);
}

function ajouterQuantite(liste: Record<string, number>, nom: string, quantite: number) {
  if (!liste[nom]) liste[nom] = 0;
  liste[nom] += quantite;
}

function calculerListeCourses(
  menus: MenuJour[],
  enfantsParJour: Record<string, number>
): Record<number, ListeCourses> {
  const result: Record<number, ListeCourses> = {};

  menus.forEach((menu) => {
    const nbEnfants = enfantsParJour[menu.jour] ?? enfantsParJour[menu.jourCourt] ?? 0;
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
      const marge =
        legume.toLowerCase().includes("brocoli") ||
        legume.toLowerCase().includes("chou-fleur")
          ? 1.35
          : 1.25;

      ajouterQuantite(liste.legumes, legume, nbEnfants * 120 * marge);
    });

    ajouterQuantite(liste.feculents, menu.diner.feculent, nbEnfants * 120 * 1.15);
    ajouterQuantite(liste.proteines, menu.diner.proteine, nbEnfants * 25 * 1.1);

    menu.gouter.fruit.split("+").forEach((fruit) => {
      ajouterQuantite(liste.fruits, fruit.trim(), nbEnfants * 80 * 1.15);
    });

    ajouterQuantite(liste.autres, "Pain", nbEnfants * 40);

    if (menu.gouter.pain1218.includes("beurré") || menu.gouter.pain18.includes("beurré")) {
      ajouterQuantite(liste.autres, "Beurre", nbEnfants * 8);
    }

    if (menu.gouter.laitier18 !== "Non nécessaire") {
      const quantite = menu.gouter.laitier18 === "Verre de lait" ? nbEnfants * 150 : nbEnfants;
      ajouterQuantite(liste.autres, menu.gouter.laitier18, quantite);
    }
  });

  return result;
}

function afficherQuantite(nom: string, quantite: number) {
  if (nom === "Verre de lait") return `${Math.ceil(quantite)} ml`;

  if (
    nom.includes("Yaourt") ||
    nom.includes("Fromage frais") ||
    nom.includes("Petit suisse") ||
    nom === "Fromage"
  ) {
    return `${Math.ceil(quantite)} portion(s)`;
  }

  if (quantite >= 1000) return `${(quantite / 1000).toFixed(2)} kg`;

  return `${Math.ceil(quantite)} g`;
}

function CoursesBloc({ titre, liste }: { titre: string; liste: Record<string, number> }) {
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

  function modifierProteine(index: number) {
    setMenus((prev) => {
      const copie = [...prev];

      let liste =
        preference === "vegetarien"
          ? ["Repas végétarien", "Œuf dur"]
          : [
              "Cabillaud",
              "Colin",
              "Poulet",
              "Dinde",
              "Saumon",
              "Truite",
              "Bœuf",
              ...(preference === "sansPorc" ? [] : ["Porc"]),
              "Œuf dur",
            ];

      const semaineDebut = Math.floor(index / 5) * 5;
      const proteinesSemaine = copie
        .slice(semaineDebut, semaineDebut + 5)
        .map((jour) => jour.diner.proteine);

      if (
        proteinesSemaine.includes("Œuf dur") &&
        copie[index].diner.proteine !== "Œuf dur"
      ) {
        liste = liste.filter((item) => item !== "Œuf dur");
      }

      copie[index].diner.proteine = prendreDifferent(liste, copie[index].diner.proteine);

      return [...copie];
    });
  }

  function modifierCompote(index: number) {
    setMenus((prev) => {
      const copie = [...prev];
      copie[index].gouter.bebe = prendreDifferent(compotesBebe, copie[index].gouter.bebe);
      return [...copie];
    });
  }

  function modifierFruit(index: number) {
    setMenus((prev) => {
      const copie = [...prev];
      copie[index].gouter.fruit = prendreDifferent(fruitsGouter, copie[index].gouter.fruit);
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
      copie[index].gouter.pain18 = nouveauLaitier === "Fromage" ? "Pain" : "Pain beurré";

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

          .print-only p {
            font-size: 11px;
            margin-bottom: 10px;
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
              Génère une semaine ou un mois de repas variés, puis calcule une
              liste de courses par semaine selon le nombre d’enfants présents.
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
                        onChange={(e) => modifierNombreEnfants(jour, e.target.value)}
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
                <li>✔ Semaine ou mois complet</li>
                <li>✔ Classique, sans porc ou végétarien</li>
                <li>✔ Journée végétarienne possible</li>
                <li>✔ Verre de lait inclus dans les laitages 18 mois +</li>
                <li>✔ Liste de courses par semaine</li>
                <li>✔ Marges prévues pour pertes / épluchage</li>
              </ul>
            </aside>
          </div>

          {menus.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={sauvegarderMenu}
                className="rounded-full bg-[#6B8F71] px-6 py-3 font-bold text-white"
              >
                Sauvegarder
              </button>

              <button
                onClick={imprimerMenu}
                className="rounded-full bg-white px-6 py-3 font-bold text-[#6B8F71]"
              >
                Imprimer
              </button>
            </div>
          )}

          <section className="mt-10 grid gap-6">
            {menus.map((menu, index) => (
              <div
                key={menu.jour}
                className="rounded-[2rem] bg-white p-8 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-3xl font-bold">{menu.jour}</h2>

                  <span className="rounded-full bg-[#E8F2EA] px-4 py-2 text-sm font-bold text-[#6B8F71]">
                    {menu.style === "simple"
                      ? "Repas simple"
                      : menu.style === "soupe"
                      ? "Soupe + repas"
                      : "Plat familial doux"}
                  </span>
                </div>

                <div className="mt-6 rounded-3xl bg-[#F8F8F4] p-6">
                  <p className="font-bold text-[#6B8F71]">Dîner commun</p>

                  <h3 className="mt-3 text-2xl font-bold">{menu.diner.plat}</h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-5">
                    <div>💧 {menu.diner.boisson}</div>
                    <div>🍚 {menu.diner.feculent}</div>
                    <div>🥦 {menu.diner.legumes}</div>

                    <div>
                      🍗 {menu.diner.proteine}
                      <button
                        onClick={() => modifierProteine(index)}
                        className="block text-sm font-bold text-[#6B8F71] underline"
                      >
                        Modifier
                      </button>
                    </div>

                    <div>🫒 {menu.diner.matiereGrasse}</div>
                  </div>

                  <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-gray-700">
                    {menu.diner.remarque}
                  </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {(["4-12", "12-18", "18+"] as Age[]).map(
                    (age) =>
                      ages[age] && (
                        <div
                          key={age}
                          className="rounded-2xl bg-[#F7F3EA] p-5"
                        >
                          <p className="font-bold">
                            {age === "4-12"
                              ? "👶 4–12 mois"
                              : age === "12-18"
                              ? "🧒 12–18 mois"
                              : "👧 18 mois et +"}
                          </p>

                          <p className="mt-3 text-sm text-gray-600">
                            {menu.textures[age]}
                          </p>

                          <div className="mt-4 rounded-2xl bg-white p-4">
                            <p className="font-semibold">Quantités de référence</p>

                            <ul className="mt-3 space-y-2 text-sm">
                              <li>🍚 Féculent : {menu.quantites[age].feculent}</li>
                              <li>🥦 Légumes : {menu.quantites[age].legumes}</li>
                              <li>🍗 VVP/O : {menu.quantites[age].proteine}</li>
                              <li>🫒 MG : {menu.quantites[age].matiereGrasse}</li>
                            </ul>
                          </div>

                          <div className="mt-4 rounded-2xl bg-white p-4">
                            <p className="font-semibold">Goûter</p>

                            {age === "4-12" && (
                              <>
                                <p className="mt-2">{menu.gouter.bebe}</p>
                                <p className="mt-2 text-sm text-gray-500">
                                  Produit laitier : non nécessaire au goûter.
                                </p>

                                <button
                                  onClick={() => modifierCompote(index)}
                                  className="mt-3 text-sm font-bold text-[#6B8F71] underline"
                                >
                                  Modifier compote
                                </button>
                              </>
                            )}

                            {age === "12-18" && (
                              <>
                                <p className="mt-2">🍎 {menu.gouter.fruit}</p>
                                <p className="mt-2">🍞 {menu.gouter.pain1218}</p>
                                <p className="mt-2 text-sm text-gray-500">
                                  Produit laitier : non nécessaire au goûter.
                                </p>

                                <button
                                  onClick={() => modifierFruit(index)}
                                  className="mt-3 text-sm font-bold text-[#6B8F71] underline"
                                >
                                  Modifier fruits
                                </button>
                              </>
                            )}

                            {age === "18+" && (
                              <>
                                <p className="mt-2">🍎 {menu.gouter.fruit}</p>
                                <p className="mt-2">🍞 {menu.gouter.pain18}</p>

                                {menu.gouter.laitier18 !== "Non nécessaire" && (
                                  <p className="mt-2">🥛 {menu.gouter.laitier18}</p>
                                )}

                                {menu.gouter.laitier18 === "Non nécessaire" && (
                                  <p className="mt-2 text-sm text-gray-500">
                                    Produit laitier : non nécessaire ce jour.
                                  </p>
                                )}

                                <button
                                  onClick={() => modifierFruit(index)}
                                  className="mt-3 text-sm font-bold text-[#6B8F71] underline"
                                >
                                  Modifier fruits
                                </button>

                                <button
                                  onClick={() => modifierLaitier18(index)}
                                  className="ml-4 text-sm font-bold text-[#6B8F71] underline"
                                >
                                  Modifier laitage
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            ))}
          </section>

          {menus.length > 0 && (
            <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Listes de courses par semaine</h2>

              <p className="mt-3 text-gray-600">
                Les quantités sont estimatives et prévoient une marge pour
                épluchage, pertes et préparation.
              </p>

              <div className="mt-6 grid gap-8">
                {Object.entries(listesCourses).map(([semaine, liste]) => (
                  <div key={semaine} className="rounded-[2rem] bg-white">
                    <h3 className="text-2xl font-bold">Semaine {semaine}</h3>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <CoursesBloc titre="🥦 Légumes" liste={liste.legumes} />
                      <CoursesBloc titre="🍚 Féculents" liste={liste.feculents} />
                      <CoursesBloc titre="🍗 VVP/O" liste={liste.proteines} />
                      <CoursesBloc titre="🍎 Fruits" liste={liste.fruits} />
                      <CoursesBloc titre="🧺 Autres" liste={liste.autres} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>

        <div className="print-only">
          <h1>
            Menus {modePeriode === "mois" ? "du mois" : "de la semaine"}
          </h1>

          <table>
            <thead>
              <tr>
                <th>Jour</th>
                <th>Plat</th>
                <th>Féculent</th>
                <th>Légumes</th>
                <th>VVP/O</th>
                <th>MG</th>
                <th>Goûter 18 mois +</th>
              </tr>
            </thead>

            <tbody>
              {menus.map((menu) => (
                <tr key={menu.jour}>
                  <td>{menu.jour}</td>
                  <td>{menu.diner.plat}</td>
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
              <h2>Liste de courses - Semaine {semaine}</h2>

              <table>
                <thead>
                  <tr>
                    <th>Catégorie</th>
                    <th>Aliment</th>
                    <th>Quantité</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(liste).flatMap(([categorie, items]) =>
                    Object.entries(items).map(([nom, quantite]) => (
                      <tr key={`${semaine}-${categorie}-${nom}`}>
                        <td>{categorie}</td>
                        <td>{nom}</td>
                        <td>{afficherQuantite(nom, quantite)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}