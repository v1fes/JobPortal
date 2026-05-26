"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NewJobPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: session?.user?.name || "",
    location: "",
    salary: "",
    salaryMin: "",
    salaryMax: "",
    type: "FULL_TIME",
    requirements: "",
    benefits: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
          salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
          requirements: formData.requirements
            .split("\n")
            .map((r) => r.trim())
            .filter(Boolean),
          benefits: formData.benefits
            .split("\n")
            .map((b) => b.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Помилка створення вакансії");
      }
    } catch {
      setError("Помилка з'єднання");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        ← Назад до кабінету
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">Створити вакансію</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Назва вакансії *
            </label>
            <input
              id="title"
              required
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="input-field mt-1"
              placeholder="Full-Stack розробник"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Компанія *
            </label>
            <input
              id="company"
              required
              value={formData.company}
              onChange={(e) => updateField("company", e.target.value)}
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Місцезнаходження *
            </label>
            <input
              id="location"
              required
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="input-field mt-1"
              placeholder="Київ"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Тип зайнятості
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => updateField("type", e.target.value)}
              className="input-field mt-1"
            >
              <option value="FULL_TIME">Повна зайнятість</option>
              <option value="PART_TIME">Часткова зайнятість</option>
              <option value="CONTRACT">Контракт</option>
              <option value="REMOTE">Віддалено</option>
              <option value="INTERNSHIP">Стажування</option>
            </select>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Зарплата (текст)
            </label>
            <input
              id="salary"
              value={formData.salary}
              onChange={(e) => updateField("salary", e.target.value)}
              className="input-field mt-1"
              placeholder="50 000 - 80 000 грн"
            />
          </div>

          <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700">
              Зарплата від (грн)
            </label>
            <input
              id="salaryMin"
              type="number"
              value={formData.salaryMin}
              onChange={(e) => updateField("salaryMin", e.target.value)}
              className="input-field mt-1"
              placeholder="50000"
            />
          </div>

          <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700">
              Зарплата до (грн)
            </label>
            <input
              id="salaryMax"
              type="number"
              value={formData.salaryMax}
              onChange={(e) => updateField("salaryMax", e.target.value)}
              className="input-field mt-1"
              placeholder="80000"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Опис вакансії *
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="input-field mt-1"
              placeholder="Детальний опис вакансії, обов'язків та умов..."
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
              Вимоги (кожна з нового рядка)
            </label>
            <textarea
              id="requirements"
              rows={4}
              value={formData.requirements}
              onChange={(e) => updateField("requirements", e.target.value)}
              className="input-field mt-1"
              placeholder={"React\nTypeScript\n3+ роки досвіду"}
            />
          </div>

          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
              Переваги (кожна з нового рядка)
            </label>
            <textarea
              id="benefits"
              rows={4}
              value={formData.benefits}
              onChange={(e) => updateField("benefits", e.target.value)}
              className="input-field mt-1"
              placeholder={"Віддалена робота\nГнучкий графік\nМедичне страхування"}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Створення..." : "Створити вакансію"}
          </button>
          <Link href="/dashboard" className="btn-secondary">
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
}
