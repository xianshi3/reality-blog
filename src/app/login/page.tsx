"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import "./login.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("请输入邮箱和密码");
      return;
    }

    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg("登录失败：" + error.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        const res = await fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          setErrorMsg("登录失败，写 cookie 错误：" + err.error);
          setLoading(false);
          return;
        }

        router.push("/admin");
      } else {
        setErrorMsg("登录失败：未获取有效会话");
      }
    } catch (err: any) {
      setErrorMsg("登录异常：" + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card" onKeyDown={onKeyDown}>
        <div className="login-brand">
          <div className="login-brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </div>
        </div>

        <h1 className="login-title">管理员登录</h1>
        <p className="login-subtitle">Reality Blog 管理后台</p>

        {errorMsg && (
          <p className="login-error">{errorMsg}</p>
        )}
        {infoMsg && (
          <p className="login-info">{infoMsg}</p>
        )}

        <input
          className="login-input"
          placeholder="邮箱"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoFocus
        />

        <input
          className="login-input"
          placeholder="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          disabled={loading}
          className="login-btn"
          onClick={handleLogin}
        >
          {loading ? <><span className="login-spinner" />正在登录...</> : "登录"}
        </button>

        <p className="login-footer">Reality Blog &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}