import Link from "next/link";

const modules = [
  {
    titre: "Générateur de menus",
    description:
      "Créer facilement des menus équilibrés adaptés aux tout-petits.",
    emoji: "🍽️",
    couleur: "bg-[#E8F2EA]",
    lien: "/generateur",
  },
  {
    titre: "Recettes & associations",
    description:
      "Retrouver des recettes, textures et idées d’associations.",
    emoji: "🥦",
    couleur: "bg-[#FFF4E8]",
    lien: "/recettes",
  },
  {
    titre: "Idées d’activités",
    description:
      "Activités créatives, sensorielles et éducatives par âge.",
    emoji: "🎨",
    couleur: "bg-[#EEF4FF]",
    lien: "/activites",
  },
  {
    titre: "Développement de l’enfant",
    description:
      "Repères utiles autour du développement des tout-petits.",
    emoji: "🧠",
    couleur: "bg-[#F5EEFF]",
    lien: "/developpement",
  },
  {
    titre: "Documents utiles",
    description:
      "Affichages, fiches pratiques et supports imprimables.",
    emoji: "📄",
    couleur: "bg-[#FFF8E7]",
    lien: "/documents",
  },
  {
    titre: "Espace parents",
    description:
      "Accès privé pour consulter les informations de la journée.",
    emoji: "👨‍👩‍👧",
    couleur: "bg-[#EAF7F6]",
    lien: "/parents",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#243024]">
      <section className="mx-auto max-w-7xl p-6 lg:p-10">
        {/* HEADER */}
        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10 lg:p-14">
              <p className="font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
                Les Petits Koalas
              </p>

              <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl">
                Un espace pensé pour la petite enfance
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
                Menus, recettes, activités, documents utiles et espace parents :
                tout est rassemblé dans une seule plateforme douce, claire et
                pratique pour le quotidien.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/generateur"
                  className="rounded-full bg-[#6B8F71] px-7 py-4 font-bold text-white transition hover:opacity-90"
                >
                  Ouvrir le générateur
                </Link>

                <Link
                  href="/parents"
                  className="rounded-full bg-[#F7F3EA] px-7 py-4 font-bold text-[#243024] transition hover:bg-[#EFE9DD]"
                >
                  Accès parents
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center bg-[#E8F2EA] p-10">
              <div className="flex h-72 w-72 items-center justify-center rounded-[3rem] bg-white text-[8rem] shadow-sm">
                🐨
              </div>
            </div>
          </div>
        </div>

        {/* MODULES */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.titre}
              href={module.lien}
              className="group rounded-[2rem] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-[2rem] text-5xl ${module.couleur}`}
              >
                {module.emoji}
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                {module.titre}
              </h2>

              <p className="mt-4 leading-relaxed text-gray-600">
                {module.description}
              </p>

              <p className="mt-6 font-bold text-[#6B8F71] transition group-hover:translate-x-1">
                Ouvrir →
              </p>
            </Link>
          ))}
        </div>

        {/* SECTION INFO */}
        <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <p className="text-4xl">🌿</p>
              <h3 className="mt-4 text-2xl font-bold">
                Approche bienveillante
              </h3>
              <p className="mt-3 text-gray-600">
                Des outils pensés pour respecter le rythme et les besoins des
                enfants.
              </p>
            </div>

            <div>
              <p className="text-4xl">🍎</p>
              <h3 className="mt-4 text-2xl font-bold">
                Menus du quotidien
              </h3>
              <p className="mt-3 text-gray-600">
                Générateur de menus, recettes et idées simples adaptées à la
                petite enfance.
              </p>
            </div>

            <div>
              <p className="text-4xl">💛</p>
              <h3 className="mt-4 text-2xl font-bold">
                Un seul espace
              </h3>
              <p className="mt-3 text-gray-600">
                Public et privé réunis dans une seule plateforme claire et
                intuitive.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}