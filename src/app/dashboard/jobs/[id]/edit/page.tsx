"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salaryMin: number | null;
  salaryMax: number | null;
  description: string;
  requirements: string[];
  benefits: string[];
  isActive: boolean;
}

export default function EditJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "FULL_TIME",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    benefits: "",
    isActive: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      if (session.user.role !== "EMPLOYER") {
        router.push("/dashboard");
        return;
      }
      fetchJob();
    }
  }, [status, session, router, jobId]);

  async function fetchJob() {
    try {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) {
        setError("Вакансію не знайдено");
        return;
      }
      const data: JobData = await res.json();
      setForm({
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type,
        salaryMin: data.salaryMin?.toString() || "",
        salaryMax: data.salaryMax?.toString() || "",
        description: data.description,
        requirements: data.requirements.join("\n"),
        benefits: data.benefits.join("\n"),
        isActive: data.isActive,
      });
    } catch {
      setError("Помилка завантаження");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        type: form.type,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        description: form.description,
        requirements: form.requirements.split("\n").filter(Boolean),
        benefits: form.benefits.split("\n").filter(Boolean),
        isActive: form.isActive,
      };

      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Помилка збереження");
      }
    } catch {
      setError("Помилка мережі");
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

  if (error && !form.title) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">
          Повернутися до кабінету
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        ← Назад до кабінету
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Редагувати вакансію</h1>

      {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Назва вакансії *
          </label>
          <input
            type="text"
            id="title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field mt-1"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Компанія *
            </label>
            <input
              type="text"
              id="company"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Місто *
            </label>
            <input
              type="text"
              id="location"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input-field mt-1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Тип зайнятості
          </label>
          <select
            id="type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="input-field mt-1"
          >
            <option value="FULL_TIME">Повна зайнятість</option>
            <option value="PART_TIME">Часткова зайнятість</option>
            <option value="CONTRACT">Контракт</option>
            <option value="REMOTE">Віддалено</option>
            <option value="INTERNSHIP">Стажування</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700">
              Мін. зарплата (грн)
            </label>
            <input
              type="number"
              id="salaryMin"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700">
              Макс. зарплата (грн)
            </label>
            <input
              type="number"
              id="salaryMax"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              className="input-field mt-1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Опис *
          </label>
          <textarea
            id="description"
            required
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
            Вимоги (кожна з нового рядка)
          </label>
          <textarea
            id="requirements"
            rows={4}
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
            Переваги (кожна з нового рядка)
          </label>
          <textarea
            id="benefits"
            rows={3}
            value={form.benefits}
            onChange={(e) => setForm({ ...form, benefits: e.target.value })}
            className="input-field mt-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Вакансія активна
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
            {saving ? "Збереження..." : "Зберегти зміни"}
          </button>
          <Link href="/dashboard" className="btn-secondary flex-1 text-center">
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
}
