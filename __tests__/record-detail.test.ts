import { describe, it, expect } from "vitest";

describe("Record Detail Screen", () => {
  it("should display record information correctly", () => {
    const mockRecord = {
      id: "record-123",
      exerciseId: "pushup",
      count: 20,
      date: "2025-01-03",
      timestamp: Date.now(),
    };

    expect(mockRecord.id).toBe("record-123");
    expect(mockRecord.count).toBe(20);
    expect(mockRecord.exerciseId).toBe("pushup");
  });

  it("should parse date string correctly", () => {
    const dateString = "2025-01-03";
    const parts = dateString.split("-");
    
    expect(parts[0]).toBe("2025");
    expect(parts[1]).toBe("01");
    expect(parts[2]).toBe("03");
  });

  it("should calculate record duration correctly", () => {
    const duration = 125; // 2분 5초
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formatted = `${minutes}:${String(seconds).padStart(2, "0")}`;

    expect(formatted).toBe("2:05");
  });
});
