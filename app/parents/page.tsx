"use client";

import { useState } from "react";
import { supabase } from "../supabase";

type Enfant = {
  id: string;
  nom: string;
  date_naissance: string;
  jours_presence: string[];
};

export default function ParentsPage() {
  const [code, setCode] = useState("");
  const [enfant, setEnfant] = useState<Enfant | null>(null);
  const [erreur, setErreur] = useState("");

  async function verifierCode() {
    setErreur("");
    setEnfant(null);

    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("code_parent", code.trim())
      .single();

    if (error || !data) {
      setErreur("Code invalide.");
      return;
    }

    setEnfant(data);
  }

  function calculAge(dateNaissance: string) {
    const naissance = new Date(dateNaissance);
    const aujourdHui = new Date();

    let age = aujourdHui.getFullYear() - naissance.getFullYear();
    const mois = aujourdHui.getMonth() - naissance.getMonth();

    if (
      mois < 0 ||
      (mois === 0 && aujourdHui.getDate() < naissance.getDate())
    ) {
      age--;
    }

    return age;
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2] px-6 py-10">
      <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black text-[#1D2B1F]">
          Espace parents
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Entrez votre code parent pour accéder aux informations de votre enfant.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Code parent"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="rounded-2xl border border-[#E7E1D7] px-5 py-4 text-lg outline-none"
          />

          <button
            onClick={verifierCode}
            className="rounded-2xl bg-[#6D8B74] px-6 py-4 text-lg font-bold text-white transition hover:opacity-90"
          >
            Accéder
          </button>
        </div>

        {erreur && (
          <div className="mt-6 rounded-2xl bg-red-100 p-4 text-red-600">
            {erreur}
          </div>
        )}

        {enfant && (
          <div className="mt-8 rounded-[2rem] bg-[#F4F8F3] p-6">
            <h2 className="text-3xl font-black text-[#1D2B1F]">
              {enfant.nom}
            </h2>

            <p className="mt-2 text-lg text-gray-700">
              Âge : {calculAge(enfant.date_naissance)} an(s)
            </p>

            <div className="mt-6">
              <p className="font-bold text-[#1D2B1F]">
                Jours de présence :
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                {enfant.jours_presence?.map((jour) => (
                  <span
                    key={jour}
                    className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1D2B1F]"
                  >
                    {jour}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-5">
              <p className="text-xl font-bold text-[#1D2B1F]">
                Transmission du jour
              </p>

              <p className="mt-3 text-gray-600">
                Aucun rapport disponible pour aujourd’hui.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}