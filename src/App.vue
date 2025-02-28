<template>
  <div id="app">
    <h1>나이 계산기</h1>
    <div class="input-container">
      <div class="select-group">
        <label>생년월일:</label>
        <select v-model="birthYear">
          <option value="" disabled>년도</option>
          <option v-for="year in birthYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <select v-model="birthMonth">
          <option value="" disabled>월</option>
          <option v-for="month in 12" :key="month" :value="month">
            {{ month }}월
          </option>
        </select>
        <select v-model="birthDay">
          <option value="" disabled>일</option>
          <option v-for="day in daysInMonth" :key="day" :value="day">
            {{ day }}일
          </option>
        </select>
      </div>
      <div class="select-group">
        <label>기준일 (오늘):</label>
        <select v-model="todayYear" @change="recalculate">
          <option value="" disabled>년도</option>
          <option v-for="year in todayYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <select v-model="todayMonth" @change="recalculate">
          <option value="" disabled>월</option>
          <option v-for="month in 12" :key="month" :value="month">
            {{ month }}월
          </option>
        </select>
        <select v-model="todayDay" @change="recalculate">
          <option value="" disabled>일</option>
          <option v-for="day in todayDaysInMonth" :key="day" :value="day">
            {{ day }}일
          </option>
        </select>
      </div>
      <div class="button-group">
        <button class="confirm-btn" @click="calculateAge">확인</button>
        <button class="reset-btn" @click="reset">초기화</button>
      </div>
    </div>

    <div class="result-container" v-if="result">
      <h2>계산 결과</h2>
      <div class="result-box">
        <p><strong>만나이:</strong> {{ result.fullAge }}세</p>
        <p v-if="result.fullAge < 3">
          <strong>개월 수:</strong> {{ result.months }}개월
        </p>
        <p v-if="result.fullAge < 3">
          <strong>일 수:</strong> {{ result.days }}일
        </p>
        <p><strong>연나이:</strong> {{ result.yearAge }}세</p>
        <p><strong>한국나이:</strong> {{ result.koreanAge }}세</p>
        <p><strong>띠 (간지):</strong> {{ result.zodiac }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from "date-fns";

export default {
  name: "App",
  data() {
    const today = new Date();
    return {
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      todayYear: today.getFullYear(),
      todayMonth: today.getMonth() + 1, // 0부터 시작하므로 +1
      todayDay: today.getDate(),
      result: null,
    };
  },
  computed: {
    birthYears() {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 100 }, (_, i) => currentYear - i); // 생일: 현재부터 100년 전
    },
    todayYears() {
      return Array.from({ length: 151 }, (_, i) => 1925 + i); // 기준일: 1925 ~ 2075년
    },
    daysInMonth() {
      if (!this.birthYear || !this.birthMonth) return 31;
      return new Date(this.birthYear, this.birthMonth, 0).getDate(); // 생일 월의 일수
    },
    todayDaysInMonth() {
      if (!this.todayYear || !this.todayMonth) return 31;
      return new Date(this.todayYear, this.todayMonth, 0).getDate(); // 기준일 월의 일수
    },
  },
  methods: {
    calculateAge() {
      if (!this.birthYear || !this.birthMonth || !this.birthDay) {
        alert("생년월일을 모두 선택해주세요!");
        return;
      }
      if (!this.todayYear || !this.todayMonth || !this.todayDay) {
        alert("기준일을 모두 선택해주세요!");
        return;
      }

      const today = new Date(
        this.todayYear,
        this.todayMonth - 1,
        this.todayDay
      );
      const birthDate = new Date(
        this.birthYear,
        this.birthMonth - 1,
        this.birthDay
      );

      if (today < birthDate) {
        alert("기준일은 생년월일보다 늦어야 합니다!");
        return;
      }

      const fullAge = differenceInYears(today, birthDate);
      const yearAge = today.getFullYear() - birthDate.getFullYear();
      const koreanAge = yearAge + 1;
      const zodiac = this.getZodiac(birthDate.getFullYear());

      let months = null;
      let days = null;

      if (fullAge < 3) {
        months = differenceInMonths(today, birthDate);
        days = differenceInDays(today, birthDate); // 생일부터 기준일까지 총 일수
      }

      this.result = { fullAge, months, days, yearAge, koreanAge, zodiac };
    },
    recalculate() {
      if (this.result) {
        this.calculateAge(); // 기준일 변경 시 결과가 있으면 자동 재계산
      }
    },
    getZodiac(year) {
      const zodiacs = [
        "쥐",
        "소",
        "호랑이",
        "토끼",
        "용",
        "뱀",
        "말",
        "양",
        "원숭이",
        "닭",
        "개",
        "돼지",
      ];
      return zodiacs[(year - 4) % 12];
    },
    reset() {
      const today = new Date();
      this.birthYear = "";
      this.birthMonth = "";
      this.birthDay = "";
      this.todayYear = today.getFullYear();
      this.todayMonth = today.getMonth() + 1;
      this.todayDay = today.getDate();
      this.result = null;
    },
  },
};
</script>

<style>
#app {
  font-family: "Noto Sans KR", sans-serif;
  max-width: 90%; /* 모바일에서 폭을 화면의 90%로 제한 */
  margin: 20px auto; /* 상단 여백 축소 */
  text-align: center;
  color: #333;
}

h1 {
  font-size: clamp(1.5rem, 5vw, 2rem); /* 최소 1.5rem, 최대 2rem으로 반응형 */
  color: #2c3e50;
  margin-bottom: 20px; /* 모바일에서 간격 축소 */
}

.input-container {
  display: flex;
  flex-direction: column; /* 기본적으로 세로로 쌓이게 설정 */
  align-items: center;
  gap: 15px; /* 모바일에서 간격 축소 */
  margin-bottom: 20px;
}

.select-group {
  display: flex;
  flex-wrap: wrap; /* 작은 화면에서 자동 줄바꿈 */
  gap: 8px; /* 모바일에서 간격 축소 */
  align-items: center;
  justify-content: center;
  width: 100%; /* 모바일에서 전체 폭 사용 */
}

label {
  font-size: clamp(0.9rem, 3vw, 1.1rem); /* 반응형 폰트 크기 */
  color: #2c3e50;
}

select {
  padding: 8px;
  font-size: clamp(0.9rem, 3vw, 1rem);
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  width: 100px; /* 기본 크기 축소 */
  max-width: 100%; /* 모바일에서 폭을 유연하게 */
  transition: border-color 0.3s;
}

select:focus {
  border-color: #3498db;
  outline: none;
}

.button-group {
  display: flex;
  flex-wrap: wrap; /* 버튼도 줄바꿈 허용 */
  gap: 10px;
  justify-content: center;
}

.confirm-btn {
  padding: 8px 16px; /* 모바일에서 크기 축소 */
  font-size: clamp(0.9rem, 3vw, 1rem);
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 80px; /* 터치 편의성을 위한 최소 폭 */
}

.confirm-btn:hover {
  background-color: #2980b9;
}

.reset-btn {
  padding: 8px 16px;
  font-size: clamp(0.9rem, 3vw, 1rem);
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 80px;
}

.reset-btn:hover {
  background-color: #c0392b;
}

.result-container {
  background-color: #f9f9f9;
  padding: 15px; /* 모바일에서 패딩 축소 */
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 90%; /* 모바일에서 폭 조정 */
  margin: 0 auto;
}

h2 {
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  color: #2c3e50;
  margin-bottom: 10px;
}

.result-box {
  text-align: left;
  max-width: 100%; /* 모바일에서 제한 해제 */
  margin: 0 auto;
  padding: 0 10px;
}

.result-box p {
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  margin: 8px 0;
}

.result-box strong {
  color: #3498db;
}

/* 데스크톱용 미디어 쿼리 */
@media (min-width: 768px) {
  #app {
    max-width: 800px; /* 데스크톱에서 최대 폭 복원 */
    margin: 60px auto;
  }

  .input-container {
    flex-direction: row; /* 데스크톱에서 가로 정렬 복원 */
    gap: 20px;
    flex-wrap: wrap;
  }

  .select-group {
    flex-wrap: nowrap; /* 데스크톱에서 줄바꿈 방지 */
    width: auto;
  }

  select {
    width: 120px; /* 데스크톱에서 원래 크기 복원 */
  }

  .confirm-btn,
  .reset-btn {
    padding: 10px 20px; /* 데스크톱에서 원래 크기 복원 */
  }

  .result-container {
    padding: 20px; /* 데스크톱에서 원래 패딩 복원 */
    width: auto;
  }

  .result-box {
    max-width: 300px; /* 데스크톱에서 최대 폭 복원 */
  }
}
</style>
