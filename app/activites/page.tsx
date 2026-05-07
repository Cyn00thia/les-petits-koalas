"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Age = "4-12" | "12-18" | "18-36" | "3-6";
type Categorie =
  | "sensoriel"
  | "creatif"
  | "motricite"
  | "musique"
  | "langage"
  | "exterieur";

type Activite = {
  id: string;
  titre: string;
  age: Age;
  categorie: Categorie;
  lieu: "Intérieur" | "Extérieur" | "Les deux";
  duree: string;
  preparation: string;
  materiel: string[];
  objectifs: string[];
  deroulement: string;
  adaptation: string;
  photo?: string;
  perso?: boolean;
};

const activitesBase: Activite[] = [
  {
    id: "a1",
    titre: "Panier de découvertes sensorielles",
    age: "4-12",
    categorie: "sensoriel",
    lieu: "Intérieur",
    duree: "10 à 15 min",
    preparation: "Très simple",
    materiel: ["Tissus doux", "Anneaux", "Objets sécurisés", "Panier"],
    objectifs: ["Explorer", "Toucher", "Observer"],
    deroulement:
      "Installer quelques objets sécurisés dans un panier et laisser l’enfant explorer librement sous surveillance.",
    adaptation:
      "Changer les textures selon l’âge et retirer tout objet trop petit.",
  },
  {
    id: "a2",
    titre: "Peinture propre",
    age: "12-18",
    categorie: "creatif",
    lieu: "Intérieur",
    duree: "10 à 20 min",
    preparation: "Facile",
    materiel: ["Feuille", "Peinture", "Pochette plastique", "Ruban adhésif"],
    objectifs: ["Couleurs", "Manipulation", "Créativité"],
    deroulement:
      "Mettre de la peinture sur une feuille, placer dans une pochette fermée, puis laisser l’enfant étaler avec les mains.",
    adaptation:
      "Fixer la pochette à la table ou au sol pour les plus petits.",
  },
  {
    id: "a3",
    titre: "Transvasement de bouchons",
    age: "18-36",
    categorie: "sensoriel",
    lieu: "Intérieur",
    duree: "15 à 25 min",
    preparation: "Simple",
    materiel: ["Bouchons larges", "Bols", "Cuillères", "Petits pots"],
    objectifs: ["Coordination", "Concentration", "Motricité fine"],
    deroulement:
      "Proposer plusieurs contenants et laisser l’enfant transvaser librement.",
    adaptation:
      "Utiliser uniquement de gros éléments non avalables.",
  },
];

function labelAge(age: Age) {
  if (age === "4-12") return "4–12 mois";
  if (age === "12-18") return "12–18 mois";
  if (age === "18-36") return "18–36 mois";
  return "3–6 ans";
}

function labelCategorie(categorie: Categorie) {
  if (categorie === "sensoriel") return "Sensoriel";
  if (categorie === "creatif") return "Créatif";
  if (categorie === "motricite") return "Motricité";
  if (categorie === "musique") return "Musique";
  if (categorie === "langage") return "Langage";
  return "Extérieur";
}

function emojiCategorie(categorie: Categorie) {
  if (categorie === "sensoriel") return "🖐️";
  if (categorie === "creatif") return "🎨";
  if (categorie === "motricite") return "🤸";
  if (categorie === "musique") return "🎵";
  if (categorie === "langage") return "📚";
  return "🌳";
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ActivitesPage() {
  const [ageFiltre, setAgeFiltre] = useState<Age>("18-36");
  const [categorieFiltre, setCategorieFiltre] =
    useState<Categorie>("sensoriel");

  const [activitesPerso, setActivitesPerso] = useState<Activite[]>([]);

  const [titre, setTitre] = useState("");
  const [age, setAge] = useState<Age>("18-36");
  const [categorie, setCategorie] = useState<Categorie>("sensoriel");
  const [lieu, setLieu] = useState<"Intérieur" | "Extérieur" | "Les deux">(
    "Intérieur"
  );
  const [duree, setDuree] = useState("");
  const [preparation, setPreparation] = useState("");
  const [materiel, setMateriel] = useState("");
  const [objectifs, setObjectifs] = useState("");
  const [deroulement, setDeroulement] = useState("");
  const [adaptation, setAdaptation] = useState("");
  const [photo, setPhoto] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("koalasActivitesPerso");
    if (saved) setActivitesPerso(JSON.parse(saved));
  }, []);

  const activites = [...activitesBase, ...activitesPerso];

  const activitesFiltrees = activites.filter(
    (activite) =>
      activite.age === ageFiltre && activite.categorie === categorieFiltre
  );

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  function ajouterActivite() {
    if (!titre.trim() || !materiel.trim() || !deroulement.trim()) {
      alert("Ajoute au minimum un titre, du matériel et un déroulement 🙂");
      return;
    }

    const nouvelle: Activite = {
      id: Date.now().toString(),
      titre: titre.trim(),
      age,
      categorie,
      lieu,
      duree: duree.trim() || "Durée à adapter",
      preparation: preparation.trim() || "Préparation simple",
      materiel: splitList(materiel),
      objectifs: splitList(objectifs || "Découverte, plaisir, exploration"),
      deroulement: deroulement.trim(),
      adaptation:
        adaptation.trim() ||
        "Adapter selon l’âge, la fatigue et la réceptivité des enfants.",
      photo,
      perso: true,
    };

    const updated = [...activitesPerso, nouvelle];

    setActivitesPerso(updated);
    localStorage.setItem("koalasActivitesPerso", JSON.stringify(updated));

    setTitre("");
    setMateriel("");
    setObjectifs("");
    setDeroulement("");
    setAdaptation("");
    setDuree("");
    setPreparation("");
    setPhoto("");

    alert("Activité ajoutée ✅");
  }

  function supprimerActivite(id: string) {
    const confirmer = confirm("Supprimer cette activité ?");
    if (!confirmer) return;

    const updated = activitesPerso.filter((activite) => activite.id !== id);
    setActivitesPerso(updated);
    localStorage.setItem("koalasActivitesPerso", JSON.stringify(updated));
  }

  return (
    <main className="min-h-screen bg-[#F7F3EA] p-6 text-[#243024] lg:p-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/" className="font-bold text-[#6B8F71]">
          ← Retour à l’accueil
        </Link>

        <div className="mt-6 rounded-[2.5rem] bg-white p-10 shadow-sm">
          <p className="font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
            Idées d’activités
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Activités simples pour les tout-petits
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Des idées adaptées par âge, catégorie, matériel et objectifs pour le
            quotidien en milieu d’accueil.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Rechercher une activité</h2>

            <div className="mt-6">
              <p className="mb-3 font-bold">Tranche d’âge</p>

              <div className="flex flex-wrap gap-3">
                {(["4-12", "12-18", "18-36", "3-6"] as Age[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => setAgeFiltre(item)}
                    className={`rounded-full px-5 py-3 font-bold ${
                      ageFiltre === item
                        ? "bg-[#6B8F71] text-white"
                        : "bg-[#F7F3EA]"
                    }`}
                  >
                    {labelAge(item)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 font-bold">Catégorie</p>

              <div className="flex flex-wrap gap-3">
                {(
                  [
                    "sensoriel",
                    "creatif",
                    "motricite",
                    "musique",
                    "langage",
                    "exterieur",
                  ] as Categorie[]
                ).map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategorieFiltre(item)}
                    className={`rounded-full px-5 py-3 font-bold ${
                      categorieFiltre === item
                        ? "bg-[#6B8F71] text-white"
                        : "bg-[#F7F3EA]"
                    }`}
                  >
                    {emojiCategorie(item)} {labelCategorie(item)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] bg-[#E8F2EA] p-8 shadow-sm">
            <div className="text-6xl">🐨</div>

            <h2 className="mt-5 text-2xl font-bold">Repère pro</h2>

            <p className="mt-3 leading-relaxed text-gray-700">
              Une activité reste une proposition. L’enfant peut observer,
              participer, détourner ou refuser. L’important est l’exploration et
              le plaisir partagé.
            </p>
          </aside>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activitesFiltrees.length === 0 && (
            <div className="rounded-[2rem] bg-white p-8 shadow-sm md:col-span-2 xl:col-span-3">
              <p className="text-lg font-bold">
                Aucune activité pour ce filtre pour le moment.
              </p>
              <p className="mt-2 text-gray-600">
                Tu peux en ajouter une manuellement juste en dessous.
              </p>
            </div>
          )}

          {activitesFiltrees.map((activite) => (
            <article
              key={activite.id}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >
              {activite.photo ? (
                <img
                  src={activite.photo}
                  alt={activite.titre}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-[#E8F2EA] text-6xl">
                  {emojiCategorie(activite.categorie)}
                </div>
              )}

              <div className="p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-[#E8F2EA] px-4 py-2 text-sm font-bold text-[#6B8F71]">
                    {labelAge(activite.age)}
                  </span>

                  <span className="rounded-full bg-[#F7F3EA] px-4 py-2 text-sm font-bold">
                    {emojiCategorie(activite.categorie)}{" "}
                    {labelCategorie(activite.categorie)}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-bold">{activite.titre}</h2>

                <div className="mt-5 grid gap-3 text-sm text-gray-700">
                  <p>
                    <b>Lieu :</b> {activite.lieu}
                  </p>

                  <p>
                    <b>Durée :</b> {activite.duree}
                  </p>

                  <p>
                    <b>Préparation :</b> {activite.preparation}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="font-bold">Matériel</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activite.materiel.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#F7F3EA] px-3 py-2 text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="font-bold">Objectifs</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activite.objectifs.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#E8F2EA] px-3 py-2 text-sm text-[#3F6847]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-700">
                  <p>
                    <b>Déroulement :</b> {activite.deroulement}
                  </p>

                  <p>
                    <b>Adaptation :</b> {activite.adaptation}
                  </p>
                </div>

                {activite.perso && (
                  <button
                    onClick={() => supprimerActivite(activite.id)}
                    className="mt-5 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Ajouter une activité</h2>

          <p className="mt-2 text-gray-600">
            Tes ajouts sont sauvegardés uniquement sur cet appareil.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre de l’activité"
              className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <div className="grid gap-4 md:grid-cols-3">
              <select
                value={age}
                onChange={(e) => setAge(e.target.value as Age)}
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              >
                <option value="4-12">4–12 mois</option>
                <option value="12-18">12–18 mois</option>
                <option value="18-36">18–36 mois</option>
                <option value="3-6">3–6 ans</option>
              </select>

              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value as Categorie)}
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              >
                <option value="sensoriel">Sensoriel</option>
                <option value="creatif">Créatif</option>
                <option value="motricite">Motricité</option>
                <option value="musique">Musique</option>
                <option value="langage">Langage</option>
                <option value="exterieur">Extérieur</option>
              </select>

              <select
                value={lieu}
                onChange={(e) =>
                  setLieu(
                    e.target.value as "Intérieur" | "Extérieur" | "Les deux"
                  )
                }
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              >
                <option>Intérieur</option>
                <option>Extérieur</option>
                <option>Les deux</option>
              </select>
            </div>

            <div className="rounded-2xl border border-dashed border-[#C8D8C7] bg-[#F7F3EA] p-5">
              <p className="mb-3 font-bold">Photo de l’activité</p>

              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="block w-full text-sm"
              />

              {photo && (
                <div className="mt-4">
                  <img
                    src={photo}
                    alt="Aperçu"
                    className="h-56 w-full rounded-2xl object-cover"
                  />

                  <button
                    onClick={() => setPhoto("")}
                    className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-red-500"
                  >
                    Retirer la photo
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
                placeholder="Durée, ex : 10 à 15 min"
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />

              <input
                value={preparation}
                onChange={(e) => setPreparation(e.target.value)}
                placeholder="Préparation, ex : très simple"
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              />
            </div>

            <textarea
              value={materiel}
              onChange={(e) => setMateriel(e.target.value)}
              placeholder="Matériel séparé par des virgules"
              className="min-h-24 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <textarea
              value={objectifs}
              onChange={(e) => setObjectifs(e.target.value)}
              placeholder="Objectifs séparés par des virgules"
              className="min-h-24 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <textarea
              value={deroulement}
              onChange={(e) => setDeroulement(e.target.value)}
              placeholder="Déroulement de l’activité"
              className="min-h-28 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <textarea
              value={adaptation}
              onChange={(e) => setAdaptation(e.target.value)}
              placeholder="Adaptations possibles selon l’âge ou le groupe"
              className="min-h-28 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <button
              onClick={ajouterActivite}
              className="w-fit rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
            >
              Ajouter l’activité
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}