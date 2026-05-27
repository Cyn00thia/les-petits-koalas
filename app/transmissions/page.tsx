"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Enfant = {
  id: string;
  nom: string;
};

export default function TransmissionsPage() {
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [childId, setChildId] = useState("");
  const [repas, setRepas] = useState("");
  const [gouter, setGouter] = useState("");
  const [sieste, setSieste] = useState("");
  const [selles, setSelles] = useState("");
  const [humeur, setHumeur] = useState("");
  const [remarques, setRemarques] = useState("");

  useEffect(() => {
    chargerEnfants();
  }, []);

  async function chargerEnfants() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("children")
      .select("id, nom")
      .eq("user_id", user.id)
      .order("nom");

    setEnfants(data || []);
  }

  async function enregistrerTransmission() {
    if (!childId) {
      alert("Sélectionnez un enfant.");
      return;
    }

    const aujourdHui = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("daily_reports").insert({
      child_id: childId,
      date: aujourdHui,
      repas,
      gouter,
      sieste,
      selles,
      humeur,
      remarques,
    });

    if (error) {
      console.log(error);
      alert("Erreur lors de l'enregistrement.");
      return;
    }

    alert("Transmission enregistrée ✅");

    setRepas("");
    setGouter("");
    setSieste("");
    setSelles("");
    setHumeur("");
    setRemarques("");
  }

  return (
    <main className="min-h-screen bg-[#F7F6F2] p-6">
      <div className="mx-auto mb-6 flex max-w-3xl gap-3">
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

      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-5xl font-black text-[#1F2A1F]">
          Transmission du jour
        </h1>

        <div className="mt-8 space-y-5">
          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="w-full rounded-2xl border p-4"
          >
            <option value="">Choisir un enfant</option>

            {enfants.map((enfant) => (
              <option key={enfant.id} value={enfant.id}>
                {enfant.nom}
              </option>
            ))}
          </select>

          <textarea placeholder="Repas" value={repas} onChange={(e) => setRepas(e.target.value)} className="w-full rounded-2xl border p-4" />
          <textarea placeholder="Goûter" value={gouter} onChange={(e) => setGouter(e.target.value)} className="w-full rounded-2xl border p-4" />
          <textarea placeholder="Sieste" value={sieste} onChange={(e) => setSieste(e.target.value)} className="w-full rounded-2xl border p-4" />
          <textarea placeholder="Selles" value={selles} onChange={(e) => setSelles(e.target.value)} className="w-full rounded-2xl border p-4" />
          <textarea placeholder="Humeur" value={humeur} onChange={(e) => setHumeur(e.target.value)} className="w-full rounded-2xl border p-4" />
          <textarea placeholder="Remarques" value={remarques} onChange={(e) => setRemarques(e.target.value)} className="w-full rounded-2xl border p-4" />

          <button
            onClick={enregistrerTransmission}
            className="w-full rounded-2xl bg-[#7A947A] py-4 text-lg font-bold text-white"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </main>
  );
}
