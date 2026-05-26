"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabase";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function connexion() {
    if (!email || !password) {
      alert("Indique ton email et ton mot de passe.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Connexion impossible : " + error.message);
      return;
    }

    router.push("/enfants");
  }

  async function inscription() {
    if (!email || !password) {
      alert("Indique ton email et ton mot de passe.");
      return;
    }

    if (password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Inscription impossible : " + error.message);
      return;
    }

    alert(
      "Inscription créée. Vérifie ta boîte mail pour confirmer ton compte, puis connecte-toi."
    );

    setMode("connexion");
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] p-6 text-[#243024] lg:p-10">
      <section className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-[2.5rem] bg-white p-10 shadow-sm">
            <Link href="/" className="font-bold text-[#6B8F71]">
              ← Retour à l’accueil
            </Link>

            <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-[#6B8F71]">
              Espace professionnel
            </p>

            <h1 className="mt-4 text-5xl font-black leading-tight text-[#1F2A1F]">
              Connexion pro
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-[#4B5563]">
              Connecte-toi pour gérer les enfants accueillis, les présences,
              les allergies et la diversification alimentaire.
            </p>

            <div className="mt-8 rounded-[2rem] bg-[#E8F2EA] p-6">
              <p className="font-bold text-[#6B8F71]">
                Sécurité en préparation
              </p>

              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Cette page prépare l’espace privé professionnel. L’étape suivante
                sera de protéger les pages sensibles pour que seules les personnes
                connectées puissent y accéder.
              </p>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
            <div className="flex rounded-full bg-[#F4F1E8] p-1">
              <button
                onClick={() => setMode("connexion")}
                className={`flex-1 rounded-full px-4 py-3 font-bold transition ${
                  mode === "connexion"
                    ? "bg-[#6B8F71] text-white"
                    : "text-[#243024]"
                }`}
              >
                Connexion
              </button>

              <button
                onClick={() => setMode("inscription")}
                className={`flex-1 rounded-full px-4 py-3 font-bold transition ${
                  mode === "inscription"
                    ? "bg-[#6B8F71] text-white"
                    : "text-[#243024]"
                }`}
              >
                Inscription
              </button>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <label className="font-bold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adresse@email.com"
                  className="mt-2 w-full rounded-2xl border border-[#D9D4C7] bg-[#FDFCF9] px-5 py-4 outline-none focus:border-[#6B8F71]"
                />
              </div>

              <div>
                <label className="font-bold">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="mt-2 w-full rounded-2xl border border-[#D9D4C7] bg-[#FDFCF9] px-5 py-4 outline-none focus:border-[#6B8F71]"
                />
              </div>

              <button
                onClick={mode === "connexion" ? connexion : inscription}
                disabled={loading}
                className="w-full rounded-full bg-[#6B8F71] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#5A7B60] disabled:opacity-60"
              >
                {loading
                  ? "Chargement..."
                  : mode === "connexion"
                  ? "Se connecter"
                  : "Créer mon compte"}
              </button>

              <p className="text-center text-sm text-gray-500">
                {mode === "connexion"
                  ? "Pas encore de compte ? Clique sur Inscription."
                  : "Après inscription, un email de confirmation peut être envoyé."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
