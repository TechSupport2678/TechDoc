import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

const SESSION_COOKIE = 'DOCS_SESSION';
const SESSION_VALUE = 'ok';

function hasSessionCookie() {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim() === `${SESSION_COOKIE}=${SESSION_VALUE}`);
}

export default function Root({ children }) {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathname = location?.pathname || '/';
    const isAuthPage = pathname === '/authorization' || pathname === '/authorization/';
    const authed = hasSessionCookie();
    if (!authed && !isAuthPage) {
      window.location.replace('/authorization');
    }
  }, [location]);

  return <>{children}</>;
}
