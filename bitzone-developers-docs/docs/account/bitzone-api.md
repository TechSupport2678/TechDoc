---
title: Bitzone API
description: Обзор раздела аккаунта и утилита для расшифровки данных AES‑256‑GCM (Web Crypto)
---

import AesGcmDecryptor from '@site/src/components/AesGcmDecryptor';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Обзор

Этот раздел содержит обзор возможностей API, связанных с аккаунтом, и вспомогательные инструменты для разработчиков.

- Авторизация и ключи
- Управление аккаунтом
- Тестовые и прод‑окружения
- Примеры запросов и ответов

:::note
Полный список конечных точек смотрите в навигации слева. Ниже — утилита для расшифровки полезной нагрузки с использованием AES‑256‑GCM в браузере.
:::

## Схема полезной нагрузки (пример)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "EncryptedMessage",
  "type": "object",
  "properties": {
    "keyBase64": { "type": "string", "description": "Секретный ключ, 32 байта, Base64" },
    "ciphertextBase64": { "type": "string", "description": "nonce(12B)+cipher+tag(16B), Base64" }
  },
  "required": ["keyBase64", "ciphertextBase64"]
}
```

## Формат шифротекста

```text
base64( [12 байт nonce] + [ciphertext] + [16 байт GCM tag] )
```

## AES‑256‑GCM Дешифратор (Web Crypto)

Ниже представлен безопасный встраиваемый виджет, работающий через `window.crypto.subtle`.

### Как пользоваться

1. Вставьте Base64 ключ (ровно 32 байта).
2. Вставьте Base64 шифротекст в формате `nonce(12B) + cipher + tag(16B)`.
3. Нажмите «Декодировать» — результат появится ниже.

:::caution Безопасность
- Не используйте реальные прод‑ключи на общих/чужих устройствах.
- Храните ключи в KMS/SSM/Secrets Manager и подгружайте их только на серверной стороне, если это не тест.
:::

<AesGcmDecryptor />

---

## Примеры интеграции (сервер‑сайд)

<Tabs>
  <TabItem value="node" label="Node.js (crypto)">

```js
import { webcrypto } from 'crypto';

const subtle = webcrypto.subtle;

function b64ToBytes(b64) {
  return Uint8Array.from(Buffer.from(b64, 'base64'));
}

export async function decryptAesGcm(keyB64, allB64) {
  const NONCE = 12; // bytes
  const keyBytes = b64ToBytes(keyB64);
  if (keyBytes.length !== 32) throw new Error('key must be 32 bytes');
  const all = b64ToBytes(allB64);
  if (all.length <= NONCE) throw new Error('ciphertext too short');
  const iv = all.slice(0, NONCE);
  const cipherAndTag = all.slice(NONCE);
  const key = await subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
  const plain = await subtle.decrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, cipherAndTag);
  return Buffer.from(new Uint8Array(plain)).toString('utf8');
}
```

  </TabItem>
  <TabItem value="python" label="Python (cryptography)">

```python
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def decrypt_aes_gcm(key_b64: str, all_b64: str) -> str:
    NONCE = 12
    key = base64.b64decode(key_b64)
    assert len(key) == 32, 'key must be 32 bytes'
    all_bytes = base64.b64decode(all_b64)
    assert len(all_bytes) > NONCE, 'ciphertext too short'
    nonce = all_bytes[:NONCE]
    data = all_bytes[NONCE:]
    aesgcm = AESGCM(key)
    plain = aesgcm.decrypt(nonce, data, None)
    return plain.decode('utf-8')
```

  </TabItem>
  <TabItem value="go" label="Go (crypto/aes)">

```go
package decrypt

import (
    "crypto/aes"
    "crypto/cipher"
    "encoding/base64"
    "errors"
)

func DecryptAESGCM(keyB64, allB64 string) (string, error) {
    const nonceSize = 12
    key, err := base64.StdEncoding.DecodeString(keyB64)
    if err != nil { return "", err }
    if len(key) != 32 { return "", errors.New("key must be 32 bytes") }
    all, err := base64.StdEncoding.DecodeString(allB64)
    if err != nil { return "", err }
    if len(all) <= nonceSize { return "", errors.New("ciphertext too short") }
    nonce := all[:nonceSize]
    data := all[nonceSize:]
    block, err := aes.NewCipher(key)
    if err != nil { return "", err }
    gcm, err := cipher.NewGCM(block)
    if err != nil { return "", err }
    plain, err := gcm.Open(nil, nonce, data, nil)
    if err != nil { return "", err }
    return string(plain), nil
}
```

  </TabItem>
  <TabItem value="php" label="PHP (openssl)">

```php
<?php
function decrypt_aes_gcm(string $keyB64, string $allB64): string {
    $NONCE = 12;
    $key = base64_decode($keyB64, true);
    if ($key === false || strlen($key) !== 32) throw new Exception('key must be 32 bytes');
    $all = base64_decode($allB64, true);
    if ($all === false || strlen($all) <= $NONCE) throw new Exception('ciphertext too short');
    $iv = substr($all, 0, $NONCE);
    $ct_and_tag = substr($all, $NONCE);
    $ct = substr($ct_and_tag, 0, -16);
    $tag = substr($ct_and_tag, -16);
    $plain = openssl_decrypt($ct, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag, '');
    if ($plain === false) throw new Exception('decrypt failed');
    return $plain;
}
```

  </TabItem>
  <TabItem value="java" label="Java (javax.crypto)">

```java
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class AesGcm {
  public static String decrypt(String keyB64, String allB64) throws Exception {
    final int NONCE = 12;
    byte[] key = Base64.getDecoder().decode(keyB64);
    if (key.length != 32) throw new IllegalArgumentException("key must be 32 bytes");
    byte[] all = Base64.getDecoder().decode(allB64);
    if (all.length <= NONCE) throw new IllegalArgumentException("ciphertext too short");
    byte[] iv = new byte[NONCE];
    System.arraycopy(all, 0, iv, 0, NONCE);
    byte[] data = new byte[all.length - NONCE];
    System.arraycopy(all, NONCE, data, 0, data.length);
    Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
    GCMParameterSpec spec = new GCMParameterSpec(128, iv);
    SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
    cipher.init(Cipher.DECRYPT_MODE, keySpec, spec);
    byte[] plain = cipher.doFinal(data);
    return new String(plain, java.nio.charset.StandardCharsets.UTF_8);
  }
}
```

  </TabItem>
  <TabItem value="csharp" label="C# (.NET AesGcm)">

```csharp
using System;
using System.Security.Cryptography;
using System.Text;

public static class AesGcmUtil {
  public static string Decrypt(string keyB64, string allB64) {
    const int NONCE = 12;
    byte[] key = Convert.FromBase64String(keyB64);
    if (key.Length != 32) throw new ArgumentException("key must be 32 bytes");
    byte[] all = Convert.FromBase64String(allB64);
    if (all.Length <= NONCE) throw new ArgumentException("ciphertext too short");
    byte[] nonce = new byte[NONCE];
    Buffer.BlockCopy(all, 0, nonce, 0, NONCE);
    int dataLen = all.Length - NONCE;
    byte[] data = new byte[dataLen];
    Buffer.BlockCopy(all, NONCE, data, 0, dataLen);
    // Split tag (last 16 bytes)
    byte[] ct = new byte[dataLen - 16];
    byte[] tag = new byte[16];
    Buffer.BlockCopy(data, 0, ct, 0, ct.Length);
    Buffer.BlockCopy(data, ct.Length, tag, 0, 16);
    byte[] plain = new byte[ct.Length];
    using var aes = new AesGcm(key);
    aes.Decrypt(nonce, ct, tag, plain, null);
    return Encoding.UTF8.GetString(plain);
  }
}
```

  </TabItem>
</Tabs>

---

## Полезные ссылки

- Руководство по авторизации: см. раздел «API Integration»
- Web Crypto API (MDN): https://developer.mozilla.org/docs/Web/API/SubtleCrypto/decrypt
- Рекомендации по хранению ключей: NIST SP 800‑57