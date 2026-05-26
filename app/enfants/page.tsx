"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";

type Enfant = {
  id: string;
  userId: string;
  nom: string;
  dateNaissance: string;
  joursPresence: string[];
  allergies: string[];
  legumesIntroduits: string[];
  fruitsIntroduits: string[];
  feculentsIntroduits: string[];
  vvpoIntroduits: string[];
  matieresGrassesIntroduites: string[];
  herbesIntroduites: string[];
  autresIntroduits: string[];
};

type EnfantSupabase = {
  id: string;
  user_id: string;
  nom: string;
  date_naissance: string;
  jours_presence: string[] | null;
  allergies: string[] | null;
  legumes_introduits: string[] | null;
  fruits_introduits: string[] | null;
  feculents_introduits: string[] | null;
  vvpo_introduits: string[] | null;
  matieres_grasses_introduites: string[] | null;
  herbes_introduites: string[] | null;
  autres_introduits: string[] | null;
};

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const listeLegumes = [
  "Carotte", "Courgette", "Butternut", "Potiron", "Potimarron",
  "Haricots verts", "Petits pois", "Pois mange-tout", "Brocoli",
  "Chou-fleur", "Romanesco", "Épinard", "Blette", "Navet", "Panais",
  "Fenouil", "Poireau", "Tomate", "Concombre", "Laitue", "Roquette",
  "Betterave", "Céleri-rave", "Céleri branche", "Aubergine", "Poivron",
  "Champignon", "Chou blanc", "Chou rouge", "Chou de Bruxelles", "Kale",
  "Endive", "Artichaut", "Radis", "Salsifis", "Rutabaga", "Crosnes",
  "Chou chinois", "Chou-rave", "Pois chiche"
];

const listeFruits = [
  "Pomme", "Poire", "Banane", "Abricot", "Pêche", "Nectarine", "Prune",
  "Cerise", "Raisin", "Fraise", "Framboise", "Myrtille", "Mûre",
  "Groseille", "Melon", "Pastèque", "Orange", "Mandarine", "Pamplemousse",
  "Kiwi", "Mangue", "Ananas", "Figue", "Kaki", "Coing", "Reine-Claude"
];

const listeFeculents = [
  "Riz", "Semoule de blé", "Pâtes", "Boulgour", "Quinoa", "Polenta",
  "Orge perlé", "Pain", "Flocons d’avoine", "Blé tendre", "Maïs",
  "Lentilles", "Pommes de terre", "Patate douce"
];

const listeVvpo = [
  "Poulet", "Dinde", "Veau", "Bœuf", "Porc", "Colin", "Cabillaud",
  "Lieu noir", "Merlan", "Bar", "Dorade", "Turbot", "Saumon", "Truite",
  "Sardine", "Maquereau", "Hareng", "Thon", "Espadon", "Sole", "Plie",
  "Sébaste", "Lotte", "Limande", "Saint-Pierre", "Œuf"
];

const listeMatieresGrasses = ["Huile d’olive", "Huile de colza", "Beurre"];

const listeHerbes = [
  "Persil", "Ciboulette", "Basilic", "Thym", "Origan", "Laurier",
  "Romarin", "Aneth", "Estragon", "Curcuma doux", "Gingembre doux",
  "Ail", "Oignon", "Coriandre", "Menthe", "Sauge", "Marjolaine",
  "Cumin doux", "Paprika doux", "Muscade"
];

function depuisSupabase(row: EnfantSupabase): Enfant {
  return {
    id: row.id,
    userId: row.user_id,
    nom: row.nom,
    dateNaissance: row.date_naissance,
    joursPresence: row.jours_presence ?? [],
    allergies: row.allergies ?? [],
    legumesIntroduits: row.legumes_introduits ?? [],
    fruitsIntroduits: row.fruits_introduits ?? [],
    feculentsIntroduits: row.feculents_introduits ?? [],
    vvpoIntroduits: row.vvpo_introduits ?? [],
    matieresGrassesIntroduites: row.matieres_grasses_introduites ?? [],
    herbesIntroduites: row.herbes_introduites ?? [],
    autresIntroduits: row.autres_introduits ?? [],
  };
}

function versSupabase(enfant: Partial<Enfant>) {
  return {
    user_id: enfant.userId,
    nom: enfant.nom,
    date_naissance: enfant.dateNaissance,
    jours_presence: enfant.joursPresence ?? [],
    allergies: enfant.allergies ?? [],
    legumes_introduits: enfant.legumesIntroduits ?? [],
    fruits_introduits: enfant.fruitsIntroduits ?? [],
    feculents_introduits: enfant.feculentsIntroduits ?? [],
    vvpo_introduits: enfant.vvpoIntroduits ?? [],
    matieres_grasses_introduites: enfant.matieresGrassesIntroduites ?? [],
    herbes_introduites: enfant.herbesIntroduites ?? [],
    autres_introduits: enfant.autresIntroduits ?? [],
  };
}

function calculerAge(dateNaissance: string) {
  if (!dateNaissance) return "Âge non indiqué";

  const naissance = new Date(dateNaissance);
  const aujourdHui = new Date();

  let mois =
    (aujourdHui.getFullYear() - naissance.getFullYear()) * 12 +
    aujourdHui.getMonth() -
    naissance.getMonth();

  if (aujourdHui.getDate() < naissance.getDate()) mois--;
  if (mois < 0) return "Date invalide";
  if (mois < 12) return `${mois} mois`;

  const ans = Math.floor(mois / 12);
  const moisRestants = mois % 12;

  if (moisRestants === 0) return `${ans} an${ans > 1 ? "s" : ""}`;
  return `${ans} an${ans > 1 ? "s" : ""} et ${moisRestants} mois`;
}

function enfantMoinsDe12Mois(dateNaissance: string) {
  const naissance = new Date(dateNaissance);
  const aujourdHui = new Date();

  let mois =
    (aujourdHui.getFullYear() - naissance.getFullYear()) * 12 +
    aujourdHui.getMonth() -
    naissance.getMonth();

  if (aujourdHui.getDate() < naissance.getDate()) mois--;
  return mois < 12;
}

function toggleDansListe(liste: string[], aliment: string) {
  return liste.includes(aliment)
    ? liste.filter((item) => item !== aliment)
    : [...liste, aliment];
}

function BadgeListe({ titre, items }: { titre: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-[#F8F6F1] p-5">
      <p className="text-sm font-bold uppercase tracking-wide text-[#6B8F71]">
        {titre}
      </p>

      {items.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.slice(0, 10).map((item) => (
            <span key={item} className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
              {item}
            </span>
          ))}

          {items.length > 10 && (
            <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
              + {items.length - 10} autre(s)
            </span>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">Aucun aliment encodé.</p>
      )}
    </div>
  );
}

function GroupeDiversification({
  titre,
  aliments,
  selection,
  onToggle,
}: {
  titre: string;
  aliments: string[];
  selection: string[];
  onToggle: (aliment: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-[#F8F6F1] p-5">
      <h4 className="text-xl font-bold text-[#6B8F71]">{titre}</h4>

      <div className="mt-4 flex flex-wrap gap-3">
        {aliments.map((aliment) => {
          const actif = selection.includes(aliment);

          return (
            <button
              key={aliment}
              onClick={() => onToggle(aliment)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                actif
                  ? "bg-[#6B8F71] text-white"
                  : "bg-white text-[#243024] hover:bg-[#EEF4EE]"
              }`}
            >
              {actif ? "✓ " : ""}
              {aliment}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function EnfantsPage() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [joursPresence, setJoursPresence] = useState<string[]>([]);
  const [fenetreDiversification, setFenetreDiversification] = useState<string | null>(null);
  const [autreAliment, setAutreAliment] = useState("");
  const [chargement, setChargement] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [enfants, setEnfants] = useState<Enfant[]>([]);

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
    chargerEnfants(session.user.id);
  }

  async function chargerEnfants(compteId: string) {
    setChargement(true);

    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("user_id", compteId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erreur lors du chargement des enfants.");
      setChargement(false);
      return;
    }

    setEnfants((data ?? []).map((row) => depuisSupabase(row as EnfantSupabase)));
    setChargement(false);
  }

  function toggleJour(jour: string) {
    setJoursPresence((prev) =>
      prev.includes(jour) ? prev.filter((j) => j !== jour) : [...prev, jour]
    );
  }

  async function ajouterEnfant() {
    if (!userId) {
      alert("Tu dois être connectée pour ajouter un enfant.");
      router.push("/login");
      return;
    }

    if (!nom.trim()) {
      alert("Indique au minimum une initiale ou un prénom.");
      return;
    }

    if (!dateNaissance) {
      alert("Indique la date de naissance.");
      return;
    }

    const nouvelEnfant: Partial<Enfant> = {
      userId,
      nom: nom.trim(),
      dateNaissance,
      joursPresence,
      allergies: [],
      legumesIntroduits: [],
      fruitsIntroduits: [],
      feculentsIntroduits: [],
      vvpoIntroduits: [],
      matieresGrassesIntroduites: [],
      herbesIntroduites: [],
      autresIntroduits: [],
    };

    const { data, error } = await supabase
      .from("children")
      .insert(versSupabase(nouvelEnfant))
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Erreur lors de l’ajout de l’enfant.");
      return;
    }

    setEnfants((prev) => [...prev, depuisSupabase(data as EnfantSupabase)]);
    setNom("");
    setDateNaissance("");
    setJoursPresence([]);
  }

  async function supprimerEnfant(id: string) {
    const ok = confirm("Supprimer cet enfant de la liste ?");
    if (!ok) return;

    const { error } = await supabase.from("children").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
      return;
    }

    setEnfants((prev) => prev.filter((enfant) => enfant.id !== id));
  }

  async function sauvegarderEnfant(enfant: Enfant) {
    const { error } = await supabase
      .from("children")
      .update(versSupabase(enfant))
      .eq("id", enfant.id);

    if (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde.");
    }
  }

  function toggleAliment(
    enfantId: string,
    champ:
      | "legumesIntroduits"
      | "fruitsIntroduits"
      | "feculentsIntroduits"
      | "vvpoIntroduits"
      | "matieresGrassesIntroduites"
      | "herbesIntroduites"
      | "autresIntroduits",
    aliment: string
  ) {
    setEnfants((prev) =>
      prev.map((enfant) => {
        if (enfant.id !== enfantId) return enfant;

        const enfantMisAJour = {
          ...enfant,
          [champ]: toggleDansListe(enfant[champ], aliment),
        };

        sauvegarderEnfant(enfantMisAJour);
        return enfantMisAJour;
      })
    );
  }

  function ajouterAutreAliment(enfantId: string) {
    if (!autreAliment.trim()) return;
    toggleAliment(enfantId, "autresIntroduits", autreAliment.trim());
    setAutreAliment("");
  }

  const enfantsMoins12Mois = useMemo(() => {
    return enfants.filter((enfant) => enfantMoinsDe12Mois(enfant.dateNaissance));
  }, [enfants]);

  return (
    <main className="min-h-screen bg-[#F8F6F1] p-6 text-[#243024] lg:p-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/" className="font-bold text-[#6B8F71]">
          ← Retour à l’accueil
        </Link>

        <div className="mt-6 rounded-[2.5rem] bg-white p-10 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6B8F71]">
            Gestion des enfants
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight text-[#1F2A1F]">
            Enfants accueillis
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#4B5563]">
            Ajoute les enfants accueillis pour gérer les jours de présence, les
            allergies et la diversification alimentaire.
          </p>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Ajouter un enfant</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_240px]">
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Initiale ou prénom court"
              className="rounded-2xl border border-[#D9D4C7] bg-[#FDFCF9] px-5 py-4 text-lg outline-none focus:border-[#6B8F71]"
            />

            <input
              type="date"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              className="rounded-2xl border border-[#D9D4C7] bg-[#FDFCF9] px-5 py-4 text-lg outline-none focus:border-[#6B8F71]"
            />
          </div>

          <div className="mt-6">
            <p className="mb-3 font-bold">Jours de présence habituels</p>

            <div className="flex flex-wrap gap-3">
              {joursSemaine.map((jour) => (
                <button
                  key={jour}
                  onClick={() => toggleJour(jour)}
                  className={`rounded-full px-5 py-3 font-bold transition ${
                    joursPresence.includes(jour)
                      ? "bg-[#6B8F71] text-white"
                      : "bg-[#F7F3EA] text-[#243024]"
                  }`}
                >
                  {jour}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={ajouterEnfant}
            className="mt-8 rounded-full bg-[#6B8F71] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#5A7B60]"
          >
            Ajouter l’enfant
          </button>
        </section>

        <section className="mt-8 rounded-[2rem] bg-[#E8F2EA] p-6">
          <p className="font-bold text-[#6B8F71]">Résumé</p>

          <p className="mt-2 text-gray-700">
            {enfants.length} enfant(s) enregistré(s), dont{" "}
            {enfantsMoins12Mois.length} enfant(s) de moins de 12 mois avec une
            diversification à suivre.
          </p>
        </section>

        <section className="mt-8 grid gap-6">
          {chargement && (
            <div className="rounded-[2rem] bg-white p-8 text-gray-600 shadow-sm">
              Chargement des enfants...
            </div>
          )}

          {!chargement && enfants.length === 0 && (
            <div className="rounded-[2rem] bg-white p-8 text-gray-600 shadow-sm">
              Aucun enfant ajouté pour le moment.
            </div>
          )}

          {enfants.map((enfant) => (
            <article key={enfant.id} className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black text-[#1F2A1F]">
                    {enfant.nom} — {calculerAge(enfant.dateNaissance)}
                  </h2>

                  <p className="mt-2 text-[#4B5563]">
                    Présence:{" "}
                    {enfant.joursPresence.length > 0
                      ? enfant.joursPresence.join(" • ")
                      : "Aucun jour défini"}
                  </p>

                  {enfantMoinsDe12Mois(enfant.dateNaissance) && (
                    <p className="mt-3 inline-block rounded-full bg-[#FFF3D8] px-4 py-2 text-sm font-bold text-[#8A6E3B]">
                      Diversification à suivre
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      setFenetreDiversification(
                        fenetreDiversification === enfant.id ? null : enfant.id
                      )
                    }
                    className="rounded-full bg-[#EEF4EE] px-5 py-2 font-bold text-[#6B8F71]"
                  >
                    Diversification
                  </button>

                  <button className="rounded-full bg-[#FFF3F3] px-5 py-2 font-bold text-[#D45B5B]">
                    Allergies
                  </button>

                  <button className="rounded-full bg-[#F4F1E8] px-5 py-2 font-bold text-[#8A6E3B]">
                    Modifier
                  </button>

                  <button
                    onClick={() => supprimerEnfant(enfant.id)}
                    className="rounded-full bg-red-50 px-5 py-2 font-bold text-red-500"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <BadgeListe titre="Légumes introduits" items={enfant.legumesIntroduits} />
                <BadgeListe titre="Fruits introduits" items={enfant.fruitsIntroduits} />
                <BadgeListe titre="Allergies / exclusions" items={enfant.allergies} />
              </div>

              {fenetreDiversification === enfant.id && (
                <div className="mt-8 rounded-[2rem] border border-[#D9D4C7] bg-[#FFFDF8] p-8">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-3xl font-black">
                        Diversification alimentaire
                      </h3>

                      <p className="mt-2 text-gray-600">
                        Coche les aliments déjà introduits et bien tolérés par l’enfant.
                      </p>
                    </div>

                    <button
                      onClick={() => setFenetreDiversification(null)}
                      className="rounded-full bg-[#F4F1E8] px-5 py-3 font-bold"
                    >
                      Fermer
                    </button>
                  </div>

                  <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <GroupeDiversification
                      titre="🥦 Légumes"
                      aliments={listeLegumes}
                      selection={enfant.legumesIntroduits}
                      onToggle={(aliment) =>
                        toggleAliment(enfant.id, "legumesIntroduits", aliment)
                      }
                    />

                    <GroupeDiversification
                      titre="🍎 Fruits"
                      aliments={listeFruits}
                      selection={enfant.fruitsIntroduits}
                      onToggle={(aliment) =>
                        toggleAliment(enfant.id, "fruitsIntroduits", aliment)
                      }
                    />

                    <GroupeDiversification
                      titre="🥔 Féculents"
                      aliments={listeFeculents}
                      selection={enfant.feculentsIntroduits}
                      onToggle={(aliment) =>
                        toggleAliment(enfant.id, "feculentsIntroduits", aliment)
                      }
                    />

                    <GroupeDiversification
                      titre="🍗 VVP/O"
                      aliments={listeVvpo}
                      selection={enfant.vvpoIntroduits}
                      onToggle={(aliment) =>
                        toggleAliment(enfant.id, "vvpoIntroduits", aliment)
                      }
                    />

                    <GroupeDiversification
                      titre="🫒 Matières grasses"
                      aliments={listeMatieresGrasses}
                      selection={enfant.matieresGrassesIntroduites}
                      onToggle={(aliment) =>
                        toggleAliment(enfant.id, "matieresGrassesIntroduites", aliment)
                      }
                    />

                    <GroupeDiversification
                      titre="🌿 Herbes aromatiques"
                      aliments={listeHerbes}
                      selection={enfant.herbesIntroduites}
                      onToggle={(aliment) =>
                        toggleAliment(enfant.id, "herbesIntroduites", aliment)
                      }
                    />

                    <div className="rounded-2xl bg-[#F8F6F1] p-5 lg:col-span-2">
                      <h4 className="text-xl font-bold text-[#6B8F71]">
                        ✍️ Autre aliment introduit
                      </h4>

                      <div className="mt-4 flex flex-col gap-3 lg:flex-row">
                        <input
                          type="text"
                          value={autreAliment}
                          onChange={(e) => setAutreAliment(e.target.value)}
                          placeholder="Ex : lait de coco, tofu, avocat..."
                          className="flex-1 rounded-2xl border border-[#D9D4C7] bg-white px-5 py-3 outline-none focus:border-[#6B8F71]"
                        />

                        <button
                          onClick={() => ajouterAutreAliment(enfant.id)}
                          className="rounded-full bg-[#6B8F71] px-6 py-3 font-bold text-white"
                        >
                          Ajouter
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {enfant.autresIntroduits.map((item) => (
                          <button
                            key={item}
                            onClick={() =>
                              toggleAliment(enfant.id, "autresIntroduits", item)
                            }
                            className="rounded-full bg-white px-4 py-2 text-sm font-bold"
                          >
                            ✓ {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
