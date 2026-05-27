// ============================================================
// Auth Store — Multi-user sign-in system for NaijaReads
// All data is stored in localStorage (no server needed).
// Each user gets their own profile, wishlist, reviews, and read log.
// ============================================================

const AUTH_KEYS = {
  ACCOUNTS: "naijareads_accounts",       // { [nickname]: { name, nickname, passwordHash, avatar } }
  ACTIVE_USER: "naijareads_active_user", // nickname of currently signed-in user
};

const AuthStore = {

  // ---- Helpers ----
  _getAccounts() {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.ACCOUNTS)) || {};
  },

  _saveAccounts(accounts) {
    localStorage.setItem(AUTH_KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  // Very simple hash — good enough for localStorage "auth" (not cryptographic)
  _hashPassword(pw) {
    let hash = 0;
    for (let i = 0; i < pw.length; i++) {
      hash = ((hash << 5) - hash) + pw.charCodeAt(i);
      hash |= 0;
    }
    return "nr_" + Math.abs(hash).toString(36);
  },

  // Unique key prefix per user — keeps wishlist/reviews/etc. isolated
  userKey(suffix) {
    const nick = this.getActiveNickname();
    return nick ? `naijareads_${nick}_${suffix}` : `naijareads_${suffix}`;
  },

  // ---- Active Session ----
  getActiveNickname() {
    return localStorage.getItem(AUTH_KEYS.ACTIVE_USER) || null;
  },

  getCurrent() {
    const nick = this.getActiveNickname();
    if (!nick) return null;
    const accounts = this._getAccounts();
    return accounts[nick] || null;
  },

  isSignedIn() {
    return !!this.getCurrent();
  },

  // ---- Sign Up ----
  signUp(name, nickname, password) {
    name = name.trim();
    nickname = nickname.trim().replace(/^@/, "").replace(/\s+/g, "");

    if (!name || !nickname || !password) {
      return { success: false, error: "All fields are required." };
    }
    if (nickname.length < 3) {
      return { success: false, error: "Nickname must be at least 3 characters." };
    }
    if (password.length < 4) {
      return { success: false, error: "Password must be at least 4 characters." };
    }

    const accounts = this._getAccounts();

    if (accounts[nickname]) {
      return { success: false, error: `@${nickname} is already taken. Try another.` };
    }

    const avatarSeeds = ["Rita", "Tunde", "Adebayo", "Kemi", "Zainab", "Chinedu", "Emeka", "Ngozi"];
    const seed = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)];

    accounts[nickname] = {
      name,
      nickname,
      passwordHash: this._hashPassword(password),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`,
      createdAt: new Date().toISOString(),
    };

    this._saveAccounts(accounts);
    this._setActiveUser(nickname);

    return { success: true, user: accounts[nickname] };
  },

  // ---- Sign In ----
  signIn(nickname, password) {
    nickname = nickname.trim().replace(/^@/, "");
    const accounts = this._getAccounts();
    const user = accounts[nickname];

    if (!user) {
      return { success: false, error: `No account found for @${nickname}.` };
    }
    if (user.passwordHash !== this._hashPassword(password)) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    this._setActiveUser(nickname);
    return { success: true, user };
  },

  // ---- Sign Out ----
  signOut() {
    localStorage.removeItem(AUTH_KEYS.ACTIVE_USER);
    window.dispatchEvent(new CustomEvent("auth-changed", { detail: { signedIn: false } }));
  },

  _setActiveUser(nickname) {
    localStorage.setItem(AUTH_KEYS.ACTIVE_USER, nickname);
    window.dispatchEvent(new CustomEvent("auth-changed", { detail: { signedIn: true, nickname } }));
  },

  // ---- Update Profile ----
  updateProfile(name, nickname, avatar) {
    const currentNick = this.getActiveNickname();
    if (!currentNick) return { success: false, error: "Not signed in." };

    const accounts = this._getAccounts();
    const user = accounts[currentNick];
    if (!user) return { success: false, error: "Account not found." };

    // If nickname changed, migrate the key
    const newNick = nickname.trim().replace(/^@/, "");
    if (newNick !== currentNick && accounts[newNick]) {
      return { success: false, error: `@${newNick} is already taken.` };
    }

    if (newNick !== currentNick) {
      // Rename the account key
      accounts[newNick] = { ...user, name, nickname: newNick, avatar };
      delete accounts[currentNick];
      this._saveAccounts(accounts);
      this._setActiveUser(newNick);
    } else {
      accounts[currentNick] = { ...user, name, avatar };
      this._saveAccounts(accounts);
      window.dispatchEvent(new CustomEvent("auth-changed", { detail: { signedIn: true, nickname: currentNick } }));
    }

    return { success: true };
  },
};
