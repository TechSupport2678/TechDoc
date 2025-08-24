import React, { useState } from 'react';

const DEFAULT_KEY = 'VjAcwNEveDbzZCrneaIc5fupr3ZqiKQxkq4E3Wdd7dU=';
const DEFAULT_CIPHERTEXT = 'jc90qF0GuajIzsZSmX9YCI6QBVtCzYzttb/pnB1HC5NiA1R/3x7LbSZ4xoXirbXmnG4IgKpbNsS/icpNeu2zEXiUzaO0kPmH/HSBFZ3UBSuioNW/mshKmm3OpJavWcHWYHaucW5GfbcLfbSDYDJq1N27lZ29+N4dn76AQjF3rDdq7bO5OPU6AHTso+1HZlDku8dbGip1OjdhNIBc';

function b64ToBytes(b64: string): Uint8Array {
	const bin = atob(b64);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

export default function AesGcmDecryptor() {
	const [key, setKey] = useState<string>(DEFAULT_KEY);
	const [ciphertext, setCiphertext] = useState<string>(DEFAULT_CIPHERTEXT);
	const [result, setResult] = useState<string>('');
	const [busy, setBusy] = useState<boolean>(false);

	async function handleDecrypt() {
		setBusy(true);
		setResult('...');
		try {
			const NONCE_SIZE_BYTES = 12;
			const GCM_TAG_BITS = 128;
			const keyBytes = b64ToBytes(key.trim());
			if (keyBytes.length !== 32) throw new Error('Ключ должен быть 32 байта');
			const all = b64ToBytes(ciphertext.trim());
			if (all.length <= NONCE_SIZE_BYTES) throw new Error('Некорректный шифротекст');
			const nonce = all.slice(0, NONCE_SIZE_BYTES);
			const cipherAndTag = all.slice(NONCE_SIZE_BYTES);
			const cryptoKey = await window.crypto.subtle.importKey(
				'raw',
				keyBytes,
				{ name: 'AES-GCM' },
				false,
				['decrypt']
			);
			const decrypted = await window.crypto.subtle.decrypt(
				{ name: 'AES-GCM', iv: nonce, tagLength: GCM_TAG_BITS },
				cryptoKey,
				cipherAndTag
			);
			setResult(new TextDecoder().decode(decrypted));
		} catch (e: any) {
			setResult('Ошибка: ' + e?.message || String(e));
		} finally {
			setBusy(false);
		}
	}

	return (
		<div>
			<h3>AES-256-GCM Дешифратор (Web Crypto)</h3>
			<label>
				Base64 ключ (32 байта):
				<input value={key} onChange={(e) => setKey(e.target.value)} />
			</label>
			<label>
				Base64 шифротекст (nonce+cipher+tag):
				<textarea rows={3} value={ciphertext} onChange={(e) => setCiphertext(e.target.value)} />
			</label>
			<button onClick={handleDecrypt} disabled={busy}>{busy ? '...' : 'Декодировать'}</button>
			<h4>Результат:</h4>
			<pre>{result}</pre>
		</div>
	);
}