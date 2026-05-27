"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

type SavedMenu = {
  id: string;
  created_at: string;
  user_id: string;
  titre: string;
  periode: string;
  menus: any[];
  courses: any;
  visible_parents: boolean;
};

export default function MenusPage() {
  const [menusSauvegardes, setMenusSauvegardes] = useState<SavedMenu[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerMenus();
  }, []);

  async function chargerMenus() {
    setChargement(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setChargement(false);
      alert("Tu dois être connectée pour voir les menus enregistrés.");
      return;
    }

    const { data, error } = await supabase
      .from("saved_menus")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      alert("Erreur lors du chargement des menus.");
      setChargement(false);
      return;
    }

    setMenusSauvegardes(data || []);
    setChargement(false);
  }

  async function togglePartage(menu: SavedMenu) {
    const nouvelleValeur = !menu.visible_parents;

    const { error } = await supabase
      .from("saved_menus")
      .update({ visible_parents: nouvelleValeur })
      .eq("id", menu.id)
      .eq("user_id", menu.user_id);

    if (error) {
      console.log(error);
      alert("Erreur lors de la modification du partage.");
      return;
    }

    setMenusSauvegardes((prev) =>
      prev.map((item) =>
        item.id === menu.id
          ? { ...item, visible_parents: nouvelleValeur }
          : item
      )
    );
  }

  async function supprimerMenu(menu: SavedMenu) {
    const ok = confirm(`Supprimer le menu "${menu.titre}" ?`);

    if (!ok) return;

    const { error } = await supabase
      .from("saved_menus")
      .delete()
      .eq("id", menu.id)
      .eq("user_id", menu.user_id);

    if (error) {
      console.log(error);
      alert("Erreur lors de la suppression.");
      return;
    }

    setMenusSauvegardes((prev) => prev.filter((item) => item.id !== menu.id));
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-BE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-6 py-10 text-[#1E2A1F]">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-full bg-white px-5 py-3 font-bold text-[#6E9271] shadow-sm"
          >
            ← Retour
          </button>

          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 font-bold text-[#6E9271] shadow-sm"
          >
            🏠 Accueil
          </Link>

          <Link
            href="/generateur"
            className="rounded-full bg-[#6E9271] px-5 py-3 font-bold text-white shadow-sm"
          >
            Générer un nouveau menu
          </Link>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6E9271]">
            Espace professionnel
          </p>

          <h1 className="mt-4 text-5xl font-black">
            Menus enregistrés
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#4F5A50]">
            Retrouve les menus générés, consulte leur contenu et choisis ceux
            qui sont visibles dans l’espace parents.
          </p>
        </div>

        {chargement ? (
          <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-xl">Chargement des menus...</p>
          </div>
        ) : menusSauvegardes.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-xl">
              Aucun menu enregistré pour le moment.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {menusSauvegardes.map((menu) => (
              <article
                key={menu.id}
                className="rounded-[2rem] bg-white p-8 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-black">
                        {menu.titre}
                      </h2>

                      {menu.visible_parents && (
                        <span className="rounded-full bg-[#E8F2EA] px-4 py-2 text-sm font-bold text-[#56735B]">
                          Visible parents
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-[#5A655B]">
                      Créé le {formatDate(menu.created_at)} —{" "}
                      {menu.periode === "mois" ? "Menu mensuel" : "Menu semaine"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => togglePartage(menu)}
                      className={`rounded-full px-5 py-3 font-bold ${
                        menu.visible_parents
                          ? "bg-[#FFE5E5] text-red-600"
                          : "bg-[#6E9271] text-white"
                      }`}
                    >
                      {menu.visible_parents
                        ? "Retirer du partage"
                        : "Partager aux parents"}
                    </button>

                    <button
                      type="button"
                      onClick={() => supprimerMenu(menu)}
                      className="rounded-full bg-[#FFE5E5] px-5 py-3 font-bold text-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {(menu.menus || []).slice(0, 5).map((jour: any, index: number) => (
                    <div
                      key={`${menu.id}-${index}`}
                      className="rounded-2xl bg-[#F8F6F2] p-5"
                    >
                      <p className="text-xl font-black">
                        {jour.jour}
                      </p>

                      <p className="mt-3 text-sm">
                        <strong>Soupe :</strong> {jour.soupe}
                      </p>

                      <p className="mt-2 text-sm">
                        <strong>Repas :</strong>{" "}
                        {jour.diner?.feculent} • {jour.diner?.legumes} •{" "}
                        {jour.diner?.proteine}
                      </p>

                      <p className="mt-2 text-sm">
                        <strong>Goûter :</strong> {jour.gouter?.fruit}
                      </p>
                    </div>
                  ))}
                </div>

                {(menu.menus || []).length > 5 && (
                  <p className="mt-4 text-sm text-[#5A655B]">
                    + {(menu.menus || []).length - 5} autre(s) jour(s) dans ce menu.
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
