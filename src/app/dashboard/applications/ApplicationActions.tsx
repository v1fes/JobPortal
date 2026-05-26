"use client";

import { useState } from "react";

interface ApplicationActionsProps {
  applicationId: string;
  currentStatus: string;
}

export default function ApplicationActions({ applicationId, currentStatus }: ApplicationActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
      }
    } finally {
      setLoading(false);
    }
  }

  if (status === "ACCEPTED" || status === "REJECTED") {
    return null;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatus("REVIEWED")}
        disabled={loading || status === "REVIEWED"}
        className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50"
      >
        Розглянуто
      </button>
      <button
        onClick={() => updateStatus("ACCEPTED")}
        disabled={loading}
        className="rounded bg-green-50 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-100 disabled:opacity-50"
      >
        Прийняти
      </button>
      <button
        onClick={() => updateStatus("REJECTED")}
        disabled={loading}
        className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
      >
        Відхилити
      </button>
    </div>
  );
}
