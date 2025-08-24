import React, { useEffect, useRef, useState } from 'react';

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
	const [isError, setIsError] = useState<boolean>(false);
	const [keyHint, setKeyHint] = useState<string>('');
	const [ctHint, setCtHint] = useState<string>('');
	const keyRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		keyRef.current?.focus();
		evaluateHints(DEFAULT_KEY, DEFAULT_CIPHERTEXT);
	}, []);

	function evaluateHints(k: string, ct: string) {
		// Key
		try {
			const kb = b64ToBytes(k.trim());
			setKeyHint(kb.length === 32 ? '32 байта — ок' : `длина ${kb.length} байт — ожидается 32`);
		} catch {
			setKeyHint('невалидный Base64');
		}
		// Ciphertext
		try {
			const all = b64ToBytes(ct.trim());
			if (all.length >= 12) {
				const data = all.length - 12;
				setCtHint(`nonce: 12 байт, данные: ${data} байт`);
			} else {
				setCtHint('слишком короткий шифротекст');
			}
		} catch {
			setCtHint('невалидный Base64');
		}
	}

	async function handleDecrypt() {
		setBusy(true);
		setIsError(false);
		setResult('Обработка...');
		try {
			const NONCE_SIZE_BYTES = 12;
			const GCM_TAG_BITS = 128;
			const keyBytes = b64ToBytes(key.trim());
			if (keyBytes.length !== 32) throw new Error('Ключ должен быть ровно 32 байта (Base64)');
			const all = b64ToBytes(ciphertext.trim());
			if (all.length <= NONCE_SIZE_BYTES) throw new Error('Некорректный шифротекст: слишком короткий');
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
			const plain = new TextDecoder().decode(decrypted);
			setIsError(false);
			setResult(plain || 'Пустой результат');
		} catch (e: any) {
			setIsError(true);
			setResult('Ошибка: ' + (e?.message || String(e)));
		} finally {
			setBusy(false);
		}
	}

	function fillExample() {
		setKey(DEFAULT_KEY);
		setCiphertext(DEFAULT_CIPHERTEXT);
		setIsError(false);
		setResult('');
		evaluateHints(DEFAULT_KEY, DEFAULT_CIPHERTEXT);
		keyRef.current?.focus();
	}

	async function copyResult() {
		try {
			await navigator.clipboard.writeText(result);
			setIsError(false);
			setResult('Скопировано в буфер обмена');
		} catch {}
	}

	function onKeyDown(e: React.KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
			e.preventDefault();
			handleDecrypt();
		}
	}

	return (
		<div className="aes-card" onKeyDown={onKeyDown}>
			<div className="aes-card__header">
				<span className="badge-interactive">Интерактивный виджет</span>
				<span className="aes-hint">⚡ AES‑256‑GCM — расшифровка в браузере. Ctrl/Cmd + Enter — декодировать.</span>
			</div>
			<div className="aes-fields">
				<label className="aes-label">
					<span className="aes-step">Шаг 1</span>
					<span>Base64 ключ (32 байта)</span>
					<input
						ref={keyRef}
						className="aes-input"
						placeholder="Пример: Base64 от 32‑байтного ключа"
						value={key}
						onChange={(e) => { setKey(e.target.value); evaluateHints(e.target.value, ciphertext); }}
					/>
					<small className="aes-helper">{keyHint}</small>
				</label>
				<label className="aes-label">
					<span className="aes-step">Шаг 2</span>
					<span>Base64 шифротекст (nonce + cipher + tag)</span>
					<textarea
						className="aes-textarea"
						rows={4}
						placeholder="Сначала 12B nonce, затем данные+tag, всё в Base64"
						value={ciphertext}
						onChange={(e) => { setCiphertext(e.target.value); evaluateHints(key, e.target.value); }}
					/>
					<small className="aes-helper">{ctHint}</small>
				</label>
			</div>
			<div className="aes-actions">
				<button className="btn btn-primary" onClick={handleDecrypt} disabled={busy}>
					{busy ? 'Декодирование…' : 'Декодировать'}
				</button>
				<button className="btn btn-secondary" type="button" onClick={fillExample} disabled={busy}>
					Заполнить пример
				</button>
				{result && !busy ? (
					<button className="btn btn-ghost" type="button" onClick={copyResult}>
						Скопировать результат
					</button>
				) : null}
			</div>
			<div className={"aes-result " + (isError ? 'aes-result--error' : 'aes-result--ok')} aria-live="polite">
				<pre className="aes-pre-copy" onClick={copyResult} title="Нажмите чтобы скопировать">{result || 'Результат появится здесь'}</pre>
			</div>
		</div>
	);
}