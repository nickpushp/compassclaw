#!/usr/bin/env python3
"""Generate Compass Claw brand images: og-image.png, logo.png, favicon.ico."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOID = (7, 11, 20)
AMBER = (255, 138, 30)
AMBER2 = (255, 180, 105)
WHITE = (244, 247, 251)
SLATE = (148, 163, 184)

FONT_DIRS = ["C:/Windows/Fonts"]
def font(names, size):
    for n in names:
        for d in FONT_DIRS:
            p = os.path.join(d, n)
            if os.path.exists(p):
                try: return ImageFont.truetype(p, size)
                except Exception: pass
    return ImageFont.load_default()

BOLD = ["segoeuib.ttf", "arialbd.ttf", "Arialbd.ttf"]
REG  = ["segoeui.ttf", "arial.ttf", "Arial.ttf"]


def glow(size, center, radius, color, alpha):
    """A soft radial blob on its own RGBA layer."""
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([center[0]-radius, center[1]-radius, center[0]+radius, center[1]+radius],
              fill=color + (alpha,))
    return layer.filter(ImageFilter.GaussianBlur(radius // 2))


def compass_mark(draw, cx, cy, r, color):
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=color, width=max(2, r//6))
    s = r * 0.62
    draw.polygon([(cx+s*0.55, cy-s*0.55), (cx+s*0.15, cy+s*0.15),
                  (cx-s*0.55, cy+s*0.55), (cx-s*0.15, cy-s*0.15)], fill=color)


def make_og():
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), VOID + (255,))
    img.alpha_composite(glow((W, H), (180, 120), 360, AMBER, 70))
    img.alpha_composite(glow((W, H), (1050, 260), 300, AMBER, 38))
    d = ImageDraw.Draw(img)
    # subtle grid
    for x in range(0, W, 64):
        d.line([(x, 0), (x, H)], fill=(148, 163, 184, 12))
    for y in range(0, H, 64):
        d.line([(0, y), (W, y)], fill=(148, 163, 184, 12))

    m = 90
    # brand row
    compass_mark(d, m + 20, 95, 22, AMBER)
    d.text((m + 56, 74), "Compass", font=font(BOLD, 40), fill=WHITE)
    cw = d.textlength("Compass", font=font(BOLD, 40))
    d.text((m + 56 + cw, 74), "Claw", font=font(BOLD, 40), fill=AMBER)

    # headline
    d.text((m, 200), "Never Miss Another Lead.", font=font(BOLD, 72), fill=WHITE)
    d.text((m, 286), "Your Website Answers", font=font(BOLD, 72), fill=AMBER)
    d.text((m, 372), "Every Call.", font=font(BOLD, 72), fill=AMBER)

    # accent bar + subline
    d.rectangle([m, 478, m + 90, 484], fill=AMBER)
    d.text((m, 508), "24/7 AI Talking Website  ·  Portsmouth, OH  ·  (740) 831-3443",
           font=font(REG, 30), fill=SLATE)

    img.convert("RGB").save(os.path.join(ROOT, "og-image.png"), "PNG")


def make_logo():
    W, H = 640, 180
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    compass_mark(d, 56, 90, 34, AMBER)
    d.text((108, 56), "Compass", font=font(BOLD, 58), fill=WHITE)
    cw = d.textlength("Compass", font=font(BOLD, 58))
    d.text((108 + cw, 56), "Claw", font=font(BOLD, 58), fill=AMBER)
    img.save(os.path.join(ROOT, "logo.png"), "PNG")
    # dark-bg square version for schema logo (Google likes a clear logo)
    sq = Image.new("RGB", (512, 512), VOID)
    ds = ImageDraw.Draw(sq)
    compass_mark(ds, 256, 200, 88, AMBER)
    ds.text((256 - ds.textlength("Compass", font=font(BOLD, 52)) / 2, 330),
            "Compass", font=font(BOLD, 52), fill=WHITE)
    cl = "Claw"
    ds.text((256 - ds.textlength(cl, font=font(BOLD, 52)) / 2, 392), cl, font=font(BOLD, 52), fill=AMBER)
    sq.save(os.path.join(ROOT, "logo-square.png"), "PNG")


def make_favicon():
    sz = 64
    img = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([2, 2, sz-2, sz-2], radius=14, fill=VOID)
    compass_mark(d, sz//2, sz//2, 20, AMBER)
    img.save(os.path.join(ROOT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
    img.save(os.path.join(ROOT, "favicon.png"), "PNG")


if __name__ == "__main__":
    make_og(); make_logo(); make_favicon()
    print("Wrote og-image.png, logo.png, logo-square.png, favicon.ico, favicon.png")
