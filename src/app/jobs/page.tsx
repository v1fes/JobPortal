import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Вакансії",
  description: "Перегляньте актуальні вакансії та знайдіть роботу вашої мрії",
};

interface JobsPageProps {
  searchParams: {
    search?: string;
    location?: string;
    type?: string;
    category?: string;
    page?: string;
  };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: Prisma.JobWhereInput = {
    isActive: true,
  };

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
      { company: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  if (searchParams.location) {
    where.location = { contains: searchParams.location, mode: "insensitive" };
  }

  if (searchParams.type) {
    where.type = searchParams.type as Prisma.EnumJobTypeFilter["equals"];
  }

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  const [jobs, total, categories] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { category: true },
    }),
    prisma.job.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Пошук вакансій</h1>
      <p className="mt-2 text-gray-600">
        Знайдено {total} {total === 1 ? "вакансію" : "вакансій"}
      </p>

      <div className="mt-6">
        <Suspense fallback={<div className="h-12 animate-pulse rounded-lg bg-gray-200" />}>
          <SearchBar
            initialSearch={searchParams.search}
            initialLocation={searchParams.location}
          />
        </Suspense>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Всі типи", value: "" },
            { label: "Повна зайнятість", value: "FULL_TIME" },
            { label: "Часткова", value: "PART_TIME" },
            { label: "Контракт", value: "CONTRACT" },
            { label: "Віддалено", value: "REMOTE" },
            { label: "Стажування", value: "INTERNSHIP" },
          ].map((typeFilter) => {
            const params = new URLSearchParams();
            if (searchParams.search) params.set("search", searchParams.search);
            if (searchParams.location) params.set("location", searchParams.location);
            if (searchParams.category) params.set("category", searchParams.category);
            if (typeFilter.value) params.set("type", typeFilter.value);

            const isActive = (searchParams.type || "") === typeFilter.value;

            return (
              <Link
                key={typeFilter.value}
                href={`/jobs?${params.toString()}`}
                className={`badge transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {typeFilter.label}
              </Link>
            );
          })}
        </div>

        {categories.length > 0 && (
          <select
            className="input-field w-auto"
            defaultValue={searchParams.category || ""}
            onChange={undefined}
          >
            <option value="">Всі категорії</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Job List */}
      <div className="mt-8 grid gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            salary={job.salary}
            type={job.type}
            createdAt={job.createdAt}
            description={job.description}
            requirements={job.requirements}
          />
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-500">
            За вашим запитом вакансій не знайдено
          </p>
          <Link href="/jobs" className="mt-4 inline-block text-primary-600 hover:underline">
            Скинути фільтри
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/jobs?${new URLSearchParams({
                ...searchParams,
                page: String(page - 1),
              }).toString()}`}
              className="btn-secondary text-xs"
            >
              ← Попередня
            </Link>
          )}
          <span className="px-4 text-sm text-gray-600">
            Сторінка {page} з {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/jobs?${new URLSearchParams({
                ...searchParams,
                page: String(page + 1),
              }).toString()}`}
              className="btn-secondary text-xs"
            >
              Наступна →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
