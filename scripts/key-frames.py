import glob, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

src = sorted(glob.glob("/tmp/vid/full2/*.png"))
out = sys.argv[1]
os.makedirs(out, exist_ok=True)


def solid_mask(rgb):
    m = rgb.max(2) > 14
    m = ndi.binary_opening(m, iterations=2)
    lab, n = ndi.label(m)
    if n == 0:
        return m
    sizes = ndi.sum(m, lab, range(1, n + 1))
    m = lab == (np.argmax(sizes) + 1)
    m = ndi.binary_closing(m, iterations=6)
    # Pad the bottom row so subjects cut off by the frame edge still get their holes filled.
    p = np.pad(m, ((0, 1), (0, 0)), constant_values=True)
    return ndi.binary_fill_holes(p)[:-1]


masks, frames = [], []
x0 = y0 = 10**9
x1 = y1 = 0
for f in src:
    rgb = np.array(Image.open(f).convert("RGB"))
    m = solid_mask(rgb)
    ys, xs = np.where(m)
    x0, x1 = min(x0, xs.min()), max(x1, xs.max())
    y0, y1 = min(y0, ys.min()), max(y1, ys.max())
    masks.append(m)
    frames.append(rgb)
print("bbox", x0, x1, y0, y1)

pad = 24
cx0, cx1 = max(0, x0 - pad), min(1920, x1 + pad)
cy0, cy1 = max(0, y0 - pad), 1080
scale = float(sys.argv[2]) if len(sys.argv) > 2 else 0.6

for i, (rgb, m) in enumerate(zip(frames, masks)):
    lum = rgb.max(2).astype(np.float32)
    soft = np.clip((lum - 3) / 16, 0, 1)
    core = ndi.gaussian_filter(ndi.binary_erosion(m, iterations=3).astype(np.float32), 1.5)
    band = ndi.binary_dilation(m, iterations=4)
    alpha = np.maximum(core, soft * band)
    rgba = np.dstack([rgb, (alpha * 255).astype(np.uint8)])[cy0:cy1, cx0:cx1]
    im = Image.fromarray(rgba, "RGBA")
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im.save(f"{out}/{i:03d}.webp", "WEBP", quality=78, method=6, alpha_quality=85)
print("size", im.size)
