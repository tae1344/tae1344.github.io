---
title: "[서울대 KDT 캡스톤] 중고차 가격 예측 모델"
summary: "신속하고 정확한 1차 매입가 산출을 위한 기준가 제시 알고리즘을 개발하여, 고객과 딜러의 매칭 확률을 높이는 것을 목표로 한 프로젝트"
description: "코오롱 모빌리티만의 중고차 가격 예측 모델 개발을 위한 프로젝트"
date: 2026-01-26 09:00:00 +0900
status: "Completed"
type: "팀 프로젝트 (KOLON MOBILITY X SNU KDT 과정)"
role: "팀장"
team: "6명"
duration: "2025-10-29 ~ 2026-01-22 (3개월)"
categories: [Project, AI]
tags: [중고차, CatBoost, LightGBM, XGBoost, Clustering]
metrics:
  - label: 회사명
    value: (주)코오롱 모빌리티
  - label: 핵심 도메인
    value: 중고차 가격 예측
  - label: 데이터 크기 - 행/열
    value: 19만 7324개 / 39개
  - label: 사용 모델
    value: LightGBM, CatBoost, XGBoost
image:
  path: src/assets/img/snu-kdt-capstone/kolon-used-car-thumbnail.png
  alt: 캡스톤 프로젝트 시스템 아키텍처
features:
  - 판매 데이터 기반 1차 매입가 산정: 차량 스펙 정보를 입력하면 알고리즘이 즉시 적정 기준가를 제시하여 신속한 고객 대응 가능
  - 차종별 맞춤형 예측(Clustering): 국산 대형차, 고가 차량, 경차 등 6개 클러스터로 분류하여 예측 정확도 향상
  - 파생 변수를 활용한 분석: 연식 대비 주행거리, 판매속도 지수 등 도메인 지식을 반영한 변수를 생성하여 모델 성능 개선
  - 가격 산정 근거 제시 (SHAP Analysis): 특정 차량의 가격이 낮거나 높게 책정된 이유를 시각화된 데이터로 설명
# achievements:
pinned: true
mermaid: true
---

![중고차 사업 프로세스](/src/assets/img/snu-kdt-capstone/kolon-used-car-process.png)


## 1. 개요
- 신속하고 정확한 1차 매입가 산출을 위한 기준가 제시 알고리즘을 개발하여 고객과 딜러의 매칭 확률을 높임
- 코오롱 모빌리티만의 일관된 가격 산정 구조를 확립하여 고객 신뢰도를 제고하고 과대/과소 매입 리스크를 감소시킴

---

![문제 정의](/src/assets/img/snu-kdt-capstone/kolon-used-car-problem.png)


## 2. 문제 정의
#### 1. 기존 방식의 한계
- **일관성 부재**: 딜러별로 데이터 수집 및 판단 방식이 달라 매입가의 일관성이 떨어짐 
- **설명력 부족**: 딜러 개개인의 경험적 지식에만 의존하여 고객에게 가격 산정 근거를 제시하기 어려움 
- **응대 지연**: 데이터 수집이 산발적으로 이루어져 고객 응대 시간이 길어지고 매입 경쟁력이 하락함 

#### 2. 왜 해결해야 했는가
- 가격 불일치로 인한 고객 혼선 및 브랜드 신뢰도 저하 발생 
- 딜러마다 암묵적 기준에 의한 입찰가 산정으로 인해 발생하는 경제적 손실(과대/과소 매입 리스크)을 최소화해야 함

---

## 3. 해결 전략
1. **클러스터링 기반 복합 모델**: 차종·차급별 가격 결정 구조가 다르다는 점을 반영하여 K-modes 클러스터링을 선행한 후 각 그룹에 최적화된 지도학습 모델을 적용 

2. **감가율 중심 예측**: 단순 판매가가 아닌 '감가율'을 타겟 변수로 설정하여 거시경제적 변화를 배제하고 차량 자체의 가치 하락 요인을 집중 분석 

3. **XAI(설명 가능한 AI) 도입**: SHAP value 분석을 통해 연식, 주행거리 등 어떤 변수가 가격 산정에 얼마나 영향을 주었는지 근거를 제공

---

## 4. 기술적 도전 & 해결 과정

1. **문제 상황**
- 단일 모델 적용 시 차종별 특성을 반영하지 못해 전체적인 예측 오차가 발생함 
- 1년 미만의 데이터셋으로 인해 연 단위 시계열 계절성 분석이 어려움 

2. **해결 방법**
- 클러스터링: 6개의 차량 그룹으로 나누어 개별 모델링을 진행하여 오차(MAE) 감소 
- 검증 전략: 시계열 분석 대신 1~10월 데이터로 5-fold CV를 수행하고, 최신 데이터인 11월 데이터를 별도 테스트셋으로 활용하는 Out-of-time 테스트 실시 

3. **결과**
- 단일 모델 대비 **복합 모델(Clustering + ML)** 적용 시 **MAPE 성능 향상 (6.84% → 6.44%)**
- 현업 허용 오차 범위인 200만 원 이내의 성능(가중 평균 MAE 약 157~173만 원) 기록

---

## 5. 모델 개발 과정

#### 1. 데이터 분석

![데이터 분석](/src/assets/img/snu-kdt-capstone/kolon-used-car-data-info.png)

#### 2. 도메인 분석

![선행 연구 분석](/src/assets/img/snu-kdt-capstone/kolon-used-car-research.png)


#### 3. 모델 설계

![test-train split](/src/assets/img/snu-kdt-capstone/kolon-used-car-test-train-split.png)

![clustering](/src/assets/img/snu-kdt-capstone/kolon-used-car-clustering.png)

![cross-validation](/src/assets/img/snu-kdt-capstone/kolon-used-car-cv.png)

![파생 변수](/src/assets/img/snu-kdt-capstone/kolon-used-car-variables.png)

---

## 6. 모델링 분석
#### 1. 파생변수 / 외생변수 추가에 따른 성능 향상을 기록함
  
![결과 - 파생변수 유무](/src/assets/img/snu-kdt-capstone/kolon-used-car-result-1.png)

![SHAP value](/src/assets/img/snu-kdt-capstone/kolon-used-car-shap-value.png)


#### 2. 클러스터링 유무에 따른 달라지는 성능 지표를 확인함

![결과 - 클러스터링](/src/assets/img/snu-kdt-capstone/kolon-used-car-result-2.png)

![결과 - 클러스터링](/src/assets/img/snu-kdt-capstone/kolon-used-car-result-3.png)

---

## 7. 결과 및 성과
- **정확도 확보**: 가중 평균 MAE 157만 원 달성으로 **실제 비즈니스 적용 가능한 수준**의 신뢰도 확보 
- **효율성 증대**: 자동화된 알고리즘을 통해 딜러의 데이터 수집 시간을 단축하고 **고객 응대 속도 개선**
- **리스크 감소**: 객관적 수치를 제공함으로써 과대/과소 매입에 따른 재무적 리스크 방어

![성과](/src/assets/img/snu-kdt-capstone/kolon-used-car-insight.png)

## 8. 회고 및 개선 방향
1. 아쉬운 점: 
- 표본 수가 적은 일부 대형차나 특수 모델의 경우 예측 정확도가 상대적으로 낮게 측정됨 

2. 향후 개선 계획:
- 코오롱 내부 데이터가 추가 누적될 경우 1년 단위 Rolling Window 시계열 분석 모델로 전환 
- 소수 표본 차량에 대한 데이터 보강을 통해 일반화 성능 강화