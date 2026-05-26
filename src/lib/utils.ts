export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeDate(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Сьогодні";
  if (diffDays === 1) return "Вчора";
  if (diffDays < 7) return `${diffDays} дн. тому`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} тижн. тому`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} міс. тому`;
  return formatDate(date);
}

export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Не вказано";
  if (min && max) return `${min.toLocaleString("uk-UA")} - ${max.toLocaleString("uk-UA")} грн`;
  if (min) return `від ${min.toLocaleString("uk-UA")} грн`;
  if (max) return `до ${max.toLocaleString("uk-UA")} грн`;
  return "Не вказано";
}

export function getJobTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    FULL_TIME: "Повна зайнятість",
    PART_TIME: "Часткова зайнятість",
    CONTRACT: "Контракт",
    REMOTE: "Віддалено",
    INTERNSHIP: "Стажування",
  };
  return labels[type] ?? type;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "На розгляді",
    REVIEWED: "Переглянуто",
    ACCEPTED: "Прийнято",
    REJECTED: "Відхилено",
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
