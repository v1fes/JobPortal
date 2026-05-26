import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latestJobs, categories, stats] = await Promise.all([
    prisma.job.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { category: true },
    }),
    prisma.category.findMany({
      include: { _count: { select: { jobs: { where: { isActive: true } } } } },
      orderBy: { name: "asc" },
    }),
    Promise.all([
      prisma.job.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "EMPLOYER" } }),
      prisma.user.count({ where: { role: "SEEKER" } }),
    ]),
  ]);

  const [totalJobs, totalEmployers, totalSeekers] = stats;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Знайдіть роботу вашої мрії
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
              Тисячі вакансій від найкращих роботодавців України.
              Почніть пошук прямо зараз!
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <SearchBar />
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">{totalJobs}</p>
              <p className="text-sm text-primary-200">Активних вакансій</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalEmployers}</p>
              <p className="text-sm text-primary-200">Роботодавців</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalSeekers}</p>
              <p className="text-sm text-primary-200">Шукачів</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Категорії вакансій</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/jobs?category=${category.slug}`}
              className="card flex items-center justify-between text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              <span>{category.name}</span>
              <span className="badge bg-gray-100 text-gray-500">
                {category._count.jobs}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Нові вакансії</h2>
          <Link href="/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Переглянути всі →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {latestJobs.map((job) => (
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
        {latestJobs.length === 0 && (
          <p className="mt-8 text-center text-gray-500">
            Наразі вакансій немає. Перевірте пізніше!
          </p>
        )}
      </section>
    </>
  );
}
