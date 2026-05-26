import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getJobTypeLabel, formatDate, formatSalary } from "@/lib/utils";
import type { Metadata } from "next";
import ApplyButton from "./ApplyButton";

interface JobPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    select: { title: true, company: true, location: true },
  });

  if (!job) return { title: "Вакансію не знайдено" };

  return {
    title: `${job.title} — ${job.company}`,
    description: `Вакансія ${job.title} у компанії ${job.company}, ${job.location}`,
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      employer: {
        include: {
          profile: true,
        },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!job) notFound();

  // Increment views
  await prisma.job.update({
    where: { id: params.id },
    data: { views: { increment: 1 } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Назад до вакансій
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="mt-1 text-lg font-medium text-gray-700">{job.company}</p>
              </div>
              <span className="badge bg-primary-100 text-primary-700">
                {getJobTypeLabel(job.type)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                </svg>
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {formatDate(job.createdAt)}
              </span>
              {job.category && (
                <Link
                  href={`/jobs?category=${job.category.slug}`}
                  className="badge bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {job.category.name}
                </Link>
              )}
            </div>

            <hr className="my-6" />

            <div className="prose prose-gray max-w-none">
              <h2 className="text-lg font-semibold text-gray-900">Опис вакансії</h2>
              <div className="mt-3 whitespace-pre-wrap text-gray-700 leading-relaxed">
                {job.description}
              </div>
            </div>

            {job.requirements.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">Вимоги</h2>
                <ul className="mt-3 space-y-2">
                  {job.requirements.map((req) => (
                    <li key={req} className="flex items-center gap-2 text-gray-700">
                      <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">Переваги</h2>
                <ul className="mt-3 space-y-2">
                  {job.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-gray-700">
                      <svg className="h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900">Подати заявку</h3>
            <p className="mt-2 text-sm text-gray-500">
              {job._count.applications} заявок подано
            </p>
            <div className="mt-4">
              <ApplyButton jobId={job.id} />
            </div>
          </div>

          {job.employer.profile && (
            <div className="card">
              <h3 className="font-semibold text-gray-900">Про компанію</h3>
              <p className="mt-2 text-sm font-medium text-gray-700">
                {job.employer.profile.companyName || job.company}
              </p>
              {job.employer.profile.companyDescription && (
                <p className="mt-2 text-sm text-gray-500">
                  {job.employer.profile.companyDescription}
                </p>
              )}
              {job.employer.profile.companyWebsite && (
                <a
                  href={job.employer.profile.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-primary-600 hover:underline"
                >
                  Вебсайт компанії →
                </a>
              )}
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold text-gray-900">Статистика</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-500">
              <p>Переглядів: {job.views}</p>
              <p>Опубліковано: {formatDate(job.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
