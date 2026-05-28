"use client";

import { useState } from "react";
import { supabase } from "../supabase";

type Enfant = {
  id: string;
  nom: string;
  date_naissance: string;
  jours_presence: string[];
  user_id: string;
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

type MenuSauvegarde = {
  id: string;
  titre: string;
  created_at: string;
  periode: string;
  menus: any[];
  visible_parents: boolean;
  menu_actif: boolean;
};

export default function ParentsPage() {
  const [codeParent, setCodeParent] = useState("");
  const [enfant, setEnfant] = useState<Enfant | null>(null);
  const [transmission, setTransmission] = useState<Transmission | null>(null);
  const [menuPartage, setMenuPartage] = useState<MenuSauvegarde | null>(null);
  const [chargement, setChargement] = useState(false);

  async function accederEspaceParent() {
    setChargement(true);
    setEnfant(null);
    setTransmission(null);
    setMenuPartage(null);

    const { data: enfantData, error } = await supabase
      .from("children")
      .select("*")
      .eq("code_parent", codeParent.trim().toUpperCase())
      .single();

    if (error || !enfantData) {
      setChargement(false);
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
      .maybeSingle();

    setTransmission(transmissionData || null);

    const { data: menuData, error: menuError } = await supabase
      .from("saved_menus")
      .select("*")
      .eq("user_id", enfantData.user_id)
      .eq("menu_actif", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!menuError && menuData) {
      setMenuPartage(menuData);
    }

    setChargement(false);
  }

  function calculerAge(dateNaissance: string) {
    const naissance = new Date(dateNaissance);
    const aujourdHui = new Date();

    let mois =
      (aujourdHui.getFullYear() - naissance.getFullYear()) * 12 +
      aujourdHui.getMonth() -
      naissance.getMonth();

    if (aujourdHui.getDate() < naissance.getDate()) {
      mois--;
    }

    if (mois < 12) return `${mois} mois`;

    const ans = Math.floor(mois / 12);
    const reste = mois % 12;

    if (reste === 0) return `${ans} an${ans > 1 ? "s" : ""}`;

    return `${ans} an${ans > 1 ? "s" : ""} et ${reste} mois`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-BE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-[#F6F4EE] p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-[32px] shadow-sm p-8">
        <h1 className="text-5xl font-black text-[#1D2B1F] mb-6">
          Espace parents
        </h1>

        <p className="text-2xl text-gray-700 mb-8">
          Entrez votre code parent pour accéder aux informations de votre enfant.
        </p>

        <input
          type="text"
          placeholder="Code parent"
          value={codeParent}
          onChange={(e) => setCodeParent(e.target.value.toUpperCase())}
          className="w-full border rounded-2xl px-5 py-5 text-2xl mb-5"
        />

        <button
          onClick={accederEspaceParent}
          disabled={chargement}
          className="w-full bg-[#7C9678] hover:bg-[#6E876A] text-white text-3xl font-bold rounded-2xl py-5 mb-10 disabled:opacity-60"
        >
          {chargement ? "Chargement..." : "Accéder"}
        </button>

        {enfant && (
          <div className="bg-[#EEF2EC] rounded-[32px] p-8">
            <h2 className="text-4xl font-black text-[#1D2B1F] mb-4">
              {enfant.nom}
            </h2>

            <p className="text-2xl mb-6">
              Âge : {calculerAge(enfant.date_naissance)}
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
                    <p>{transmission.repas || "Non renseigné"}</p>
                  </div>

                  <div>
                    <p className="font-bold">Goûter</p>
                    <p>{transmission.gouter || "Non renseigné"}</p>
                  </div>

                  <div>
                    <p className="font-bold">Sieste</p>
                    <p>{transmission.sieste || "Non renseigné"}</p>
                  </div>

                  <div>
                    <p className="font-bold">Selles</p>
                    <p>{transmission.selles || "Non renseigné"}</p>
                  </div>

                  <div>
                    <p className="font-bold">Humeur</p>
                    <p>{transmission.humeur || "Non renseigné"}</p>
                  </div>

                  <div>
                    <p className="font-bold">Remarques</p>
                    <p>{transmission.remarques || "Non renseigné"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xl text-gray-600">
                  Aucun rapport disponible pour aujourd’hui.
                </p>
              )}
            </div>

            <div className="mt-8 bg-white rounded-[24px] p-6">
              <h3 className="text-3xl font-black mb-5">
                Menu partagé
              </h3>

              {menuPartage ? (
                <div>
                  <div className="mb-6 rounded-2xl bg-[#F6F4EE] p-5">
                    <p className="text-2xl font-black">
                      {menuPartage.titre}
                    </p>

                    <p className="mt-2 text-gray-600">
                      Partagé le {formatDate(menuPartage.created_at)} —{" "}
                      {menuPartage.periode === "mois" ? "Menu mensuel" : "Menu semaine"}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {(menuPartage.menus || []).map((jour: any, index: number) => (
                      <div
                        key={`${menuPartage.id}-${index}`}
                        className="rounded-2xl bg-[#F8F6F2] p-5"
                      >
                        <p className="text-2xl font-black text-[#1D2B1F]">
                          {jour.jour}
                        </p>

                        <p className="mt-3">
                          <strong>Soupe :</strong> {jour.soupe}
                        </p>

                        <p className="mt-2">
                          <strong>Repas :</strong>{" "}
                          {jour.diner?.feculent} • {jour.diner?.legumes} •{" "}
                          {jour.diner?.proteine}
                        </p>

                        <p className="mt-2">
                          <strong>Goûter 4–12 mois :</strong>{" "}
                          {jour.gouter?.bebe}
                        </p>

                        <p className="mt-2">
                          <strong>Goûter 12–18 mois :</strong>{" "}
                          {jour.gouter?.fruit} + {jour.gouter?.pain1218}
                        </p>

                        <p className="mt-2">
                          <strong>Goûter 18 mois + :</strong>{" "}
                          {jour.gouter?.fruit} + {jour.gouter?.pain18}
                          {jour.gouter?.laitier18 &&
                          jour.gouter?.laitier18 !== "Non nécessaire"
                            ? ` + ${jour.gouter?.laitier18}`
                            : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xl text-gray-600">
                  Aucun menu partagé pour le moment.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
