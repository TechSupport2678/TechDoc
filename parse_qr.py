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
from typing import List


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

    # Try multi-code path first (available in most OpenCV builds)
    try:
        retval, decoded_info, points, _ = detector.detectAndDecodeMulti(image)  # type: ignore[attr-defined]
        if retval and decoded_info:
            decoded_texts.extend([t for t in decoded_info if t])
    except Exception:
        # Fallback to single-code path
        pass

    if not decoded_texts:
        text, points, _ = detector.detectAndDecode(image)
        if text:
            decoded_texts.append(text)

    return decoded_texts


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

