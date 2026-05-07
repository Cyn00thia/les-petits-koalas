"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Age = "4-12" | "12-18" | "18+";
type Categorie = "diner" | "gouter" | "association" | "herbes";

type Recette = {
  id: string;
  titre: string;
  age: Age;
  categorie: "diner" | "gouter";
  ingredients: string[];
  texture: string;
  conseil: string;
  perso?: boolean;
};

type Association = {
  id: string;
  aliment: string;
  idees: string[];
  perso?: boolean;
};

type Herbe = {
  id: string;
  nom: string;
  avec: string[];
  idee: string;
  perso?: boolean;
};

const recettesBase: Recette[] = [
  {
    id: "r1",
    titre: "Purée carotte pomme de terre poulet",
    age: "4-12",
    categorie: "diner",
    ingredients: ["Carotte", "Pomme de terre", "Poulet", "Huile de colza"],
    texture: "Purée lisse ou très finement écrasée.",
    conseil: "Ajouter l’huile après cuisson. Sans sel ajouté.",
  },
  {
    id: "r2",
    titre: "Courgette riz cabillaud",
    age: "4-12",
    categorie: "diner",
    ingredients: ["Courgette", "Riz", "Cabillaud", "Huile d’olive"],
    texture: "Texture lisse puis progressivement plus épaisse.",
    conseil: "Bien vérifier les arêtes.",
  },
  {
    id: "r3",
    titre: "Compote pomme poire banane",
    age: "4-12",
    categorie: "gouter",
    ingredients: ["Pomme", "Poire", "Banane"],
    texture: "Compote lisse ou panade.",
    conseil: "Sans sucre ajouté. Fruits déjà introduits.",
  },
  {
    id: "r4",
    titre: "Pâtes courgette poulet",
    age: "12-18",
    categorie: "diner",
    ingredients: ["Pâtes", "Courgette", "Poulet", "Huile d’olive"],
    texture: "Petits morceaux fondants.",
    conseil: "Bien cuire les légumes et couper le poulet finement.",
  },
  {
    id: "r5",
    titre: "Fruits pain beurre",
    age: "12-18",
    categorie: "gouter",
    ingredients: ["Pomme", "Poire", "Pain", "Beurre"],
    texture: "Fruits adaptés selon l’enfant.",
    conseil: "Proposer de l’eau.",
  },
  {
    id: "r6",
    titre: "Riz carotte saumon",
    age: "18+",
    categorie: "diner",
    ingredients: ["Riz", "Carotte", "Saumon", "Huile d’olive"],
    texture: "Morceaux fondants.",
    conseil: "Adapter selon l’enfant.",
  },
  {
    id: "r7",
    titre: "Fruits pain yaourt",
    age: "18+",
    categorie: "gouter",
    ingredients: ["Banane", "Pain", "Yaourt nature"],
    texture: "Petits morceaux adaptés.",
    conseil: "Selon fréquence des laitages.",
  },
];

const associationsBase: Association[] = [
  {
    id: "a1",
    aliment: "Carotte",
    idees: ["Pomme de terre + poulet", "Riz + cabillaud", "Semoule + œuf", "Persil doux"],
  },
  {
    id: "a2",
    aliment: "Courgette",
    idees: ["Pâtes + poulet", "Riz + saumon", "Basilic doux"],
  },
  {
    id: "a3",
    aliment: "Patate douce",
    idees: ["Poulet + huile de colza", "Cabillaud + persil", "Thym doux"],
  },
];

const herbesBase: Herbe[] = [
  {
    id: "h1",
    nom: "Persil",
    avec: ["Carotte", "Pomme de terre", "Courgette", "Poulet"],
    idee: "Purée carotte pomme de terre persil",
  },
  {
    id: "h2",
    nom: "Ciboulette",
    avec: ["Œuf", "Pomme de terre", "Fromage frais"],
    idee: "Œuf écrasé pomme de terre ciboulette",
  },
  {
    id: "h3",
    nom: "Basilic",
    avec: ["Tomate cuite", "Pâtes", "Courgette"],
    idee: "Pâtes courgette basilic",
  },
  {
    id: "h4",
    nom: "Thym doux",
    avec: ["Patate douce", "Poulet", "Poireau"],
    idee: "Patate douce poulet thym doux",
  },
  {
    id: "h5",
    nom: "Aneth",
    avec: ["Cabillaud", "Saumon", "Courgette"],
    idee: "Cabillaud pomme de terre aneth",
  },
];

function labelAge(age: Age) {
  if (age === "4-12") return "4–12 mois";
  if (age === "12-18") return "12–18 mois";
  return "18 mois et +";
}

function labelCategorie(categorie: Categorie) {
  if (categorie === "diner") return "Dîner";
  if (categorie === "gouter") return "Goûter";
  if (categorie === "association") return "Associations";
  return "Herbes aromatiques";
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function RecettesPage() {
  const [age, setAge] = useState<Age>("4-12");
  const [categorie, setCategorie] = useState<Categorie>("diner");

  const [recettesPerso, setRecettesPerso] = useState<Recette[]>([]);
  const [associationsPerso, setAssociationsPerso] = useState<Association[]>([]);
  const [herbesPerso, setHerbesPerso] = useState<Herbe[]>([]);

  const [titreRecette, setTitreRecette] = useState("");
  const [ageRecette, setAgeRecette] = useState<Age>("4-12");
  const [categorieRecette, setCategorieRecette] = useState<"diner" | "gouter">("diner");
  const [ingredientsRecette, setIngredientsRecette] = useState("");
  const [textureRecette, setTextureRecette] = useState("");
  const [conseilRecette, setConseilRecette] = useState("");

  const [alimentAssociation, setAlimentAssociation] = useState("");
  const [ideesAssociation, setIdeesAssociation] = useState("");

  const [nomHerbe, setNomHerbe] = useState("");
  const [avecHerbe, setAvecHerbe] = useState("");
  const [ideeHerbe, setIdeeHerbe] = useState("");

  useEffect(() => {
    const recettesSaved = localStorage.getItem("koalasRecettesPerso");
    const associationsSaved = localStorage.getItem("koalasAssociationsPerso");
    const herbesSaved = localStorage.getItem("koalasHerbesPerso");

    if (recettesSaved) setRecettesPerso(JSON.parse(recettesSaved));
    if (associationsSaved) setAssociationsPerso(JSON.parse(associationsSaved));
    if (herbesSaved) setHerbesPerso(JSON.parse(herbesSaved));
  }, []);

  const recettes = [...recettesBase, ...recettesPerso];
  const associations = [...associationsBase, ...associationsPerso];
  const herbes = [...herbesBase, ...herbesPerso];

  const recettesFiltrees = recettes.filter(
    (recette) => recette.age === age && recette.categorie === categorie
  );

  function ajouterRecette() {
    if (!titreRecette.trim() || !ingredientsRecette.trim()) {
      alert("Ajoute au minimum un titre et des ingrédients 🙂");
      return;
    }

    const nouvelle: Recette = {
      id: Date.now().toString(),
      titre: titreRecette.trim(),
      age: ageRecette,
      categorie: categorieRecette,
      ingredients: splitList(ingredientsRecette),
      texture: textureRecette.trim() || "À adapter selon l’enfant.",
      conseil: conseilRecette.trim() || "À adapter selon les capacités et habitudes de l’enfant.",
      perso: true,
    };

    const updated = [...recettesPerso, nouvelle];
    setRecettesPerso(updated);
    localStorage.setItem("koalasRecettesPerso", JSON.stringify(updated));

    setTitreRecette("");
    setIngredientsRecette("");
    setTextureRecette("");
    setConseilRecette("");

    alert("Recette ajoutée ✅");
  }

  function ajouterAssociation() {
    if (!alimentAssociation.trim() || !ideesAssociation.trim()) {
      alert("Ajoute l’aliment et au moins une idée d’association 🙂");
      return;
    }

    const nouvelle: Association = {
      id: Date.now().toString(),
      aliment: alimentAssociation.trim(),
      idees: splitList(ideesAssociation),
      perso: true,
    };

    const updated = [...associationsPerso, nouvelle];
    setAssociationsPerso(updated);
    localStorage.setItem("koalasAssociationsPerso", JSON.stringify(updated));

    setAlimentAssociation("");
    setIdeesAssociation("");

    alert("Association ajoutée ✅");
  }

  function ajouterHerbe() {
    if (!nomHerbe.trim() || !avecHerbe.trim()) {
      alert("Ajoute le nom de l’herbe et les aliments associés 🙂");
      return;
    }

    const nouvelle: Herbe = {
      id: Date.now().toString(),
      nom: nomHerbe.trim(),
      avec: splitList(avecHerbe),
      idee: ideeHerbe.trim() || "Idée à compléter.",
      perso: true,
    };

    const updated = [...herbesPerso, nouvelle];
    setHerbesPerso(updated);
    localStorage.setItem("koalasHerbesPerso", JSON.stringify(updated));

    setNomHerbe("");
    setAvecHerbe("");
    setIdeeHerbe("");

    alert("Herbe ajoutée ✅");
  }

  function supprimerRecette(id: string) {
    const updated = recettesPerso.filter((recette) => recette.id !== id);
    setRecettesPerso(updated);
    localStorage.setItem("koalasRecettesPerso", JSON.stringify(updated));
  }

  function supprimerAssociation(id: string) {
    const updated = associationsPerso.filter((association) => association.id !== id);
    setAssociationsPerso(updated);
    localStorage.setItem("koalasAssociationsPerso", JSON.stringify(updated));
  }

  function supprimerHerbe(id: string) {
    const updated = herbesPerso.filter((herbe) => herbe.id !== id);
    setHerbesPerso(updated);
    localStorage.setItem("koalasHerbesPerso", JSON.stringify(updated));
  }

  return (
    <main className="min-h-screen bg-[#F7F3EA] p-6 text-[#243024] lg:p-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/" className="font-bold text-[#6B8F71]">
          ← Retour à l’accueil
        </Link>

        <div className="mt-6 rounded-[2.5rem] bg-white p-10 shadow-sm">
          <p className="font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
            Recettes & associations
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Idées repas pour les tout-petits
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Recettes, associations d’aliments et idées d’herbes aromatiques
            adaptées à la petite enfance.
          </p>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Rechercher une idée</h2>

          <div className="mt-6">
            <p className="mb-3 font-bold">Tranche d’âge</p>
            <div className="flex flex-wrap gap-3">
              {(["4-12", "12-18", "18+"] as Age[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setAge(item)}
                  className={`rounded-full px-5 py-3 font-bold ${
                    age === item ? "bg-[#6B8F71] text-white" : "bg-[#F7F3EA]"
                  }`}
                >
                  {labelAge(item)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 font-bold">Catégorie</p>
            <div className="flex flex-wrap gap-3">
              {(["diner", "gouter", "association", "herbes"] as Categorie[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setCategorie(item)}
                  className={`rounded-full px-5 py-3 font-bold ${
                    categorie === item ? "bg-[#6B8F71] text-white" : "bg-[#F7F3EA]"
                  }`}
                >
                  {labelCategorie(item)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(categorie === "diner" || categorie === "gouter") && (
          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recettesFiltrees.map((recette) => (
              <article key={recette.id} className="rounded-[2rem] bg-white p-7 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-[#E8F2EA] px-4 py-2 text-sm font-bold text-[#6B8F71]">
                    {labelAge(recette.age)}
                  </span>

                  <span className="rounded-full bg-[#F7F3EA] px-4 py-2 text-sm font-bold">
                    {labelCategorie(recette.categorie)}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-bold">{recette.titre}</h2>

                <div className="mt-5 flex flex-wrap gap-2">
                  {recette.ingredients.map((ingredient) => (
                    <span key={ingredient} className="rounded-full bg-[#F7F3EA] px-3 py-2 text-sm">
                      {ingredient}
                    </span>
                  ))}
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-700">
                  <p>
                    <b>Texture :</b> {recette.texture}
                  </p>
                  <p>
                    <b>Conseil :</b> {recette.conseil}
                  </p>
                </div>

                {recette.perso && (
                  <button
                    onClick={() => supprimerRecette(recette.id)}
                    className="mt-5 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
                  >
                    Supprimer
                  </button>
                )}
              </article>
            ))}
          </section>
        )}

        {categorie === "association" && (
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            {associations.map((association) => (
              <article key={association.id} className="rounded-[2rem] bg-white p-7 shadow-sm">
                <h2 className="text-3xl font-bold">{association.aliment}</h2>

                <div className="mt-5 grid gap-3">
                  {association.idees.map((idee) => (
                    <div key={idee} className="rounded-2xl bg-[#F7F3EA] p-4">
                      {idee}
                    </div>
                  ))}
                </div>

                {association.perso && (
                  <button
                    onClick={() => supprimerAssociation(association.id)}
                    className="mt-5 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
                  >
                    Supprimer
                  </button>
                )}
              </article>
            ))}
          </section>
        )}

        {categorie === "herbes" && (
          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {herbes.map((herbe) => (
              <article key={herbe.id} className="rounded-[2rem] bg-white p-7 shadow-sm">
                <h2 className="text-3xl font-bold">🌿 {herbe.nom}</h2>

                <p className="mt-5 font-bold">Se marie bien avec :</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {herbe.avec.map((aliment) => (
                    <span key={aliment} className="rounded-full bg-[#F7F3EA] px-3 py-2 text-sm">
                      {aliment}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-[#E8F2EA] p-4">
                  <p className="font-bold">Exemple :</p>
                  <p className="mt-2">{herbe.idee}</p>
                </div>

                {herbe.perso && (
                  <button
                    onClick={() => supprimerHerbe(herbe.id)}
                    className="mt-5 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
                  >
                    Supprimer
                  </button>
                )}
              </article>
            ))}
          </section>
        )}

        <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Ajouter manuellement</h2>

          <p className="mt-2 text-gray-600">
            Tes ajouts sont sauvegardés uniquement sur cet appareil.
          </p>

          {(categorie === "diner" || categorie === "gouter") && (
            <div className="mt-6 grid gap-4">
              <input
                value={titreRecette}
                onChange={(e) => setTitreRecette(e.target.value)}
                placeholder="Titre de la recette"
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={ageRecette}
                  onChange={(e) => setAgeRecette(e.target.value as Age)}
                  className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
                >
                  <option value="4-12">4–12 mois</option>
                  <option value="12-18">12–18 mois</option>
                  <option value="18+">18 mois et +</option>
                </select>

                <select
                  value={categorieRecette}
                  onChange={(e) => setCategorieRecette(e.target.value as "diner" | "gouter")}
                  className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
                >
                  <option value="diner">Dîner</option>
                  <option value="gouter">Goûter</option>
                </select>
              </div>

              <textarea
                value={ingredientsRecette}
                onChange={(e) => setIngredientsRecette(e.target.value)}
                placeholder="Ingrédients séparés par des virgules"
                className="min-h-24 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <textarea
                value={textureRecette}
                onChange={(e) => setTextureRecette(e.target.value)}
                placeholder="Texture / adaptation"
                className="min-h-24 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <textarea
                value={conseilRecette}
                onChange={(e) => setConseilRecette(e.target.value)}
                placeholder="Conseil professionnel"
                className="min-h-24 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <button
                onClick={ajouterRecette}
                className="w-fit rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
              >
                Ajouter la recette
              </button>
            </div>
          )}

          {categorie === "association" && (
            <div className="mt-6 grid gap-4">
              <input
                value={alimentAssociation}
                onChange={(e) => setAlimentAssociation(e.target.value)}
                placeholder="Aliment principal, ex : Carotte"
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <textarea
                value={ideesAssociation}
                onChange={(e) => setIdeesAssociation(e.target.value)}
                placeholder="Idées séparées par des virgules, ex : pomme de terre + poulet, riz + cabillaud"
                className="min-h-28 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <button
                onClick={ajouterAssociation}
                className="w-fit rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
              >
                Ajouter l’association
              </button>
            </div>
          )}

          {categorie === "herbes" && (
            <div className="mt-6 grid gap-4">
              <input
                value={nomHerbe}
                onChange={(e) => setNomHerbe(e.target.value)}
                placeholder="Nom de l’herbe, ex : Romarin"
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <textarea
                value={avecHerbe}
                onChange={(e) => setAvecHerbe(e.target.value)}
                placeholder="Se marie avec... aliments séparés par des virgules"
                className="min-h-24 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <input
                value={ideeHerbe}
                onChange={(e) => setIdeeHerbe(e.target.value)}
                placeholder="Exemple d’idée, ex : pomme de terre poulet romarin"
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <button
                onClick={ajouterHerbe}
                className="w-fit rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
              >
                Ajouter l’herbe
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}