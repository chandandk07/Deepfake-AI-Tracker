"""
Quick diagnostic — run this to see RAW model output for any image.
Usage:  python test_model.py path\to\your_photo.jpg
        python test_model.py path\to\ai_generated.jpg
"""
import sys
from PIL import Image
import numpy as np
import cv2
from transformers import pipeline

MODEL_ID = "dima806/deepfake_vs_real_image_detection"
print(f"\nLoading {MODEL_ID} ...")
clf = pipeline("image-classification", model=MODEL_ID, device=-1, top_k=None)
print("Ready.\n")

FACE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

def crop_face(img_path):
    img = Image.open(img_path).convert("RGB")
    arr = np.array(img)
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    for params in [
        dict(scaleFactor=1.05, minNeighbors=3, minSize=(48,48)),
        dict(scaleFactor=1.1,  minNeighbors=2, minSize=(32,32)),
        dict(scaleFactor=1.15, minNeighbors=1, minSize=(24,24)),
    ]:
        faces = FACE_CASCADE.detectMultiScale(gray, **params)
        if len(faces) > 0:
            x,y,w,h = faces[0]
            pad_x, pad_y = int(w*0.3), int(h*0.3)
            x1=max(0,x-pad_x); y1=max(0,y-pad_y)
            x2=min(arr.shape[1],x+w+pad_x); y2=min(arr.shape[0],y+h+pad_y)
            crop = Image.fromarray(arr[y1:y2,x1:x2])
            print(f"  ✅ Face found at ({x},{y},{w},{h}) → cropped to {crop.size}")
            return crop, True
    # Fallback: centre square crop
    w_i, h_i = img.size
    side = min(w_i, h_i)
    left = (w_i-side)//2; top = (h_i-side)//2
    crop = img.crop((left, top, left+side, top+side))
    print(f"  ⚠️  No face detected → centre-crop fallback {crop.size}")
    return crop, False

def infer(img_path, label):
    print(f"\n{'='*55}")
    print(f"  File:  {img_path}")
    print(f"  Type:  {label}")
    print(f"{'='*55}")
    crop, face_found = crop_face(img_path)
    resized = crop.resize((224,224))
    results = clf(resized)
    print(f"\n  RAW MODEL OUTPUT:")
    for r in results:
        bar = "█" * int(r['score']*40)
        print(f"    {r['label']:12s}  {r['score']:.5f}  {bar}")

    # Show what each interpretation gives
    fake_label_score = None
    for r in results:
        if any(k in r['label'].lower() for k in ("fake","deepfake","artificial","generated")):
            fake_label_score = r['score']
    if fake_label_score is not None:
        direct   = fake_label_score
        inverted = 1.0 - fake_label_score
        print(f"\n  If NO inversion : fake_prob = {direct:.4f}  → {'DEEPFAKE' if direct>=0.8 else 'SUSPICIOUS' if direct>=0.5 else 'AUTHENTIC'}")
        print(f"  If INVERTED     : fake_prob = {inverted:.4f}  → {'DEEPFAKE' if inverted>=0.8 else 'SUSPICIOUS' if inverted>=0.5 else 'AUTHENTIC'}")
        print(f"\n  Ground truth: {label}")
        correct_no_inv = (label=="REAL" and direct<0.5) or (label=="FAKE" and direct>=0.8)
        correct_inv    = (label=="REAL" and inverted<0.5) or (label=="FAKE" and inverted>=0.8)
        print(f"  No-inversion correct? {'✅ YES' if correct_no_inv else '❌ NO'}")
        print(f"  Inversion correct?    {'✅ YES' if correct_inv else '❌ NO'}")

if len(sys.argv) >= 3:
    infer(sys.argv[1], sys.argv[2].upper())   # e.g. python test_model.py photo.jpg REAL
elif len(sys.argv) == 2:
    infer(sys.argv[1], "UNKNOWN")
else:
    print("Usage:  python test_model.py <image_path> <REAL|FAKE>")
    print("Example:")
    print("  python test_model.py myPhoto.jpg REAL")
    print("  python test_model.py ai_face.jpg FAKE")
