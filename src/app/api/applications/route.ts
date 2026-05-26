import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    if (session.user.role === "SEEKER") {
      const applications = await prisma.application.findMany({
        where: { seekerId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              type: true,
            },
          },
        },
      });
      return NextResponse.json({ success: true, data: applications });
    }

    if (session.user.role === "EMPLOYER") {
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
                select: {
                  phone: true,
                  skills: true,
                  resumeUrl: true,
                },
              },
            },
          },
        },
      });
      return NextResponse.json({ success: true, data: applications });
    }

    return NextResponse.json(
      { success: false, error: "Невідома роль" },
      { status: 403 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Помилка завантаження заявок" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { success: false, error: "Немає доступу" },
        { status: 403 }
      );
    }

    const { applicationId, status } = await request.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: "Вкажіть ID заявки та статус" },
        { status: 400 }
      );
    }

    const validStatuses = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Невірний статус" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: { select: { employerId: true } } },
    });

    if (!application || application.job.employerId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Заявку не знайдено" },
        { status: 404 }
      );
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Помилка оновлення заявки" },
      { status: 500 }
    );
  }
}
