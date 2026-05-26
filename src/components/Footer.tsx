import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
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
            <p className="mt-4 max-w-md text-sm text-gray-500">
              Портал для пошуку роботи — ваш надійний помічник у пошуку ідеальної вакансії
              або кваліфікованого спеціаліста.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Шукачам</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/jobs" className="text-sm text-gray-500 hover:text-primary-600">
                  Пошук вакансій
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-sm text-gray-500 hover:text-primary-600">
                  Реєстрація
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Роботодавцям</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/auth/signup" className="text-sm text-gray-500 hover:text-primary-600">
                  Розмістити вакансію
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-primary-600">
                  Особистий кабінет
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} JobPortal. Курсова робота з дисципліни
            &quot;Full-Stack розробка на Next.js&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
