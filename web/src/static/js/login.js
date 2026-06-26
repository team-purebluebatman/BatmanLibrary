(function () {

  // ─── 스타일 ──────────────────────────────────────────────
  const style = document.createElement("style");
  style.innerHTML = `
    /* 오버레이 배경 */
    #authOverlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.82);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
    }

    /* 카드 박스 */
    #authBox {
      width: 360px;
      padding: 36px 30px;
      background: #1a1a2e;
      border: 1px solid #f5c518;
      border-radius: 16px;
      box-shadow: 0 0 40px rgba(245, 197, 24, 0.25);
      font-family: 'Do Hyeon', sans-serif;
      color: white;
      text-align: center;
    }

    /* 배트맨 아이콘 */
    #authBox .bat-icon {
      font-size: 46px;
      display: block;
      margin-bottom: 4px;
    }

    #authBox .brand {
      font-size: 20px;
      color: #f5c518;
      margin: 0 0 20px 0;
    }

    /* 탭 */
    .auth-tabs {
      display: flex;
      margin-bottom: 24px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #333;
    }

    .auth-tab {
      flex: 1;
      padding: 10px;
      background: #0f0f1a;
      color: #888;
      cursor: pointer;
      font-size: 14px;
      font-family: 'Do Hyeon', sans-serif;
      border: none;
      transition: all 0.2s;
    }

    .auth-tab.active {
      background: #f5c518;
      color: #1a1a2e;
      font-weight: bold;
    }

    /* 폼 영역 */
    .auth-form {
      display: none;
    }

    .auth-form.active {
      display: block;
    }

    /* 인풋 */
    #authBox input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 14px;
      margin-bottom: 10px;
      border: 1px solid #333;
      border-radius: 8px;
      background: #0f0f1a;
      color: white;
      font-size: 14px;
      font-family: 'Do Hyeon', sans-serif;
      transition: border 0.2s;
    }

    #authBox input:focus {
      outline: none;
      border-color: #f5c518;
    }

    #authBox input::placeholder {
      color: #666;
    }

    /* 버튼 */
    .auth-btn {
      width: 100%;
      padding: 13px;
      margin-top: 4px;
      border: none;
      border-radius: 8px;
      background: #f5c518;
      color: #1a1a2e;
      font-size: 16px;
      font-family: 'Do Hyeon', sans-serif;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }

    .auth-btn:hover {
      background: #e0b000;
    }

    .auth-btn:disabled {
      background: #888;
      cursor: not-allowed;
    }

    /* 메시지 */
    .auth-msg {
      margin-top: 12px;
      font-size: 13px;
      min-height: 20px;
    }

    .auth-msg.error { color: #ff6b6b; }
    .auth-msg.success { color: #6bff9e; }

    /* 비밀번호 강도 바 */
    #pwStrengthWrap {
      height: 4px;
      background: #333;
      border-radius: 4px;
      margin-bottom: 10px;
      overflow: hidden;
    }

    #pwStrengthBar {
      height: 100%;
      width: 0%;
      border-radius: 4px;
      transition: width 0.3s, background 0.3s;
    }

    /* 로그아웃 버튼 */
    #logoutBtn {
      position: fixed;
      top: 14px;
      right: 20px;
      z-index: 9999;
      padding: 7px 16px;
      background: #f5c518;
      color: #1a1a2e;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-family: 'Do Hyeon', sans-serif;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.2s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    #logoutBtn:hover { background: #e0b000; }
  `;
  document.head.appendChild(style);

  // ─── 로그아웃 버튼 ───────────────────────────────────────
  function addLogoutButton(nickname) {
    const btn = document.createElement("button");
    btn.id = "logoutBtn";
    btn.textContent = `🦇 ${nickname} | 로그아웃`;
    btn.addEventListener("click", async () => {
      await fetch("/logout");
      location.reload();
    });
    document.body.appendChild(btn);
  }

  // ─── 오버레이 생성 ───────────────────────────────────────
  function showAuthOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "authOverlay";
    overlay.innerHTML = `
      <div id="authBox">
        <span class="bat-icon">🦇</span>
        <p class="brand">Batman Library</p>

        <!-- 탭 -->
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">로그인</button>
          <button class="auth-tab" data-tab="signup">회원가입</button>
        </div>

        <!-- 로그인 폼 -->
        <div class="auth-form active" id="form-login">
          <input id="loginId" type="text" placeholder="아이디" autocomplete="username" />
          <input id="loginPw" type="password" placeholder="비밀번호" autocomplete="current-password" />
          <button class="auth-btn" id="loginBtn">로그인</button>
          <p class="auth-msg error" id="loginMsg"></p>
        </div>

        <!-- 회원가입 폼 -->
        <div class="auth-form" id="form-signup">
          <input id="signId" type="text" placeholder="아이디 (영문, 숫자, 4~20자)" autocomplete="off" />
          <input id="signNick" type="text" placeholder="닉네임" autocomplete="off" />
          <input id="signPw" type="password" placeholder="비밀번호 (8자 이상)" autocomplete="new-password" />
          <div id="pwStrengthWrap"><div id="pwStrengthBar"></div></div>
          <input id="signPwCf" type="password" placeholder="비밀번호 확인" autocomplete="new-password" />
          <button class="auth-btn" id="signupBtn">회원가입</button>
          <p class="auth-msg" id="signupMsg"></p>
        </div>

      </div>
    `;
    document.body.appendChild(overlay);

    // ── 탭 전환 ──
    overlay.querySelectorAll(".auth-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        overlay.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
        overlay.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`form-${tab.dataset.tab}`).classList.add("active");
        clearMessages();
      });
    });

    // ── 로그인 이벤트 ──
    document.getElementById("loginBtn").addEventListener("click", tryLogin);
    document.getElementById("loginPw").addEventListener("keydown", e => {
      if (e.key === "Enter") tryLogin();
    });
    document.getElementById("loginId").addEventListener("keydown", e => {
      if (e.key === "Enter") document.getElementById("loginPw").focus();
    });

    // ── 회원가입 이벤트 ──
    document.getElementById("signupBtn").addEventListener("click", trySignup);
    document.getElementById("signPw").addEventListener("input", updateStrengthBar);

    document.getElementById("signPwCf").addEventListener("keydown", e => {
      if (e.key === "Enter") trySignup();
    });
  }

  // ─── 메시지 초기화 ───────────────────────────────────────
  function clearMessages() {
    ["loginMsg", "signupMsg"].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ""; el.className = "auth-msg"; }
    });
  }

  // ─── 비밀번호 강도 바 ────────────────────────────────────
  function updateStrengthBar() {
    const pw = document.getElementById("signPw").value;
    const bar = document.getElementById("pwStrengthBar");
    let score = 0;

    if (pw.length >= 8)                    score++;
    if (/[A-Z]/.test(pw))                  score++;
    if (/[0-9]/.test(pw))                  score++;
    if (/[^A-Za-z0-9]/.test(pw))          score++;

    const levels = [
      { w: "0%",   bg: "transparent" },
      { w: "25%",  bg: "#ff6b6b" },
      { w: "55%",  bg: "#f5a623" },
      { w: "80%",  bg: "#f5c518" },
      { w: "100%", bg: "#6bff9e" },
    ];

    bar.style.width      = levels[score].w;
    bar.style.background = levels[score].bg;
  }

  // ─── 로그인 시도 ─────────────────────────────────────────
  async function tryLogin() {
    const id   = document.getElementById("loginId").value.trim();
    const pw   = document.getElementById("loginPw").value;
    const msg  = document.getElementById("loginMsg");
    const btn  = document.getElementById("loginBtn");

    if (!id || !pw) {
      showMsg(msg, "아이디와 비밀번호를 입력해주세요.", "error");
      return;
    }

    setLoading(btn, true, "확인 중...");

    const form = new FormData();
    form.append("username", id);
    form.append("password", pw);

    try {
      const res  = await fetch("/login", { method: "POST", body: form });
      const data = await res.json();

      if (data.success) {
        document.getElementById("authOverlay").remove();
        addLogoutButton(data.nickname);
      } else {
        showMsg(msg, data.message, "error");
        setLoading(btn, false, "로그인");
      }
    } catch {
      showMsg(msg, "서버 오류가 발생했습니다.", "error");
      setLoading(btn, false, "로그인");
    }
  }

  // ─── 회원가입 시도 ───────────────────────────────────────
  async function trySignup() {
    const id    = document.getElementById("signId").value.trim();
    const nick  = document.getElementById("signNick").value.trim();
    const pw    = document.getElementById("signPw").value;
    const pwCf  = document.getElementById("signPwCf").value;
    const msg   = document.getElementById("signupMsg");
    const btn   = document.getElementById("signupBtn");

    // 유효성 검사
    if (!id || !nick || !pw || !pwCf) {
      showMsg(msg, "모든 항목을 입력해주세요.", "error"); return;
    }
    if (!/^[a-zA-Z0-9]{4,20}$/.test(id)) {
      showMsg(msg, "아이디는 영문·숫자 4~20자로 입력해주세요.", "error"); return;
    }
    if (pw.length < 8) {
      showMsg(msg, "비밀번호는 8자 이상이어야 합니다.", "error"); return;
    }
    if (pw !== pwCf) {
      showMsg(msg, "비밀번호가 일치하지 않습니다.", "error"); return;
    }

    setLoading(btn, true, "가입 중...");

    const form = new FormData();
    form.append("username", id);
    form.append("nickname", nick);
    form.append("password", pw);

    try {
      const res  = await fetch("/signup", { method: "POST", body: form });
      const data = await res.json();

      if (data.success) {
        showMsg(msg, "🎉 가입 완료! 로그인해주세요.", "success");
        setLoading(btn, false, "회원가입");

        // 2초 후 로그인 탭으로 자동 전환
        setTimeout(() => {
          document.querySelector('.auth-tab[data-tab="login"]').click();
          document.getElementById("loginId").value = id;
          document.getElementById("loginPw").focus();
        }, 1500);

      } else {
        showMsg(msg, data.message, "error");
        setLoading(btn, false, "회원가입");
      }
    } catch {
      showMsg(msg, "서버 오류가 발생했습니다.", "error");
      setLoading(btn, false, "회원가입");
    }
  }

  // ─── 유틸 함수 ──────────────────────────────────────────
  function showMsg(el, text, type) {
    el.textContent = text;
    el.className   = `auth-msg ${type}`;
  }

  function setLoading(btn, isLoading, text) {
    btn.disabled    = isLoading;
    btn.textContent = text;
  }

  // ─── 페이지 로드 시 인증 확인 ────────────────────────────
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const res  = await fetch("/check_auth");
      const data = await res.json();

      if (data.logged_in) {
        addLogoutButton(data.nickname);
      } else {
        showAuthOverlay();
      }
    } catch {
      showAuthOverlay();
    }
  });

})();