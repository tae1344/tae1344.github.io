---
title: "[서울대 KDT] 불륜 확률 예측 시각화 웹 프로젝트"
summary: "시각화 웹개발 수업에서 진행한 팀 프로젝트이며, 사설 탐정이 불륜 사건을 의뢰 받는다는 컨셉의 머신러닝 데이터 시각화 프로젝트"
description: "불륜 확률을 추정하고, 이를 게이지·캐릭터 반응·비교 화면으로 직관적으로 보여주는 엔터테인먼트형 데이터 시각화 서비스"
date: 2026-02-01 09:00:00 +0900
status: "Completed"
type: "팀 프로젝트 (SNU KDT 과정)"
role: "팀원 | 데이터 모델링 및 웹 배포 담당"
team: "6명"
duration: "2025-08-05 ~ 2025-08-18 (2주)"
categories: [Project, AI, ML]
tags: [불륜예측, 시각화, 고양이탐정]
metrics:
  - label: 소속명
    value: SNU KDT 11기
  - label: 데이터
    value: RAY FAIR의 논문에서 수집된 설문 기반 자료 - 6,365개 행 / 9개 열
  - label: 사용 모델
    value: Logistic Regression, Random Forest
image:
  path: /images/snu-kdt-project/affair-project-thumbnail.png
  alt: 불륜예측 프로젝트 표지
deployedUrl: https://snu-bigdata-fintech-2025.vercel.app
features:
  - "브라우저 ONNX Runtime 추론 + 규칙 기반 폴백으로 서비스 안정성 확보"
  - "게이지/비교/요인 설명 UI로 예측값의 해석 가능성 강화"
  - "입력값 검증 및 경고 처리로 비정상 입력 대응"
achievements:
  - "모델 추론 실패 시에도 사용자 플로우가 끊기지 않는 예외 처리 구조 구현"
  - "수익 기반 임계값 탐색 방식을 적용해 비즈니스 관점의 의사결정 시도"
pinned: true
mermaid: true
---

## 1. 개요
#### 1. 프로젝트 목적
- 시각화 웹개발 수업에서 진행한 팀 프로젝트이며, 사설 탐정이 불륜 사건을 의뢰 받는다는 컨셉으로 진행함
- 통계/ML 결과를 숫자만 보여주는 대신, 사용자가 체감 가능한 인터랙션(게이지 + 캐릭터 애니메이션)으로 전달
- 민감한 주제를 “오락용 콘텐츠”로 안전하게 다루면서 데이터 기반 UX를 실험

#### 2. 타겟 사용자
- 불륜 증거 수집 사설 탐정 업체
- 부부 상담 플랫폼 및 클리닉 (상담 우선순위 결정용)
- 관계 건강 정책을 설계하는 연구 및 공공기관

---

## 2. 아키텍처
```bash
Client (Next.js)
  ├─ Input Form / State (Zustand)
  ├─ ONNX Runtime Web Inference
  ├─ Fallback Rule-based Scoring
  └─ Visualization (Gauge/Factors/Compare)
        ↓
Next.js API Route (sample affairs data)
```

### 사용 기술 및 선택 이유
- **ONNX Runtime Web**: 브라우저 환경에서 모델 추론을 수행해 데모/배포 환경에서 재현성을 확보
- **Fallback Rule-based Scoring**: ONNX 추론 실패 시에도 사용자가 결과를 확인할 수 있도록 서비스 가용성 보장

---

## 3. 기술적 도전 & 해결 과정
1. **문제 상황**
- **ONNX 모델** 출력 포맷(label/probabilities) 파싱이 환경/모델 구조에 따라 불안정
- ML 결과만으로는 사용자에게 **근거 전달**이 부족

2. **원인 분석**
- 브라우저 추론 시 **텐서 구조와 출력 키가 고정적이지 않음**
- 예측 정확도와 UX 설명성은 별개 문제

3. **해결 방법**
- 예측 결과 파싱 로직을 방어적으로 작성하고, 실패 시 규칙 기반 확률 계산으로 폴백
- 위험 요인/권장사항을 별도 레이어로 제공해 설명 가능성 확보
- 입력값 범위 검증/경고를 추가해 비정상 입력에 대한 안정성 강화

4. **결과**
- 모델 실패 상황에서도 사용자 플로우가 끊기지 않음
- 결과 해석 가능성이 개선되어 데모/포트폴리오 전달력이 높아짐

---

## 4. 모델링 과정
- **재현율(Recall) 중심의 최적화**: 정확도(Accuracy)보다 실제 외도 사례를 최대한 놓치지 않는 방향으로 모델을 설계함
- **수익 기반 임계값(Threshold) 설정**: 단순한 0.5 기준이 아니라, **TP(수익)와 FP/FN(비용)** 을 고려한 **수익 함수**를 정의하여 **비즈니스 이익이 최대**가 되는 지점을 탐색함
- **해석 가능한 모델 채택**: 성능뿐만 아니라 어떤 변수가 외도에 영향을 주는지 설명하기 위해 로지스틱 회귀를 최종 모델로 선정함


### 1. 데이터 전처리
![데이터 EDA](/images/snu-kdt-project/affair-eda-1.png)
![데이터 EDA](/images/snu-kdt-project/affair-eda-2.png)
![데이터 EDA](/images/snu-kdt-project/affair-eda-3.png)

### 2. 모델 선정
![](/images/snu-kdt-project/affair-model.png)

### 3. 모델 성능 평가
![](/images/snu-kdt-project/affair-threshold.png)
![](/images/snu-kdt-project/affair-business.png)
![](/images/snu-kdt-project/affair-business-result.png)

---

## 5. 결과 및 인사이트

![인사이트](/images/snu-kdt-project/affair-insight.png)

## 6. 역할 및 기여
- **데이터 모델링**: Recall 중심 목적 함수/평가 관점 설정, 임계값 탐색 로직 정리
- **웹 배포**: 예측 결과 시각화 데모의 배포 및 실행 환경 안정화 담당
- **안정성 보강**: ONNX 파싱 실패 대응 폴백 로직, 입력값 검증/경고 처리 구현
- **팀 협업**: 분석 결과를 UI 요구사항으로 변환해 구현 파트와 연결

## 7. 한계와 윤리 고려
- 본 프로젝트는 **교육/포트폴리오 목적의 데이터 시각화 실험**이며, 실제 개인의 관계 판단에 직접 사용해서는 안 됨
- 데이터셋이 1978년 논문에 기반하고 있어 최신 사회 분위기나 디지털 소통 수단 등을 반영하지 못함


## 참고자료
- FAIR, R. C. (1978). A THEORY OF EXTRAMARITAL AFFAIRS. JOURNAL OF POLITICAL ECONOMY, 86(1), 45–61.
- HAMEDETEZADI. (N.D.). AFFAIR PREDICTION [KAGGLENOTEBOOK]. RETRIEVED FROM HTTPS://WWW.KAGGLE.COM/CODE/HAMEDETEZADI/AFFAIR-PREDICTION
