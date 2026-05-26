import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Особистий кабінет",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const isEmployer = session.user.role === "EMPLOYER";

  if (isEmployer) {
    const [jobs, applications] = await Promise.all([
      prisma.job.findMany({
        where: { employerId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { applications: true } } },
      }),
      prisma.application.count({
        where: { job: { employerId: session.user.id } },
      }),
    ]);

    const activeJobs = jobs.filter((j) => j.isActive).length;

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Кабінет роботодавця
            </h1>
            <p className="mt-1 text-gray-600">Вітаємо, {session.user.name}!</p>
          </div>
          <Link href="/dashboard/jobs/new" className="btn-primary">
            + Нова вакансія
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="card">
            <p className="text-sm text-gray-500">Всього вакансій</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{jobs.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Активних вакансій</p>
            <p className="mt-1 text-3xl font-bold text-green-600">{activeJobs}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Отримано заявок</p>
            <p className="mt-1 text-3xl font-bold text-primary-600">{applications}</p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Мої вакансії</h2>
          <div className="mt-4 space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="card flex items-center justify-between">
                <div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-medium text-gray-900 hover:text-primary-600"
                  >
                    {job.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    <span>{job.location}</span>
                    <span>{job._count.applications} заявок</span>
                    <span
                      className={`badge ${
                        job.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.isActive ? "Активна" : "Неактивна"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/jobs/${job.id}/edit`}
                    className="btn-secondary text-xs"
                  >
                    Редагувати
                  </Link>
                  <Link
                    href={`/dashboard/applications?jobId=${job.id}`}
                    className="btn-secondary text-xs"
                  >
                    Заявки
                  </Link>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                У вас ще немає вакансій.{" "}
                <Link href="/dashboard/jobs/new" className="text-primary-600 hover:underline">
                  Створити першу вакансію
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/dashboard/applications" className="card block hover:border-primary-300">
            <h3 className="font-semibold text-gray-900">📋 Переглянути заявки</h3>
            <p className="mt-1 text-sm text-gray-500">Перегляд та управління заявками кандидатів</p>
          </Link>
          <Link href="/dashboard/profile" className="card block hover:border-primary-300">
            <h3 className="font-semibold text-gray-900">⚙️ Профіль компанії</h3>
            <p className="mt-1 text-sm text-gray-500">Редагувати інформацію про компанію</p>
          </Link>
        </div>
      </div>
    );
  }

  // Seeker Dashboard
  const [applications, savedJobs] = await Promise.all([
    prisma.application.findMany({
      where: { seekerId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        job: { select: { id: true, title: true, company: true, location: true } },
      },
    }),
    prisma.savedJob.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Особистий кабінет</h1>
        <p className="mt-1 text-gray-600">Вітаємо, {session.user.name}!</p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-gray-500">Подано заявок</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{applications.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Збережені вакансії</p>
          <p className="mt-1 text-3xl font-bold text-primary-600">{savedJobs}</p>
        </div>
        <Link href="/jobs" className="card block hover:border-primary-300">
          <p className="text-sm text-gray-500">Шукати вакансії</p>
          <p className="mt-2 text-sm font-medium text-primary-600">Перейти до пошуку →</p>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Мої заявки</h2>
          <Link
            href="/dashboard/applications"
            className="text-sm text-primary-600 hover:underline"
          >
            Всі заявки →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="card flex items-center justify-between">
              <div>
                <Link
                  href={`/jobs/${app.job.id}`}
                  className="font-medium text-gray-900 hover:text-primary-600"
                >
                  {app.job.title}
                </Link>
                <p className="mt-1 text-sm text-gray-500">
                  {app.job.company} — {app.job.location}
                </p>
              </div>
              <span
                className={`badge ${
                  app.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : app.status === "ACCEPTED"
                    ? "bg-green-100 text-green-700"
                    : app.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {app.status === "PENDING"
                  ? "На розгляді"
                  : app.status === "ACCEPTED"
                  ? "Прийнято"
                  : app.status === "REJECTED"
                  ? "Відхилено"
                  : "Переглянуто"}
              </span>
            </div>
          ))}
          {applications.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Ви ще не подавали заявок.{" "}
              <Link href="/jobs" className="text-primary-600 hover:underline">
                Переглянути вакансії
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/applications" className="card block hover:border-primary-300">
          <h3 className="font-semibold text-gray-900">📋 Мої заявки</h3>
          <p className="mt-1 text-sm text-gray-500">Перегляд статусу всіх поданих заявок</p>
        </Link>
        <Link href="/dashboard/profile" className="card block hover:border-primary-300">
          <h3 className="font-semibold text-gray-900">👤 Мій профіль</h3>
          <p className="mt-1 text-sm text-gray-500">Редагувати резюме та особисту інформацію</p>
        </Link>
      </div>
    </div>
  );
}
