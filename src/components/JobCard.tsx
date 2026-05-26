import Link from "next/link";
import { getJobTypeLabel, formatRelativeDate, truncateText } from "@/lib/utils";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string | null;
  type: string;
  createdAt: Date | string;
  description: string;
  requirements?: string[];
}

export default function JobCard({
  id,
  title,
  company,
  location,
  salary,
  type,
  createdAt,
  description,
  requirements = [],
}: JobCardProps) {
  return (
    <Link href={`/jobs/${id}`} className="card block group">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-700">{company}</p>
        </div>
        <span className="badge bg-primary-100 text-primary-700 whitespace-nowrap">
          {getJobTypeLabel(type)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
          </svg>
          {location}
        </span>
        {salary && (
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {salary}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatRelativeDate(createdAt)}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        {truncateText(description, 200)}
      </p>

      {requirements.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {requirements.slice(0, 5).map((req) => (
            <span key={req} className="badge bg-gray-100 text-gray-600">
              {req}
            </span>
          ))}
          {requirements.length > 5 && (
            <span className="badge bg-gray-100 text-gray-400">
              +{requirements.length - 5}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
