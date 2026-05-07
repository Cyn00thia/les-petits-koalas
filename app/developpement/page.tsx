"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Age = "4-12" | "12-18" | "18-36" | "3-6";
type Domaine =
  | "motricite"
  | "langage"
  | "autonomie"
  | "emotions"
  | "sommeil"
  | "alimentation";

type Repere = {
  id: string;
  age: Age;
  domaine: Domaine;
  titre: string;
  observations: string[];
  accompagnement: string[];
  vigilance: string;
  perso?: boolean;
};

const reperesBase: Repere[] = [
  {
    id: "r1",
    age: "4-12",
    domaine: "motricite",
    titre: "Découverte du corps et mouvements au sol",
    observations: [
      "Explore ses mains, ses pieds et les objets proches.",
      "Commence à se retourner, ramper ou se déplacer selon son rythme.",
    ],
    accompagnement: [
      "Proposer du temps au sol sur un tapis confortable.",
      "Laisser l’enfant bouger librement.",
    ],
    vigilance:
      "Chaque enfant évolue à son rythme. En cas d’inquiétude persistante, orienter vers les parents et/ou un professionnel de santé.",
  },
  {
    id: "r2",
    age: "12-18",
    domaine: "autonomie",
    titre: "Premières envies de faire seul",
    observations: [
      "Essaie de manger seul.",
      "Participe à l’habillage.",
      "Montre ce qu’il veut ou refuse plus clairement.",
    ],
    accompagnement: [
      "Laisser du temps pour essayer.",
      "Proposer des choix simples.",
      "Encourager sans faire à la place trop vite.",
    ],
    vigilance:
      "L’autonomie se construit progressivement. Les refus font partie du développement.",
  },
  {
    id: "r3",
    age: "18-36",
    domaine: "emotions",
    titre: "Grandes émotions et besoin de sécurité",
    observations: [
      "Exprime fortement la frustration.",
      "Peut crier, pleurer ou refuser.",
      "Cherche l’adulte pour être rassuré.",
    ],
    accompagnement: [
      "Mettre des mots simples sur l’émotion.",
      "Rester calme et sécurisant.",
      "Proposer un cadre clair.",
    ],
    vigilance:
      "L’enfant ne fait pas exprès de mal gérer. Son cerveau émotionnel est encore immature.",
  },
  {
    id: "r4",
    age: "18-36",
    domaine: "langage",
    titre: "Explosion du vocabulaire",
    observations: [
      "Comprend de plus en plus de consignes simples.",
      "Associe deux mots ou commence de petites phrases.",
      "Répète des mots entendus dans la journée.",
    ],
    accompagnement: [
      "Lire des imagiers et histoires courtes.",
      "Reformuler sans corriger brutalement.",
      "Chanter, nommer et commenter les actions.",
    ],
    vigilance:
      "Observer l’évolution globale plutôt qu’un âge strict.",
  },
  {
    id: "r5",
    age: "3-6",
    domaine: "motricite",
    titre: "Coordination et jeux moteurs",
    observations: [
      "Court, saute, grimpe, lance ou attrape avec plus de précision.",
      "Aime les parcours et jeux d’équilibre.",
      "Développe la motricité fine.",
    ],
    accompagnement: [
      "Proposer des parcours simples et sécurisés.",
      "Varier motricité globale et motricité fine.",
      "Valoriser l’essai plus que le résultat.",
    ],
    vigilance:
      "Adapter les propositions à la fatigue, au tempérament et à la sécurité du groupe.",
  },
];

function labelAge(age: Age) {
  if (age === "4-12") return "4–12 mois";
  if (age === "12-18") return "12–18 mois";
  if (age === "18-36") return "18–36 mois";
  return "3–6 ans";
}

function labelDomaine(domaine: Domaine) {
  if (domaine === "motricite") return "Motricité";
  if (domaine === "langage") return "Langage";
  if (domaine === "autonomie") return "Autonomie";
  if (domaine === "emotions") return "Émotions";
  if (domaine === "sommeil") return "Sommeil";
  return "Alimentation";
}

function emojiDomaine(domaine: Domaine) {
  if (domaine === "motricite") return "🤸";
  if (domaine === "langage") return "📚";
  if (domaine === "autonomie") return "🧸";
  if (domaine === "emotions") return "💛";
  if (domaine === "sommeil") return "🌙";
  return "🍽️";
}

function splitList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function DeveloppementPage() {
  const [ageFiltre, setAgeFiltre] = useState<Age>("18-36");
  const [domaineFiltre, setDomaineFiltre] = useState<Domaine>("emotions");
  const [reperesPerso, setReperesPerso] = useState<Repere[]>([]);

  const [titre, setTitre] = useState("");
  const [age, setAge] = useState<Age>("18-36");
  const [domaine, setDomaine] = useState<Domaine>("emotions");
  const [observations, setObservations] = useState("");
  const [accompagnement, setAccompagnement] = useState("");
  const [vigilance, setVigilance] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("koalasDeveloppementPerso");
    if (saved) setReperesPerso(JSON.parse(saved));
  }, []);

  const reperes = [...reperesBase, ...reperesPerso];

  const reperesFiltres = reperes.filter(
    (repere) => repere.age === ageFiltre && repere.domaine === domaineFiltre
  );

  function ajouterRepere() {
    if (!titre.trim() || !observations.trim() || !accompagnement.trim()) {
      alert("Ajoute au minimum un titre, des observations et un accompagnement 🙂");
      return;
    }

    const nouveau: Repere = {
      id: Date.now().toString(),
      age,
      domaine,
      titre: titre.trim(),
      observations: splitList(observations),
      accompagnement: splitList(accompagnement),
      vigilance:
        vigilance.trim() ||
        "À adapter selon l’enfant. En cas d’inquiétude, échanger avec les parents et/ou un professionnel.",
      perso: true,
    };

    const updated = [...reperesPerso, nouveau];
    setReperesPerso(updated);
    localStorage.setItem("koalasDeveloppementPerso", JSON.stringify(updated));

    setTitre("");
    setObservations("");
    setAccompagnement("");
    setVigilance("");

    alert("Contenu ajouté ✅");
  }

  function supprimerRepere(id: string) {
    const confirmer = confirm("Supprimer ce contenu ?");
    if (!confirmer) return;

    const updated = reperesPerso.filter((repere) => repere.id !== id);
    setReperesPerso(updated);
    localStorage.setItem("koalasDeveloppementPerso", JSON.stringify(updated));
  }

  return (
    <main className="min-h-screen bg-[#F7F3EA] p-6 text-[#243024] lg:p-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/" className="font-bold text-[#6B8F71]">
          ← Retour à l’accueil
        </Link>

        <div className="mt-6 rounded-[2.5rem] bg-white p-10 shadow-sm">
          <p className="font-bold uppercase tracking-[0.2em] text-[#6B8F71]">
            Développement de l’enfant
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Repères pour accompagner les tout-petits
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Des repères simples pour observer, comprendre et accompagner les
            enfants au quotidien, sans remplacer l’avis d’un professionnel.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Chercher un repère</h2>

            <div className="mt-6">
              <p className="mb-3 font-bold">Tranche d’âge</p>

              <div className="flex flex-wrap gap-3">
                {(["4-12", "12-18", "18-36", "3-6"] as Age[]).map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeFiltre(age)}
                    className={`rounded-full px-5 py-3 font-bold ${
                      ageFiltre === age
                        ? "bg-[#6B8F71] text-white"
                        : "bg-[#F7F3EA]"
                    }`}
                  >
                    {labelAge(age)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 font-bold">Domaine</p>

              <div className="flex flex-wrap gap-3">
                {(
                  [
                    "motricite",
                    "langage",
                    "autonomie",
                    "emotions",
                    "sommeil",
                    "alimentation",
                  ] as Domaine[]
                ).map((domaine) => (
                  <button
                    key={domaine}
                    onClick={() => setDomaineFiltre(domaine)}
                    className={`rounded-full px-5 py-3 font-bold ${
                      domaineFiltre === domaine
                        ? "bg-[#6B8F71] text-white"
                        : "bg-[#F7F3EA]"
                    }`}
                  >
                    {emojiDomaine(domaine)} {labelDomaine(domaine)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] bg-[#E8F2EA] p-8 shadow-sm">
            <div className="text-6xl">🐨</div>

            <h2 className="mt-5 text-2xl font-bold">Repère important</h2>

            <p className="mt-3 leading-relaxed text-gray-700">
              Ces informations servent à observer et accompagner. Elles ne
              remplacent jamais l’avis des parents, d’un médecin ou d’un autre
              professionnel.
            </p>
          </aside>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {reperesFiltres.length === 0 && (
            <div className="rounded-[2rem] bg-white p-8 shadow-sm md:col-span-2">
              <p className="text-lg font-bold">
                Aucun repère pour ce filtre pour le moment.
              </p>
              <p className="mt-2 text-gray-600">
                Tu peux en ajouter un manuellement juste en dessous.
              </p>
            </div>
          )}

          {reperesFiltres.map((repere) => (
            <article
              key={repere.id}
              className="rounded-[2rem] bg-white p-7 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#E8F2EA] px-4 py-2 text-sm font-bold text-[#6B8F71]">
                  {labelAge(repere.age)}
                </span>

                <span className="rounded-full bg-[#F7F3EA] px-4 py-2 text-sm font-bold">
                  {emojiDomaine(repere.domaine)} {labelDomaine(repere.domaine)}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold">{repere.titre}</h2>

              <div className="mt-6 rounded-2xl bg-[#F7F3EA] p-5">
                <p className="font-bold">Ce qu’on peut observer</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {repere.observations.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-2xl bg-[#E8F2EA] p-5">
                <p className="font-bold">Comment accompagner</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {repere.accompagnement.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-2xl bg-[#FFF8E7] p-5">
                <p className="font-bold">Vigilance</p>
                <p className="mt-3 text-sm text-gray-700">{repere.vigilance}</p>
              </div>

              {repere.perso && (
                <button
                  onClick={() => supprimerRepere(repere.id)}
                  className="mt-5 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
                >
                  Supprimer
                </button>
              )}
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Ajouter un contenu</h2>

          <p className="mt-2 text-gray-600">
            Tes ajouts sont sauvegardés uniquement sur cet appareil.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre du repère"
              className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <div className="grid gap-4 md:grid-cols-2">
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
                value={domaine}
                onChange={(e) => setDomaine(e.target.value as Domaine)}
                className="rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
              >
                <option value="motricite">Motricité</option>
                <option value="langage">Langage</option>
                <option value="autonomie">Autonomie</option>
                <option value="emotions">Émotions</option>
                <option value="sommeil">Sommeil</option>
                <option value="alimentation">Alimentation</option>
              </select>
            </div>

            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder={"Observations possibles\nUne ligne par observation"}
              className="min-h-28 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <textarea
              value={accompagnement}
              onChange={(e) => setAccompagnement(e.target.value)}
              placeholder={"Comment accompagner\nUne ligne par idée"}
              className="min-h-28 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <textarea
              value={vigilance}
              onChange={(e) => setVigilance(e.target.value)}
              placeholder="Point de vigilance"
              className="min-h-24 rounded-2xl border border-[#E8E0D5] bg-white p-4 outline-none focus:border-[#6B8F71]"
            />

            <button
              onClick={ajouterRepere}
              className="w-fit rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
            >
              Ajouter le contenu
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}