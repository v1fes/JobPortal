import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jobSchema } from "@/lib/validations";

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        employer: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                companyName: true,
                companyDescription: true,
                companyWebsite: true,
                companyLogo: true,
              },
            },
          },
        },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Вакансію не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch {
    return NextResponse.json(
      { success: false, error: "Помилка завантаження вакансії" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      select: { employerId: true },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Вакансію не знайдено" },
        { status: 404 }
      );
    }

    if (job.employerId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Немає доступу до цієї вакансії" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = jobSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: validated.data,
    });

    return NextResponse.json({ success: true, data: updatedJob });
  } catch {
    return NextResponse.json(
      { success: false, error: "Помилка оновлення вакансії" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      select: { employerId: true },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Вакансію не знайдено" },
        { status: 404 }
      );
    }

    if (job.employerId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Немає доступу до цієї вакансії" },
        { status: 403 }
      );
    }

    await prisma.job.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Помилка видалення вакансії" },
      { status: 500 }
    );
  }
}
