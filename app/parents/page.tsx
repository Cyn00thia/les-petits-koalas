"use client";

import { useState } from "react";
import { supabase } from "../../supabase";

type Enfant = {
  id: string;
  nom: string;
  date_naissance: string;
  jours_presence: string[];
};

type Transmission = {
  repas: string;
  gouter: string;
  sieste: string;
  selles: string;
  humeur: string;
  remarques: string;
  date: string;
};

export default function ParentsPage() {
  const [codeParent, setCodeParent] = useState("");
  const [enfant, setEnfant] = useState<Enfant | null>(null);
  const [transmission, setTransmission] = useState<Transmission | null>(null);

  async function accederEspaceParent() {
    const { data: enfantData, error } = await supabase
      .from("children")
      .select("*")
      .eq("code_parent", codeParent)
      .single();

    if (error || !enfantData) {
      alert("Code parent invalide.");
      return;
    }

    setEnfant(enfantData);

    const today = new Date().toISOString().split("T")[0];

    const { data: transmissionData } = await supabase
      .from("daily_reports")
      .select("*")
      .eq("child_id", enfantData.id)
      .eq("date", today)
      .single();

    if (transmissionData) {
      setTransmission(transmissionData);
    } else {
      setTransmission(null);
    }
  }

  function calculerAge(dateNaissance: string) {
    const naissance = new Date(dateNaissance);
    const aujourdHui = new Date();

    let age = aujourdHui.getFullYear() - naissance.getFullYear();

    const mois =
      aujourdHui.getMonth() - naissance.getMonth();

    if (
      mois < 0 ||
      (mois === 0 &&
        aujourdHui.getDate() < naissance.getDate())
    ) {
      age--;
    }

    return age;
  }

  return (
    <main className="min-h-screen bg-[#F6F4EE] p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-sm p-8">
        <h1 className="text-5xl font-black text-[#1D2B1F] mb-6">
          Espace parents
        </h1>

        <p className="text-2xl text-gray-700 mb-8">
          Entrez votre code parent pour accéder aux
          informations de votre enfant.
        </p>

        <input
          type="text"
          placeholder="Code parent"
          value={codeParent}
          onChange={(e) =>
            setCodeParent(e.target.value.toUpperCase())
          }
          className="w-full border rounded-2xl px-5 py-5 text-2xl mb-5"
        />

        <button
          onClick={accederEspaceParent}
          className="w-full bg-[#7C9678] hover:bg-[#6E876A] text-white text-3xl font-bold rounded-2xl py-5 mb-10"
        >
          Accéder
        </button>

        {enfant && (
          <div className="bg-[#EEF2EC] rounded-[32px] p-8">
            <h2 className="text-4xl font-black text-[#1D2B1F] mb-4">
              {enfant.nom}
            </h2>

            <p className="text-2xl mb-6">
              Âge : {calculerAge(enfant.date_naissance)} an(s)
            </p>

            <div className="mb-8">
              <p className="font-bold text-2xl mb-3">
                Jours de présence :
              </p>

              <div className="flex gap-3 flex-wrap">
                {enfant.jours_presence?.map((jour) => (
                  <span
                    key={jour}
                    className="bg-white px-4 py-2 rounded-full text-xl font-semibold"
                  >
                    {jour}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6">
              <h3 className="text-3xl font-black mb-5">
                Transmission du jour
              </h3>

              {transmission ? (
                <div className="space-y-6 text-xl">
                  <div>
                    <p className="font-bold">Repas</p>
                    <p>{transmission.repas}</p>
                  </div>

                  <div>
                    <p className="font-bold">Goûter</p>
                    <p>{transmission.gouter}</p>
                  </div>

                  <div>
                    <p className="font-bold">Sieste</p>
                    <p>{transmission.sieste}</p>
                  </div>

                  <div>
                    <p className="font-bold">Selles</p>
                    <p>{transmission.selles}</p>
                  </div>

                  <div>
                    <p className="font-bold">Humeur</p>
                    <p>{transmission.humeur}</p>
                  </div>

                  <div>
                    <p className="font-bold">Remarques</p>
                    <p>{transmission.remarques}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xl text-gray-600">
                  Aucun rapport disponible pour
                  aujourd’hui.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}