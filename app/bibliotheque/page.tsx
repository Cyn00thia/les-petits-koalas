"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

type Food = {
  id: string;
  nom: string;
  categorie: string;
  description?: string;
  bienfaits?: string;
  textures?: string[];
  presentations?: string[];
  conseils?: string;
  photo_url?: string;
};

const categories = [
  { key: "legumes", label: "Légumes", emoji: "🥕", desc: "Légumes, textures et présentations.", color: "bg-[#F1F7EC]" },
  { key: "fruits", label: "Fruits", emoji: "🍎", desc: "Fruits, compotes et morceaux fondants.", color: "bg-[#FFF3EF]" },
  { key: "feculents", label: "Féculents", emoji: "🥔", desc: "Pommes de terre, riz, pâtes, semoule...", color: "bg-[#FFF8E8]" },
  { key: "vvpo", label: "VVP/O", emoji: "🐟", desc: "Viandes, volailles, poissons et œufs.", color: "bg-[#EEF6FA]" },
  { key: "soupes", label: "Soupes", emoji: "🥣", desc: "Associations de légumes et potages doux.", color: "bg-[#F8F0E8]" },
  { key: "gouters", label: "Goûters", emoji: "🧁", desc: "Idées de goûters adaptés.", color: "bg-[#F7EEF9]" },
  { key: "repas-complets", label: "Repas complets", emoji: "🍽️", desc: "Repas complets adaptés aux enfants.", color: "bg-[#F7F4EE]" },
];

const exemples: Food[] = [
  {
    id: "carotte",
    nom: "Carotte",
    categorie: "legumes",
    description: "Légume racine doux et coloré, apprécié des enfants pour son goût légèrement sucré.",
    bienfaits: "Riche en bêta-carotène, source de fibres et goût naturellement doux.",
    textures: ["Mixé", "Écrasé", "Morceaux fondants", "Bâtonnets vapeur", "Frites au four"],
    presentations: ["Purée lisse", "Écrasée", "Bâtonnets vapeur", "Frites de carotte au four"],
    conseils: "La carotte se marie facilement avec la pomme de terre, le panais, la courgette ou le poireau.",
  },
  {
    id: "brocoli",
    nom: "Brocoli",
    categorie: "legumes",
    description: "Légume vert intéressant pour varier les goûts et les couleurs.",
    bienfaits: "Source de fibres, vitamines et minéraux.",
    textures: ["Mixé", "Écrasé", "Fleurettes fondantes"],
    presentations: ["Purée brocoli-pomme de terre", "Fleurettes vapeur", "Soupe brocoli-courgette"],
  },
  {
    id: "pomme",
    nom: "Pomme",
    categorie: "fruits",
    description: "Fruit doux, facile à proposer en compote ou en morceaux fondants.",
    bienfaits: "Source de fibres et fruit très pratique au quotidien.",
    textures: ["Compote", "Écrasé", "Morceaux fondants"],
    presentations: ["Compote pomme-poire", "Pomme cuite", "Petits morceaux fondants"],
  },
  {
    id: "pomme-de-terre",
    nom: "Pomme de terre",
    categorie: "feculents",
    description: "Féculent de base, facile à adapter à de nombreuses textures.",
    bienfaits: "Apporte de l’énergie et se marie facilement avec les légumes.",
    textures: ["Purée", "Écrasée", "Cubes fondants", "Quartiers au four"],
    presentations: ["Purée", "Cubes vapeur", "Frites au four", "Tortilla"],
  },
  {
    id: "oeuf",
    nom: "Œuf",
    categorie: "vvpo",
    description: "Source de protéines pouvant être proposée dans des préparations adaptées.",
    bienfaits: "Source de protéines et ingrédient pratique pour varier les repas.",
    textures: ["Œuf dur émietté", "Omelette fondante", "Tortilla"],
    presentations: ["Omelette", "Tortilla pommes de terre-carottes", "Œuf dur adapté"],
  },
];

function getCat(categorie: string) {
  return categories.find((c) => c.key === categorie);
}

function texteVersListe(texte: string) {
  return texte
    .split("\n")
    .map((ligne) => ligne.trim())
    .filter(Boolean);
}

export default function BibliothequePage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categorieActive, setCategorieActive] = useState("legumes");
  const [recherche, setRecherche] = useState("");
  const [selection, setSelection] = useState<Food | null>(null);
  const [chargement, setChargement] = useState(true);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);

  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("legumes");
  const [description, setDescription] = useState("");
  const [bienfaits, setBienfaits] = useState("");
  const [textures, setTextures] = useState("");
  const [presentations, setPresentations] = useState("");
  const [conseils, setConseils] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    chargerAliments();
  }, []);

  async function chargerAliments() {
    setChargement(true);

    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .order("nom", { ascending: true });

    if (error) {
      console.log(error);
      setFoods([]);
    } else {
      setFoods(data || []);
    }

    setChargement(false);
  }

  async function ajouterAliment() {
    if (!nom.trim()) {
      alert("Indique au minimum le nom de l’aliment.");
      return;
    }

    setSauvegarde(true);

    const nouvelAliment = {
      nom: nom.trim(),
      categorie,
      description: description.trim(),
      bienfaits: bienfaits.trim(),
      textures: texteVersListe(textures),
      presentations: texteVersListe(presentations),
      conseils: conseils.trim(),
      photo_url: photoUrl.trim(),
    };

    const { data, error } = await supabase
      .from("foods")
      .insert([nouvelAliment])
      .select("*")
      .single();

    setSauvegarde(false);

    if (error) {
      console.log(error);
      alert("Erreur lors de l’ajout de l’aliment.");
      return;
    }

    setFoods((prev) => [data, ...prev]);
    setSelection(data);
    setCategorieActive(data.categorie);

    setNom("");
    setCategorie("legumes");
    setDescription("");
    setBienfaits("");
    setTextures("");
    setPresentations("");
    setConseils("");
    setPhotoUrl("");
    setFormulaireOuvert(false);
  }

  const source = foods.length > 0 ? foods : exemples;

  const alimentsFiltres = useMemo(() => {
    return source.filter((food) => {
      const okCategorie = categorieActive === "tous" || food.categorie === categorieActive;
      const texte = `${food.nom} ${food.description || ""} ${food.bienfaits || ""}`.toLowerCase();
      return okCategorie && texte.includes(recherche.toLowerCase());
    });
  }, [source, categorieActive, recherche]);

  const aliment = selection || alimentsFiltres[0] || source[0];
  const cat = aliment ? getCat(aliment.categorie) : undefined;

  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#243024]">
      <div className="mx-auto grid max-w-[1600px] gap-6 p-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
          <Link href="/" className="font-bold text-[#6B8F71]">← Retour accueil</Link>

          <div className="mt-8">
            <div className="text-5xl">🌿</div>
            <h1 className="mt-4 text-3xl font-black leading-tight">Bibliothèque alimentaire</h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Découvrir les aliments, leurs bienfaits, leurs textures et les recettes associées.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFormulaireOuvert(true)}
            className="mt-8 w-full rounded-full bg-[#6B8F71] px-5 py-4 font-black text-white shadow-sm transition hover:scale-[1.02]"
          >
            ➕ Nouvel aliment
          </button>

          <div className="mt-8 rounded-[1.5rem] bg-[#FFF7F2] p-5">
            <p className="font-bold text-[#B2782D]">💡 Le savais-tu ?</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Une autre présentation peut parfois aider un enfant à redécouvrir un aliment.
            </p>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="font-bold uppercase tracking-[0.25em] text-[#6B8F71]">Recettes & aliments</p>
                <h2 className="mt-4 text-5xl font-black leading-tight">Découverte des aliments</h2>
                <p className="mt-3 max-w-3xl text-lg leading-relaxed text-gray-600">
                  Une base pour retrouver un aliment, ses bienfaits, ses textures possibles et ses recettes.
                </p>
              </div>

              <div className="rounded-[2rem] bg-[#F7F3EA] p-4">
                <p className="text-sm font-bold text-[#6B8F71]">
                  {foods.length > 0 ? `${foods.length} aliment(s)` : "Mode aperçu"}
                </p>
              </div>
            </div>

            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="🔍 Rechercher un aliment ou une recette..."
              className="mt-8 w-full rounded-[1.5rem] border border-[#E8E0D5] bg-white px-6 py-5 text-lg outline-none focus:border-[#6B8F71]"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[330px_1fr]">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-black">Catégories</h3>

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => { setCategorieActive("tous"); setSelection(null); }}
                  className={`w-full rounded-[1.2rem] border px-4 py-4 text-left font-bold ${
                    categorieActive === "tous" ? "border-[#6B8F71] bg-[#F1F7EC]" : "border-[#E8E0D5] bg-white"
                  }`}
                >
                  🌈 Tous les aliments
                </button>

                {categories.map((categorie) => (
                  <button
                    key={categorie.key}
                    type="button"
                    onClick={() => { setCategorieActive(categorie.key); setSelection(null); }}
                    className={`w-full rounded-[1.2rem] border px-4 py-4 text-left transition ${
                      categorieActive === categorie.key ? "border-[#6B8F71] bg-[#F1F7EC]" : "border-[#E8E0D5] bg-white hover:bg-[#F8F6F2]"
                    }`}
                  >
                    <p className="text-lg font-black">{categorie.emoji} {categorie.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">{categorie.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {aliment && (
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                    <div>
                      <p className="text-sm font-bold text-[#6B8F71]">{cat?.label || aliment.categorie}</p>
                      <h3 className="mt-2 text-5xl font-black">{cat?.emoji || "🌿"} {aliment.nom}</h3>
                      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
                        {aliment.description || "Fiche aliment à compléter progressivement."}
                      </p>

                      <div className="mt-6 rounded-[1.5rem] bg-[#F1F7EC] p-5">
                        <p className="font-black text-[#45654A]">🌿 Les bienfaits</p>
                        <p className="mt-3 text-sm leading-relaxed text-gray-700">
                          {aliment.bienfaits || "Bienfaits à compléter : fibres, vitamines, goût et intérêt dans l’alimentation des jeunes enfants."}
                        </p>
                      </div>

                      {aliment.conseils && (
                        <div className="mt-4 rounded-[1.5rem] bg-[#FFF7F2] p-5">
                          <p className="font-black text-[#B2782D]">💡 Conseils</p>
                          <p className="mt-3 text-sm leading-relaxed text-gray-700">{aliment.conseils}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#FFF8E8] text-8xl">
                      {aliment.photo_url ? (
                        <img src={aliment.photo_url} alt={aliment.nom} className="h-full w-full object-cover" />
                      ) : (
                        cat?.emoji || "🌿"
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-[#E8E0D5] bg-white p-5">
                      <p className="text-xl font-black">👶 Textures possibles</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(aliment.textures?.length ? aliment.textures : ["Mixé", "Écrasé", "Morceaux fondants"]).map((texture) => (
                          <span key={texture} className="rounded-full bg-[#F7F3EA] px-4 py-2 text-sm font-bold">
                            {texture}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#E8E0D5] bg-white p-5">
                      <p className="text-xl font-black">🍽️ Présentations possibles</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {(aliment.presentations?.length ? aliment.presentations : ["Purée lisse", "Écrasé doux", "Morceaux fondants", "Présentation familiale adaptée"]).map((presentation) => (
                          <div key={presentation} className="rounded-[1rem] bg-[#F7F3EA] p-3 text-sm font-bold">
                            {presentation}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.5rem] bg-[#F8F6F2] p-5">
                    <p className="text-xl font-black">🍽️ Recettes utilisant {aliment.nom.toLowerCase()}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {[`Purée de ${aliment.nom.toLowerCase()}`, `Soupe avec ${aliment.nom.toLowerCase()}`, `${aliment.nom} vapeur`, `Repas complet avec ${aliment.nom.toLowerCase()}`].map((recette) => (
                        <div key={recette} className="rounded-[1rem] bg-white p-4 font-bold text-[#315A86]">
                          {recette}
                          <p className="mt-1 text-xs font-normal text-gray-500">Fiche recette à relier plus tard</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-black">
                  {categorieActive === "tous" ? "Tous les aliments" : categories.find((item) => item.key === categorieActive)?.label}
                </h3>

                {chargement ? (
                  <p className="mt-5 text-gray-600">Chargement...</p>
                ) : alimentsFiltres.length === 0 ? (
                  <p className="mt-5 text-gray-600">Aucun aliment pour le moment dans cette catégorie.</p>
                ) : (
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {alimentsFiltres.map((food) => {
                      const foodCat = getCat(food.categorie);
                      return (
                        <button
                          key={food.id}
                          type="button"
                          onClick={() => setSelection(food)}
                          className="rounded-[1.5rem] border border-[#E8E0D5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                          <p className="text-3xl">{foodCat?.emoji || "🌿"}</p>
                          <p className="mt-3 text-xl font-black">{food.nom}</p>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                            {food.description || "Fiche à compléter progressivement."}
                          </p>
                          <p className="mt-4 text-sm font-bold text-[#6B8F71]">Voir la fiche →</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {formulaireOuvert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8">
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#6B8F71]">Nouvel aliment</p>
                <h2 className="mt-2 text-4xl font-black">Ajouter un aliment</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Les champs avec plusieurs éléments se remplissent avec une ligne par élément.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormulaireOuvert(false)}
                className="rounded-full bg-[#F7F3EA] px-6 py-3 font-bold text-[#6B8F71]"
              >
                Fermer
              </button>
            </div>

            <div className="mt-8 grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="font-bold">Nom de l’aliment</label>
                  <input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Exemple : Carotte"
                    className="mt-2 w-full rounded-2xl border border-[#E8E0D5] px-5 py-4 outline-none focus:border-[#6B8F71]"
                  />
                </div>

                <div>
                  <label className="font-bold">Catégorie</label>
                  <select
                    value={categorie}
                    onChange={(e) => setCategorie(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#E8E0D5] px-5 py-4 outline-none focus:border-[#6B8F71]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Petite description douce et professionnelle..."
                  className="mt-2 min-h-[110px] w-full rounded-2xl border border-[#E8E0D5] px-5 py-4 outline-none focus:border-[#6B8F71]"
                />
              </div>

              <div>
                <label className="font-bold">Bienfaits</label>
                <textarea
                  value={bienfaits}
                  onChange={(e) => setBienfaits(e.target.value)}
                  placeholder="Exemple : riche en bêta-carotène, source de fibres..."
                  className="mt-2 min-h-[110px] w-full rounded-2xl border border-[#E8E0D5] px-5 py-4 outline-none focus:border-[#6B8F71]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="font-bold">Textures possibles</label>
                  <textarea
                    value={textures}
                    onChange={(e) => setTextures(e.target.value)}
                    placeholder={"Mixé\\nÉcrasé\\nMorceaux fondants"}
                    className="mt-2 min-h-[140px] w-full rounded-2xl border border-[#E8E0D5] px-5 py-4 outline-none focus:border-[#6B8F71]"
                  />
                </div>

                <div>
                  <label className="font-bold">Présentations possibles</label>
                  <textarea
                    value={presentations}
                    onChange={(e) => setPresentations(e.target.value)}
                    placeholder={"Purée lisse\\nBâtonnets vapeur\\nFrites au four"}
                    className="mt-2 min-h-[140px] w-full rounded-2xl border border-[#E8E0D5] px-5 py-4 outline-none focus:border-[#6B8F71]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold">Conseils</label>
                <textarea
                  value={conseils}
                  onChange={(e) => setConseils(e.target.value)}
                  placeholder="Astuce de présentation, association intéressante, point d’attention..."
                  className="mt-2 min-h-[100px] w-full rounded-2xl border border-[#E8E0D5] px-5 py-4 outline-none focus:border-[#6B8F71]"
                />
              </div>

              <div>
                <label className="font-bold">URL photo</label>
                <input
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-2xl border border-[#E8E0D5] px-5 py-4 outline-none focus:border-[#6B8F71]"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormulaireOuvert(false)}
                className="rounded-full bg-[#F7F3EA] px-8 py-4 font-bold text-[#6B8F71]"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={ajouterAliment}
                disabled={sauvegarde}
                className="rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white disabled:opacity-50"
              >
                {sauvegarde ? "Enregistrement..." : "Ajouter l’aliment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
