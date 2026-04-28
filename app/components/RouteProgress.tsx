"use client";

import Link, { type LinkProps } from "next/link";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type ProgressContextValue = {
  isLoading: boolean;
  progress: number;
  start: () => void;
};

const RouteProgressContext = createContext<ProgressContextValue | null>(null);

function useRouteProgressContext() {
  const context = useContext(RouteProgressContext);

  if (!context) {
    throw new Error("Route progress components must be used within RouteProgressProvider.");
  }

  return context;
}

function hrefToString(href: LinkProps["href"]) {
  if (typeof href === "string") return href;

  const pathname = href.pathname ?? "";
  const query = href.query ? new URLSearchParams(href.query as Record<string, string>).toString() : "";
  const hash = href.hash ?? "";

  return `${pathname}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function RouteProgressProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const finishTimeoutRef = useRef<number | null>(null);
  const currentUrlRef = useRef("");

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (finishTimeoutRef.current !== null) {
      window.clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setProgress(100);

    finishTimeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 180);
  }, [clearTimers]);

  const start = useCallback(() => {
    if (isLoading) return;

    clearTimers();
    currentUrlRef.current = window.location.pathname + window.location.search;
    setIsLoading(true);
    setProgress(12);

    intervalRef.current = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 88) return value;
        return Math.min(value + Math.random() * 14, 88);
      });
    }, 140);
  }, [clearTimers, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      currentUrlRef.current = window.location.pathname + window.location.search;
    }
  }, [isLoading, pathname]);

  useEffect(() => {
    if (!isLoading) return;

    const interval = window.setInterval(() => {
      const nextUrl = window.location.pathname + window.location.search;

      if (currentUrlRef.current && currentUrlRef.current !== nextUrl) {
        currentUrlRef.current = nextUrl;
        finish();
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [finish, isLoading]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <RouteProgressContext.Provider value={{ isLoading, progress, start }}>
      {children}
      <RouteProgressBar />
    </RouteProgressContext.Provider>
  );
}

function RouteProgressBar() {
  const { isLoading, progress } = useRouteProgressContext();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden transition-opacity duration-200 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="route-progress-bar h-full"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}

type ProgressLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

export const ProgressLink = forwardRef<HTMLAnchorElement, ProgressLinkProps>(
  function ProgressLink({ href, onClick, target, children, ...props }, ref) {
    const { start } = useRouteProgressContext();
    const hrefString = hrefToString(href);

    function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
      onClick?.(event);

      if (
        event.defaultPrevented ||
        target === "_blank" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        hrefString.startsWith("#") ||
        /^https?:\/\//.test(hrefString)
      ) {
        return;
      }

      const currentUrl = window.location.pathname + window.location.search;
      if (hrefString !== currentUrl) {
        start();
      }
    }

    return (
      <Link ref={ref} href={href} onClick={handleClick} target={target} {...props}>
        {children}
      </Link>
    );
  },
);

export function useProgressRouter() {
  const router = useRouter();
  const { start } = useRouteProgressContext();

  return {
    ...router,
    push: (...args: Parameters<typeof router.push>) => {
      start();
      return router.push(...args);
    },
    replace: (...args: Parameters<typeof router.replace>) => {
      start();
      return router.replace(...args);
    },
  };
}
