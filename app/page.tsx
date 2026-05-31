"use client";

import Link from "next/link";

const navigation = [
  { label: "Tableau de bord", href: "/", icon: "🏠", active: true },
  { label: "Générateur de menus", href: "/generateur", icon: "🌿" },
  { label: "Menus & planning", href: "/menus", icon: "📅" },
  { label: "Enfants", href: "/enfants", icon: "👶" },
  { label: "Bibliothèque alimentaire", href: "/bibliotheque", icon: "🥕" },
  { label: "Recettes", href: "/recettes", icon: "🍽️" },
  { label: "Le savais-tu ?", href: "/le-savais-tu", icon: "💡" },
  { label: "Communauté", href: "/communaute", icon: "💛" },
  { label: "Documents", href: "/documents", icon: "📄" },
  { label: "Paramètres", href: "/settings", icon: "⚙️" },
];

const resumeCards = [
  {
    title: "Enfants présents",
    value: "Aujourd’hui",
    detail: "Groupe du jour",
    emoji: "👶",
    bg: "bg-[#F1F7EC]",
    border: "border-[#DCEBD6]",
  },
  {
    title: "Menu du jour",
    value: "Équilibré",
    detail: "Base commune + adaptations",
    emoji: "🥗",
    bg: "bg-[#FFF3EA]",
    border: "border-[#F3D9C8]",
  },
  {
    title: "Texture du jour",
    value: "Adaptée",
    detail: "Selon chaque enfant",
    emoji: "🥣",
    bg: "bg-[#FFF7DF]",
    border: "border-[#F0DEAA]",
  },
  {
    title: "Prochain menu",
    value: "À préparer",
    detail: "Planning à venir",
    emoji: "🌱",
    bg: "bg-[#F5F0FF]",
    border: "border-[#DFD3F3]",
  },
];

const valeurs = [
  { icon: "⏱️", text: "Pensé pour gagner du temps" },
  { icon: "🧸", text: "S’adapte à chaque enfant" },
  { icon: "🌿", text: "Respecte les recommandations de l’ONE" },
  { icon: "✨", text: "Évolutif et facile à mettre à jour" },
  { icon: "💛", text: "Communauté bienveillante" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F4EC] p-4 text-[#1F2A24] lg:p-5">
      <div className="mx-auto grid max-w-[1500px] gap-5 xl:grid-cols-[255px_minmax(0,1fr)_385px]">
        <aside className="rounded-[2rem] bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F4EFE6] text-3xl">
              🐨
            </div>

            <div>
              <h1 className="text-xl font-black leading-tight text-[#102015]">
                Les Petits Koalas
              </h1>
              <p className="mt-1 text-sm text-[#6C7168]">Milieu d’accueil</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1.5">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  item.active
                    ? "bg-[#E8F1DF] text-[#2E5C35]"
                    : "text-[#344134] hover:bg-[#F6F2EA]"
                }`}
              >
                <span className="w-6 text-center text-lg">{item.icon}</span>
                <span className="leading-tight">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-[1.8rem] bg-[#F8F4EC] p-5">
            <div className="text-4xl">🌿</div>
            <p className="mt-4 text-sm leading-relaxed text-[#424C3F]">
              Prendre soin des petits, au quotidien.
            </p>
            <p className="mt-3 text-xl">🤍</p>
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          <header className="rounded-[2rem] bg-white/90 p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#6E9271]">
                  Tableau de bord
                </p>

                <h2 className="mt-3 max-w-[640px] text-4xl font-black leading-[1.05] text-[#102015] lg:text-5xl">
                  Bonjour, Cynthia !
                  <span className="ml-2 text-[#8BA56F]">🌿</span>
                </h2>

                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#5E675C]">
                  Prête pour une journée pleine de douceur et de bons petits plats ? 😊
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <Link
                  href="/settings"
                  className="rounded-2xl bg-[#F8F4EC] px-5 py-3 text-sm font-bold text-[#2E342D] transition hover:bg-[#EFE8DB]"
                >
                  🏡 Ma structure
                </Link>

                <Link
                  href="/parents"
                  className="rounded-2xl bg-[#E8F1DF] px-5 py-3 text-sm font-bold text-[#2E5C35] transition hover:bg-[#DCEBD6]"
                >
                  Espace parents
                </Link>

                <Link
                  href="/login"
                  className="rounded-2xl bg-[#F8F4EC] px-5 py-3 text-sm font-bold text-[#2E342D] transition hover:bg-[#EFE8DB]"
                >
                  Connexion pro
                </Link>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {resumeCards.map((card) => (
                <div
                  key={card.title}
                  className={`min-h-[145px] rounded-[1.6rem] border ${card.border} ${card.bg} p-5`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="max-w-[110px] text-sm font-black leading-snug">
                      {card.title}
                    </p>
                    <span className="text-3xl">{card.emoji}</span>
                  </div>

                  <p className="mt-5 text-2xl font-black leading-tight text-[#102015]">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-[#5E675C]">
                    {card.detail}
                  </p>
                </div>
              ))}
            </div>
          </header>

          <section className="rounded-[2rem] bg-white/90 p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-3xl font-black leading-tight text-[#102015]">
                  Générateur de menus
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#5E675C]">
                  Crée un menu équilibré en quelques clics, avec une base commune et des adaptations selon les enfants ✨
                </p>
              </div>

              <Link
                href="/generateur"
                className="rounded-full bg-[#6E9271] px-7 py-3.5 text-center text-sm font-black text-white shadow-sm transition hover:scale-[1.02]"
              >
                Ouvrir le générateur
              </Link>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {[
                [
                  "Étape 1",
                  "Enfants présents",
                  "Utilise les enfants encodés dans l’espace pro.",
                  "#6E9271",
                ],
                [
                  "Étape 2",
                  "Textures & âges",
                  "Mixé, écrasé, morceaux fondants ou autonomes.",
                  "#D99D5B",
                ],
                [
                  "Étape 3",
                  "Résultat adapté",
                  "Menus à enregistrer et à partager aux parents.",
                  "#B47D9B",
                ],
              ].map(([step, title, detail, color]) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] border border-[#EFE7DB] bg-[#FFFCF7] p-5"
                >
                  <p
                    className="text-xs font-black uppercase tracking-[0.2em]"
                    style={{ color }}
                  >
                    {step}
                  </p>
                  <h3 className="mt-3 text-lg font-black leading-tight text-[#102015]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5E675C]">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white/90 p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E08C65]">
                  Inspiration du moment
                </p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-[#102015]">
                  Des idées, des astuces et de la douceur
                </h2>
              </div>
              <span className="text-3xl">💛</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Link
                href="/bibliotheque"
                className="rounded-[1.5rem] bg-[#FFF4EB] p-5 transition hover:scale-[1.01]"
              >
                <p className="text-xs font-bold text-[#7B6A59]">Idée présentation</p>
                <h3 className="mt-2 text-base font-black leading-tight text-[#102015]">
                  Assiette arc-en-ciel
                </h3>
                <div className="mt-4 rounded-2xl bg-white p-4 text-4xl">🥕🥔🥦</div>
              </Link>

              <Link
                href="/le-savais-tu"
                className="rounded-[1.5rem] bg-[#F6F0FF] p-5 transition hover:scale-[1.01]"
              >
                <p className="text-xs font-bold text-[#7B6A59]">Le savais-tu ?</p>
                <h3 className="mt-2 text-base font-black leading-tight text-[#102015]">
                  Pourquoi proposer des textures variées ?
                </h3>
                <div className="mt-4 rounded-2xl bg-white p-4 text-4xl">🐨📖</div>
              </Link>

              <Link
                href="/communaute"
                className="rounded-[1.5rem] bg-[#FFF0EA] p-5 transition hover:scale-[1.01]"
              >
                <p className="text-xs font-bold text-[#7B6A59]">Astuce pro</p>
                <h3 className="mt-2 text-base font-black leading-tight text-[#102015]">
                  Gérer les refus sans pression
                </h3>
                <div className="mt-4 rounded-2xl bg-white p-4 text-4xl">🤲</div>
              </Link>
            </div>
          </section>

          <div className="grid gap-3 rounded-[2rem] bg-white/90 p-4 shadow-sm ring-1 ring-black/5 sm:grid-cols-2 xl:grid-cols-5">
            {valeurs.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-2xl p-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4EFE6] text-lg">
                  {item.icon}
                </span>
                <p className="text-xs font-black leading-snug text-[#263126]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[2rem] bg-white/90 p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-2xl font-black leading-tight text-[#102015]">
              Une interface douce, claire et pensée pour le quotidien
            </h2>

            <div className="mt-6 grid grid-cols-4 gap-2 text-center">
              {[
                ["🌿", "Chaleureuse"],
                ["✨", "Épurée"],
                ["☕", "Pro"],
                ["🤍", "Rassurante"],
              ].map(([icon, label]) => (
                <div key={label}>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F6F0E6] text-2xl">
                    {icon}
                  </div>
                  <p className="mt-2 text-[11px] font-black leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white/90 p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-black text-[#102015]">Focus menu généré</h2>

            <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-[#EFE7DB]">
              <div className="flex items-center justify-between gap-3 bg-[#FFFCF7] px-5 py-4">
                <p className="font-black">Menu du lundi</p>
                <span className="rounded-full bg-[#E8F1DF] px-3 py-1 text-xs font-black text-[#4E7A52]">
                  Équilibré
                </span>
              </div>

              {[
                ["🎃", "Entrée", "Velouté de potiron"],
                ["🐔", "Plat", "Poulet au thym, carottes et pommes de terre"],
                ["🥛", "Goûter", "Fruit + pain adapté"],
                ["🍎", "Adaptation", "Texture selon l’enfant"],
              ].map(([icon, label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[36px_75px_1fr] items-center gap-3 border-t border-[#EFE7DB] px-4 py-4 text-sm"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="font-black">{label}</span>
                  <span className="leading-snug text-[#3E493E]">{value}</span>
                </div>
              ))}
            </div>

            <Link
              href="/generateur"
              className="mt-4 block rounded-2xl bg-[#F8F4EC] px-5 py-4 text-center text-sm font-black text-[#6E9271]"
            >
              Voir les détails et les idées d’adaptation →
            </Link>
          </section>

          <section className="rounded-[2rem] bg-white/90 p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-black text-[#102015]">Pages en préparation</h2>

            <div className="mt-4 space-y-3">
              {[
                ["📚", "Le savais-tu ?", "Fiches alimentation, sommeil, développement"],
                ["🍽️", "Recettes", "Photos, idées de présentation, adaptations"],
                ["💛", "Communauté", "Échanges bienveillants entre pros"],
              ].map(([icon, title, detail]) => (
                <div key={title} className="rounded-2xl bg-[#FFFCF7] p-4">
                  <p className="font-black">
                    {icon} {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5E675C]">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-[2rem] bg-[#F1F7EC] p-6 text-center shadow-sm ring-1 ring-black/5">
            <div className="text-5xl">🐨🌿</div>
            <p className="mt-4 text-sm font-black leading-relaxed text-[#45654A]">
              Chaque enfant évolue à son propre rythme.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
