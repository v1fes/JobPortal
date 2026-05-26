import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "it" },
      update: {},
      create: { name: "IT та розробка", slug: "it" },
    }),
    prisma.category.upsert({
      where: { slug: "design" },
      update: {},
      create: { name: "Дизайн", slug: "design" },
    }),
    prisma.category.upsert({
      where: { slug: "marketing" },
      update: {},
      create: { name: "Маркетинг", slug: "marketing" },
    }),
    prisma.category.upsert({
      where: { slug: "finance" },
      update: {},
      create: { name: "Фінанси та бухгалтерія", slug: "finance" },
    }),
    prisma.category.upsert({
      where: { slug: "management" },
      update: {},
      create: { name: "Менеджмент", slug: "management" },
    }),
    prisma.category.upsert({
      where: { slug: "sales" },
      update: {},
      create: { name: "Продажі", slug: "sales" },
    }),
    prisma.category.upsert({
      where: { slug: "hr" },
      update: {},
      create: { name: "HR та рекрутинг", slug: "hr" },
    }),
    prisma.category.upsert({
      where: { slug: "education" },
      update: {},
      create: { name: "Освіта та наука", slug: "education" },
    }),
  ]);

  // Create demo employer
  const employerPassword = await hash("employer123", 12);
  const employer = await prisma.user.upsert({
    where: { email: "employer@example.com" },
    update: {},
    create: {
      email: "employer@example.com",
      passwordHash: employerPassword,
      name: "ТОВ «ТехноСофт»",
      role: UserRole.EMPLOYER,
      profile: {
        create: {
          companyName: "ТехноСофт",
          companyDescription:
            "Провідна IT-компанія з розробки програмного забезпечення в Україні. Ми створюємо інноваційні рішення для бізнесу.",
          companyWebsite: "https://technosoft.example.com",
          location: "Київ",
          phone: "+380441234567",
        },
      },
    },
  });

  // Create demo seeker
  const seekerPassword = await hash("seeker123", 12);
  await prisma.user.upsert({
    where: { email: "seeker@example.com" },
    update: {},
    create: {
      email: "seeker@example.com",
      passwordHash: seekerPassword,
      name: "Іван Петренко",
      role: UserRole.SEEKER,
      profile: {
        create: {
          bio: "Full-Stack розробник з 3 роками досвіду",
          phone: "+380501234567",
          location: "Київ",
          skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"],
          experience: "3 роки досвіду у веб-розробці",
          education: "Бакалавр комп'ютерних наук",
        },
      },
    },
  });

  // Create demo jobs
  const jobs = [
    {
      title: "Full-Stack розробник (Next.js)",
      description:
        "Шукаємо досвідченого Full-Stack розробника для роботи над сучасним веб-додатком. Ви будете працювати з Next.js, React, TypeScript та PostgreSQL. Команда використовує Agile-методологію та практики CI/CD.",
      company: "ТехноСофт",
      location: "Київ",
      salary: "50 000 - 80 000 грн",
      salaryMin: 50000,
      salaryMax: 80000,
      type: "FULL_TIME" as const,
      requirements: ["Next.js", "React", "TypeScript", "PostgreSQL", "Git", "3+ роки досвіду"],
      benefits: ["Віддалена робота", "Гнучкий графік", "Медичне страхування", "Корпоративне навчання"],
      categoryId: categories[0].id,
      employerId: employer.id,
    },
    {
      title: "Frontend розробник (React)",
      description:
        "Запрошуємо frontend розробника до нашої команди. Основні задачі — розробка нових UI-компонентів, оптимізація продуктивності та взаємодія з бекенд-командою.",
      company: "ТехноСофт",
      location: "Львів",
      salary: "40 000 - 65 000 грн",
      salaryMin: 40000,
      salaryMax: 65000,
      type: "FULL_TIME" as const,
      requirements: ["React", "JavaScript", "CSS/SCSS", "REST API", "2+ роки досвіду"],
      benefits: ["Віддалена робота", "Бонуси", "Навчання за рахунок компанії"],
      categoryId: categories[0].id,
      employerId: employer.id,
    },
    {
      title: "UI/UX Дизайнер",
      description:
        "Шукаємо креативного UI/UX дизайнера для створення інтуїтивних інтерфейсів веб та мобільних додатків. Потрібен досвід роботи з Figma та розуміння принципів user-centered design.",
      company: "ТехноСофт",
      location: "Дніпро",
      salary: "35 000 - 55 000 грн",
      salaryMin: 35000,
      salaryMax: 55000,
      type: "REMOTE" as const,
      requirements: ["Figma", "Adobe XD", "Прототипування", "User Research", "2+ роки досвіду"],
      benefits: ["100% віддалено", "Гнучкий графік", "Цікаві проєкти"],
      categoryId: categories[1].id,
      employerId: employer.id,
    },
    {
      title: "DevOps інженер",
      description:
        "Потрібен DevOps інженер для налаштування та підтримки CI/CD пайплайнів, контейнеризації додатків та управління хмарною інфраструктурою.",
      company: "ТехноСофт",
      location: "Київ",
      salary: "60 000 - 90 000 грн",
      salaryMin: 60000,
      salaryMax: 90000,
      type: "FULL_TIME" as const,
      requirements: ["Docker", "Kubernetes", "AWS/GCP", "CI/CD", "Linux", "Terraform"],
      benefits: ["Медичне страхування", "Фітнес", "Конференції"],
      categoryId: categories[0].id,
      employerId: employer.id,
    },
    {
      title: "Маркетолог-аналітик",
      description:
        "Шукаємо маркетолога з аналітичним мисленням для аналізу ринку, розробки маркетингових стратегій та оптимізації рекламних кампаній.",
      company: "ТехноСофт",
      location: "Харків",
      salary: "30 000 - 45 000 грн",
      salaryMin: 30000,
      salaryMax: 45000,
      type: "FULL_TIME" as const,
      requirements: ["Google Analytics", "SEO/SEM", "Копірайтинг", "A/B тестування"],
      benefits: ["Бонуси за KPI", "Навчання", "Кар'єрне зростання"],
      categoryId: categories[2].id,
      employerId: employer.id,
    },
    {
      title: "Junior Backend розробник (Node.js)",
      description:
        "Запрошуємо junior розробника до дружньої команди. Менторство від senior-розробників, цікаві задачі та можливість швидкого кар'єрного зростання.",
      company: "ТехноСофт",
      location: "Житомир",
      salary: "20 000 - 35 000 грн",
      salaryMin: 20000,
      salaryMax: 35000,
      type: "FULL_TIME" as const,
      requirements: ["Node.js", "JavaScript", "SQL", "Git", "Базові знання REST API"],
      benefits: ["Менторство", "Навчання", "Гнучкий графік", "Дружня атмосфера"],
      categoryId: categories[0].id,
      employerId: employer.id,
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
