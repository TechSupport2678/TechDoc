import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

const SESSION_COOKIE = 'DOCS_SESSION';
const SESSION_VALUE = 'ok';

function getBaseUrl() {
	if (typeof window === 'undefined') return '/';
	const base = (window.__docusaurus && window.__docusaurus.baseUrl) || '/';
	return base.endsWith('/') ? base : base + '/';
}

function hasSessionCookie() {
	if (typeof document === 'undefined') return false;
	return document.cookie.split(';').some((c) => c.trim() === `${SESSION_COOKIE}=${SESSION_VALUE}`);
}

export default function Root({ children }) {
	const location = useLocation();

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const baseUrl = getBaseUrl();
		const pathname = location?.pathname || '/';
		const authPath = baseUrl + 'authorization';
		const isAuthPage = pathname === authPath || pathname === authPath + '/';
		const authed = hasSessionCookie();
		if (!authed && !isAuthPage) {
			window.location.replace(authPath);
		}
	}, [location]);

	return <>{children}</>;
}
