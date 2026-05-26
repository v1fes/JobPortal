import React from "react";
import { render, screen } from "@testing-library/react";
import JobCard from "../JobCard";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const defaultProps = {
  id: "1",
  title: "Frontend Developer",
  company: "TechCorp",
  location: "Київ",
  type: "FULL_TIME",
  createdAt: new Date().toISOString(),
  description: "A great job opportunity for frontend developers.",
};

describe("JobCard", () => {
  it("renders job title", () => {
    render(<JobCard {...defaultProps} />);
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("renders company name", () => {
    render(<JobCard {...defaultProps} />);
    expect(screen.getByText("TechCorp")).toBeInTheDocument();
  });

  it("renders location", () => {
    render(<JobCard {...defaultProps} />);
    expect(screen.getByText("Київ")).toBeInTheDocument();
  });

  it("renders job type label in Ukrainian", () => {
    render(<JobCard {...defaultProps} />);
    expect(screen.getByText("Повна зайнятість")).toBeInTheDocument();
  });

  it("renders salary when provided", () => {
    render(<JobCard {...defaultProps} salary="20 000 - 40 000 грн" />);
    expect(screen.getByText("20 000 - 40 000 грн")).toBeInTheDocument();
  });

  it("does not render salary when not provided", () => {
    render(<JobCard {...defaultProps} />);
    expect(screen.queryByText(/грн/)).not.toBeInTheDocument();
  });

  it("renders requirement tags", () => {
    render(
      <JobCard {...defaultProps} requirements={["React", "TypeScript", "CSS"]} />
    );
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
  });

  it("limits displayed requirements to 5", () => {
    const reqs = ["React", "TS", "CSS", "Node", "SQL", "Docker", "AWS"];
    render(<JobCard {...defaultProps} requirements={reqs} />);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders description truncated", () => {
    const longDesc = "A".repeat(300);
    render(<JobCard {...defaultProps} description={longDesc} />);
    const desc = screen.getByText(/\.\.\.$/);
    expect(desc).toBeInTheDocument();
  });

  it("links to job detail page", () => {
    render(<JobCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/jobs/1");
  });
});
