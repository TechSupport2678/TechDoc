---
id: authorization
title: Авторизация
description: Доступ к порталу документации
---

import React, { useState } from 'react';

const SESSION_COOKIE = 'DOCS_SESSION';
const SESSION_VALUE = 'ok';

function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      document.cookie = `${SESSION_COOKIE}=${SESSION_VALUE}; SameSite=Lax; Path=/; Max-Age=86400`;
      window.location.replace('/');
      return;
    }
    setError('Неверный логин или пароль');
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
      <div style={{marginTop:8,opacity:.8,fontSize:12}}>По умолчанию: admin / admin</div>
    </form>
  );
}

<AuthForm />
