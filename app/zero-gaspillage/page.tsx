"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Categorie =
  | "legume"
  | "fruit"
  | "feculent"
  | "proteine"
  | "laitier"
  | "autre";

type AlimentRestant = {
  id: string;
  nom: string;
  categorie: Categorie;
  quantite: string;
};

type IdeeRepas = {
  titre: string;
  type: string;
  age: string;
  ingredientsUtilises: string[];
  idee: string;
  adaptation: string;
};

function labelCategorie(categorie: Categorie) {
  if (categorie === "legume") return "Légume";
  if (categorie === "fruit") return "Fruit";
  if (categorie === "feculent") return "Féculent";
  if (categorie === "proteine") return "VVP/O";
  if (categorie === "laitier") return "Produit laitier";
  return "Autre";
}

function emojiCategorie(categorie: Categorie) {
  if (categorie === "legume") return "🥦";
  if (categorie === "fruit") return "🍎";
  if (categorie === "feculent") return "🍚";
  if (categorie === "proteine") return "🍗";
  if (categorie === "laitier") return "🥛";
  return "🧺";
}

function contient(aliments: AlimentRestant[], mots: string[]) {
  return aliments.some((aliment) =>
    mots.some((mot) => aliment.nom.toLowerCase().includes(mot.toLowerCase()))
  );
}

function genererIdees(aliments: AlimentRestant[]): IdeeRepas[] {
  const idees: IdeeRepas[] = [];

  const legumes = aliments.filter((a) => a.categorie === "legume");
  const fruits = aliments.filter((a) => a.categorie === "fruit");
  const feculents = aliments.filter((a) => a.categorie === "feculent");
  const proteines = aliments.filter((a) => a.categorie === "proteine");
  const laitier = aliments.filter((a) => a.categorie === "laitier");

  if (legumes.length >= 1) {
    idees.push({
      titre: "Soupe douce de légumes",
      type: "Dîner",
      age: "Dès 12 mois, texture adaptée avant selon introductions",
      ingredientsUtilises: legumes.map((a) => a.nom),
      idee:
        "Cuire les légumes restants avec un peu de pomme de terre si besoin, mixer et servir avec une VVP/O adaptée.",
      adaptation:
        "Avant 12 mois : rester sur une préparation très simple, vapeur/mixée, sans sauce ni mélange trop complexe.",
    });
  }

  if (legumes.length >= 1 && feculents.length >= 1) {
    idees.push({
      titre: "Galettes fondantes légumes-féculent",
      type: "Dîner",
      age: "Plutôt 18 mois et +",
      ingredientsUtilises: [...legumes.map((a) => a.nom), ...feculents.map((a) => a.nom)],
      idee:
        "Mélanger légumes cuits écrasés et féculent cuit, former de petites galettes fondantes et cuire doucement à la poêle avec très peu de matière grasse.",
      adaptation:
        "À proposer seulement si l’enfant gère bien les morceaux fondants. Éviter les textures sèches.",
    });
  }

  if (contient(aliments, ["courgette", "carotte", "tomate", "butternut", "potiron"])) {
    idees.push({
      titre: "Sauce légumes maison pour pâtes",
      type: "Dîner",
      age: "Dès 12 mois",
      ingredientsUtilises: aliments
        .filter((a) =>
          ["courgette", "carotte", "tomate", "butternut", "potiron"].some((mot) =>
            a.nom.toLowerCase().includes(mot)
          )
        )
        .map((a) => a.nom),
      idee:
        "Cuire les légumes puis les mixer pour obtenir une sauce douce à mélanger avec des pâtes.",
      adaptation:
        "Sauce uniquement à base de légumes cuits mixés, sans ketchup, mayonnaise ni sauce industrielle.",
    });
  }

  if (fruits.length >= 1) {
    idees.push({
      titre: "Compote anti-gaspi",
      type: "Goûter",
      age: "4–12 mois selon fruits déjà introduits, et plus grands",
      ingredientsUtilises: fruits.map((a) => a.nom),
      idee:
        "Cuire les fruits mûrs ou abîmés, mixer ou écraser selon l’âge. Ne pas ajouter de sucre.",
      adaptation:
        "Pour les 4–12 mois : rester sur 2 à 3 fruits déjà introduits et texture adaptée.",
    });
  }

  if (fruits.length >= 1 && contient(aliments, ["pain"])) {
    idees.push({
      titre: "Goûter fruits + pain",
      type: "Goûter",
      age: "12 mois et +",
      ingredientsUtilises: [...fruits.map((a) => a.nom), "Pain"],
      idee:
        "Servir les fruits adaptés avec du pain beurré selon l’âge.",
      adaptation:
        "12–18 mois : fruit + pain beurré + eau. 18 mois et + : ajouter un produit laitier seulement selon fréquence.",
    });
  }

  if (legumes.length >= 1 && proteines.length >= 1) {
    idees.push({
      titre: "Écrasé légumes + VVP/O",
      type: "Dîner",
      age: "Selon texture et âge",
      ingredientsUtilises: [...legumes.map((a) => a.nom), ...proteines.map((a) => a.nom)],
      idee:
        "Réchauffer les légumes cuits et ajouter la VVP/O adaptée. Servir avec un féculent si besoin.",
      adaptation:
        "Bien adapter les morceaux, vérifier les arêtes du poisson et éviter les préparations sèches.",
    });
  }

  if (laitier.length >= 1 && fruits.length >= 1) {
    idees.push({
      titre: "Fruit + produit laitier selon fréquence",
      type: "Goûter",
      age: "18 mois et +",
      ingredientsUtilises: [...fruits.map((a) => a.nom), ...laitier.map((a) => a.nom)],
      idee:
        "Associer un fruit adapté avec un produit laitier uniquement si cela correspond à la fréquence prévue.",
      adaptation:
        "Ne pas proposer de produit laitier au goûter avant 18 mois dans cette logique.",
    });
  }

  if (idees.length === 0) {
    idees.push({
      titre: "Idée simple à construire",
      type: "Repas ou goûter",
      age: "À adapter",
      ingredientsUtilises: aliments.map((a) => a.nom),
      idee:
        "Ajoute au moins un légume, un fruit ou un féculent pour obtenir des propositions plus précises.",
      adaptation:
        "L’idée doit toujours rester adaptée à l’âge, aux textures et aux recommandations du milieu d’accueil.",
    });
  }

  return idees;
}

export default function ZeroGaspillagePage() {
  const [aliments, setAliments] = useState<AlimentRestant[]>([]);
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState<Categorie>("legume");
  const [quantite, setQuantite] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("koalasZeroGaspillage");
    if (saved) setAliments(JSON.parse(saved));
  }, []);

  const idees = genererIdees(aliments);

  function ajouterAliment() {
    if (!nom.trim()) {
      alert("Ajoute au minimum le nom de l’aliment 🙂");
      return;
    }

    const nouveau: AlimentRestant = {
      id: Date.now().toString(),
      nom: nom.trim(),
      categorie,
      quantite: quantite.trim() || "Quantité non précisée",
    };

    const updated = [...aliments, nouveau];
    setAliments(updated);
    localStorage.setItem("koalasZeroGaspillage", JSON.stringify(updated));

    setNom("");
    setQuantite("");
  }

  function supprimerAliment(id: string) {
    const updated = aliments.filter((aliment) => aliment.id !== id);
    setAliments(updated);
    localStorage.setItem("koalasZeroGaspillage", JSON.stringify(updated));
  }

  function viderListe() {
    const confirmer = confirm("Vider toute la liste des restes ?");
    if (!confirmer) return;

    setAliments([]);
    localStorage.removeItem("koalasZeroGaspillage");
  }

  return (
    <main className="min-h-screen bg-[#F7F3EA] p-6 text-[#243024] lg:p-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/" className="font-bold text-[#6B8F71]">
          ← Retour à l’accueil
        </Link>

        <div className="mt-6 rounded-[2.5rem] bg-white p-10 shadow-sm">
          <p className="font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
            Zéro gaspillage
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Utiliser les restes intelligemment
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Ajoute les aliments qu’il te reste, et l’application propose des idées
            simples adaptées aux tout-petits.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Ajouter un reste</h2>

            <div className="mt-6 grid gap-4">
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex : courgette, riz cuit, pomme mûre..."
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value as Categorie)}
                  className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
                >
                  <option value="legume">Légume</option>
                  <option value="fruit">Fruit</option>
                  <option value="feculent">Féculent</option>
                  <option value="proteine">VVP/O</option>
                  <option value="laitier">Produit laitier</option>
                  <option value="autre">Autre</option>
                </select>

                <input
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  placeholder="Quantité, ex : 1 courgette, 200 g, un reste..."
                  className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
                />
              </div>

              <button
                onClick={ajouterAliment}
                className="w-fit rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
              >
                Ajouter à la liste
              </button>
            </div>
          </section>

          <aside className="rounded-[2rem] bg-[#E8F2EA] p-8 shadow-sm">
            <div className="text-6xl">♻️</div>

            <h2 className="mt-5 text-2xl font-bold">Repère</h2>

            <p className="mt-3 leading-relaxed text-gray-700">
              Les idées proposées restent à adapter selon l’âge, les textures,
              les introductions alimentaires et les règles du milieu d’accueil.
            </p>
          </aside>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-3xl font-bold">Mes restes</h2>

              {aliments.length > 0 && (
                <button
                  onClick={viderListe}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
                >
                  Vider
                </button>
              )}
            </div>

            {aliments.length === 0 && (
              <p className="mt-5 rounded-2xl bg-[#F7F3EA] p-5 text-gray-600">
                Aucun aliment ajouté pour le moment.
              </p>
            )}

            <div className="mt-5 grid gap-3">
              {aliments.map((aliment) => (
                <div
                  key={aliment.id}
                  className="rounded-2xl bg-[#F7F3EA] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">
                        {emojiCategorie(aliment.categorie)} {aliment.nom}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {labelCategorie(aliment.categorie)} — {aliment.quantite}
                      </p>
                    </div>

                    <button
                      onClick={() => supprimerAliment(aliment.id)}
                      className="text-sm font-bold text-red-500"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section className="grid gap-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Idées proposées</h2>

              <p className="mt-2 text-gray-600">
                Les idées se génèrent automatiquement selon les aliments ajoutés.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {idees.map((idee) => (
                <article
                  key={idee.titre}
                  className="rounded-[2rem] bg-white p-7 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-[#E8F2EA] px-4 py-2 text-sm font-bold text-[#6B8F71]">
                      {idee.type}
                    </span>

                    <span className="rounded-full bg-[#F7F3EA] px-4 py-2 text-sm font-bold">
                      {idee.age}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold">{idee.titre}</h3>

                  <div className="mt-5">
                    <p className="font-bold">À utiliser</p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {idee.ingredientsUtilises.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="rounded-full bg-[#F7F3EA] px-3 py-2 text-sm"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#F7F3EA] p-5">
                    <p className="font-bold">Idée</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      {idee.idee}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#FFF8E7] p-5">
                    <p className="font-bold">Adaptation petite enfance</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      {idee.adaptation}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}