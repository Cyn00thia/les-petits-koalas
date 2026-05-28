"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";

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
  code_parent?: string;
};

type CategorieDiversification = {
  key:
    | "fruits_introduits"
    | "legumes_introduits"
    | "feculents_introduits"
    | "vvpo_introduits"
    | "matieres_grasses_introduites"
    | "herbes_introduites"
    | "autres_introduits";
  titre: string;
  emoji: string;
  aliments: string[];
};

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const texturesAlimentaires = [
  {
    value: "mixe",
    label: "Mixé",
    description: "Texture lisse et homogène.",
    emoji: "🥣",
  },
  {
    value: "ecrase",
    label: "Écrasé",
    description: "Texture écrasée, souple et progressive.",
    emoji: "🍴",
  },
  {
    value: "morceaux_fondants",
    label: "Morceaux fondants",
    description: "Petits morceaux tendres qui s’écrasent facilement.",
    emoji: "🧩",
  },
  {
    value: "morceaux_autonomes",
    label: "Morceaux autonomes",
    description: "Morceaux adaptés à l’autonomie alimentaire.",
    emoji: "🍽️",
  },
];

const categoriesDiversification: CategorieDiversification[] = [
  {
    key: "fruits_introduits",
    titre: "Fruits",
    emoji: "🍎",
    aliments: [
      "Pomme",
      "Poire",
      "Banane",
      "Pêche",
      "Nectarine",
      "Abricot",
      "Prune",
      "Mirabelle",
      "Reine-Claude",
      "Cerise",
      "Fraise",
      "Framboise",
      "Myrtille",
      "Mûre",
      "Groseille",
      "Raisin",
      "Kiwi",
      "Mandarine",
      "Clémentine",
      "Orange",
      "Pamplemousse",
      "Melon",
      "Pastèque",
      "Mangue",
      "Ananas",
      "Figue",
      "Kaki",
      "Coing",
      "Rhubarbe cuite",
    ],
  },
  {
    key: "legumes_introduits",
    titre: "Légumes",
    emoji: "🥕",
    aliments: [
      "Carotte",
      "Courgette",
      "Potiron",
      "Butternut",
      "Potimarron",
      "Haricots verts",
      "Petits pois",
      "Pois mange-tout",
      "Brocoli",
      "Chou-fleur",
      "Romanesco",
      "Épinard",
      "Blette",
      "Poireau",
      "Panais",
      "Navet",
      "Rutabaga",
      "Fenouil",
      "Tomate",
      "Concombre",
      "Betterave",
      "Céleri-rave",
      "Céleri branche",
      "Aubergine",
      "Poivron",
      "Champignon",
      "Laitue",
      "Roquette",
      "Endive",
      "Chou blanc",
      "Chou rouge",
      "Chou de Bruxelles",
      "Kale",
      "Chou chinois",
      "Chou-rave",
      "Artichaut",
      "Radis",
      "Salsifis",
      "Asperge",
      "Crosnes",
    ],
  },
  {
    key: "feculents_introduits",
    titre: "Féculents",
    emoji: "🥔",
    aliments: [
      "Pommes de terre",
      "Patate douce",
      "Riz",
      "Pâtes",
      "Semoule",
      "Boulgour",
      "Quinoa",
      "Polenta",
      "Orge perlé",
      "Blé tendre",
      "Millet",
      "Sarrasin",
      "Maïs",
      "Pain gris",
      "Pain blanc",
      "Baguette",
      "Toscane",
      "Flocons d’avoine",
      "Lentilles",
      "Lentilles corail",
      "Pois chiches",
      "Haricots rouges",
      "Haricots blancs",
      "Petits pois cassés",
    ],
  },
  {
    key: "vvpo_introduits",
    titre: "VVP/O",
    emoji: "🍗",
    aliments: [
      "Poulet",
      "Dinde",
      "Lapin",
      "Veau",
      "Bœuf",
      "Porc",
      "Œuf",
      "Colin",
      "Cabillaud",
      "Lieu noir",
      "Lieu jaune",
      "Merlan",
      "Sébaste",
      "Sole",
      "Plie",
      "Limande",
      "Bar",
      "Dorade",
      "Saumon",
      "Truite",
      "Sardine",
      "Maquereau",
      "Hareng",
      "Thon",
    ],
  },
  {
    key: "matieres_grasses_introduites",
    titre: "Matières grasses",
    emoji: "🫒",
    aliments: [
      "Huile d’olive",
      "Huile de colza",
      "Huile de noix",
      "Beurre",
      "Margarine adaptée",
    ],
  },
  {
    key: "herbes_introduites",
    titre: "Herbes & épices douces",
    emoji: "🌿",
    aliments: [
      "Persil",
      "Ciboulette",
      "Basilic",
      "Thym",
      "Origan",
      "Laurier",
      "Romarin",
      "Aneth",
      "Estragon",
      "Coriandre",
      "Menthe",
      "Sauge",
      "Marjolaine",
      "Paprika doux",
      "Curcuma doux",
      "Cumin doux",
      "Muscade",
      "Cannelle",
      "Gingembre doux",
      "Ail",
      "Oignon",
      "Échalote",
    ],
  },
  {
    key: "autres_introduits",
    titre: "Autres",
    emoji: "➕",
    aliments: [
      "Yaourt nature",
      "Fromage",
      "Fromage frais",
      "Lait adapté",
      "Houmous",
      "Caviar d’aubergine",
      "Compote",
      "Tartinade de légumes",
      "Tartinade de légumineuses",
      "Bouillon maison sans sel",
    ],
  },
];

const allergiesFrequences = [
  "Lait de vache",
  "Œuf",
  "Arachide",
  "Fruits à coque",
  "Poisson",
  "Crustacés",
  "Blé / gluten",
  "Soja",
  "Sésame",
  "Moutarde",
  "Céleri",
  "Kiwi",
  "Fraise",
  "Autre",
];

function genererCodeParent() {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 8; i++) {
    code += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  return code;
}

export default function EnfantsPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [joursPresence, setJoursPresence] = useState<string[]>([]);
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [chargement, setChargement] = useState(true);

  const [enfantDiversification, setEnfantDiversification] =
    useState<Enfant | null>(null);
  const [enfantAllergies, setEnfantAllergies] = useState<Enfant | null>(null);
  const [allergiesTemp, setAllergiesTemp] = useState<string[]>([]);
  const [remarqueAllergiesTemp, setRemarqueAllergiesTemp] = useState("");
  const [nouvelAliment, setNouvelAliment] = useState<Record<string, string>>({});

  useEffect(() => {
    verifierConnexion();
  }, []);

  async function verifierConnexion() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    setUserId(session.user.id);
    await chargerEnfants(session.user.id);
  }

  async function chargerEnfants(uid: string) {
    setChargement(true);

    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      setChargement(false);
      return;
    }

    setEnfants(data || []);
    setChargement(false);
  }

  function toggleJour(jour: string) {
    setJoursPresence((prev) =>
      prev.includes(jour)
        ? prev.filter((j) => j !== jour)
        : [...prev, jour]
    );
  }

  async function ajouterEnfant() {
    if (!userId) {
      alert("Tu dois être connectée pour ajouter un enfant.");
      router.push("/login");
      return;
    }

    if (!nom.trim() || !dateNaissance) {
      alert("Merci de compléter le prénom/initiale et la date de naissance.");
      return;
    }

    const codeParent = genererCodeParent();

    const nouvelEnfant = {
      nom: nom.trim(),
      date_naissance: dateNaissance,
      jours_presence: joursPresence,

      fruits_introduits: [],
      legumes_introduits: [],
      feculents_introduits: [],
      vvpo_introduits: [],
      matieres_grasses_introduites: [],
      herbes_introduites: [],
      autres_introduits: [],

      allergies: [],
      allergies_remarques: "",
      texture_alimentaire: "morceaux_fondants",

      user_id: userId,
      code_parent: codeParent,
    };

    const { data, error } = await supabase
      .from("children")
      .insert([nouvelEnfant])
      .select("*")
      .single();

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      return;
    }

    setNom("");
    setDateNaissance("");
    setJoursPresence([]);

    if (data) {
      setEnfants((prev) => [data, ...prev]);
    } else {
      await chargerEnfants(userId);
    }
  }

  async function supprimerEnfant(id: string) {
    const confirmation = confirm("Supprimer définitivement cet enfant ?");

    if (!confirmation) return;

    const { error } = await supabase
      .from("children")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      return;
    }

    setEnfants((prev) => prev.filter((enfant) => enfant.id !== id));
  }

  async function modifierTextureEnfant(id: string, texture: string) {
    const { error } = await supabase
      .from("children")
      .update({ texture_alimentaire: texture })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      return;
    }

    setEnfants((prev) =>
      prev.map((enfant) =>
        enfant.id === id
          ? { ...enfant, texture_alimentaire: texture }
          : enfant
      )
    );
  }

  function ouvrirAllergies(enfant: Enfant) {
    setEnfantAllergies(enfant);
    setAllergiesTemp(enfant.allergies || []);
    setRemarqueAllergiesTemp(enfant.allergies_remarques || "");
  }

  async function sauvegarderAllergies() {
    if (!enfantAllergies) return;

    const { error } = await supabase
      .from("children")
      .update({
        allergies: allergiesTemp,
        allergies_remarques: remarqueAllergiesTemp,
      })
      .eq("id", enfantAllergies.id)
      .eq("user_id", userId);

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      return;
    }

    setEnfants((prev) =>
      prev.map((enfant) =>
        enfant.id === enfantAllergies.id
          ? {
              ...enfant,
              allergies: allergiesTemp,
              allergies_remarques: remarqueAllergiesTemp,
            }
          : enfant
      )
    );

    setEnfantAllergies(null);
  }

  function toggleAllergie(allergie: string) {
    setAllergiesTemp((prev) =>
      prev.includes(allergie)
        ? prev.filter((item) => item !== allergie)
        : [...prev, allergie]
    );
  }

  async function modifierIntroduction(
    enfant: Enfant,
    categorie: CategorieDiversification["key"],
    aliment: string
  ) {
    const valeursActuelles = enfant[categorie] || [];
    const nouvellesValeurs = valeursActuelles.includes(aliment)
      ? valeursActuelles.filter((item) => item !== aliment)
      : [...valeursActuelles, aliment];

    const { error } = await supabase
      .from("children")
      .update({ [categorie]: nouvellesValeurs })
      .eq("id", enfant.id)
      .eq("user_id", userId);

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      return;
    }

    const enfantMisAJour = {
      ...enfant,
      [categorie]: nouvellesValeurs,
    };

    setEnfants((prev) =>
      prev.map((item) => (item.id === enfant.id ? enfantMisAJour : item))
    );

    setEnfantDiversification((prev) =>
      prev && prev.id === enfant.id ? enfantMisAJour : prev
    );
  }

  async function ajouterAlimentManuel(
    enfant: Enfant,
    categorie: CategorieDiversification["key"]
  ) {
    const aliment = (nouvelAliment[categorie] || "").trim();

    if (!aliment) {
      alert("Écris d’abord le nom de l’aliment à ajouter.");
      return;
    }

    const valeursActuelles = enfant[categorie] || [];

    if (valeursActuelles.some((item) => item.toLowerCase() === aliment.toLowerCase())) {
      alert("Cet aliment est déjà dans la liste introduite.");
      return;
    }

    const nouvellesValeurs = [...valeursActuelles, aliment];

    const { error } = await supabase
      .from("children")
      .update({ [categorie]: nouvellesValeurs })
      .eq("id", enfant.id)
      .eq("user_id", userId);

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      return;
    }

    const enfantMisAJour = {
      ...enfant,
      [categorie]: nouvellesValeurs,
    };

    setEnfants((prev) =>
      prev.map((item) => (item.id === enfant.id ? enfantMisAJour : item))
    );

    setEnfantDiversification((prev) =>
      prev && prev.id === enfant.id ? enfantMisAJour : prev
    );

    setNouvelAliment((prev) => ({ ...prev, [categorie]: "" }));
  }

  function calculerAge(date: string) {
    const naissance = new Date(date);
    const aujourdHui = new Date();

    let mois =
      (aujourdHui.getFullYear() - naissance.getFullYear()) * 12 +
      aujourdHui.getMonth() -
      naissance.getMonth();

    if (aujourdHui.getDate() < naissance.getDate()) {
      mois--;
    }

    const annees = Math.floor(mois / 12);
    const resteMois = mois % 12;

    if (annees <= 0) {
      return `${resteMois} mois`;
    }

    if (resteMois === 0) {
      return `${annees} an${annees > 1 ? "s" : ""}`;
    }

    return `${annees} an${annees > 1 ? "s" : ""} et ${resteMois} mois`;
  }

  function afficherTexture(texture?: string) {
    return (
      texturesAlimentaires.find((item) => item.value === texture) ||
      texturesAlimentaires.find((item) => item.value === "morceaux_fondants")!
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-6 py-10">
      <div className="mx-auto mb-6 flex max-w-6xl gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-full bg-white px-5 py-3 font-bold text-[#6E9271] shadow-sm"
        >
          ← Retour
        </button>

        <a
          href="/"
          className="rounded-full bg-white px-5 py-3 font-bold text-[#6E9271] shadow-sm"
        >
          🏠 Accueil
        </a>
      </div>

      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-5xl font-black text-[#1E2A1F]">
            Ajouter un enfant
          </h1>

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_260px]">
            <input
              type="text"
              placeholder="Initiale ou prénom court"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="rounded-3xl border border-[#E8E1D5] bg-white px-6 py-5 text-xl outline-none"
            />

            <input
              type="date"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              className="rounded-3xl border border-[#E8E1D5] bg-white px-6 py-5 text-xl outline-none"
            />
          </div>

          <div className="mt-8">
            <p className="mb-4 text-2xl font-bold text-[#1E2A1F]">
              Jours de présence habituels
            </p>

            <div className="flex flex-wrap gap-3">
              {joursSemaine.map((jour) => (
                <button
                  key={jour}
                  type="button"
                  onClick={() => toggleJour(jour)}
                  className={`rounded-full px-6 py-4 text-lg font-bold transition ${
                    joursPresence.includes(jour)
                      ? "bg-[#6E9271] text-white"
                      : "bg-[#EFE9DE] text-[#1E2A1F]"
                  }`}
                >
                  {jour}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={ajouterEnfant}
            className="mt-10 rounded-full bg-[#6E9271] px-10 py-5 text-2xl font-bold text-white transition hover:scale-[1.02]"
          >
            Ajouter l’enfant
          </button>
        </div>

        <div className="mt-8 rounded-[2rem] bg-[#E8F2EA] p-8">
          <p className="text-xl font-bold text-[#56735B]">Résumé</p>

          <p className="mt-3 text-xl text-[#314235]">
            {chargement
              ? "Chargement..."
              : `${enfants.length} enfant(s) enregistré(s)`}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {!chargement && enfants.length === 0 && (
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <p className="text-xl text-[#5C655E]">
                Aucun enfant ajouté pour le moment.
              </p>
            </div>
          )}

          {enfants.map((enfant) => (
            <article
              key={enfant.id}
              className="rounded-[2rem] bg-white p-8 shadow-sm"
            >
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-5xl font-black text-[#1E2A1F]">
                    {enfant.nom} — {calculerAge(enfant.date_naissance)}
                  </h2>

                  <p className="mt-4 text-2xl text-[#4F5A50]">
                    Présence :{" "}
                    {enfant.jours_presence?.length
                      ? enfant.jours_presence.join(" • ")
                      : "Aucun jour défini"}
                  </p>

                  <p className="mt-4 text-lg font-bold text-[#6E9271]">
                    Code parent : {enfant.code_parent || "—"}
                  </p>

                  {!!enfant.allergies?.length && (
                    <p className="mt-3 inline-block rounded-full bg-[#FFE5E5] px-4 py-2 text-sm font-bold text-red-500">
                      Allergie(s) : {enfant.allergies.join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setEnfantDiversification(enfant)}
                    className="rounded-full bg-[#E6F2E7] px-6 py-3 text-lg font-bold text-[#56735B]"
                  >
                    Diversification
                  </button>

                  <button
                    type="button"
                    onClick={() => ouvrirAllergies(enfant)}
                    className="rounded-full bg-[#FBE7E7] px-6 py-3 text-lg font-bold text-[#C94B4B]"
                  >
                    Allergies
                  </button>

                  <button
                    type="button"
                    className="rounded-full bg-[#EFE9DE] px-6 py-3 text-lg font-bold text-[#7C6744]"
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    onClick={() => supprimerEnfant(enfant.id)}
                    className="rounded-full bg-[#FFE5E5] px-6 py-3 text-lg font-bold text-red-500"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-[#E8E1D5] bg-[#FFFCF7] p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-[#6E9271]">
                      Texture alimentaire actuelle
                    </p>

                    <p className="mt-2 text-lg text-[#4F5A50]">
                      {afficherTexture(enfant.texture_alimentaire).emoji}{" "}
                      <strong>
                        {afficherTexture(enfant.texture_alimentaire).label}
                      </strong>{" "}
                      — {afficherTexture(enfant.texture_alimentaire).description}
                    </p>
                  </div>

                  <p className="max-w-md text-sm leading-relaxed text-[#6E9271]">
                    Chaque enfant évolue à son propre rythme. Cette information
                    sera utilisée par le générateur pour adapter les repas.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {texturesAlimentaires.map((texture) => {
                    const active =
                      (enfant.texture_alimentaire || "morceaux_fondants") ===
                      texture.value;

                    return (
                      <button
                        key={texture.value}
                        type="button"
                        onClick={() =>
                          modifierTextureEnfant(enfant.id, texture.value)
                        }
                        className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                          active
                            ? "border-[#B7D7B4] bg-[#E8F2EA]"
                            : "border-[#E8E1D5] bg-white hover:bg-[#F7F4EE]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{texture.emoji}</span>

                          <div>
                            <p className="text-lg font-black text-[#1E2A1F]">
                              {texture.label}
                            </p>

                            <p className="mt-1 text-sm leading-relaxed text-[#5C655E]">
                              {texture.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {enfantDiversification && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#6E9271]">
                  Diversification alimentaire
                </p>

                <h2 className="mt-2 text-4xl font-black text-[#1E2A1F]">
                  {enfantDiversification.nom}
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5C655E]">
                  Coche les aliments déjà introduits chez l’enfant. Ces
                  informations pourront aider le générateur à proposer des repas
                  plus adaptés au parcours alimentaire de chacun.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEnfantDiversification(null)}
                className="rounded-full bg-[#EFE9DE] px-6 py-3 font-bold text-[#7C6744]"
              >
                Fermer
              </button>
            </div>

            <div className="mt-8 grid gap-6">
              {categoriesDiversification.map((categorie) => (
                <div
                  key={categorie.key}
                  className="rounded-[2rem] bg-[#F7F4EE] p-6"
                >
                  <h3 className="text-2xl font-black text-[#1E2A1F]">
                    {categorie.emoji} {categorie.titre}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {[
                      ...categorie.aliments,
                      ...((enfantDiversification[categorie.key] || []).filter(
                        (aliment) => !categorie.aliments.includes(aliment)
                      )),
                    ].map((aliment) => {
                      const actif =
                        enfantDiversification[categorie.key]?.includes(
                          aliment
                        ) || false;

                      return (
                        <button
                          key={aliment}
                          type="button"
                          onClick={() =>
                            modifierIntroduction(
                              enfantDiversification,
                              categorie.key,
                              aliment
                            )
                          }
                          className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                            actif
                              ? "bg-[#6E9271] text-white"
                              : "bg-white text-[#314235] hover:bg-[#E8F2EA]"
                          }`}
                        >
                          {aliment}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-[1.5rem] bg-white p-4">
                    <p className="text-sm font-black text-[#6E9271]">
                      Ajouter manuellement un aliment
                    </p>

                    <div className="mt-3 flex flex-col gap-3 md:flex-row">
                      <input
                        type="text"
                        value={nouvelAliment[categorie.key] || ""}
                        onChange={(e) =>
                          setNouvelAliment((prev) => ({
                            ...prev,
                            [categorie.key]: e.target.value,
                          }))
                        }
                        placeholder={`Exemple : ajouter dans ${categorie.titre.toLowerCase()}`}
                        className="flex-1 rounded-2xl border border-[#E8E1D5] px-5 py-3 outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          ajouterAlimentManuel(
                            enfantDiversification,
                            categorie.key
                          )
                        }
                        className="rounded-2xl bg-[#6E9271] px-6 py-3 font-bold text-white"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {enfantAllergies && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-red-400">
                  Allergies & aliments à éviter
                </p>

                <h2 className="mt-2 text-4xl font-black text-[#1E2A1F]">
                  {enfantAllergies.nom}
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5C655E]">
                  Encode les allergies connues ou aliments à éviter. En cas de
                  doute médical, la famille reste la référence et les consignes
                  écrites doivent être respectées.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEnfantAllergies(null)}
                className="rounded-full bg-[#EFE9DE] px-6 py-3 font-bold text-[#7C6744]"
              >
                Fermer
              </button>
            </div>

            <div className="mt-8 rounded-[2rem] bg-[#FFF4F4] p-6">
              <h3 className="text-2xl font-black text-[#1E2A1F]">
                Allergies fréquentes
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                {allergiesFrequences.map((allergie) => (
                  <button
                    key={allergie}
                    type="button"
                    onClick={() => toggleAllergie(allergie)}
                    className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                      allergiesTemp.includes(allergie)
                        ? "bg-red-400 text-white"
                        : "bg-white text-[#314235] hover:bg-[#FFE5E5]"
                    }`}
                  >
                    {allergie}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[2rem] bg-[#F7F4EE] p-6">
              <label className="text-xl font-black text-[#1E2A1F]">
                Remarques / consignes particulières
              </label>

              <textarea
                value={remarqueAllergiesTemp}
                onChange={(e) => setRemarqueAllergiesTemp(e.target.value)}
                placeholder="Exemple : éviter les traces, protocole fourni par les parents, aliment refusé, consigne médicale..."
                className="mt-4 min-h-[150px] w-full rounded-3xl border border-[#E8E1D5] bg-white p-5 text-lg outline-none"
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setEnfantAllergies(null)}
                className="rounded-full bg-[#EFE9DE] px-8 py-4 text-lg font-bold text-[#7C6744]"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={sauvegarderAllergies}
                className="rounded-full bg-[#6E9271] px-8 py-4 text-lg font-bold text-white"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
