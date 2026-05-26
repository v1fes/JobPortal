import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jobSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const type = searchParams.get("type") || "";
    const category = searchParams.get("category") || "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = { isActive: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }
    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }
    if (type) {
      where.type = type as Prisma.EnumJobTypeFilter["equals"];
    }
    if (category) {
      where.category = { slug: category };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { category: true, employer: { select: { name: true } } },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Помилка завантаження вакансій" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    if (session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { success: false, error: "Тільки роботодавці можуть створювати вакансії" },
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

    const job = await prisma.job.create({
      data: {
        ...validated.data,
        employerId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Помилка створення вакансії" },
      { status: 500 }
    );
  }
}
