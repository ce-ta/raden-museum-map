"use client";

import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    const handleLogin = () => {
        router.push("/admin");
    };

    return (
        <div className="flex h-screen items-center justify-center bg-neutral-950">
            <div className="w-80 rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-neutral-100">
                <h1 className="mb-4 text-lg font-semibold">管理者ログイン</h1>

                <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                    <label className="flex flex-col gap-1 text-sm">
                        ID
                        <input
                            type="text"
                            name="id"
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        パスワード
                        <input
                            type="password"
                            name="password"
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
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
