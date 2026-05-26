import {
  cn,
  formatSalary,
  getJobTypeLabel,
  getStatusLabel,
  getStatusColor,
  truncateText,
  formatRelativeDate,
} from "../utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatSalary", () => {
  it("returns range when both min and max provided", () => {
    const result = formatSalary(20000, 40000);
    expect(result).toContain("20");
    expect(result).toContain("40");
    expect(result).toContain("грн");
  });

  it("returns 'від' when only min provided", () => {
    const result = formatSalary(20000, null);
    expect(result).toMatch(/від/);
    expect(result).toContain("грн");
  });

  it("returns 'до' when only max provided", () => {
    const result = formatSalary(null, 40000);
    expect(result).toMatch(/до/);
    expect(result).toContain("грн");
  });

  it("returns 'Не вказано' when nothing provided", () => {
    expect(formatSalary(null, null)).toBe("Не вказано");
    expect(formatSalary()).toBe("Не вказано");
  });
});

describe("getJobTypeLabel", () => {
  it("returns Ukrainian label for known types", () => {
    expect(getJobTypeLabel("FULL_TIME")).toBe("Повна зайнятість");
    expect(getJobTypeLabel("PART_TIME")).toBe("Часткова зайнятість");
    expect(getJobTypeLabel("CONTRACT")).toBe("Контракт");
    expect(getJobTypeLabel("REMOTE")).toBe("Віддалено");
    expect(getJobTypeLabel("INTERNSHIP")).toBe("Стажування");
  });

  it("returns the type itself for unknown types", () => {
    expect(getJobTypeLabel("UNKNOWN")).toBe("UNKNOWN");
  });
});

describe("getStatusLabel", () => {
  it("returns Ukrainian label for known statuses", () => {
    expect(getStatusLabel("PENDING")).toBe("На розгляді");
    expect(getStatusLabel("REVIEWED")).toBe("Переглянуто");
    expect(getStatusLabel("ACCEPTED")).toBe("Прийнято");
    expect(getStatusLabel("REJECTED")).toBe("Відхилено");
  });

  it("returns status itself for unknown statuses", () => {
    expect(getStatusLabel("CUSTOM")).toBe("CUSTOM");
  });
});

describe("getStatusColor", () => {
  it("returns color classes for known statuses", () => {
    expect(getStatusColor("PENDING")).toContain("yellow");
    expect(getStatusColor("REVIEWED")).toContain("blue");
    expect(getStatusColor("ACCEPTED")).toContain("green");
    expect(getStatusColor("REJECTED")).toContain("red");
  });

  it("returns gray for unknown status", () => {
    expect(getStatusColor("UNKNOWN")).toContain("gray");
  });
});

describe("truncateText", () => {
  it("returns text unchanged when shorter than max", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
  });

  it("truncates long text with ellipsis", () => {
    expect(truncateText("Hello World Foo Bar", 10)).toMatch(/\.\.\.$/);
    expect(truncateText("Hello World Foo Bar", 10).length).toBeLessThanOrEqual(14);
  });

  it("handles exact length", () => {
    expect(truncateText("Hello", 5)).toBe("Hello");
  });
});

describe("formatRelativeDate", () => {
  it("returns 'Сьогодні' for today", () => {
    expect(formatRelativeDate(new Date())).toBe("Сьогодні");
  });

  it("returns 'Вчора' for yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatRelativeDate(yesterday)).toBe("Вчора");
  });

  it("returns days ago for recent dates", () => {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    expect(formatRelativeDate(d)).toBe("3 дн. тому");
  });

  it("returns weeks for dates within a month", () => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    expect(formatRelativeDate(d)).toBe("2 тижн. тому");
  });

  it("returns months for dates within a year", () => {
    const d = new Date();
    d.setDate(d.getDate() - 60);
    expect(formatRelativeDate(d)).toBe("2 міс. тому");
  });
});
