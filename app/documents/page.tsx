"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type DocumentItem = {
  name: string;
  url: string;
  created_at?: string | null;
};

const categories = [
  {
    id: "documents-utiles",
    titre: "Documents utiles",
  },
  {
    id: "introduction-alimentaire",
    titre: "Introduction alimentaire",
  },
  {
    id: "autorisations",
    titre: "Autorisations",
  },
  {
    id: "fiches-pratiques",
    titre: "Fiches pratiques",
  },
  {
    id: "menus",
    titre: "Menus",
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<
    Record<string, DocumentItem[]>
  >({});
  const [file, setFile] = useState<File | null>(null);
  const [categorie, setCategorie] = useState("documents-utiles");
  const [loading, setLoading] = useState(false);

  async function chargerDocuments() {
    const nouveauxDocuments: Record<string, DocumentItem[]> = {};

    for (const cat of categories) {
      const { data, error } = await supabase.storage
        .from("documents-utiles")
        .list(cat.id, {
          limit: 100,
        });

      if (!error && data) {
        nouveauxDocuments[cat.id] = data.map((doc) => ({
          name: doc.name,
          url: supabase.storage
            .from("documents-utiles")
            .getPublicUrl(`${cat.id}/${doc.name}`).data.publicUrl,
          created_at: doc.created_at,
        }));
      } else {
        nouveauxDocuments[cat.id] = [];
      }
    }

    setDocuments(nouveauxDocuments);
  }

  useEffect(() => {
    chargerDocuments();
  }, []);

  async function ajouterDocument() {
    if (!file) {
      alert("Sélectionne un fichier.");
      return;
    }

    setLoading(true);

    const chemin = `${categorie}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("documents-utiles")
      .upload(chemin, file);

    if (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du document.");
    } else {
      alert("Document ajouté avec succès !");
      setFile(null);
      chargerDocuments();
    }

    setLoading(false);
  }

  function obtenirIcone(nom: string) {
    const extension = nom.split(".").pop()?.toLowerCase();

    if (extension === "pdf") return "📕";
    if (extension === "docx" || extension === "doc") return "📘";
    if (extension === "xlsx") return "📗";

    return "📄";
  }

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-block text-lg font-medium text-[#6E8B74]"
        >
          ← Retour à l’accueil
        </Link>

        <section className="rounded-[35px] bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6E8B74]">
            Documents utiles
          </p>

          <h1 className="mt-4 text-6xl font-black leading-none text-[#243126]">
            Fichiers à télécharger
          </h1>

          <p className="mt-8 max-w-4xl text-2xl leading-relaxed text-[#47554A]">
            Retrouvez ici tous les documents utiles à télécharger,
            imprimer ou partager.
          </p>
        </section>

        <div className="mt-10 space-y-8">
          {categories.map((cat) => (
            <section
              key={cat.id}
              className="rounded-[35px] bg-white p-8 shadow-sm"
            >
              <h2 className="text-4xl font-black text-[#243126]">
                {cat.titre}
              </h2>

              <div className="mt-6">
                {documents[cat.id] &&
                documents[cat.id].length > 0 ? (
                  <div className="grid gap-4">
                    {documents[cat.id].map((doc, index) => (
                      <article
                        key={index}
                        className="flex flex-col gap-4 rounded-3xl border border-[#E7E1D4] bg-[#FAF8F2] p-5 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">
                            {obtenirIcone(doc.name)}
                          </div>

                          <div>
                            <p className="text-lg font-bold text-[#243126]">
                              {doc.name}
                            </p>

                            <p className="text-sm text-[#6E7B70]">
                              Téléchargement disponible
                            </p>
                          </div>
                        </div>

                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#6E8B74] px-6 py-3 text-center text-sm font-bold text-white transition hover:opacity-90"
                        >
                          Télécharger
                        </a>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl bg-[#F5F1E8] p-6 text-lg text-[#5E6A60]">
                    Aucun document dans cette catégorie pour le moment.
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-[35px] bg-white p-8 shadow-sm">
          <h2 className="text-4xl font-black text-[#243126]">
            Ajouter un document
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1.5fr_auto]">
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="rounded-2xl border border-[#E5DED0] bg-white px-5 py-4 text-lg outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.titre}
                </option>
              ))}
            </select>

            <label className="flex cursor-pointer items-center rounded-2xl border border-[#E5DED0] bg-white px-5 py-4 text-lg text-[#47554A]">
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />

              {file
                ? file.name
                : "Choisir un fichier"}
            </label>

            <button
              onClick={ajouterDocument}
              disabled={loading}
              className="rounded-full bg-[#6E8B74] px-8 py-4 text-lg font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>
          </div>

          {file && (
            <div className="mt-5 rounded-2xl bg-[#F5F1E8] p-4 text-lg text-[#243126]">
              Fichier sélectionné :{" "}
              <span className="font-bold">{file.name}</span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}