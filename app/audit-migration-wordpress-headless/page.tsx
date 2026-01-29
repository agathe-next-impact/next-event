import React, { useState } from "react";

export default function AuditMigrationWordpressHeadless() {
  const [form, setForm] = useState({
    nom: "",
    entreprise: "",
    email: "",
    telephone: "",
    url: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Ici, vous pouvez ajouter l'envoi à une API ou un traitement supplémentaire
  };

  return (
    <main className="container mx-auto py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Demande d'audit migration WordPress Headless</h1>
      {submitted ? (
        <div className="p-4 bg-green-100 text-green-800 rounded">Merci pour votre demande, nous vous contacterons rapidement.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded shadow">
          <div>
            <label htmlFor="nom" className="block font-medium mb-1">Nom Prénom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="entreprise" className="block font-medium mb-1">Entreprise / Organisation</label>
            <input
              type="text"
              id="entreprise"
              name="entreprise"
              value={form.entreprise}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="telephone" className="block font-medium mb-1">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="url" className="block font-medium mb-1">Url du site actuel</label>
            <input
              type="url"
              id="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Envoyer la demande</button>
        </form>
      )}
    </main>
  );
}
