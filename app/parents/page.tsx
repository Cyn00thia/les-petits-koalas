"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Enfant = {
  id: string;
  prenom: string;
  code: string;
};

type Journee = {
  enfantId: string;
  date: string;
  menuSemaine: string;
  repas: string;
  repos: string;
  selles: string;
  activites: string;
  remarques: string;
};

const enfants: Enfant[] = [
  { id: "1", prenom: "Zoé", code: "KOALA-ZOE" },
  { id: "2", prenom: "Samuel", code: "KOALA-SAMUEL" },
  { id: "3", prenom: "Lina", code: "KOALA-LINA" },
];

const journeesBase: Journee[] = [
  {
    enfantId: "1",
    date: "Aujourd’hui",
    menuSemaine:
      "Lundi : carotte, pomme de terre, poulet / goûter : pomme + poire + pain beurré",
    repas: "Aucune information encodée pour le moment.",
    repos: "Aucune information encodée pour le moment.",
    selles: "Aucune information encodée pour le moment.",
    activites: "Aucune information encodée pour le moment.",
    remarques: "Aucune remarque pour le moment.",
  },
  {
    enfantId: "2",
    date: "Aujourd’hui",
    menuSemaine:
      "Lundi : carotte, pomme de terre, poulet / goûter : pomme + poire + pain beurré",
    repas: "Aucune information encodée pour le moment.",
    repos: "Aucune information encodée pour le moment.",
    selles: "Aucune information encodée pour le moment.",
    activites: "Aucune information encodée pour le moment.",
    remarques: "Aucune remarque pour le moment.",
  },
  {
    enfantId: "3",
    date: "Aujourd’hui",
    menuSemaine:
      "Lundi : carotte, pomme de terre, poulet / goûter : compote pomme-poire-banane",
    repas: "Aucune information encodée pour le moment.",
    repos: "Aucune information encodée pour le moment.",
    selles: "Aucune information encodée pour le moment.",
    activites: "Aucune information encodée pour le moment.",
    remarques: "Aucune remarque pour le moment.",
  },
];

export default function ParentsPage() {
  const [mode, setMode] = useState<"parent" | "gestion">("parent");

  const [code, setCode] = useState("");
  const [enfantConnecte, setEnfantConnecte] = useState<Enfant | null>(null);
  const [erreur, setErreur] = useState("");

  const [journees, setJournees] = useState<Journee[]>(journeesBase);
  const [enfantGestionId, setEnfantGestionId] = useState(enfants[0].id);

  const journeeGestion =
    journees.find((item) => item.enfantId === enfantGestionId) ??
    journeesBase[0];

  const [menuSemaine, setMenuSemaine] = useState("");
  const [repas, setRepas] = useState("");
  const [repos, setRepos] = useState("");
  const [selles, setSelles] = useState("");
  const [activites, setActivites] = useState("");
  const [remarques, setRemarques] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("koalasJourneesParents");
    if (saved) {
      setJournees(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const journee =
      journees.find((item) => item.enfantId === enfantGestionId) ??
      journeesBase[0];

    setMenuSemaine(journee.menuSemaine);
    setRepas(journee.repas);
    setRepos(journee.repos);
    setSelles(journee.selles);
    setActivites(journee.activites);
    setRemarques(journee.remarques);
  }, [enfantGestionId, journees]);

  function seConnecter() {
    const enfant = enfants.find(
      (item) => item.code.toLowerCase() === code.trim().toLowerCase()
    );

    if (!enfant) {
      setErreur("Code incorrect. Vérifie le code transmis par le milieu d’accueil.");
      setEnfantConnecte(null);
      return;
    }

    setErreur("");
    setEnfantConnecte(enfant);
  }

  function seDeconnecter() {
    setCode("");
    setEnfantConnecte(null);
    setErreur("");
  }

  function sauvegarderGestion() {
    const nouvellesJournees = journees.map((journee) =>
      journee.enfantId === enfantGestionId
        ? {
            ...journee,
            menuSemaine,
            repas,
            repos,
            selles,
            activites,
            remarques,
          }
        : journee
    );

    setJournees(nouvellesJournees);
    localStorage.setItem(
      "koalasJourneesParents",
      JSON.stringify(nouvellesJournees)
    );

    alert("Informations sauvegardées ✅");
  }

  const journeeParent = enfantConnecte
    ? journees.find((item) => item.enfantId === enfantConnecte.id)
    : null;

  return (
    <main className="min-h-screen bg-[#F7F3EA] p-6 text-[#243024] lg:p-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/" className="font-bold text-[#6B8F71]">
          ← Retour à l’accueil
        </Link>

        <div className="mt-6 rounded-[2.5rem] bg-white p-10 shadow-sm">
          <p className="font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
            Espace parents
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Les nouvelles de la journée
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Un espace pour partager les informations de la journée de chaque
            enfant, avec un accès séparé par code.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setMode("parent");
              setEnfantConnecte(null);
              setErreur("");
            }}
            className={`rounded-full px-6 py-3 font-bold ${
              mode === "parent"
                ? "bg-[#6B8F71] text-white"
                : "bg-white text-[#6B8F71]"
            }`}
          >
            Accès parent
          </button>

          <button
            onClick={() => {
              setMode("gestion");
              setEnfantConnecte(null);
              setErreur("");
            }}
            className={`rounded-full px-6 py-3 font-bold ${
              mode === "gestion"
                ? "bg-[#6B8F71] text-white"
                : "bg-white text-[#6B8F71]"
            }`}
          >
            Gestion accueillante
          </button>
        </div>

        {mode === "parent" && !enfantConnecte && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <section className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Connexion parent</h2>

              <p className="mt-3 text-gray-600">
                Entre le code reçu pour accéder au résumé de ton enfant.
              </p>

              <div className="mt-6 grid gap-4">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex : KOALA-ZOE"
                  className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
                />

                {erreur && (
                  <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-500">
                    {erreur}
                  </p>
                )}

                <button
                  onClick={seConnecter}
                  className="w-fit rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
                >
                  Accéder à l’espace
                </button>
              </div>
            </section>

            <aside className="rounded-[2rem] bg-[#E8F2EA] p-8 shadow-sm">
              <div className="text-6xl">🐨</div>

              <h2 className="mt-5 text-2xl font-bold">Confidentialité</h2>

              <p className="mt-3 leading-relaxed text-gray-700">
                Cette version est une maquette locale. Pour une vraie mise en
                ligne, il faudra une authentification sécurisée afin que chaque
                parent voie uniquement son enfant.
              </p>
            </aside>
          </div>
        )}

        {mode === "gestion" && (
          <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Gestion accueillante</h2>

            <p className="mt-3 text-gray-600">
              Encode ici les informations visibles ensuite dans l’espace du
              parent concerné.
            </p>

            <div className="mt-6 grid gap-4">
              <select
                value={enfantGestionId}
                onChange={(e) => setEnfantGestionId(e.target.value)}
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              >
                {enfants.map((enfant) => (
                  <option key={enfant.id} value={enfant.id}>
                    {enfant.prenom} — code : {enfant.code}
                  </option>
                ))}
              </select>

              <textarea
                value={menuSemaine}
                onChange={(e) => setMenuSemaine(e.target.value)}
                placeholder="Menu de la semaine"
                className="min-h-28 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <textarea
                  value={repas}
                  onChange={(e) => setRepas(e.target.value)}
                  placeholder="Repas"
                  className="min-h-32 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
                />

                <textarea
                  value={repos}
                  onChange={(e) => setRepos(e.target.value)}
                  placeholder="Repos / sieste"
                  className="min-h-32 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
                />

                <textarea
                  value={selles}
                  onChange={(e) => setSelles(e.target.value)}
                  placeholder="Selles / change"
                  className="min-h-32 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
                />

                <textarea
                  value={activites}
                  onChange={(e) => setActivites(e.target.value)}
                  placeholder="Activités"
                  className="min-h-32 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
                />
              </div>

              <textarea
                value={remarques}
                onChange={(e) => setRemarques(e.target.value)}
                placeholder="Autres remarques"
                className="min-h-28 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <button
                onClick={sauvegarderGestion}
                className="w-fit rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
              >
                Sauvegarder les informations
              </button>
            </div>
          </section>
        )}

        {mode === "parent" && enfantConnecte && journeeParent && (
          <>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-[#E8F2EA] p-6 shadow-sm">
              <div>
                <p className="font-bold text-[#6B8F71]">
                  Connecté à l’espace de
                </p>
                <h2 className="text-4xl font-bold">{enfantConnecte.prenom}</h2>
              </div>

              <button
                onClick={seDeconnecter}
                className="rounded-full bg-white px-6 py-3 font-bold text-[#6B8F71]"
              >
                Se déconnecter
              </button>
            </div>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="grid gap-6">
                <article className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <p className="font-bold uppercase tracking-wide text-[#6B8F71]">
                    Menu de la semaine
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">Repas prévus</h3>

                  <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-[#F7F3EA] p-5 leading-relaxed">
                    {journeeParent.menuSemaine}
                  </p>
                </article>

                <article className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <p className="font-bold uppercase tracking-wide text-[#6B8F71]">
                    Résumé du jour
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    {journeeParent.date}
                  </h3>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-[#FFF8E7] p-5">
                      <p className="text-3xl">🍽️</p>
                      <h4 className="mt-3 text-xl font-bold">Repas</h4>
                      <p className="mt-2 whitespace-pre-wrap text-gray-700">
                        {journeeParent.repas}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#EEF4FF] p-5">
                      <p className="text-3xl">🌙</p>
                      <h4 className="mt-3 text-xl font-bold">Repos</h4>
                      <p className="mt-2 whitespace-pre-wrap text-gray-700">
                        {journeeParent.repos}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#F7F3EA] p-5">
                      <p className="text-3xl">🧷</p>
                      <h4 className="mt-3 text-xl font-bold">
                        Selles / change
                      </h4>
                      <p className="mt-2 whitespace-pre-wrap text-gray-700">
                        {journeeParent.selles}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#E8F2EA] p-5">
                      <p className="text-3xl">🎨</p>
                      <h4 className="mt-3 text-xl font-bold">Activités</h4>
                      <p className="mt-2 whitespace-pre-wrap text-gray-700">
                        {journeeParent.activites}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <p className="font-bold uppercase tracking-wide text-[#6B8F71]">
                    Autre remarque
                  </p>

                  <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-[#F7F3EA] p-5 leading-relaxed">
                    {journeeParent.remarques}
                  </p>
                </article>
              </div>

              <aside className="rounded-[2rem] bg-white p-8 shadow-sm">
                <div className="text-6xl">💛</div>

                <h3 className="mt-5 text-2xl font-bold">
                  Petit mot du milieu d’accueil
                </h3>

                <p className="mt-3 leading-relaxed text-gray-700">
                  Les informations de la journée sont partagées pour garder un
                  lien simple et rassurant avec les familles.
                </p>

                <div className="mt-6 rounded-3xl bg-[#E8F2EA] p-5">
                  <p className="font-bold">Important</p>
                  <p className="mt-2 text-sm text-gray-700">
                    Cette version est locale. Pour une utilisation réelle, il
                    faudra sécuriser les accès parents.
                  </p>
                </div>
              </aside>
            </section>
          </>
        )}
      </section>
    </main>
  );
}