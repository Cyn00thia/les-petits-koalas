"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type JourMenu = {
  jour: string;

  diner: {
    feculent: string;
    legumes: string;
    proteine: string;
    matiereGrasse: string;
  };

  gouter: {
    bebe: string;
    fruit: string;
    pain1218: string;
    pain18: string;
    laitier18: string;
  };
};

const jours = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
];

const feculentsPommesDeTerre = [
  "Pommes de terre",
  "Patate douce",
  "Purée pomme de terre",
];

const autresFeculents = [
  "Riz",
  "Pâtes",
  "Semoule",
  "Polenta",
  "Quinoa",
  "Boulgour",
];

const legumes = [
  "Carotte",
  "Courgette",
  "Brocoli",
  "Poireau",
  "Butternut",
  "Petits pois",
  "Haricots verts",
  "Chou-fleur",
  "Épinards",
  "Fenouil",
  "Potiron",
  "Tomate",
];

const proteines = [
  "Poulet",
  "Dinde",
  "Bœuf",
  "Porc",
  "Saumon",
  "Cabillaud",
  "Colin",
  "Truite",
  "Œuf dur",
];

const huiles = [
  "Huile d’olive",
  "Huile de colza",
  "Beurre",
];

const fruits = [
  "Pomme",
  "Poire",
  "Banane",
  "Kiwi",
  "Pêche",
  "Abricot",
  "Fraise",
];

const laitages = [
  "Yaourt nature",
  "Fromage frais",
  "Petit suisse",
  "Fromage",
];

function melanger<T>(tableau: T[]) {
  return [...tableau].sort(() => Math.random() - 0.5);
}

function choisir<T>(tableau: T[], utilise: T[]) {
  const disponible = tableau.filter((item) => !utilise.includes(item));

  if (disponible.length === 0) {
    utilise.length = 0;
    return tableau[Math.floor(Math.random() * tableau.length)];
  }

  const choix =
    disponible[Math.floor(Math.random() * disponible.length)];

  utilise.push(choix);

  return choix;
}

function genererMenus(): JourMenu[] {
  const menus: JourMenu[] = [];

  const legumesUtilises: string[] = [];
  const proteinesUtilisees: string[] = [];
  const feculentsUtilises: string[] = [];

  let pommesDeTerreCount = 0;

  jours.forEach((jour) => {
    let feculent = "";

    if (pommesDeTerreCount < 3) {
      feculent = choisir(
        feculentsPommesDeTerre,
        feculentsUtilises
      );
      pommesDeTerreCount++;
    } else {
      feculent = choisir(
        autresFeculents,
        feculentsUtilises
      );
    }

    const legume1 = choisir(legumes, legumesUtilises);

    let legumesRepas = legume1;

    if (Math.random() > 0.6) {
      const legume2 = choisir(legumes, legumesUtilises);

      if (legume2 !== legume1) {
        legumesRepas = `${legume1} + ${legume2}`;
      }
    }

    const proteine = choisir(
      proteines,
      proteinesUtilisees
    );

    const huile =
      huiles[Math.floor(Math.random() * huiles.length)];

    const fruit1 =
      fruits[Math.floor(Math.random() * fruits.length)];

    const fruit2 =
      fruits[Math.floor(Math.random() * fruits.length)];

    const laitier =
      Math.random() > 0.5
        ? laitages[Math.floor(Math.random() * laitages.length)]
        : "Non nécessaire";

    menus.push({
      jour,

      diner: {
        feculent,
        legumes: legumesRepas,
        proteine,
        matiereGrasse: huile,
      },

      gouter: {
        bebe: `Compote ${fruit1.toLowerCase()}-${fruit2.toLowerCase()}`,
        fruit: `${fruit1} + ${fruit2}`,
        pain1218: "Pain beurré",
        pain18: "Pain beurré",
        laitier18: laitier,
      },
    });
  });

  return menus;
}

function extraireLegumes(texte: string) {
  return texte.split("+").map((item) => item.trim());
}

function ajouterQuantite(
  liste: Record<string, number>,
  nom: string,
  quantite: number
) {
  if (!liste[nom]) {
    liste[nom] = 0;
  }

  liste[nom] += quantite;
}type ListeCourses = {
  legumes: Record<string, number>;
  feculents: Record<string, number>;
  proteines: Record<string, number>;
  fruits: Record<string, number>;
  autres: Record<string, number>;
};

function calculerListeCourses(
  menus: JourMenu[],
  enfantsParJour: Record<string, number>
): ListeCourses {
  const liste: ListeCourses = {
    legumes: {},
    feculents: {},
    proteines: {},
    fruits: {},
    autres: {},
  };

  menus.forEach((menu) => {
    const nbEnfants = enfantsParJour[menu.jour] || 0;

    if (nbEnfants === 0) return;

    extraireLegumes(menu.diner.legumes).forEach((legume) => {
      const marge =
        legume.toLowerCase().includes("brocoli") ||
        legume.toLowerCase().includes("chou-fleur")
          ? 1.35
          : 1.25;

      ajouterQuantite(liste.legumes, legume, nbEnfants * 120 * marge);
    });

    ajouterQuantite(
      liste.feculents,
      menu.diner.feculent,
      nbEnfants * 120 * 1.15
    );

    ajouterQuantite(
      liste.proteines,
      menu.diner.proteine,
      nbEnfants * 25 * 1.1
    );

    menu.gouter.fruit.split("+").forEach((fruit) => {
      ajouterQuantite(liste.fruits, fruit.trim(), nbEnfants * 80 * 1.15);
    });

    ajouterQuantite(liste.autres, "Pain", nbEnfants * 40);

    if (
      menu.gouter.pain1218.includes("beurré") ||
      menu.gouter.pain18.includes("beurré")
    ) {
      ajouterQuantite(liste.autres, "Beurre", nbEnfants * 8);
    }

    if (menu.gouter.laitier18 !== "Non nécessaire") {
      ajouterQuantite(liste.autres, menu.gouter.laitier18, nbEnfants * 1);
    }
  });

  return liste;
}

function afficherQuantite(nom: string, quantite: number) {
  if (
    nom.includes("Yaourt") ||
    nom.includes("Fromage frais") ||
    nom.includes("Petit suisse") ||
    nom.includes("Fromage")
  ) {
    return `${Math.ceil(quantite)} portion(s)`;
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
  const [menus, setMenus] = useState<JourMenu[]>([]);
  const [enfantsParJour, setEnfantsParJour] = useState<Record<string, number>>({
    Lundi: 0,
    Mardi: 0,
    Mercredi: 0,
    Jeudi: 0,
    Vendredi: 0,
  });

  const listeCourses = useMemo(
    () => calculerListeCourses(menus, enfantsParJour),
    [menus, enfantsParJour]
  );

  function modifierNombreEnfants(jour: string, valeur: string) {
    setEnfantsParJour((prev) => ({
      ...prev,
      [jour]: Number(valeur),
    }));
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
            inset: 0;
            background: white;
            padding: 20px;
          }

          .screen-only {
            display: none !important;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          th,
          td {
            border: 1px solid #999;
            padding: 6px;
            vertical-align: top;
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
              Indique le nombre d’enfants par jour, génère un menu, puis obtiens
              une liste de courses estimative avec marge pour les pertes.
            </p>
          </div>

          <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Nombre d’enfants par jour</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {jours.map((jour) => (
                <div key={jour}>
                  <label className="font-bold">{jour}</label>

                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={enfantsParJour[jour]}
                    onChange={(e) => modifierNombreEnfants(jour, e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#E8E0D5] p-4 outline-none focus:border-[#6B8F71]"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setMenus(genererMenus())}
                className="rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
              >
                Générer le menu ✨
              </button>

              {menus.length > 0 && (
                <button
                  onClick={imprimer}
                  className="rounded-full bg-[#F7F3EA] px-8 py-4 font-bold text-[#6B8F71]"
                >
                  Imprimer
                </button>
              )}
            </div>
          </section>

          {menus.length > 0 && (
            <>
              <section className="mt-10 grid gap-6">
                {menus.map((menu) => (
                  <article
                    key={menu.jour}
                    className="rounded-[2rem] bg-white p-8 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h2 className="text-3xl font-bold">{menu.jour}</h2>

                      <span className="rounded-full bg-[#E8F2EA] px-4 py-2 text-sm font-bold text-[#6B8F71]">
                        {enfantsParJour[menu.jour]} enfant(s)
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                      <div className="rounded-2xl bg-[#F7F3EA] p-4">
                        🍚 {menu.diner.feculent}
                      </div>

                      <div className="rounded-2xl bg-[#F7F3EA] p-4">
                        🥦 {menu.diner.legumes}
                      </div>

                      <div className="rounded-2xl bg-[#F7F3EA] p-4">
                        🍗 {menu.diner.proteine}
                      </div>

                      <div className="rounded-2xl bg-[#F7F3EA] p-4">
                        🫒 {menu.diner.matiereGrasse}
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl bg-[#E8F2EA] p-5">
                      <p className="font-bold">Goûter</p>
                      <p className="mt-2">👶 4–12 mois : {menu.gouter.bebe}</p>
                      <p className="mt-2">
                        🧒 12–18 mois : {menu.gouter.fruit} +{" "}
                        {menu.gouter.pain1218}
                      </p>
                      <p className="mt-2">
                        👧 18 mois + : {menu.gouter.fruit} + {menu.gouter.pain18}
                        {menu.gouter.laitier18 !== "Non nécessaire"
                          ? ` + ${menu.gouter.laitier18}`
                          : ""}
                      </p>
                    </div>
                  </article>
                ))}
              </section>

              <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-bold">Liste de courses estimative</h2>

                <p className="mt-3 text-gray-600">
                  Les quantités sont calculées avec une marge pour l’épluchage,
                  les pertes et la préparation. À ajuster selon les habitudes du
                  groupe.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <CoursesBloc titre="🥦 Légumes" liste={listeCourses.legumes} />
                  <CoursesBloc titre="🍚 Féculents" liste={listeCourses.feculents} />
                  <CoursesBloc titre="🍗 VVP/O" liste={listeCourses.proteines} />
                  <CoursesBloc titre="🍎 Fruits" liste={listeCourses.fruits} />
                  <CoursesBloc titre="🧺 Autres" liste={listeCourses.autres} />
                </div>
              </section>
            </>
          )}
        </section>

        <section className="print-only">
          <h1>Menu de la semaine</h1>

          <table>
            <thead>
              <tr>
                <th>Jour</th>
                <th>Enfants</th>
                <th>Féculent</th>
                <th>Légumes</th>
                <th>VVP/O</th>
                <th>Goûter 18 mois +</th>
              </tr>
            </thead>

            <tbody>
              {menus.map((menu) => (
                <tr key={menu.jour}>
                  <td>{menu.jour}</td>
                  <td>{enfantsParJour[menu.jour]}</td>
                  <td>{menu.diner.feculent}</td>
                  <td>{menu.diner.legumes}</td>
                  <td>{menu.diner.proteine}</td>
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

          <h1 style={{ marginTop: 24 }}>Liste de courses</h1>

          <table>
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Aliment</th>
                <th>Quantité à prévoir</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(listeCourses).flatMap(([categorie, items]) =>
                Object.entries(items).map(([nom, quantite]) => (
                  <tr key={`${categorie}-${nom}`}>
                    <td>{categorie}</td>
                    <td>{nom}</td>
                    <td>{afficherQuantite(nom, quantite)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}