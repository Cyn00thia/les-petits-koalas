"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Enfant = {
  id: string;
  nom: string;
  dateNaissance: string;
  joursPresence: string[];
  allergies: string[];
  legumesIntroduits: string[];
  fruitsIntroduits: string[];
};

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

function calculerAge(dateNaissance: string) {
  if (!dateNaissance) return "Âge non indiqué";

  const naissance = new Date(dateNaissance);
  const aujourdHui = new Date();

  let mois =
    (aujourdHui.getFullYear() - naissance.getFullYear()) * 12 +
    aujourdHui.getMonth() -
    naissance.getMonth();

  if (aujourdHui.getDate() < naissance.getDate()) {
    mois--;
  }

  if (mois < 0) return "Date invalide";

  if (mois < 12) {
    return `${mois} mois`;
  }

  const ans = Math.floor(mois / 12);
  const moisRestants = mois % 12;

  if (moisRestants === 0) {
    return `${ans} an${ans > 1 ? "s" : ""}`;
  }

  return `${ans} an${ans > 1 ? "s" : ""} et ${moisRestants} mois`;
}

export default function EnfantsPage() {
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [joursPresence, setJoursPresence] = useState<string[]>([]);

  const [enfants, setEnfants] = useState<Enfant[]>([
    {
      id: "exemple-1",
      nom: "L",
      dateNaissance: "2025-09-15",
      joursPresence: ["Lundi", "Mardi", "Jeudi"],
      allergies: ["Œuf"],
      legumesIntroduits: ["Carotte", "Courgette", "Poireau"],
      fruitsIntroduits: ["Pomme", "Poire"],
    },
  ]);

  function toggleJour(jour: string) {
    setJoursPresence((prev) =>
      prev.includes(jour)
        ? prev.filter((j) => j !== jour)
        : [...prev, jour]
    );
  }

  function ajouterEnfant() {
    if (!nom.trim()) {
      alert("Indique au minimum une initiale ou un prénom.");
      return;
    }

    if (!dateNaissance) {
      alert("Indique la date de naissance.");
      return;
    }

    const nouvelEnfant: Enfant = {
      id: Date.now().toString(),
      nom: nom.trim(),
      dateNaissance,
      joursPresence,
      allergies: [],
      legumesIntroduits: [],
      fruitsIntroduits: [],
    };

    setEnfants((prev) => [...prev, nouvelEnfant]);

    setNom("");
    setDateNaissance("");
    setJoursPresence([]);
  }

  function supprimerEnfant(id: string) {
    const ok = confirm("Supprimer cet enfant de la liste ?");
    if (!ok) return;

    setEnfants((prev) => prev.filter((enfant) => enfant.id !== id));
  }

  const enfantsMoins12Mois = useMemo(() => {
    return enfants.filter((enfant) => {
      const naissance = new Date(enfant.dateNaissance);
      const aujourdHui = new Date();

      const mois =
        (aujourdHui.getFullYear() - naissance.getFullYear()) * 12 +
        aujourdHui.getMonth() -
        naissance.getMonth();

      return mois < 12;
    });
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
            Ajoute ici les enfants accueillis afin de gérer leur présence,
            leurs allergies, leur diversification alimentaire et adapter les menus
            automatiquement.
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
                  className={`rounded-full px-5 py-3 font-bold ${
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
          <p className="font-bold text-[#6B8F71]">
            Résumé
          </p>

          <p className="mt-2 text-gray-700">
            {enfants.length} enfant(s) enregistré(s), dont{" "}
            {enfantsMoins12Mois.length} enfant(s) de moins de 12 mois avec une
            diversification à suivre.
          </p>
        </section>

        <section className="mt-8 grid gap-6">
          {enfants.length === 0 && (
            <div className="rounded-[2rem] bg-white p-8 text-gray-600 shadow-sm">
              Aucun enfant ajouté pour le moment.
            </div>
          )}

          {enfants.map((enfant) => (
            <article
              key={enfant.id}
              className="rounded-[2rem] bg-white p-8 shadow-sm"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black text-[#1F2A1F]">
                    {enfant.nom} — {calculerAge(enfant.dateNaissance)}
                  </h2>

                  <p className="mt-2 text-[#4B5563]">
                    Présence :{" "}
                    {enfant.joursPresence.length > 0
                      ? enfant.joursPresence.join(" • ")
                      : "Aucun jour défini"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full bg-[#EEF4EE] px-5 py-2 font-bold text-[#6B8F71]">
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
                <div className="rounded-2xl bg-[#F8F6F1] p-5">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#6B8F71]">
                    Légumes introduits
                  </p>

                  {enfant.legumesIntroduits.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {enfant.legumesIntroduits.map((legume) => (
                        <span
                          key={legume}
                          className="rounded-full bg-white px-4 py-2 text-sm"
                        >
                          {legume}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">
                      Aucun légume encodé pour le moment.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-[#F8F6F1] p-5">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#6B8F71]">
                    Fruits introduits
                  </p>

                  {enfant.fruitsIntroduits.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {enfant.fruitsIntroduits.map((fruit) => (
                        <span
                          key={fruit}
                          className="rounded-full bg-white px-4 py-2 text-sm"
                        >
                          {fruit}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">
                      Aucun fruit encodé pour le moment.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-[#F8F6F1] p-5">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#6B8F71]">
                    Allergies / exclusions
                  </p>

                  {enfant.allergies.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {enfant.allergies.map((allergie) => (
                        <span
                          key={allergie}
                          className="rounded-full bg-[#FFE5E5] px-4 py-2 text-sm text-[#B54747]"
                        >
                          {allergie}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">
                      Aucune allergie encodée.
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
