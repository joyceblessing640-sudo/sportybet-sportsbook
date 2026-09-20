#!/usr/bin/env python3
"""Render original high-resolution homepage and Virtuals artwork."""

from __future__ import annotations

import math
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
HOME = os.path.join(ROOT, "public", "home")
VIRTUALS = os.path.join(ROOT, "public", "virtuals")
os.makedirs(HOME, exist_ok=True)
os.makedirs(VIRTUALS, exist_ok=True)

INTER = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"
INTER_REG = "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"
INTER_ITA = "/usr/share/fonts/truetype/macos/Inter-BoldItalic.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def rounded(im: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.size[0] - 1, im.size[1] - 1), radius=radius, fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def gradient(size: tuple[int, int], top: tuple[int, int, int], bot: tuple[int, int, int]) -> Image.Image:
    w, h = size
    im = Image.new("RGB", size)
    px = im.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        col = tuple(int(top[i] * (1 - t) + bot[i] * t) for i in range(3))
        for x in range(w):
            px[x, y] = col
    return im


def circle(draw: ImageDraw.ImageDraw, xy: tuple[int, int], r: int, fill, outline=None, width: int = 3) -> None:
    x, y = xy
    draw.ellipse((x - r, y - r, x + r, y + r), fill=fill, outline=outline, width=width)


def badge(draw: ImageDraw.ImageDraw, xy: tuple[int, int], r: int, fill, text: str, text_fill=(255, 255, 255)) -> None:
    circle(draw, xy, r, fill, (255, 255, 255), 6)
    f = font(INTER, max(22, int(r * 0.42)))
    bbox = draw.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((xy[0] - tw / 2, xy[1] - th / 2 - 2), text, font=f, fill=text_fill)


def label_block(im: Image.Image, lines: list[str]) -> None:
    w, h = im.size
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rectangle((0, int(h * 0.62), w, h), fill=(0, 0, 0, 150))
    f = font(INTER, 42 if len(lines) == 1 else 36)
    y = int(h * 0.68)
    for line in lines:
        bbox = d.textbbox((0, 0), line, font=f)
        tw = bbox[2] - bbox[0]
        d.text(((w - tw) / 2, y), line, font=f, fill=(255, 255, 255, 255))
        y += 46
    im.paste(Image.alpha_composite(im.convert("RGBA"), overlay).convert("RGB"))


def save_tile(im: Image.Image, name: str) -> None:
    sharp = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=90, threshold=2))
    png = os.path.join(HOME, f"{name}.png")
    rounded(sharp, 48).save(png, "PNG", optimize=True)
    sharp.save(os.path.join(HOME, f"{name}.jpg"), "JPEG", quality=92, optimize=True, subsampling=0)
    print("wrote", name, sharp.size)


def promo_match(name: str, bg_top, bg_bot, left, right, lines: list[str], extra=None) -> None:
    im = gradient((512, 512), bg_top, bg_bot)
    d = ImageDraw.Draw(im)
    # pitch glow
    d.ellipse((40, 40, 472, 360), outline=(255, 255, 255, ), width=3)
    if extra:
        extra(d, im)
    badge(d, (170, 210), 78, left[0], left[1], left[2] if len(left) > 2 else (255, 255, 255))
    badge(d, (342, 210), 78, right[0], right[1], right[2] if len(right) > 2 else (255, 255, 255))
    label_block(im, lines)
    save_tile(im, name)


def promo_lucky() -> None:
    im = gradient((512, 512), (140, 8, 22), (40, 0, 8))
    d = ImageDraw.Draw(im)
    colors = [(230, 190, 40), (240, 240, 240), (210, 40, 40), (40, 140, 220)]
    positions = [(110, 150), (250, 110), (390, 155), (160, 280), (340, 270)]
    f = font(INTER, 36)
    for i, (xy, col) in enumerate(zip(positions, colors + colors)):
        circle(d, xy, 48, col, (255, 255, 255), 4)
        n = str((i % 9) + 1)
        bbox = d.textbbox((0, 0), n, font=f)
        d.text((xy[0] - (bbox[2] - bbox[0]) / 2, xy[1] - 22), n, font=f, fill=(20, 20, 20) if sum(col) > 400 else (255, 255, 255))
    label_block(im, ["Lucky Numbers"])
    save_tile(im, "lucky-numbers")


def promo_halloween() -> None:
    im = gradient((512, 512), (48, 12, 72), (12, 4, 18))
    d = ImageDraw.Draw(im)
    d.ellipse((70, 70, 190, 190), fill=(240, 150, 20))
    d.polygon([(256, 70), (330, 250), (182, 250)], fill=(90, 20, 130))
    d.ellipse((210, 210, 302, 302), fill=(255, 210, 80))
    d.ellipse((300, 120, 420, 240), fill=(40, 180, 70))
    label_block(im, ["TaDa", "Halloween"])
    save_tile(im, "tada-halloween")


def promo_nba() -> None:
    im = gradient((512, 512), (18, 16, 48), (8, 6, 16))
    d = ImageDraw.Draw(im)
    d.ellipse((86, 40, 426, 380), outline=(220, 170, 50), width=10)
    d.ellipse((156, 110, 356, 310), outline=(220, 170, 50), width=7)
    d.ellipse((226, 180, 286, 240), fill=(220, 170, 50))
    label_block(im, ["NBA Night"])
    save_tile(im, "nba-night")


def virtuals_banner() -> None:
    im = gradient((1920, 360), (18, 48, 28), (8, 12, 16))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 1920, 360), outline=None)
    d.ellipse((1280, -80, 2100, 420), fill=(22, 90, 48))
    d.polygon([(1500, 80), (1780, 180), (1500, 280)], fill=(255, 255, 255))
    title = font(INTER, 54)
    sub = font(INTER_REG, 28)
    d.text((72, 108), "Lead by 2 at half-time?", font=title, fill=(255, 255, 255))
    d.text((72, 180), "SportyBets SIM  ·  Play the demo now", font=sub, fill=(180, 220, 190))
    d.rounded_rectangle((72, 240, 280, 300), 24, fill=(18, 161, 80))
    d.text((102, 252), "PLAY NOW", font=font(INTER, 24), fill=(255, 255, 255))
    im = im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=70, threshold=2))
    path = os.path.join(VIRTUALS, "banner.jpg")
    im.save(path, "JPEG", quality=90, optimize=True, subsampling=0)
    print("wrote banner", im.size, os.path.getsize(path))


def virtual_card(name: str, top, bot, motif: str) -> None:
    im = gradient((1200, 800), top, bot)
    d = ImageDraw.Draw(im)
    if motif == "ball":
        circle(d, (860, 400), 170, (245, 245, 245), (20, 20, 20), 8)
        d.polygon([(860, 270), (930, 330), (900, 410), (820, 410), (790, 330)], fill=(20, 20, 20))
    elif motif == "cup":
        d.polygon([(760, 180), (980, 180), (930, 420), (810, 420)], fill=(230, 190, 50))
        d.rectangle((820, 420, 920, 560), fill=(230, 190, 50))
        d.rectangle((780, 560, 960, 600), fill=(200, 150, 30))
    elif motif == "hoop":
        d.ellipse((700, 160, 1060, 360), outline=(230, 80, 30), width=18)
        d.rectangle((860, 360, 900, 640), fill=(240, 240, 240))
        d.polygon([(700, 640), (1060, 640), (980, 720), (780, 720)], fill=(180, 90, 30))
    elif motif == "dog":
        d.ellipse((740, 300, 1020, 520), fill=(180, 150, 110))
        d.ellipse((980, 260, 1100, 380), fill=(180, 150, 110))
        d.polygon([(1080, 300), (1180, 250), (1100, 340)], fill=(180, 150, 110))
    elif motif == "net":
        d.arc((680, 180, 1080, 620), 200, 340, fill=(240, 240, 240), width=14)
        circle(d, (880, 500), 70, (245, 245, 245), (20, 20, 20), 6)
    else:
        d.rounded_rectangle((720, 180, 1080, 620), 40, outline=(255, 255, 255), width=10)
        circle(d, (900, 400), 90, (18, 161, 80))
    im = im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=80, threshold=2))
    path = os.path.join(VIRTUALS, f"{name}.png")
    im.save(path, "PNG", optimize=True)
    print("wrote", name, im.size, os.path.getsize(path))


def main() -> None:
    promo_match(
        "mci-sun",
        (10, 40, 70),
        (6, 10, 16),
        ((108, 171, 221), "MCI"),
        ((227, 30, 38), "SUN"),
        ["MCI vs SUN"],
    )
    promo_match(
        "ful-mun",
        (18, 18, 18),
        (8, 8, 8),
        ((255, 255, 255), "FUL", (20, 20, 20)),
        ((218, 41, 28), "MUN"),
        ["FUL vs MUN"],
    )
    promo_lucky()
    promo_match(
        "atm-rma",
        (90, 10, 24),
        (18, 8, 28),
        ((206, 53, 36), "ATM"),
        ((253, 185, 19), "RMA", (20, 20, 20)),
        ["ATM vs RMA"],
        extra=lambda d, im: d.text((150, 70), "1up  2up", font=font(INTER, 40), fill=(255, 210, 70)),
    )
    promo_halloween()
    promo_nba()
    virtuals_banner()
    cards = [
        ("world-cup", (12, 40, 90), (90, 16, 16), "cup"),
        ("scheduled-football", (48, 10, 80), (90, 40, 10), "ball"),
        ("instant-football", (90, 16, 16), (30, 6, 6), "ball"),
        ("vfootball", (8, 20, 70), (10, 30, 90), "ball"),
        ("legends", (10, 50, 24), (6, 20, 12), "cup"),
        ("penalty", (50, 10, 16), (18, 10, 18), "net"),
        ("african-cup", (160, 90, 10), (16, 70, 30), "cup"),
        ("basketball", (90, 40, 10), (20, 12, 8), "hoop"),
        ("dog-racing", (10, 40, 70), (8, 12, 24), "dog"),
        ("sim", (50, 50, 16), (16, 16, 8), "net"),
        ("scheduled-virtuals", (50, 32, 8), (16, 12, 8), "ball"),
        ("golden-virtuals", (16, 16, 16), (50, 36, 8), "cup"),
    ]
    for item in cards:
        virtual_card(*item)


if __name__ == "__main__":
    main()
