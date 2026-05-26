
import Link from "next/link";

const sections = [
  {
    titre: "Générateur de menus",
    description:
      "Créer automatiquement des menus inspirés de Chouette, on passe à table.",
    lien: "/generateur",
    emoji: "🍽️",
    couleur: "bg-[#F4EFE8]",
  },

  {
    titre: "Activités",
    description:
      "Idées d’activités, bricolages et inspirations pour les tout-petits.",
    lien: "/activites",
    emoji: "🎨",
    couleur: "bg-[#EEF4E8]",
  },

  {
    titre: "Développement",
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
    titre: "Enfants",
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
    couleur: "bg-[#F5E8E8]",
  },

  {
    titre: "Recettes",
    description:
      "Recettes adaptées aux enfants et idées cuisine.",
    lien: "/recettes",
    emoji: "🥣",
    couleur: "bg-[#F9F3E7]",
  },

  {
    titre: "Zéro gaspillage",
    description:
      "Astuces anti-gaspi et cuisine responsable.",
    lien: "/zero-gaspillage",
    emoji: "♻️",
    couleur: "bg-[#E8F3EC]",
  },

  {
    titre: "Connexion pro",
    description:
      "Connexion sécurisée pour accéder à l’espace professionnel.",
    lien: "/login",
    emoji: "🔒",
    couleur: "bg-[#EAF0F8]",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] p-6 text-[#243024] lg:p-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm lg:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-[#6B8F71]">
            Les Petits Koalas
          </p>

          <h1 className="mt-6 text-5xl font-black leading-tight lg:text-7xl">
            Application d’accueil
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4B5563]">
            Gestion des menus, enfants accueillis, diversification alimentaire,
            documents, activités et futur espace parents sécurisé.
          </p>

          <section className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section, index) => (
              <Link
                key={index}
                href={section.lien}
                className={`rounded-[2rem] ${section.couleur} p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="text-5xl">{section.emoji}</div>

                <h2 className="mt-6 text-2xl font-black">
                  {section.titre}
                </h2>

                <p className="mt-3 leading-relaxed text-[#4B5563]">
                  {section.description}
                </p>
              </Link>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
