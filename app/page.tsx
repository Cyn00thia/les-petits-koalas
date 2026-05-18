"use client";

import Link from "next/link";

const sections = [
  {
    titre: "Générateur de menus",
    description:
      "Créer facilement des menus équilibrés adaptés aux tout-petits.",
    lien: "/generateur",
    emoji: "🍽️",
    couleur: "bg-[#E8F0E8]",
  },

  {
    titre: "Zéro gaspillage",
    description:
      "Entrer les aliments restants du frigo et recevoir des idées adaptées aux tout-petits.",
    lien: "/zero-gaspillage",
    emoji: "♻️",
    couleur: "bg-[#E7F4E8]",
  },

  {
    titre: "Recettes & associations",
    description:
      "Retrouver des recettes, textures et idées d’associations.",
    lien: "/recettes",
    emoji: "🥦",
    couleur: "bg-[#F4EBDD]",
  },

  {
    titre: "Idées d’activités",
    description:
      "Activités créatives, sensorielles et éducatives par âge.",
    lien: "/activites",
    emoji: "🎨",
    couleur: "bg-[#E8EDF7]",
  },

  {
    titre: "Développement de l’enfant",
    description:
      "Repères utiles autour du développement des tout-petits.",
    lien: "/developpement",
    emoji: "🧠",
    couleur: "bg-[#EFE4F8]",
  },

  {
    titre: "Documents utiles",
    description:
      "Affichages, fiches pratiques et supports imprimables.",
    lien: "/documents",
    emoji: "📄",
    couleur: "bg-[#F7F1DD]",
  },
{
  title: "Enfants",
  description:
    "Gestion des enfants, présences, allergies et diversification alimentaire.",
  lien: "/enfants",
  emoji: "👶",
  couleur: "bg-[#EEF4E8]",
},
  {
    titre: "Espace parents",
    description:
      "Accès privé pour consulter les informations de la journée.",
    lien: "/parents",
    emoji: "👨‍👩‍👧",
    couleur: "bg-[#E8F2F0]",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F6F2EA] px-6 py-10 text-[#243024]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
                Les Petits Koalas
              </p>

              <h1 className="mt-5 text-5xl font-bold leading-tight">
                Application menu & outils petite enfance
              </h1>

              <p className="mt-6 text-xl leading-relaxed text-gray-600">
                Une plateforme pensée pour les accueillantes et professionnels
                de la petite enfance : menus, activités, développement,
                documents utiles et suivi du quotidien.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#EEF5EF] p-8 text-center">
              <div className="text-7xl">🌿</div>

              <p className="mt-4 text-lg font-semibold text-[#6B8F71]">
                Outils simples, doux et pratiques pour le quotidien.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.titre}
              href={section.lien}
              className="rounded-[2rem] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl ${section.couleur}`}
              >
                {section.emoji}
              </div>

              <h2 className="text-3xl font-bold">
                {section.titre}
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                {section.description}
              </p>

              <p className="mt-8 font-bold text-[#6B8F71]">
                Ouvrir →
              </p>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}