"use client";

import { useEffect, useMemo, useState } from "react";

type Participant = {
  name: string;
  exclusions?: string; // noms séparés par des virgules
};

type Assignment = { giver: string; receiver: string };

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function Noel() {
  // Secret Santa
  const [participants, setParticipants] = useState<Participant[]>(
    () => loadLocal<Participant[]>("noel_participants", [{ name: "Alice" }, { name: "Bob" }, { name: "Charly" }])
  );
  const [budget, setBudget] = useState<string>(() => loadLocal<string>("noel_budget", "20€"));
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadLocal<Assignment[]>("noel_assignments", []));
  const [tries, setTries] = useState(0);
  const [errorSanta, setErrorSanta] = useState<string | null>(null);

  useEffect(() => saveLocal("noel_participants", participants), [participants]);
  useEffect(() => saveLocal("noel_budget", budget), [budget]);
  useEffect(() => saveLocal("noel_assignments", assignments), [assignments]);

  const names = useMemo(() => participants.map((p) => p.name.trim()).filter(Boolean), [participants]);
  const exclusionsMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    participants.forEach((p) => {
      const list = (p.exclusions || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      map.set(p.name.trim(), new Set(list));
    });
    return map;
  }, [participants]);

  function isValidPair(giver: string, receiver: string): boolean {
    if (giver === receiver) return false;
    const ex = exclusionsMap.get(giver);
    if (ex && ex.has(receiver)) return false;
    return true;
  }

  function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function drawSanta() {
    setErrorSanta(null);
    if (names.length < 2) {
      setErrorSanta("Ajoutez au moins 2 participants.");
      return;
    }
    // Essais limités pour trouver une permutation valide
    for (let attempt = 0; attempt < 2000; attempt++) {
      const receivers = shuffle(names);
      let ok = true;
      for (let i = 0; i < names.length; i++) {
        if (!isValidPair(names[i], receivers[i])) {
          ok = false;
          break;
        }
      }
      if (ok) {
        const result = names.map((giver, i) => ({ giver, receiver: receivers[i] }));
        setAssignments(result);
        setTries(attempt + 1);
        return;
      }
    }
    setErrorSanta("Impossible de trouver un tirage valide avec les exclusions. Essayez d’adapter la liste.");
  }

  async function copyPairs() {
    const text = assignments.map((a) => `${a.giver} → ${a.receiver}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Tirage copié !");
    } catch {
      alert("Copie impossible. Sélectionnez le texte manuellement.");
    }
  }

  // Repas
  type MenuItem = { name: string; qty?: string };
  type Menu = { label: string; items: MenuItem[] };
  const [menus, setMenus] = useState<Menu[]>(
    () =>
      loadLocal<Menu[]>("noel_menus", [
        { label: "Apéro", items: [{ name: "Toasts", qty: "30" }, { name: "Champagne", qty: "2 bouteilles" }] },
        { label: "Entrée", items: [{ name: "Foie gras", qty: "300g" }, { name: "Pain d’épices", qty: "1" }] },
        { label: "Plat", items: [{ name: "Dinde", qty: "1" }, { name: "Gratin dauphinois", qty: "1 plat" }] },
        { label: "Dessert", items: [{ name: "Bûche", qty: "1" }] },
      ])
  );
  useEffect(() => saveLocal("noel_menus", menus), [menus]);

  const shoppingList = useMemo(() => {
    const list = new Map<string, string>();
    menus.forEach((m) =>
      m.items.forEach((it) => {
        const key = it.name.trim();
        if (!key) return;
        const prev = list.get(key);
        const next = it.qty ? (prev ? `${prev} + ${it.qty}` : it.qty) : prev || "";
        list.set(key, next);
      })
    );
    return Array.from(list.entries());
  }, [menus]);

  return (
    <div className="container">
      <header className="header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="neon-text title">Noël – Organisation</h1>
          <p className="subtitle">Secret Santa, repas et liste de courses</p>
        </div>
      </header>

      <main className="glass panel" style={{ padding: 24, display: "grid", gap: 24 }}>
        {/* Secret Santa */}
        <section className="glass" style={{ padding: 16 }}>
          <h2 className="neon-text" style={{ marginTop: 0 }}>Secret Santa</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <label className="label" style={{ minWidth: 120 }}>Budget</label>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Ex: 20€"
                style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "#fff" }}
              />
            </div>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Participants</div>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {participants.map((p, i) => (
                  <div key={i} className="tile glass" style={{ padding: 12, display: "grid", gap: 8 }}>
                    <input
                      value={p.name}
                      onChange={(e) => {
                        const v = e.target.value;
                        setParticipants((arr) => arr.map((x, idx) => (idx === i ? { ...x, name: v } : x)));
                      }}
                      placeholder="Nom"
                      style={{ padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "#fff" }}
                    />
                    <input
                      value={p.exclusions || ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setParticipants((arr) => arr.map((x, idx) => (idx === i ? { ...x, exclusions: v } : x)));
                      }}
                      placeholder="Exclusions (noms, séparés par virgules)"
                      style={{ padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "#fff" }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        className="btn-neon"
                        onClick={() => setParticipants((arr) => arr.filter((_, idx) => idx !== i))}
                        title="Supprimer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="tile glass"
                  onClick={() => setParticipants((arr) => [...arr, { name: "" }])}
                  style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 96 }}
                  title="Ajouter un participant"
                >
                  + Ajouter
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button className="btn-neon" onClick={drawSanta}>Tirer au sort</button>
              <button className="btn-neon" onClick={() => setAssignments([])}>Effacer le tirage</button>
              <div className="label" style={{ marginLeft: "auto" }}>
                {tries > 0 ? `Essais: ${tries}` : null} {budget ? `· Budget: ${budget}` : null}
              </div>
            </div>
            {errorSanta && <div style={{ color: "#ff8080" }}>{errorSanta}</div>}
            {assignments.length > 0 && (
              <div className="glass" style={{ padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 className="neon-text" style={{ margin: 0 }}>Tirage</h3>
                  <button className="btn-neon" onClick={copyPairs}>Copier</button>
                </div>
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
                  {assignments.map((a, i) => (
                    <div key={i} className="tile glass" style={{ padding: 12, display: "flex", justifyContent: "space-between" }}>
                      <span>{a.giver}</span>
                      <span className="neon-text">→ {a.receiver}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Repas & courses */}
        <section className="glass" style={{ padding: 16 }}>
          <h2 className="neon-text" style={{ marginTop: 0 }}>Repas & Courses</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <div className="tile glass" style={{ padding: 12 }}>
              <h3 className="neon-text" style={{ marginTop: 0 }}>Menu</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {menus.map((m, mi) => (
                  <div key={mi} className="glass" style={{ padding: 12 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        value={m.label}
                        onChange={(e) => setMenus((arr) => arr.map((x, idx) => (idx === mi ? { ...x, label: e.target.value } : x)))}
                        placeholder="Section (Apéro, Entrée, Plat, Dessert…) "
                        style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "#fff" }}
                      />
                      <button className="btn-neon" onClick={() => setMenus((arr) => arr.filter((_, idx) => idx !== mi))}>Supprimer</button>
                    </div>
                    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                      {m.items.map((it, ii) => (
                        <div key={ii} className="tile glass" style={{ padding: 8, display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr auto" }}>
                          <input
                            value={it.name}
                            onChange={(e) =>
                              setMenus((arr) =>
                                arr.map((x, idx) =>
                                  idx === mi
                                    ? { ...x, items: x.items.map((y, jj) => (jj === ii ? { ...y, name: e.target.value } : y)) }
                                    : x
                                )
                              )
                            }
                            placeholder="Élément (ex: Dinde)"
                            style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "#fff" }}
                          />
                          <input
                            value={it.qty || ""}
                            onChange={(e) =>
                              setMenus((arr) =>
                                arr.map((x, idx) =>
                                  idx === mi
                                    ? { ...x, items: x.items.map((y, jj) => (jj === ii ? { ...y, qty: e.target.value } : y)) }
                                    : x
                                )
                              )
                            }
                            placeholder="Quantité (ex: 1 plat)"
                            style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "#fff" }}
                          />
                          <button
                            className="btn-neon"
                            onClick={() =>
                              setMenus((arr) =>
                                arr.map((x, idx) => (idx === mi ? { ...x, items: x.items.filter((_, jj) => jj !== ii) } : x))
                              )
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                      <button
                        className="btn-neon"
                        onClick={() =>
                          setMenus((arr) => arr.map((x, idx) => (idx === mi ? { ...x, items: [...x.items, { name: "", qty: "" }] } : x)))
                        }
                      >
                        + Ajouter un élément
                      </button>
                    </div>
                  </div>
                ))}
                <button className="btn-neon" onClick={() => setMenus((arr) => [...arr, { label: "Nouvelle section", items: [] }])}>+ Ajouter une section</button>
              </div>
            </div>

            <div className="tile glass" style={{ padding: 12 }}>
              <h3 className="neon-text" style={{ marginTop: 0 }}>Liste de courses</h3>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
                {shoppingList.map(([name, qty], i) => (
                  <div key={i} className="tile glass" style={{ padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{name}</span>
                    <span className="label">{qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


