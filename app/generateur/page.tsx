"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Preference = "classique" | "sansPorc" | "vegetarien";
type ModePeriode = "semaine" | "mois";

type MenuJour = {
  index: number;
  semaine: number;
  jourCourt: string;
  jour: string;
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
  legumes: Record<string, number>;
  feculents: Record<string, number>;
  proteines: Record<string, number>;
  fruits: Record<string, number>;
  autres: Record<string, number>;
};

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const feculents = [
  "Pommes de terre",
  "Patate douce",
  "Riz",
  "Pâtes",
  "Semoule",
  "Quinoa",
  "Boulgour",
  "Polenta",
];

const legumes = [
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
];

const soupes = [
  "Soupe poireau + butternut",
  "Soupe carotte + potiron",
  "Soupe courgette + pomme de terre",
  "Soupe brocoli + courgette",
];

const matieresGrasses = ["Huile de colza", "Huile d’olive", "Beurre"];

const compotesBebe = [
  "Compote pomme-banane-poire",
  "Compote pomme-poire",
  "Compote banane-fraise-pomme",
  "Compote pomme-abricot",
  "Compote poire-banane-kiwi",
];

const fruitsGouter = [
  "Pomme + poire",
  "Banane + pomme",
  "Poire + kiwi",
  "Pomme + fraise",
  "Banane + pêche",
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
};

function prendreDifferent(liste: string[], actuel: string) {
  const possibles = liste.filter((item) => item !== actuel);
  return possibles[Math.floor(Math.random() * possibles.length)] ?? liste[0];
}

function ajouter(liste: Record<string, number>, nom: string, quantite: number) {
  liste[nom] = (liste[nom] || 0) + quantite;
}

function convertirEnCru(nom: string, poidsCuit: number) {
  return poidsCuit * (conversionCru[nom] ?? 1.25);
}

function extraire(texte: string) {
  return texte
    .replaceAll("Soupe", "")
    .split("+")
    .map((x) => x.trim())
    .filter(Boolean);
}

function choisirFeculent(index: number) {
  const semaine = Math.floor(index / 5);
  const autres = [
    ["Riz", "Pâtes"],
    ["Semoule", "Quinoa"],
    ["Boulgour", "Polenta"],
    ["Riz", "Semoule"],
  ][semaine % 4];

  return ["Pommes de terre", autres[0], "Patate douce", autres[1], "Pommes de terre"][
    index % 5
  ];
}

function choisirProteine(index: number, preference: Preference) {
  const semaine = Math.floor(index / 5);
  const jour = index % 5;

  if (preference === "vegetarien") {
    return ["Repas végétarien", "Œuf dur", "Repas végétarien", "Repas végétarien", "Repas végétarien"][jour];
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

function genererMenu(mode: ModePeriode, nombreJours: number, preference: Preference): MenuJour[] {
  const total = mode === "mois" ? 20 : nombreJours;

  return Array.from({ length: total }, (_, index) => {
    const semaine = Math.floor(index / 5) + 1;
    const jourCourt = joursSemaine[index % 5];
    const jour = mode === "mois" ? `Semaine ${semaine} - ${jourCourt}` : jourCourt;

    const style = index % 5 === 1 ? "soupe" : index % 5 === 3 ? "plat" : "simple";

    let plat = "Repas simple";
    let legumesRepas = legumes[index % legumes.length];
    let remarque = "Repas simple : féculent + légume + VVP/O + matière grasse.";

    if (style === "soupe") {
      plat = soupes[index % soupes.length];
      legumesRepas = `${plat} + ${associationsLegumes[index % associationsLegumes.length]}`;
      remarque = "Soupe possible. Avant 12 mois : version vapeur/mixée simple, sans sauce.";
    }

    if (style === "plat") {
      plat = index % 2 === 0 ? "Pâtes sauce légumes maison" : "Couscous doux adapté";
      legumesRepas = associationsLegumes[index % associationsLegumes.length];
      remarque = "Plat plus construit uniquement pour les 12 mois et +.";
    }

    const laitier18 = laitages18[index % laitages18.length];

    return {
      index,
      semaine,
      jourCourt,
      jour,
      diner: {
        boisson: "Eau",
        plat,
        feculent: choisirFeculent(index),
        legumes: legumesRepas,
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
    };
  });
}

function calculerCourses(menus: MenuJour[], enfantsParJour: Record<string, number>) {
  const result: Record<number, ListeCourses> = {};

  menus.forEach((menu) => {
    const nb = enfantsParJour[menu.jourCourt] || 0;
    if (nb === 0) return;

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

    extraire(menu.diner.legumes).forEach((legume) => {
      ajouter(liste.legumes, legume, convertirEnCru(legume, nb * 120));
    });

    ajouter(liste.feculents, menu.diner.feculent, convertirEnCru(menu.diner.feculent, nb * 120));
    ajouter(liste.proteines, menu.diner.proteine, convertirEnCru(menu.diner.proteine, nb * 25));

    menu.gouter.fruit.split("+").forEach((fruit) => {
      ajouter(liste.fruits, fruit.trim(), nb * 125);
    });

    ajouter(liste.autres, "Pain", nb * 40);
    ajouter(liste.autres, "Beurre", nb * 8);

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
  const [menus, setMenus] = useState<MenuJour[]>([]);

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

  function modifier(index: number, champ: "feculent" | "legumes" | "proteine" | "matiereGrasse") {
    setMenus((prev) => {
      const copie = [...prev];
      const menu = copie[index];

      if (champ === "feculent") {
        menu.diner.feculent = prendreDifferent(feculents, menu.diner.feculent);
      }

      if (champ === "legumes") {
        menu.diner.legumes = prendreDifferent([...legumes, ...associationsLegumes], menu.diner.legumes);
      }

      if (champ === "proteine") {
        const liste =
          preference === "vegetarien"
            ? ["Repas végétarien", "Œuf dur"]
            : preference === "sansPorc"
            ? ["Cabillaud", "Colin", "Saumon", "Truite", "Poulet", "Dinde", "Bœuf", "Œuf dur"]
            : ["Cabillaud", "Colin", "Saumon", "Truite", "Poulet", "Dinde", "Bœuf", "Porc", "Œuf dur"];

        menu.diner.proteine = prendreDifferent(liste, menu.diner.proteine);
      }

      if (champ === "matiereGrasse") {
        menu.diner.matiereGrasse = prendreDifferent(matieresGrasses, menu.diner.matiereGrasse);
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
              Menus & liste de courses
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
              Génère une semaine ou un mois de repas variés, puis calcule la liste
              de courses en poids cru à acheter.
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

            <div className="mt-6 flex flex-wrap gap-3">
              {(["classique", "sansPorc", "vegetarien"] as Preference[]).map((pref) => (
                <button
                  key={pref}
                  onClick={() => setPreference(pref)}
                  className={`rounded-full px-5 py-3 font-bold ${
                    preference === pref ? "bg-[#6B8F71] text-white" : "bg-[#F7F3EA]"
                  }`}
                >
                  {pref === "classique" ? "Classique" : pref === "sansPorc" ? "Sans porc" : "Végétarien"}
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
              onClick={() => setMenus(genererMenu(mode, nombreJours, preference))}
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

                      <div className="mt-4 grid gap-4 md:grid-cols-5">
                        <div>💧 {menu.diner.boisson}</div>

                        <div>
                          🥔 {menu.diner.feculent}
                          <button onClick={() => modifier(menu.index, "feculent")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier
                          </button>
                        </div>

                        <div>
                          🥦 {menu.diner.legumes}
                          <button onClick={() => modifier(menu.index, "legumes")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier
                          </button>
                        </div>

                        <div>
                          🍗 {menu.diner.proteine}
                          <button onClick={() => modifier(menu.index, "proteine")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier
                          </button>
                        </div>

                        <div>
                          🫒 {menu.diner.matiereGrasse}
                          <button onClick={() => modifier(menu.index, "matiereGrasse")} className="block text-sm font-bold text-[#6B8F71] underline">
                            Modifier
                          </button>
                        </div>
                      </div>

                      <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-gray-700">
                        {menu.diner.remarque}
                      </p>
                    </div>

                    <div className="mt-6 rounded-2xl bg-[#F7F3EA] p-5">
                      <p className="font-bold">Goûters</p>
                      <p className="mt-2">👶 4–12 mois : {menu.gouter.bebe}</p>
                      <p className="mt-2">🧒 12–18 mois : {menu.gouter.fruit} + {menu.gouter.pain1218}</p>
                      <p className="mt-2">
                        👧 18 mois + : {menu.gouter.fruit} + {menu.gouter.pain18}
                        {menu.gouter.laitier18 !== "Non nécessaire" ? ` + ${menu.gouter.laitier18}` : ""}
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
                        <CoursesBloc titre="🥦 Légumes" liste={liste.legumes} />
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
                  {Object.entries(liste.legumes).map(([nom, q]) => (
                    <tr key={`l-${nom}`}>
                      <td>Légumes</td>
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