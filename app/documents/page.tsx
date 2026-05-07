"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Categorie =
  | "parents"
  | "organisation"
  | "repas"
  | "activites"
  | "securite"
  | "administratif";

type DocumentUtile = {
  id: string;
  titre: string;
  categorie: Categorie;
  description: string;
  contenu: string;
  perso?: boolean;
};

const documentsBase: DocumentUtile[] = [
  {
    id: "d1",
    titre: "Affichage menu de la semaine",
    categorie: "repas",
    description: "Support simple pour présenter les repas aux parents.",
    contenu:
      "Menu de la semaine\n\nLundi :\nMardi :\nMercredi :\nJeudi :\nVendredi :\n\nBoisson proposée : eau.",
  },
  {
    id: "d2",
    titre: "Liste matériel activité",
    categorie: "activites",
    description: "Petit modèle pour préparer une activité.",
    contenu:
      "Nom de l’activité :\nÂge conseillé :\nMatériel :\nPréparation :\nDéroulement :\nAdaptations possibles :",
  },
  {
    id: "d3",
    titre: "Message d’information aux parents",
    categorie: "parents",
    description: "Modèle court pour transmettre une information.",
    contenu:
      "Chers parents,\n\nPetite information concernant la journée / l’organisation :\n\n...\n\nMerci pour votre compréhension.",
  },
  {
    id: "d4",
    titre: "Check-list sortie extérieure",
    categorie: "organisation",
    description: "Aide-mémoire avant une sortie ou un temps dehors.",
    contenu:
      "Avant de sortir :\n- Vérifier la météo\n- Préparer les vêtements adaptés\n- Prévoir eau / mouchoirs / trousse si nécessaire\n- Vérifier la sécurité de l’espace\n- Adapter la durée selon le groupe",
  },
  {
    id: "d5",
    titre: "Rappel sécurité petites pièces",
    categorie: "securite",
    description: "Mémo pour vérifier le matériel proposé.",
    contenu:
      "Avant une activité :\n- Retirer les petits éléments non adaptés\n- Vérifier l’état du matériel\n- Adapter selon l’âge\n- Rester en surveillance active\n- Ne jamais laisser un jeune enfant seul avec du petit matériel",
  },
];

function labelCategorie(categorie: Categorie) {
  if (categorie === "parents") return "Parents";
  if (categorie === "organisation") return "Organisation";
  if (categorie === "repas") return "Repas";
  if (categorie === "activites") return "Activités";
  if (categorie === "securite") return "Sécurité";
  return "Administratif";
}

function emojiCategorie(categorie: Categorie) {
  if (categorie === "parents") return "👨‍👩‍👧";
  if (categorie === "organisation") return "🗓️";
  if (categorie === "repas") return "🍽️";
  if (categorie === "activites") return "🎨";
  if (categorie === "securite") return "🛡️";
  return "📄";
}

export default function DocumentsPage() {
  const [categorieFiltre, setCategorieFiltre] = useState<Categorie>("parents");
  const [documentsPerso, setDocumentsPerso] = useState<DocumentUtile[]>([]);
  const [documentOuvert, setDocumentOuvert] = useState<DocumentUtile | null>(null);

  const [titre, setTitre] = useState("");
  const [categorie, setCategorie] = useState<Categorie>("parents");
  const [description, setDescription] = useState("");
  const [contenu, setContenu] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("koalasDocumentsPerso");
    if (saved) setDocumentsPerso(JSON.parse(saved));
  }, []);

  const documents = [...documentsBase, ...documentsPerso];

  const documentsFiltres = documents.filter(
    (document) => document.categorie === categorieFiltre
  );

  function ajouterDocument() {
    if (!titre.trim() || !contenu.trim()) {
      alert("Ajoute au minimum un titre et un contenu 🙂");
      return;
    }

    const nouveau: DocumentUtile = {
      id: Date.now().toString(),
      titre: titre.trim(),
      categorie,
      description: description.trim() || "Document personnalisé",
      contenu: contenu.trim(),
      perso: true,
    };

    const updated = [...documentsPerso, nouveau];
    setDocumentsPerso(updated);
    localStorage.setItem("koalasDocumentsPerso", JSON.stringify(updated));

    setTitre("");
    setDescription("");
    setContenu("");

    alert("Document ajouté ✅");
  }

  function supprimerDocument(id: string) {
    const confirmer = confirm("Supprimer ce document ?");
    if (!confirmer) return;

    const updated = documentsPerso.filter((document) => document.id !== id);
    setDocumentsPerso(updated);
    localStorage.setItem("koalasDocumentsPerso", JSON.stringify(updated));

    if (documentOuvert?.id === id) {
      setDocumentOuvert(null);
    }
  }

  function copierDocument(document: DocumentUtile) {
    navigator.clipboard.writeText(document.contenu);
    alert("Contenu copié ✅");
  }

  function imprimerDocument(document: DocumentUtile) {
    const fenetre = window.open("", "_blank");
    if (!fenetre) return;

    fenetre.document.write(`
      <html>
        <head>
          <title>${document.titre}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
              color: #243024;
            }
            h1 {
              color: #4f7a58;
            }
            pre {
              white-space: pre-wrap;
              font-family: Arial, sans-serif;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <h1>${document.titre}</h1>
          <pre>${document.contenu}</pre>
        </body>
      </html>
    `);

    fenetre.document.close();
    fenetre.print();
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
            Supports pratiques et imprimables
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Modèles, mémos, affichages et supports pour faciliter l’organisation
            quotidienne en milieu d’accueil.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Rechercher un document</h2>

            <div className="mt-6">
              <p className="mb-3 font-bold">Catégorie</p>

              <div className="flex flex-wrap gap-3">
                {(
                  [
                    "parents",
                    "organisation",
                    "repas",
                    "activites",
                    "securite",
                    "administratif",
                  ] as Categorie[]
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategorieFiltre(cat);
                      setDocumentOuvert(null);
                    }}
                    className={`rounded-full px-5 py-3 font-bold ${
                      categorieFiltre === cat
                        ? "bg-[#6B8F71] text-white"
                        : "bg-[#F7F3EA]"
                    }`}
                  >
                    {emojiCategorie(cat)} {labelCategorie(cat)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] bg-[#E8F2EA] p-8 shadow-sm">
            <div className="text-6xl">🐨</div>

            <h2 className="mt-5 text-2xl font-bold">Utilisation</h2>

            <p className="mt-3 leading-relaxed text-gray-700">
              Ces documents peuvent servir de base. Ils sont à adapter selon ton
              organisation, ton service, les parents et les besoins du groupe.
            </p>
          </aside>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="grid gap-4">
            {documentsFiltres.length === 0 && (
              <div className="rounded-[2rem] bg-white p-7 shadow-sm">
                <p className="font-bold">Aucun document dans cette catégorie.</p>
                <p className="mt-2 text-gray-600">
                  Tu peux en ajouter un manuellement.
                </p>
              </div>
            )}

            {documentsFiltres.map((document) => (
              <button
                key={document.id}
                onClick={() => setDocumentOuvert(document)}
                className={`rounded-[2rem] p-6 text-left shadow-sm transition ${
                  documentOuvert?.id === document.id
                    ? "bg-[#6B8F71] text-white"
                    : "bg-white hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                <p className="text-3xl">{emojiCategorie(document.categorie)}</p>

                <h2 className="mt-3 text-2xl font-bold">{document.titre}</h2>

                <p className="mt-2 text-sm opacity-80">
                  {document.description}
                </p>

                {document.perso && (
                  <p className="mt-3 text-sm font-bold">Document ajouté</p>
                )}
              </button>
            ))}
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            {!documentOuvert ? (
              <div>
                <p className="text-5xl">📄</p>
                <h2 className="mt-5 text-3xl font-bold">
                  Sélectionne un document
                </h2>
                <p className="mt-3 text-gray-600">
                  Clique sur un document à gauche pour l’ouvrir, le copier ou
                  l’imprimer.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-bold uppercase tracking-wide text-[#6B8F71]">
                      {emojiCategorie(documentOuvert.categorie)}{" "}
                      {labelCategorie(documentOuvert.categorie)}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                      {documentOuvert.titre}
                    </h2>
                  </div>

                  {documentOuvert.perso && (
                    <button
                      onClick={() => supprimerDocument(documentOuvert.id)}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                <pre className="mt-6 whitespace-pre-wrap rounded-3xl bg-[#F7F3EA] p-6 text-sm leading-relaxed">
                  {documentOuvert.contenu}
                </pre>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => copierDocument(documentOuvert)}
                    className="rounded-full bg-[#6B8F71] px-6 py-3 font-bold text-white"
                  >
                    Copier
                  </button>

                  <button
                    onClick={() => imprimerDocument(documentOuvert)}
                    className="rounded-full bg-[#F7F3EA] px-6 py-3 font-bold text-[#6B8F71]"
                  >
                    Imprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Ajouter un document</h2>

          <p className="mt-2 text-gray-600">
            Tes documents personnalisés sont sauvegardés uniquement sur cet
            appareil.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre du document"
              className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value as Categorie)}
              className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            >
              <option value="parents">Parents</option>
              <option value="organisation">Organisation</option>
              <option value="repas">Repas</option>
              <option value="activites">Activités</option>
              <option value="securite">Sécurité</option>
              <option value="administratif">Administratif</option>
            </select>

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courte description"
              className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Contenu du document"
              className="min-h-56 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <button
              onClick={ajouterDocument}
              className="w-fit rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
            >
              Ajouter le document
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}