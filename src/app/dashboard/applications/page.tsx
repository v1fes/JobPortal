import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import type { Metadata } from "next";
import ApplicationActions from "./ApplicationActions";

export const metadata: Metadata = {
  title: "Заявки",
};

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/applications");
  }

  const isEmployer = session.user.role === "EMPLOYER";

  if (isEmployer) {
    const applications = await prisma.application.findMany({
      where: { job: { employerId: session.user.id } },
      orderBy: { createdAt: "desc" },
      include: {
        job: { select: { id: true, title: true } },
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: { phone: true, skills: true, location: true },
            },
          },
        },
      },
    });

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
        >
          ← Назад до кабінету
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Заявки кандидатів</h1>
        <p className="mt-1 text-gray-600">Всього: {applications.length}</p>

        <div className="mt-6 space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">{app.seeker.name}</h3>
                  <p className="text-sm text-gray-500">{app.seeker.email}</p>
                  {app.seeker.profile?.phone && (
                    <p className="text-sm text-gray-500">{app.seeker.profile.phone}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-400">
                    Вакансія:{" "}
                    <Link href={`/jobs/${app.job.id}`} className="text-primary-600 hover:underline">
                      {app.job.title}
                    </Link>
                  </p>
                  {app.seeker.profile?.skills && app.seeker.profile.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {app.seeker.profile.skills.map((skill) => (
                        <span key={skill} className="badge bg-gray-100 text-gray-600 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {app.coverLetter && (
                    <p className="mt-2 text-sm text-gray-600">{app.coverLetter}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">{formatDate(app.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`badge ${getStatusColor(app.status)}`}>
                    {getStatusLabel(app.status)}
                  </span>
                  <ApplicationActions applicationId={app.id} currentStatus={app.status} />
                </div>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <p className="py-8 text-center text-gray-500">Заявок поки немає</p>
          )}
        </div>
      </div>
    );
  }

  // Seeker view
  const applications = await prisma.application.findMany({
    where: { seekerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: { id: true, title: true, company: true, location: true, type: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        ← Назад до кабінету
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Мої заявки</h1>
      <p className="mt-1 text-gray-600">Всього: {applications.length}</p>

      <div className="mt-6 space-y-4">
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
              <p className="mt-1 text-xs text-gray-400">{formatDate(app.createdAt)}</p>
            </div>
            <span className={`badge ${getStatusColor(app.status)}`}>
              {getStatusLabel(app.status)}
            </span>
          </div>
        ))}
        {applications.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            Ви ще не подавали заявок.{" "}
            <Link href="/jobs" className="text-primary-600 hover:underline">
              Переглянути вакансії
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
