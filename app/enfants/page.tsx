"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Enfant = {
  id: string;
  nom: string;
  dateNaissance: string;
  joursPresence: string[];
  allergies: string[];
  legumesIntroduits: string[];
  fruitsIntroduits: string[];
};

const joursSemaine = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi"];
const listeLegumes = ["Carotte","Courgette","Poireau","Brocoli","Épinard"];
const listeFruits = ["Pomme","Poire","Banane","Fraise","Kiwi"];

export default function EnfantsPage() {
  const [nom,setNom]=useState("");
  const [dateNaissance,setDateNaissance]=useState("");
  const [joursPresence,setJoursPresence]=useState<string[]>([]);
  const [fenetreDiversification,setFenetreDiversification]=useState<string|null>(null);

  const [enfants,setEnfants]=useState<Enfant[]>([]);

  function toggleJour(jour:string){
    setJoursPresence((prev)=>
      prev.includes(jour)
        ? prev.filter((j)=>j!==jour)
        : [...prev,jour]
    );
  }

  function ajouterEnfant(){
    if(!nom || !dateNaissance) return;

    setEnfants((prev)=>[
      ...prev,
      {
        id: Date.now().toString(),
        nom,
        dateNaissance,
        joursPresence,
        allergies: [],
        legumesIntroduits: [],
        fruitsIntroduuits: [],
      } as any,
    ]);

    setNom("");
    setDateNaissance("");
    setJoursPresence([]);
  }

  function toggleLegume(enfantId:string, legume:string){
    setEnfants((prev)=>
      prev.map((enfant)=>{
        if(enfant.id !== enfantId) return enfant;

        return {
          ...enfant,
          legumesIntroduits: enfant.legumesIntroduits.includes(legume)
            ? enfant.legumesIntroduits.filter((l)=>l!==legume)
            : [...enfant.legumesIntroduits, legume],
        };
      })
    );
  }

  function toggleFruit(enfantId:string, fruit:string){
    setEnfants((prev)=>
      prev.map((enfant)=>{
        if(enfant.id !== enfantId) return enfant;

        return {
          ...enfant,
          fruitsIntroduits: enfant.fruitsIntroduits.includes(fruit)
            ? enfant.fruitsIntroduits.filter((f)=>f!==fruit)
            : [...enfant.fruitsIntroduits, fruit],
        };
      })
    );
  }

  const enfantsMoins12Mois = useMemo(()=>{
    return enfants.length;
  },[enfants]);

  return (
    <main className="min-h-screen bg-[#F8F6F1] p-6">
      <section className="mx-auto max-w-7xl">
        <Link href="/" className="font-bold text-[#6B8F71]">
          ← Retour à l’accueil
        </Link>

        <div className="mt-6 rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-5xl font-black text-[#1F2A1F]">
            Enfants accueillis
          </h1>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            <input
              type="text"
              value={nom}
              onChange={(e)=>setNom(e.target.value)}
              placeholder="Initiale ou prénom"
              className="rounded-2xl border px-5 py-4"
            />

            <input
              type="date"
              value={dateNaissance}
              onChange={(e)=>setDateNaissance(e.target.value)}
              className="rounded-2xl border px-5 py-4"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {joursSemaine.map((jour)=>(
              <button
                key={jour}
                onClick={()=>toggleJour(jour)}
                className="rounded-full bg-[#F4F1E8] px-5 py-3 font-bold"
              >
                {jour}
              </button>
            ))}
          </div>

          <button
            onClick={ajouterEnfant}
            className="mt-8 rounded-full bg-[#6B8F71] px-8 py-4 font-bold text-white"
          >
            Ajouter l’enfant
          </button>
        </section>

        <section className="mt-8 grid gap-6">
          {enfants.map((enfant)=>(
            <article
              key={enfant.id}
              className="rounded-[2rem] bg-white p-8 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black">
                  {enfant.nom}
                </h2>

                <button
                  onClick={()=>setFenetreDiversification(enfant.id)}
                  className="rounded-full bg-[#EEF4EE] px-5 py-2 font-bold text-[#6B8F71]"
                >
                  Diversification
                </button>
              </div>

              {fenetreDiversification === enfant.id && (
                <div className="mt-8 rounded-[2rem] border bg-[#FFFDF8] p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black">
                      Diversification alimentaire
                    </h3>

                    <button
                      onClick={()=>setFenetreDiversification(null)}
                      className="rounded-full bg-[#F4F1E8] px-4 py-2 font-bold"
                    >
                      Fermer
                    </button>
                  </div>

                  <div className="mt-8 grid gap-8 lg:grid-cols-2">
                    <div>
                      <h4 className="text-xl font-bold text-[#6B8F71]">
                        Légumes introduits
                      </h4>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {listeLegumes.map((legume)=>{
                          const actif = enfant.legumesIntroduits.includes(legume);

                          return (
                            <button
                              key={legume}
                              onClick={()=>toggleLegume(enfant.id, legume)}
                              className={`rounded-full px-4 py-2 text-sm font-bold ${
                                actif
                                  ? "bg-[#6B8F71] text-white"
                                  : "bg-[#F4F1E8]"
                              }`}
                            >
                              {legume}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-[#6B8F71]">
                        Fruits introduits
                      </h4>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {listeFruits.map((fruit)=>{
                          const actif = enfant.fruitsIntroduits.includes(fruit);

                          return (
                            <button
                              key={fruit}
                              onClick={()=>toggleFruit(enfant.id, fruit)}
                              className={`rounded-full px-4 py-2 text-sm font-bold ${
                                actif
                                  ? "bg-[#6B8F71] text-white"
                                  : "bg-[#F4F1E8]"
                              }`}
                            >
                              {fruit}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
