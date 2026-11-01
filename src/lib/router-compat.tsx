'use client';

import NextLink from 'next/link';
import { useRouter, usePathname, useSearchParams, useParams as useNextParams } from 'next/navigation';
import React from 'react';

export const Link = React.forwardRef<HTMLAnchorElement, any>(function Link(
  { to, href, children, ...props },
  ref
) {
  const target = href || to || '#';
  return (
    <NextLink href={target} ref={ref} {...props}>
      {children}
    </NextLink>
  );
});

export const NavLink = React.forwardRef<HTMLAnchorElement, any>(function NavLink(
  { to, href, className, children, ...props },
  ref
) {
  const pathname = usePathname();
  const target = href || to || '#';
  const isActive = pathname === target || (target !== '/' && pathname.startsWith(target));
  const computedClass = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <NextLink href={target} ref={ref} className={computedClass} {...props}>
      {children}
    </NextLink>
  );
});

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean; state?: any }) => {
    if (typeof to === 'number') {
      if (to === -1) router.back();
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function useLocation() {
  const pathname = usePathname() || '/';
  const [search, setSearch] = React.useState(() =>
    typeof window !== 'undefined' ? window.location.search || '' : ''
  );

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearch(window.location.search || '');
    }
  }, [pathname]);

  return {
    pathname,
    search,
    state: {},
  };
}

export function useParams() {
  const params = useNextParams();
  if (!params) return {};
  const normalized: Record<string, any> = { ...params };
  if (normalized.slug && !normalized['*']) {
    normalized['*'] = Array.isArray(normalized.slug) ? normalized.slug.join('/') : normalized.slug;
  }
  return normalized;
}

export function Outlet() {
  return null;
}
