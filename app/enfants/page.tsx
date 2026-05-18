export default function EnfantsPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6B8F71]">
            Gestion des enfants
          </p>

          <h1 className="mt-4 text-5xl font-black text-[#1F2A1F]">
            Enfants accueillis
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-[#4B5563]">
            Ajoute ici les enfants accueillis afin de gérer leur présence,
            leurs allergies, leur diversification alimentaire et adapter les
            menus automatiquement.
          </p>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row">
            <input
              type="text"
              placeholder="Initiale ou prénom"
              className="flex-1 rounded-2xl border border-[#D9D4C7] bg-[#FDFCF9] px-5 py-4 text-lg outline-none"
            />

            <input
              type="date"
              className="rounded-2xl border border-[#D9D4C7] bg-[#FDFCF9] px-5 py-4 text-lg outline-none"
            />

            <button className="rounded-2xl bg-[#6B8F71] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#5A7B60]">
              Ajouter l’enfant
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6">
          <article className="rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-3xl font-black text-[#1F2A1F]">
                  L — 8 mois
                </h2>

                <p className="mt-2 text-[#4B5563]">
                  Présence : lundi • mardi • jeudi
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-[#EEF4EE] px-5 py-2 font-bold text-[#6B8F71]">
                  Diversification
                </button>

                <button className="rounded-full bg-[#FFF3F3] px-5 py-2 font-bold text-[#D45B5B]">
                  Allergies
                </button>

                <button className="rounded-full bg-[#F4F1E8] px-5 py-2 font-bold text-[#8A6E3B]">
                  Modifier
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl bg-[#F8F6F1] p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-[#6B8F71]">
                  Légumes introduits
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-4 py-2 text-sm">
                    Carotte
                  </span>

                  <span className="rounded-full bg-white px-4 py-2 text-sm">
                    Courgette
                  </span>

                  <span className="rounded-full bg-white px-4 py-2 text-sm">
                    Poireau
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-[#F8F6F1] p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-[#6B8F71]">
                  Fruits introduits
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-4 py-2 text-sm">
                    Pomme
                  </span>

                  <span className="rounded-full bg-white px-4 py-2 text-sm">
                    Poire
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-[#F8F6F1] p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-[#6B8F71]">
                  Allergies
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#FFE5E5] px-4 py-2 text-sm text-[#B54747]">
                    Œuf
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
