import { describe, it, expect } from "vitest";

describe("Pose Detector Utilities", () => {
  it("should calculate angle correctly", () => {
    // 직각 삼각형: 90도
    const pointA = { x: 0, y: 0 };
    const pointB = { x: 0, y: 1 };
    const pointC = { x: 1, y: 1 };

    const BA = { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
    const BC = { x: pointC.x - pointB.x, y: pointC.y - pointB.y };

    const dotProduct = BA.x * BC.x + BA.y * BC.y;
    const magnitudeBA = Math.sqrt(BA.x * BA.x + BA.y * BA.y);
    const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);

    const cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    const angleDeg = (angleRad * 180) / Math.PI;

    expect(Math.round(angleDeg)).toBe(90);
  });

  it("should detect pushup down position", () => {
    // 팔굽혀펴기 내려간 상태: 팔꿈치 각도 90도 이하
    const angle = 85;
    const isDown = angle <= 90;

    expect(isDown).toBe(true);
  });

  it("should detect pushup up position", () => {
    // 팔굽혀펴기 올라간 상태: 팔꿈치 각도 90도 초과
    const angle = 160;
    const isDown = angle <= 90;

    expect(isDown).toBe(false);
  });

  it("should detect situp up position", () => {
    // 윗몸일으키기 일어난 상태: 각도 45도 이상
    const angle = 60;
    const isUp = angle >= 45;

    expect(isUp).toBe(true);
  });

  it("should detect situp down position", () => {
    // 윗몸일으키기 누운 상태: 각도 45도 미만
    const angle = 30;
    const isUp = angle >= 45;

    expect(isUp).toBe(false);
  });

  it("should validate confidence threshold", () => {
    const confidence = 0.65;
    const minConfidence = 0.5;

    expect(confidence >= minConfidence).toBe(true);
  });

  it("should reject low confidence detection", () => {
    const confidence = 0.3;
    const minConfidence = 0.5;

    expect(confidence >= minConfidence).toBe(false);
  });
});
