"use client";

// パスワード変更処理は現時点で考えていない

import { useRouter } from "next/navigation";
import { login } from "@/lib/actions/login";
import { useState } from "react";
import type { LoginForm } from "@/types/admin";

export default function AdminLoginPage() {
    const router = useRouter();

    const [form, setForm] = useState<LoginForm>({
        username: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(prop: keyof LoginForm, data: string) {
        setForm((prev) => ({ ...prev, [prop]: data }));
    }

    async function handleLogin() {
        const result = await login(form);
        if (!result.ok) {
            setErrorMessage(result.error ?? "");
            return;
        }
        router.push("/admin");
    };

    return (
        <div className="flex h-screen items-center justify-center bg-neutral-950">
            <div className="w-80 rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-neutral-100">
                <h1 className="mb-4 text-lg font-semibold">管理者ログイン</h1>

                {errorMessage && (
                    <p
                        role="alert"
                        className="mb-3 rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-200"
                    >
                        {errorMessage}
                    </p>
                )}

                <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                    <label className="flex flex-col gap-1 text-sm">
                        ユーザー名
                        <input
                            type="text"
                            name="id"
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        パスワード
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 pr-10 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-neutral-200"
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </label>


                    <button
                        type="button"
                        onClick={handleLogin}
                        className="mt-2 cursor-pointer rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
                    >
                        ログイン
                    </button>
                </form>
            </div>
        </div>
    );
}

function EyeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.7 17.7 0 0 1-3.3 4.3M6.1 6.1A17.9 17.9 0 0 0 2 11s3.5 7 10 7a10.9 10.9 0 0 0 5-1.2" />
            <path d="M3 3l18 18" />
        </svg>
    );
}