"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    bio: "",
    phone: "",
    location: "",
    skills: "",
    resume: "",
    company: "",
    website: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard/profile");
    }
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setForm({
            bio: data.bio || "",
            phone: data.phone || "",
            location: data.location || "",
            skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
            resume: data.resume || "",
            company: data.company || "",
            website: data.website || "",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Профіль успішно збережено!");
      } else {
        const data = await res.json();
        setMessage(data.error || "Помилка збереження");
      }
    } catch {
      setMessage("Помилка мережі");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Завантаження...</p>
      </div>
    );
  }

  const isEmployer = session?.user?.role === "EMPLOYER";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        ← Назад до кабінету
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Редагувати профіль</h1>

      {message && (
        <div
          className={`mt-4 rounded-md p-3 text-sm ${
            message.includes("успішно")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Про себе
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            className="input-field mt-1"
            placeholder="Розкажіть про себе..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field mt-1"
              placeholder="+380..."
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Місто
            </label>
            <input
              type="text"
              id="location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input-field mt-1"
              placeholder="Київ"
            />
          </div>
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Навички (через кому)
          </label>
          <input
            type="text"
            id="skills"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="input-field mt-1"
            placeholder="React, TypeScript, Node.js"
          />
        </div>

        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
            Посилання на резюме
          </label>
          <input
            type="url"
            id="resume"
            value={form.resume}
            onChange={(e) => setForm({ ...form, resume: e.target.value })}
            className="input-field mt-1"
            placeholder="https://..."
          />
        </div>

        {isEmployer && (
          <>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Назва компанії
              </label>
              <input
                type="text"
                id="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="input-field mt-1"
                placeholder="Назва вашої компанії"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Вебсайт
              </label>
              <input
                type="url"
                id="website"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="input-field mt-1"
                placeholder="https://..."
              />
            </div>
          </>
        )}

        <div className="pt-4">
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? "Збереження..." : "Зберегти профіль"}
          </button>
        </div>
      </form>
    </div>
  );
}
