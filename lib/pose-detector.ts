import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

let detector: poseDetection.PoseDetector | null = null;

/**
 * 포즈 감지 모델 초기화
 */
export async function initializePoseDetector() {
  try {
    await tf.ready();
    
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    
    return detector;
  } catch (error) {
    console.error("포즈 감지 모델 초기화 실패:", error);
    throw error;
  }
}

/**
 * 이미지에서 포즈 감지
 */
export async function detectPose(
  imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
) {
  if (!detector) {
    throw new Error("포즈 감지 모델이 초기화되지 않았습니다.");
  }

  try {
    const poses = await detector.estimatePoses(imageElement);
    return poses;
  } catch (error) {
    console.error("포즈 감지 실패:", error);
    throw error;
  }
}

/**
 * 팔굽혀펴기 카운팅 로직
 * 어깨, 팔꿈치, 손목의 각도를 기반으로 운동 상태 판단
 */
export function analyzePushup(pose: poseDetection.Pose): {
  isDown: boolean;
  angle: number;
  confidence: number;
} {
  const keypoints = pose.keypoints;

  // 필요한 키포인트 찾기
  const leftShoulder = keypoints.find((k) => k.name === "left_shoulder");
  const leftElbow = keypoints.find((k) => k.name === "left_elbow");
  const leftWrist = keypoints.find((k) => k.name === "left_wrist");

  if (!leftShoulder || !leftElbow || !leftWrist) {
    return { isDown: false, angle: 0, confidence: 0 };
  }

  // 신뢰도 확인
  const minConfidence = 0.5;
  if (
    leftShoulder.score! < minConfidence ||
    leftElbow.score! < minConfidence ||
    leftWrist.score! < minConfidence
  ) {
    return { isDown: false, angle: 0, confidence: 0 };
  }

  // 팔꿈치 각도 계산
  const angle = calculateAngle(
    {
      x: leftShoulder.x!,
      y: leftShoulder.y!,
    },
    {
      x: leftElbow.x!,
      y: leftElbow.y!,
    },
    {
      x: leftWrist.x!,
      y: leftWrist.y!,
    }
  );

  // 팔꿈치 각도가 90도 이하면 내려간 상태
  const isDown = angle <= 90;
  const confidence = Math.min(
    leftShoulder.score!,
    leftElbow.score!,
    leftWrist.score!
  );

  return { isDown, angle, confidence };
}

/**
 * 윗몸일으키기 카운팅 로직
 * 머리, 목, 엉덩이의 각도를 기반으로 운동 상태 판단
 */
export function analyzeSitup(pose: poseDetection.Pose): {
  isUp: boolean;
  angle: number;
  confidence: number;
} {
  const keypoints = pose.keypoints;

  // 필요한 키포인트 찾기
  const nose = keypoints.find((k) => k.name === "nose");
  const leftHip = keypoints.find((k) => k.name === "left_hip");
  const leftKnee = keypoints.find((k) => k.name === "left_knee");

  if (!nose || !leftHip || !leftKnee) {
    return { isUp: false, angle: 0, confidence: 0 };
  }

  // 신뢰도 확인
  const minConfidence = 0.5;
  if (
    nose.score! < minConfidence ||
    leftHip.score! < minConfidence ||
    leftKnee.score! < minConfidence
  ) {
    return { isUp: false, angle: 0, confidence: 0 };
  }

  // 몸통 각도 계산
  const angle = calculateAngle(
    {
      x: leftHip.x!,
      y: leftHip.y!,
    },
    {
      x: nose.x!,
      y: nose.y!,
    },
    {
      x: leftKnee.x!,
      y: leftKnee.y!,
    }
  );

  // 각도가 45도 이상이면 일어난 상태
  const isUp = angle >= 45;
  const confidence = Math.min(nose.score!, leftHip.score!, leftKnee.score!);

  return { isUp, angle, confidence };
}

/**
 * 3개의 포인트로 각도 계산
 */
function calculateAngle(
  pointA: { x: number; y: number },
  pointB: { x: number; y: number },
  pointC: { x: number; y: number }
): number {
  // 벡터 BA와 BC 계산
  const BA = {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y,
  };

  const BC = {
    x: pointC.x - pointB.x,
    y: pointC.y - pointB.y,
  };

  // 내적 계산
  const dotProduct = BA.x * BC.x + BA.y * BC.y;

  // 벡터 크기 계산
  const magnitudeBA = Math.sqrt(BA.x * BA.x + BA.y * BA.y);
  const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);

  // 각도 계산 (라디안)
  const cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));

  // 도 단위로 변환
  const angleDeg = (angleRad * 180) / Math.PI;

  return Math.round(angleDeg);
}

/**
 * 포즈 감지기 정리
 */
export function disposePoseDetector() {
  if (detector) {
    detector.dispose();
    detector = null;
  }
}
