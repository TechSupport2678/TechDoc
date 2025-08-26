import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

const SESSION_COOKIE = 'DOCS_SESSION';
const SESSION_VALUE = 'ok';

function getBaseUrlFromWindow() {
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
		const baseUrl = getBaseUrlFromWindow();
		const authPath = baseUrl + 'authorization';
		const absAuth = window.location.origin + authPath;
		const pathname = window.location.pathname || '/';
		const isAuthPage = pathname.endsWith('/authorization') || pathname.endsWith('/authorization/');
		const authed = hasSessionCookie();
		if (!authed && !isAuthPage) {
			window.location.replace(absAuth);
		}
	}, [location]);

	return <>{children}</>;
}
