import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    if (session.user.role !== "SEEKER") {
      return NextResponse.json(
        { success: false, error: "Тільки шукачі можуть подавати заявки" },
        { status: 403 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id, isActive: true },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Вакансію не знайдено або вона неактивна" },
        { status: 404 }
      );
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_seekerId: {
          jobId: params.id,
          seekerId: session.user.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: "Ви вже подали заявку на цю вакансію" },
        { status: 409 }
      );
    }

    const body = await request.json();

    const application = await prisma.application.create({
      data: {
        jobId: params.id,
        seekerId: session.user.id,
        coverLetter: body.coverLetter || null,
        resumeUrl: body.resumeUrl || null,
      },
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Помилка подачі заявки" },
      { status: 500 }
    );
  }
}
