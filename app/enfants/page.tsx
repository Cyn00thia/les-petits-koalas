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
  user_id?: string;
  code_parent?: string;
};

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

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

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-6 py-10">
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
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full bg-[#E6F2E7] px-6 py-3 text-lg font-bold text-[#56735B]"
                  >
                    Diversification
                  </button>

                  <button
                    type="button"
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
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
