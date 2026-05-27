"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "./supabase";

type Settings = {
  nom_milieu: string | null;
  couleur_principale: string | null;
};

const ressourcesPubliques = [
  {
    titre: "Générateur de menus",
    description:
      "Créer des menus variés, de saison, avec liste de courses et impression.",
    lien: "/generateur",
    emoji: "🍽️",
  },
  {
    titre: "Activités",
    description:
      "Idées d’activités, bricolages et inspirations pour les tout-petits.",
    lien: "/activites",
    emoji: "🎨",
  },
  {
    titre: "Recettes",
    description: "Recettes adaptées aux enfants et idées de goûters maison.",
    lien: "/recettes",
    emoji: "🥣",
  },
  {
    titre: "Documents utiles",
    description:
      "Documents vierges à télécharger, autorisations, affichages et supports.",
    lien: "/documents",
    emoji: "📄",
  },
  {
    titre: "Zéro gaspillage",
    description:
      "Astuces simples pour organiser, réutiliser et limiter le gaspillage.",
    lien: "/zero-gaspillage",
    emoji: "♻️",
  },
];

const espacePro = [
  {
    titre: "Enfants",
    description:
      "Gestion des enfants, jours de présence, codes parents et diversification.",
    lien: "/enfants",
    emoji: "👶",
  },
  {
    titre: "Transmissions",
    description:
      "Encoder le repas, la sieste, les selles, l’humeur et les remarques du jour.",
    lien: "/transmissions",
    emoji: "📝",
  },
  {
    titre: "Paramètres",
    description:
      "Personnaliser le nom du milieu d’accueil, les coordonnées et la couleur.",
    lien: "/settings",
    emoji: "⚙️",
  },
];

function Carte({
  item,
  accent,
}: {
  item: {
    titre: string;
    description: string;
    lien: string;
    emoji: string;
  };
  accent: string;
}) {
  return (
    <Link
      href={item.lien}
      className="group rounded-[2rem] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl"
        style={{ backgroundColor: `${accent}22` }}
      >
        {item.emoji}
      </div>

      <h3 className="mt-6 text-2xl font-black text-[#1E2A1F]">
        {item.titre}
      </h3>

      <p className="mt-3 leading-relaxed text-[#5A655B]">
        {item.description}
      </p>

      <p className="mt-5 font-bold" style={{ color: accent }}>
        Ouvrir →
      </p>
    </Link>
  );
}

export default function HomePage() {
  const [nomMilieu, setNomMilieu] = useState("Les Petits Koalas");
  const [couleur, setCouleur] = useState("#6E9271");
  const [connecte, setConnecte] = useState(false);

  useEffect(() => {
    chargerAccueil();
  }, []);

  async function chargerAccueil() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setConnecte(false);
      return;
    }

    setConnecte(true);

    const { data } = await supabase
      .from("settings")
      .select("nom_milieu, couleur_principale")
      .eq("user_id", session.user.id)
      .maybeSingle();

    const settings = data as Settings | null;

    if (settings?.nom_milieu) {
      setNomMilieu(settings.nom_milieu);
    }

    if (settings?.couleur_principale) {
      setCouleur(settings.couleur_principale);
    }
  }

  async function deconnexion() {
    await supabase.auth.signOut();
    setConnecte(false);
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-6 py-8 text-[#1E2A1F] lg:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="rounded-[2.5rem] bg-white p-8 shadow-sm lg:p-12">
          <nav className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-black text-white"
                style={{ backgroundColor: couleur }}
              >
                {nomMilieu.charAt(0).toUpperCase()}
              </div>

              <div>
                <p
                  className="text-sm font-bold uppercase tracking-[0.3em]"
                  style={{ color: couleur }}
                >
                  Plateforme petite enfance
                </p>

                <h1 className="text-3xl font-black lg:text-4xl">
                  {nomMilieu}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/parents"
                className="rounded-full bg-[#F1EEE7] px-5 py-3 font-bold text-[#1E2A1F]"
              >
                Espace parents
              </Link>

              {connecte ? (
                <>
                  <Link
                    href="/settings"
                    className="rounded-full px-5 py-3 font-bold text-white"
                    style={{ backgroundColor: couleur }}
                  >
                    Espace pro
                  </Link>

                  <button
                    onClick={deconnexion}
                    className="rounded-full bg-[#FFE5E5] px-5 py-3 font-bold text-red-600"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full px-5 py-3 font-bold text-white"
                  style={{ backgroundColor: couleur }}
                >
                  Connexion pro
                </Link>
              )}
            </div>
          </nav>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="max-w-4xl text-5xl font-black leading-tight lg:text-7xl">
                Un espace clair pour les pros, les parents et les tout-petits.
              </h2>

              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-[#5A655B]">
                Menus, documents, transmissions, gestion des enfants et espace
                parent sécurisé : tout est regroupé dans une plateforme douce,
                lisible et pensée pour le quotidien.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#F7F4EE] p-6">
              <p
                className="text-sm font-bold uppercase tracking-[0.2em]"
                style={{ color: couleur }}
              >
                Accès rapides
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/parents"
                  className="rounded-2xl bg-white p-5 font-bold shadow-sm"
                >
                  👨‍👩‍👧 Accéder avec un code parent
                </Link>

                <Link
                  href="/generateur"
                  className="rounded-2xl bg-white p-5 font-bold shadow-sm"
                >
                  🍽️ Générer un menu
                </Link>

                <Link
                  href={connecte ? "/transmissions" : "/login"}
                  className="rounded-2xl bg-white p-5 font-bold shadow-sm"
                >
                  🔒 Encoder une transmission
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-10">
          <div className="rounded-[2.5rem] bg-[#E8F2EA] p-8">
            <p
              className="text-sm font-bold uppercase tracking-[0.3em]"
              style={{ color: couleur }}
            >
              Partie publique
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Ressources accessibles à tous
            </h2>

            <p className="mt-3 max-w-3xl text-lg text-[#5A655B]">
              Des outils et contenus utiles pour les parents, les professionnels
              et les personnes intéressées par la petite enfance.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {ressourcesPubliques.map((item) => (
                <Carte key={item.lien} item={item} accent={couleur} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
            <p
              className="text-sm font-bold uppercase tracking-[0.3em]"
              style={{ color: couleur }}
            >
              Espace parents
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Accès privé par code
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#5A655B]">
              Les parents entrent le code transmis par le milieu d’accueil et
              accèdent uniquement aux informations de leur enfant.
            </p>

            <Link
              href="/parents"
              className="mt-8 inline-block rounded-full px-7 py-4 text-lg font-bold text-white"
              style={{ backgroundColor: couleur }}
            >
              Ouvrir l’espace parents
            </Link>
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
            <p
              className="text-sm font-bold uppercase tracking-[0.3em]"
              style={{ color: couleur }}
            >
              Espace professionnel
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Gestion réservée au personnel
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#5A655B]">
              Ces pages sont protégées par connexion professionnelle.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {espacePro.map((item) => (
                <Carte key={item.lien} item={item} accent={couleur} />
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
