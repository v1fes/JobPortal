import {
  signUpSchema,
  signInSchema,
  jobSchema,
} from "../validations";

describe("signUpSchema", () => {
  it("validates correct input", () => {
    const valid = {
      name: "Тест Юзер",
      email: "test@example.com",
      password: "password123",
      role: "SEEKER" as const,
    };
    expect(signUpSchema.parse(valid)).toEqual(valid);
  });

  it("rejects short name", () => {
    expect(() =>
      signUpSchema.parse({
        name: "A",
        email: "test@example.com",
        password: "password123",
        role: "SEEKER",
      })
    ).toThrow();
  });

  it("rejects invalid email", () => {
    expect(() =>
      signUpSchema.parse({
        name: "Тест",
        email: "invalid",
        password: "password123",
        role: "SEEKER",
      })
    ).toThrow();
  });

  it("rejects short password", () => {
    expect(() =>
      signUpSchema.parse({
        name: "Тест",
        email: "test@example.com",
        password: "12345",
        role: "SEEKER",
      })
    ).toThrow();
  });

  it("rejects invalid role", () => {
    expect(() =>
      signUpSchema.parse({
        name: "Тест",
        email: "test@example.com",
        password: "password123",
        role: "INVALID",
      })
    ).toThrow();
  });

  it("accepts EMPLOYER role", () => {
    const result = signUpSchema.parse({
      name: "Тест",
      email: "test@example.com",
      password: "password123",
      role: "EMPLOYER",
    });
    expect(result.role).toBe("EMPLOYER");
  });
});

describe("signInSchema", () => {
  it("validates correct input", () => {
    const valid = { email: "test@example.com", password: "pass" };
    expect(signInSchema.parse(valid)).toEqual(valid);
  });

  it("rejects invalid email", () => {
    expect(() =>
      signInSchema.parse({ email: "bad", password: "pass" })
    ).toThrow();
  });

  it("rejects empty password", () => {
    expect(() =>
      signInSchema.parse({ email: "test@example.com", password: "" })
    ).toThrow();
  });
});

describe("jobSchema", () => {
  const validJob = {
    title: "Frontend Developer",
    description: "A detailed description of the job posting with enough characters",
    company: "TechCorp",
    location: "Київ",
    type: "FULL_TIME" as const,
  };

  it("validates correct input", () => {
    const result = jobSchema.parse(validJob);
    expect(result.title).toBe("Frontend Developer");
    expect(result.requirements).toEqual([]);
    expect(result.benefits).toEqual([]);
  });

  it("rejects short title", () => {
    expect(() =>
      jobSchema.parse({ ...validJob, title: "AB" })
    ).toThrow();
  });

  it("rejects short description", () => {
    expect(() =>
      jobSchema.parse({ ...validJob, description: "Short" })
    ).toThrow();
  });

  it("accepts optional salary fields", () => {
    const result = jobSchema.parse({
      ...validJob,
      salaryMin: 20000,
      salaryMax: 40000,
    });
    expect(result.salaryMin).toBe(20000);
    expect(result.salaryMax).toBe(40000);
  });

  it("accepts requirements and benefits", () => {
    const result = jobSchema.parse({
      ...validJob,
      requirements: ["React", "TypeScript"],
      benefits: ["Remote"],
    });
    expect(result.requirements).toHaveLength(2);
    expect(result.benefits).toHaveLength(1);
  });

  it("rejects invalid type", () => {
    expect(() =>
      jobSchema.parse({ ...validJob, type: "INVALID" })
    ).toThrow();
  });
});
