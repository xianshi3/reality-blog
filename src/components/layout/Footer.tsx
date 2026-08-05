type FooterProps = {
  currentYear: number;
};

export default function Footer({ currentYear }: FooterProps) {
  return (
    <footer className="mt-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700/60 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          <p className="text-lg font-bold text-gray-400 dark:text-gray-500 tracking-wide">
            Reality Blog
          </p>

          <a
            href="https://github.com/xianshi3/Reality-Blog"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Blog Open Source"
            className="
              flex items-center gap-2 px-4 py-1.5 rounded-full
              text-sm text-gray-500 dark:text-gray-400
              border border-gray-200 dark:border-gray-700
              hover:text-blue-500 dark:hover:text-blue-400
              hover:border-blue-300 dark:hover:border-blue-500/50
              hover:bg-blue-50 dark:hover:bg-blue-500/10
              transition-all duration-300
            "
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="inline-block align-middle"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            Blog Open Source
          </a>
        </div>

        <div className="mt-8 pt-6 text-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
            &copy; {currentYear} Reality-Blog
            <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
