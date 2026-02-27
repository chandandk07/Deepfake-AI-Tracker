"""
Debug: Show raw labels from BOTH models on a synthetic test image.
Run: python debug_labels.py
"""
import sys
from PIL import Image
import numpy as np
from transformers import pipeline

def make_photo_like():
    arr = np.zeros((224, 224, 3), dtype=np.uint8)
    for i in range(224):
        for j in range(224):
            arr[i, j] = [
                int(80 + 80*np.sin(i/30)),
                int(60 + 60*np.cos(j/25)),
                int(100 + 50*np.sin((i+j)/40))
            ]
    return Image.fromarray(arr)

def make_flat():
    arr = np.full((224, 224, 3), [200, 150, 180], dtype=np.uint8)
    return Image.fromarray(arr)

print("="*60)
print("LOADING MODEL 1: dima806/deepfake_vs_real_image_detection")
print("="*60)
sys.stdout.flush()
clf1 = pipeline("image-classification", model="dima806/deepfake_vs_real_image_detection", device=-1, top_k=None)
print("Model 1 loaded OK")

print("="*60)
print("LOADING MODEL 2: Organika/sdxl-detector")
print("="*60)
sys.stdout.flush()
try:
    clf2 = pipeline("image-classification", model="Organika/sdxl-detector", device=-1, top_k=None)
    has_m2 = True
    print("Model 2 loaded OK")
except Exception as e:
    print(f"Model 2 failed: {e}")
    has_m2 = False

img1 = make_photo_like()
img2 = make_flat()

for name, img in [("photo-like (natural)", img1), ("flat-color (synthetic)", img2)]:
    print(f"\n{'='*60}")
    print(f"Image: {name}")
    print(f"{'='*60}")

    print("\nMODEL 1 - dima806:")
    r1 = clf1(img)
    for r in r1:
        print(f"  label={repr(r['label']):<35}  score={r['score']:.5f}")

    if has_m2:
        print("\nMODEL 2 - Organika/sdxl-detector:")
        r2 = clf2(img)
        for r in r2:
            print(f"  label={repr(r['label']):<35}  score={r['score']:.5f}")

print("\nDone.")
