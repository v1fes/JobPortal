"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (status === "loading") {
    return <div className="h-10 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => router.push("/auth/signin")}
        className="btn-primary w-full"
      >
        Увійдіть, щоб подати заявку
      </button>
    );
  }

  if (session.user.role === "EMPLOYER") {
    return (
      <p className="text-sm text-gray-500">
        Роботодавці не можуть подавати заявки
      </p>
    );
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Заявку успішно подано!" });
        setShowForm(false);
      } else {
        setMessage({ type: "error", text: data.error || "Помилка при подачі заявки" });
      }
    } catch {
      setMessage({ type: "error", text: "Помилка з'єднання" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message && (
        <div
          className={`mb-3 rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full">
          Подати заявку
        </button>
      ) : (
        <form onSubmit={handleApply} className="space-y-3">
          <textarea
            placeholder="Супровідний лист (необов'язково)"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={4}
            className="input-field"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Відправка..." : "Відправити"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Скасувати
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
