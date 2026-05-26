"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-8 w-8 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          <span className="text-xl font-bold text-gray-900">JobPortal</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/jobs"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
          >
            Вакансії
          </Link>

          {status === "authenticated" && session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
              >
                Кабінет
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-secondary text-xs"
                >
                  Вийти
                </button>
              </div>
            </>
          ) : status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/signin" className="btn-secondary text-xs">
                Увійти
              </Link>
              <Link href="/auth/signup" className="btn-primary text-xs">
                Реєстрація
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Меню"
        >
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/jobs"
              className="text-sm font-medium text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Вакансії
            </Link>
            {status === "authenticated" && session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Кабінет
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-secondary text-xs w-fit"
                >
                  Вийти
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/auth/signin" className="btn-secondary text-xs">
                  Увійти
                </Link>
                <Link href="/auth/signup" className="btn-primary text-xs">
                  Реєстрація
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
