"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";

type Settings = {
  id?: string;
  user_id: string;
  nom_milieu: string;
  telephone: string;
  email: string;
  adresse: string;
  couleur_principale: string;
  logo_url: string;
};

export default function SettingsPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [settingsId, setSettingsId] = useState<string | null>(null);

  const [nomMilieu, setNomMilieu] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [adresse, setAdresse] = useState("");
  const [couleurPrincipale, setCouleurPrincipale] = useState("#6E9271");
  const [logoUrl, setLogoUrl] = useState("");

  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);

  useEffect(() => {
    verifierConnexion();
  }, []);

  async function verifierConnexion() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    setUserId(session.user.id);
    await chargerParametres(session.user.id);
  }

  async function chargerParametres(uid: string) {
    setChargement(true);

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();

    if (error) {
      console.log(error);
      alert("Erreur lors du chargement des paramètres.");
      setChargement(false);
      return;
    }

    if (data) {
      setSettingsId(data.id);
      setNomMilieu(data.nom_milieu || "");
      setTelephone(data.telephone || "");
      setEmail(data.email || "");
      setAdresse(data.adresse || "");
      setCouleurPrincipale(data.couleur_principale || "#6E9271");
      setLogoUrl(data.logo_url || "");
    }

    setChargement(false);
  }

  async function enregistrerParametres() {
    if (!userId) {
      alert("Tu dois être connectée.");
      router.push("/login");
      return;
    }

    if (!nomMilieu.trim()) {
      alert("Indique le nom du milieu d’accueil.");
      return;
    }

    setSauvegarde(true);

    const donnees: Settings = {
      user_id: userId,
      nom_milieu: nomMilieu.trim(),
      telephone: telephone.trim(),
      email: email.trim(),
      adresse: adresse.trim(),
      couleur_principale: couleurPrincipale,
      logo_url: logoUrl.trim(),
    };

    if (settingsId) {
      const { error } = await supabase
        .from("settings")
        .update(donnees)
        .eq("id", settingsId)
        .eq("user_id", userId);

      setSauvegarde(false);

      if (error) {
        console.log(error);
        alert("Erreur lors de la sauvegarde.");
        return;
      }

      alert("Paramètres mis à jour ✅");
      return;
    }

    const { data, error } = await supabase
      .from("settings")
      .insert([donnees])
      .select("*")
      .single();

    setSauvegarde(false);

    if (error) {
      console.log(error);
      alert("Erreur lors de la création des paramètres.");
      return;
    }

    setSettingsId(data.id);
    alert("Paramètres enregistrés ✅");
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-6 py-10 text-[#1E2A1F]">
      <section className="mx-auto max-w-5xl">
        <Link href="/" className="font-bold text-[#6E9271]">
          ← Retour à l’accueil
        </Link>

        <div className="mt-6 rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6E9271]">
            Espace professionnel
          </p>

          <h1 className="mt-4 text-5xl font-black">
            Paramètres du milieu d’accueil
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#4F5A50]">
            Personnalise le nom, les coordonnées et l’identité visuelle de ton
            espace professionnel.
          </p>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          {chargement ? (
            <p className="text-xl text-[#4F5A50]">Chargement...</p>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-lg font-bold">
                  Nom du milieu d’accueil
                </label>

                <input
                  type="text"
                  value={nomMilieu}
                  onChange={(e) => setNomMilieu(e.target.value)}
                  placeholder="Ex : Les Petits Koalas"
                  className="mt-2 w-full rounded-3xl border border-[#E8E1D5] bg-white px-6 py-5 text-xl outline-none focus:border-[#6E9271]"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-lg font-bold">Téléphone</label>

                  <input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="Ex : 04..."
                    className="mt-2 w-full rounded-3xl border border-[#E8E1D5] bg-white px-6 py-5 text-xl outline-none focus:border-[#6E9271]"
                  />
                </div>

                <div>
                  <label className="text-lg font-bold">Email</label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adresse@email.com"
                    className="mt-2 w-full rounded-3xl border border-[#E8E1D5] bg-white px-6 py-5 text-xl outline-none focus:border-[#6E9271]"
                  />
                </div>
              </div>

              <div>
                <label className="text-lg font-bold">Adresse</label>

                <textarea
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="Adresse du milieu d’accueil"
                  rows={3}
                  className="mt-2 w-full rounded-3xl border border-[#E8E1D5] bg-white px-6 py-5 text-xl outline-none focus:border-[#6E9271]"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-lg font-bold">
                    Couleur principale
                  </label>

                  <div className="mt-2 flex items-center gap-4">
                    <input
                      type="color"
                      value={couleurPrincipale}
                      onChange={(e) => setCouleurPrincipale(e.target.value)}
                      className="h-16 w-24 cursor-pointer rounded-2xl border border-[#E8E1D5] bg-white p-2"
                    />

                    <input
                      type="text"
                      value={couleurPrincipale}
                      onChange={(e) => setCouleurPrincipale(e.target.value)}
                      className="flex-1 rounded-3xl border border-[#E8E1D5] bg-white px-6 py-5 text-xl outline-none focus:border-[#6E9271]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-lg font-bold">
                    Logo / image URL
                  </label>

                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Lien du logo plus tard"
                    className="mt-2 w-full rounded-3xl border border-[#E8E1D5] bg-white px-6 py-5 text-xl outline-none focus:border-[#6E9271]"
                  />
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#E8F2EA] p-6">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6E9271]">
                  Aperçu
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white"
                    style={{ backgroundColor: couleurPrincipale }}
                  >
                    {nomMilieu ? nomMilieu.charAt(0).toUpperCase() : "K"}
                  </div>

                  <div>
                    <p className="text-2xl font-black">
                      {nomMilieu || "Nom du milieu d’accueil"}
                    </p>

                    <p className="text-[#4F5A50]">
                      {email || "Email non renseigné"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={enregistrerParametres}
                disabled={sauvegarde}
                className="rounded-full bg-[#6E9271] px-10 py-5 text-2xl font-bold text-white transition hover:scale-[1.02] disabled:opacity-60"
              >
                {sauvegarde ? "Sauvegarde..." : "Enregistrer les paramètres"}
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
