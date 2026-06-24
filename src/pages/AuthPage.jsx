import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup, loading, user } = useAuth();
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form.email, form.password, form.fullName);
      }
      navigate("/board");
    } catch (err) {
      console.error(err);
      let msg = err.message || "שגיאה באימות";
      if (msg.includes("User already registered")) {
        msg = "האימייל הזה כבר רשום במערכת. אנא עברו למסך התחברות.";
      } else if (msg.includes("Password should be at least")) {
        msg = "הסיסמה חייבת להכיל לפחות 6 תווים.";
      } else if (msg.includes("Invalid login credentials")) {
        msg = "אימייל או סיסמה שגויים.";
      }
      setError(msg);
    }
  };

  if (loading) return <div className="text-center py-32">טוען...</div>;

  // If already authenticated, redirect to board
  if (user) {
    navigate("/board");
    return null;
  }

  return (
    <div className="max-w-md mx-auto py-24 px-8">
      <h1 className="text-3xl font-bold text-center mb-12">
        {mode === "login" ? "התחברות" : "רישום"}
      </h1>
      {error && (
        <div className="bg-red-50 border-r-4 border-red-500 text-red-800 p-[16px] mb-[16px] rounded-[8px] text-sm font-bold shadow-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-md p-12 rounded-12 shadow-lg border border-gray-100">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            אימייל
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full input-field"
            placeholder="example@domain.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            סיסמה
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full input-field"
            placeholder="********"
          />
        </div>
        {mode === "signup" && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full input-field"
              placeholder="לדוגמה: אירים יפעת"
            />
          </div>
        )}
        <div className="text-center">
          <button type="submit" className="btn-primary px-24 py-12 text-lg">
            {mode === "login" ? "היכנס" : "הירשם"}
          </button>
        </div>
        <div className="text-center text-sm mt-4">
          {mode === "login" ? (
            <span>
              אין לך חשבון? <button type="button" onClick={() => setMode("signup")} className="text-primary underline">
                רישום
              </button>
            </span>
          ) : (
            <span>
              כבר יש לך חשבון? <button type="button" onClick={() => setMode("login")} className="text-primary underline">
                התחברות
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
