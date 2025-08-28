#!/usr/bin/env python3
"""
QR decoder script.

Dependencies:
  pip install opencv-python-headless

Usage:
  python3 parse_qr.py /path/to/qr.png [more_images...]
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import List, Iterable, Tuple


def _generate_variants(cv2, image) -> Iterable[Tuple[str, "object"]]:
    """Yield image variants (name, image) to improve QR detection.

    Includes: original, grayscale, CLAHE (contrast), adaptive threshold,
    morphological cleanup, and 0/90/180/270 rotations. Also upsamples small images.
    """
    # Ensure color image
    img = image.copy()

    # Upscale if small
    height, width = img.shape[:2]
    max_dim = max(width, height)
    if max_dim < 800:
        scale = 800 / max_dim
        img = cv2.resize(img, (int(width * scale), int(height * scale)), interpolation=cv2.INTER_CUBIC)

    yield ("original", img)

    # Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    yield ("gray", gray)

    # CLAHE contrast boost
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    eq = clahe.apply(gray)
    yield ("clahe", eq)

    # Adaptive thresholding
    th = cv2.adaptiveThreshold(eq, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 3)
    yield ("adaptive_thresh", th)

    # Morphological clean-up
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    morphed = cv2.morphologyEx(th, cv2.MORPH_OPEN, kernel, iterations=1)
    yield ("morph_open", morphed)

    # Rotations for each variant
    base_variants = [img, gray, eq, th, morphed]
    for idx, v in enumerate(base_variants):
        for angle in (90, 180, 270):
            rot = cv2.rotate(v, {90: cv2.ROTATE_90_CLOCKWISE, 180: cv2.ROTATE_180, 270: cv2.ROTATE_90_COUNTERCLOCKWISE}[angle])
            yield (f"rot{angle}_{idx}", rot)


def decode_qr_from_image(image_path: Path) -> List[str]:
    try:
        import cv2  # type: ignore
    except Exception as import_error:  # pragma: no cover
        raise SystemExit(
            "OpenCV is required. Install with: pip install opencv-python-headless"
        ) from import_error

    if not image_path.exists() or not image_path.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError(f"Failed to read image (unsupported or corrupt): {image_path}")

    detector = cv2.QRCodeDetector()
    decoded_texts: List[str] = []

    variants: List[Tuple[str, "object"]] = list(_generate_variants(cv2, image))

    # Try multiple variants and rotations with OpenCV first
    for _name, variant in variants:
        try:
            # Multi-code path
            try:
                retval, decoded_info, _points, _ = detector.detectAndDecodeMulti(variant)  # type: ignore[attr-defined]
                if retval and decoded_info:
                    decoded_texts = [t for t in decoded_info if t]
                    if decoded_texts:
                        return decoded_texts
            except Exception:
                pass

            # Single-code path
            text, _points, _ = detector.detectAndDecode(variant)
            if text:
                return [text]
        except Exception:
            continue

    # Fallback: pyzbar (ZBar), often robust for screenshots
    try:
        from pyzbar.pyzbar import decode as zbar_decode  # type: ignore
        from PIL import Image  # type: ignore

        results: List[str] = []
        for _name, variant in variants:
            try:
                if len(getattr(variant, "shape", ())) == 2:
                    # grayscale numpy array
                    pil_img = Image.fromarray(variant)
                else:
                    # BGR -> RGB
                    rgb = cv2.cvtColor(variant, cv2.COLOR_BGR2RGB)
                    pil_img = Image.fromarray(rgb)

                decoded = zbar_decode(pil_img)
                if decoded:
                    for d in decoded:
                        data = d.data.decode("utf-8", errors="replace")
                        if data:
                            results.append(data)
                    if results:
                        return results
            except Exception:
                continue
    except Exception:
        pass

    return []


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Decode QR codes from images")
    parser.add_argument(
        "images",
        nargs="+",
        type=Path,
        help="Path(s) to image file(s) containing QR code(s)",
    )
    return parser


def main(argv: List[str]) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    any_found = False
    for img_path in args.images:
        try:
            texts = decode_qr_from_image(img_path)
        except Exception as exc:
            print(f"{img_path}: ERROR: {exc}")
            continue

        if texts:
            any_found = True
            for idx, text in enumerate(texts, start=1):
                print(f"{img_path} [#{idx}]: {text}")
        else:
            print(f"{img_path}: no QR code detected")

    return 0 if any_found else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

