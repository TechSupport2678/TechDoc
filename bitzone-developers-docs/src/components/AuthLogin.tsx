import React, { useState } from 'react';

const SESSION_COOKIE = 'DOCS_SESSION';
const SESSION_VALUE = 'ok';

export default function AuthLogin() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	function getBaseUrlFromWindow() {
		if (typeof window === 'undefined') return '/';
		const base = (window as any).__docusaurus?.baseUrl || '/';
		return base.endsWith('/') ? base : base + '/';
	}

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (username === 'admin' && password === 'admin') {
			document.cookie = `${SESSION_COOKIE}=${SESSION_VALUE}; SameSite=Lax; Path=/; Max-Age=86400`;
			const base = getBaseUrlFromWindow();
			const absHome = (typeof window !== 'undefined' ? window.location.origin : '') + base;
			window.location.replace(absHome);
			return;
		}
		setError('Неверный логин или пароль');
		try {
			const base = getBaseUrlFromWindow();
			const authPath = base + 'authorization/';
			const absAuth = (typeof window !== 'undefined' ? window.location.origin : '') + authPath;
			const isAuthPage = (window.location.pathname || '').endsWith('/authorization') || (window.location.pathname || '').endsWith('/authorization/');
			if (!isAuthPage) window.location.replace(absAuth);
		} catch {}
	}

	return (
		<form onSubmit={onSubmit} style={{maxWidth:'420px',padding:'16px',border:'1px solid var(--ifm-toc-border-color)',borderRadius:10}}>
			<h2>Авторизация</h2>
			{error && <p style={{color:'#dc2626'}}>{error}</p>}
			<label htmlFor="username" style={{display:'block',marginTop:10}}>Логин</label>
			<input id="username" value={username} onChange={(e)=>setUsername(e.target.value)} required style={{width:'100%',padding:'10px',borderRadius:8}} />
			<label htmlFor="password" style={{display:'block',marginTop:10}}>Пароль</label>
			<input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required style={{width:'100%',padding:'10px',borderRadius:8}} />
			<button type="submit" style={{marginTop:12,padding:'10px 14px',borderRadius:8}}>Войти</button>
		</form>
	);
}
