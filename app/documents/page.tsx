"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type DocumentItem = {
  name: string;
  url: string;
  created_at?: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [categorie, setCategorie] = useState("documents-utiles");
  const [loading, setLoading] = useState(false);

  async function chargerDocuments() {
    const { data, error } = await supabase.storage
      .from("documents-utiles")
      .list(categorie, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error(error);
      return;
    }

    const fichiers =
      data
        ?.filter((item) => item.name !== ".emptyFolderPlaceholder")
        .map((item) => {
          const path = `${categorie}/${item.name}`;

          const { data: publicUrl } = supabase.storage
            .from("documents-utiles")
            .getPublicUrl(path);

          return {
            name: item.name,
            url: publicUrl.publicUrl,
            created_at: item.created_at,
          };
        }) ?? [];

    setDocuments(fichiers);
  }

  useEffect(() => {
    chargerDocuments();
  }, [categorie]);

  async function ajouterDocument() {
    if (!file) {
      alert("Choisis d’abord un fichier 🙂");
      return;
    }

    setLoading(true);

    const extension = file.name.split(".").pop();
    const nomSansExtension = file.name
      .replace(`.${extension}`, "")
      .replaceAll(" ", "-")
      .toLowerCase();

    const fileName = `${Date.now()}-${nomSansExtension}.${extension}`;
    const path = `${categorie}/${fileName}`;

    const { error } = await supabase.storage
      .from("documents-utiles")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Erreur lors de l’ajout du document.");
      return;
    }

    setFile(null);
    await chargerDocuments();
    alert("Document ajouté ✅");
  }

  async function supprimerDocument(nom: string) {
    const ok = confirm("Supprimer ce document ?");
    if (!ok) return;

    const path = `${categorie}/${nom}`;

    const { error } = await supabase.storage
      .from("documents-utiles")
      .remove([path]);

    if (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
      return;
    }

    await chargerDocuments();
  }

  return (
    <main className="min-h-screen bg-[#F7F3EA] p-6 text-[#243024] lg:p-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/" className="font-bold text-[#6B8F71]">
          ← Retour à l’accueil
        </Link>

        <div className="mt-6 rounded-[2.5rem] bg-white p-10 shadow-sm">
          <p className="font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
            Documents utiles
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Fichiers à télécharger
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Ajoute ici les documents vierges utiles : liste d’introduction
            alimentaire, autorisation photos, fiches pratiques, modèles à
            imprimer ou à partager.
          </p>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Ajouter un document</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            >
              <option value="documents-utiles">Documents utiles</option>
              <option value="introduction-alimentaire">
                Introduction alimentaire
              </option>
              <option value="autorisations">Autorisations</option>
              <option value="fiches-pratiques">Fiches pratiques</option>
              <option value="menus">Menus</option>
            </select>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <button
              onClick={ajouterDocument}
              disabled={loading}
              className="rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white disabled:opacity-50"
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>
          </div>

          {file && (
            <p className="mt-4 rounded-2xl bg-[#F7F3EA] p-4 text-sm text-gray-700">
              Fichier sélectionné : <strong>{file.name}</strong>
            </p>
          )}
        </section>

        <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Documents disponibles</h2>

          {documents.length === 0 && (
            <p className="mt-5 rounded-2xl bg-[#F7F3EA] p-5 text-gray-600">
              Aucun document dans cette catégorie pour le moment.
            </p>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc) => (
              <article
                key={doc.name}
                className="rounded-2xl bg-[#F7F3EA] p-5"
              >
                <div className="text-4xl">📄</div>

                <h3 className="mt-4 break-words text-xl font-bold">
                  {doc.name}
                </h3>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#6B8F71] px-5 py-3 text-sm font-bold text-white"
                  >
                    Ouvrir / télécharger
                  </a>

                  <button
                    onClick={() => supprimerDocument(doc.name)}
                    className="rounded-full bg-red-50 px-5 py-3 text-sm font-bold text-red-500"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}