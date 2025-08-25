---
id: authorization
title: Авторизация
description: Доступ к порталу документации
---

Для доступа к разделам документации выполните вход. Введите логин и пароль ниже. 

<form method="post" action="/login">
  <div style={{maxWidth:'420px',padding:'16px',border:'1px solid var(--ifm-toc-border-color)',borderRadius:'10px'}}>
    <div style={{marginBottom:'10px'}}>
      <label htmlFor="username" style={{display:'block',marginBottom:4}}>Логин</label>
      <input id="username" name="username" required style={{width:'100%',padding:'10px',borderRadius:8}} />
    </div>
    <div style={{marginBottom:'10px'}}>
      <label htmlFor="password" style={{display:'block',marginBottom:4}}>Пароль</label>
      <input id="password" type="password" name="password" required style={{width:'100%',padding:'10px',borderRadius:8}} />
    </div>
    <button type="submit" style={{padding:'10px 14px',borderRadius:8}}>Войти</button>
    <div style={{marginTop:8,opacity:.8,fontSize:12}}>По умолчанию: admin / admin</div>
  </div>
</form>

Подсказка: если видите редирект на эту страницу — значит, вход ещё не выполнен.

