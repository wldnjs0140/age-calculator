// app.js
const { createApp } = Vue;

createApp({
  data() {
    const today = new Date();
    return {
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      todayYear: today.getFullYear(),
      todayMonth: today.getMonth() + 1,
      todayDay: today.getDate(),
      result: null,
    };
  },
  computed: {
    birthYears() {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 100 }, (_, i) => currentYear - i);
    },
    todayYears() {
      return Array.from({ length: 151 }, (_, i) => 1925 + i);
    },
    daysInMonth() {
      if (!this.birthYear || !this.birthMonth) return 31;
      return new Date(this.birthYear, this.birthMonth, 0).getDate();
    },
    todayDaysInMonth() {
      if (!this.todayYear || !this.todayMonth) return 31;
      return new Date(this.todayYear, this.todayMonth, 0).getDate();
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

      const fullAge = dateFns.differenceInYears(today, birthDate);
      const yearAge = today.getFullYear() - birthDate.getFullYear();
      const koreanAge = yearAge + 1;
      const zodiac = this.getZodiac(birthDate.getFullYear());

      let months = null;
      let days = null;

      if (fullAge < 3) {
        months = dateFns.differenceInMonths(today, birthDate);
        days = dateFns.differenceInDays(today, birthDate);
      }

      this.result = { fullAge, months, days, yearAge, koreanAge, zodiac };
    },
    recalculate() {
      if (this.result) {
        this.calculateAge();
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
  template: `
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
  `,
}).mount("#app");
