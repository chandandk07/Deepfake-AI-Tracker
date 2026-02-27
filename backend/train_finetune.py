"""
DeepShield AI — Fine-Tuning Script
====================================
Downloads the 'yashduhan/DeepFakeDetection' dataset (140K real+fake face images)
from HuggingFace and fine-tunes the ViT-based deepfake detection model.

WHY THIS FIXES FALSE POSITIVES:
  The base model (dima806/deepfake_vs_real_image_detection) was trained ~3 years
  ago on older GAN-generated images. Newer real-world photos (phone cameras,
  social media) look different enough to trigger false positives.
  Fine-tuning on a modern, larger dataset corrects this concept drift.

USAGE:
  python train_finetune.py

OUTPUT:
  Saves fine-tuned model to ./finetuned_model/
  server.py will automatically detect and use this model.

ESTIMATED TIME:
  CPU only  : ~3-6 hours (depends on your machine)
  With GPU  : ~20-40 minutes
"""

import os, sys, time
from pathlib import Path
import numpy as np

print("📦 Checking and importing dependencies...")

try:
    import torch
    from torch.utils.data import DataLoader
    from transformers import (
        ViTForImageClassification,
        ViTImageProcessor,
        TrainingArguments,
        Trainer,
    )
    from datasets import load_dataset
    from PIL import Image
    import evaluate
except ImportError as e:
    print(f"\n❌ Missing dependency: {e}")
    print("Please run: pip install transformers datasets evaluate torch pillow accelerate")
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────

BASE_MODEL      = "dima806/deepfake_vs_real_image_detection"
DATASET_NAME    = "yashduhan/DeepFakeDetection"
OUTPUT_DIR      = "./finetuned_model"
NUM_EPOCHS      = 3
BATCH_SIZE      = 16
LEARNING_RATE   = 2e-5
MAX_TRAIN       = 10000   # Use 10K samples for faster training (increase for better accuracy)
MAX_EVAL        = 2000    # Eval on 2K samples

LABEL2ID = {"Real": 0, "Fake": 1}
ID2LABEL = {0: "Real", 1: "Fake"}

print(f"\n🔧 Configuration:")
print(f"   Base model  : {BASE_MODEL}")
print(f"   Dataset     : {DATASET_NAME}")
print(f"   Output dir  : {OUTPUT_DIR}")
print(f"   Epochs      : {NUM_EPOCHS}")
print(f"   Batch size  : {BATCH_SIZE}")
print(f"   Max train   : {MAX_TRAIN} samples")
print(f"   Device      : {'CUDA (GPU) 🚀' if torch.cuda.is_available() else 'CPU (this will be slow)'}")

# ── Load Dataset ──────────────────────────────────────────────────────────────

print(f"\n📥 Downloading dataset: {DATASET_NAME}")
print("   (this may take a while for the first download — ~4GB)")
print("   Progress will appear below...\n")

try:
    ds = load_dataset(DATASET_NAME)
    print(f"✅ Dataset loaded! Splits: {list(ds.keys())}")
    print(f"   Total samples: {sum(len(ds[s]) for s in ds)}")
except Exception as e:
    print(f"\n❌ Failed to load '{DATASET_NAME}': {e}")
    print("\n🔄 Trying fallback dataset: saakshigupta/deepfake-detection-dataset-v3")
    try:
        ds = load_dataset("saakshigupta/deepfake-detection-dataset-v3")
        print(f"✅ Fallback dataset loaded!")
    except Exception as e2:
        print(f"\n❌ Fallback also failed: {e2}")
        print("\n💡 Try manually downloading from:")
        print("   https://huggingface.co/datasets/yashduhan/DeepFakeDetection")
        sys.exit(1)

# ── Inspect Dataset Structure ─────────────────────────────────────────────────

print(f"\n🔍 Dataset structure:")
for split_name, split_data in ds.items():
    print(f"   [{split_name}]: {len(split_data)} samples — columns: {split_data.column_names}")

# Figure out which split to use
train_split = "train" if "train" in ds else list(ds.keys())[0]
test_split  = "test"  if "test"  in ds else ("validation" if "validation" in ds else train_split)

# Figure out label column
sample = ds[train_split][0]
print(f"\n   Sample keys: {list(sample.keys())}")
label_col = "label" if "label" in sample else "labels" if "labels" in sample else None
image_col = "image" if "image" in sample else "img" if "img" in sample else None

if not label_col:
    print("⚠️  Could not find label column. Checking columns...")
    for col in ds[train_split].column_names:
        print(f"   - {col}: {type(ds[train_split][0][col])}")
    label_col = input("Enter the label column name: ").strip()

if not image_col:
    print("⚠️  Could not find image column. Checking columns...")
    image_col = input("Enter the image column name: ").strip()

print(f"   Label column: {label_col}")
print(f"   Image column: {image_col}")

# ── Load Processor & Model ────────────────────────────────────────────────────

print(f"\n🔄 Loading base model: {BASE_MODEL}")
processor = ViTImageProcessor.from_pretrained(BASE_MODEL)
model     = ViTForImageClassification.from_pretrained(
    BASE_MODEL,
    num_labels    = 2,
    id2label      = ID2LABEL,
    label2id      = LABEL2ID,
    ignore_mismatched_sizes = True,
)
print("✅ Base model loaded and ready for fine-tuning\n")

# ── Preprocessing ─────────────────────────────────────────────────────────────

def normalise_label(raw_label) -> int:
    """Convert dataset label to 0=Real, 1=Fake."""
    if isinstance(raw_label, int):
        return raw_label  # assume 0=real, 1=fake already
    lbl = str(raw_label).strip().lower()
    if any(k in lbl for k in ("fake", "deepfake", "ai", "artificial", "generated", "synthetic")):
        return 1
    return 0  # real

def preprocess(batch):
    images = []
    for img in batch[image_col]:
        if not isinstance(img, Image.Image):
            img = Image.fromarray(np.array(img))
        images.append(img.convert("RGB"))

    inputs = processor(images=images, return_tensors="pt")
    inputs["labels"] = torch.tensor([normalise_label(l) for l in batch[label_col]])
    return inputs

print("📊 Preprocessing datasets...")

# Subsample for manageable training time
train_data = ds[train_split].shuffle(seed=42).select(range(min(MAX_TRAIN, len(ds[train_split]))))
eval_data  = ds[test_split ].shuffle(seed=42).select(range(min(MAX_EVAL,  len(ds[test_split]))))

train_data = train_data.with_transform(preprocess)
eval_data  = eval_data.with_transform(preprocess)

print(f"✅ Train: {len(train_data)} samples | Eval: {len(eval_data)} samples")

# ── Metrics ───────────────────────────────────────────────────────────────────

accuracy_metric = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    acc = accuracy_metric.compute(predictions=preds, references=labels)
    # Also report per-class accuracy to track false positives
    real_mask = labels == 0
    fake_mask = labels == 1
    real_acc  = (preds[real_mask] == labels[real_mask]).mean() if real_mask.any() else 0.0
    fake_acc  = (preds[fake_mask] == labels[fake_mask]).mean() if fake_mask.any() else 0.0
    return {
        "accuracy":      acc["accuracy"],
        "real_accuracy": float(real_acc),   # How well we detect REAL images (key metric!)
        "fake_accuracy": float(fake_acc),   # How well we detect FAKE images
    }

# ── Training Arguments ────────────────────────────────────────────────────────

training_args = TrainingArguments(
    output_dir               = OUTPUT_DIR,
    num_train_epochs         = NUM_EPOCHS,
    per_device_train_batch_size = BATCH_SIZE,
    per_device_eval_batch_size  = BATCH_SIZE,
    learning_rate            = LEARNING_RATE,
    weight_decay             = 0.01,
    eval_strategy            = "epoch",
    save_strategy            = "epoch",
    load_best_model_at_end   = True,
    metric_for_best_model    = "real_accuracy",  # Prioritize reducing false positives!
    greater_is_better        = True,
    logging_dir              = "./logs",
    logging_steps            = 50,
    warmup_ratio             = 0.1,
    fp16                     = torch.cuda.is_available(),  # Use FP16 only on GPU
    report_to                = "none",
    save_total_limit         = 2,
    dataloader_num_workers   = 0,  # Windows compatibility
    remove_unused_columns    = False,
)

# ── Trainer ───────────────────────────────────────────────────────────────────

trainer = Trainer(
    model           = model,
    args            = training_args,
    train_dataset   = train_data,
    eval_dataset    = eval_data,
    compute_metrics = compute_metrics,
)

# ── Train! ────────────────────────────────────────────────────────────────────

print("\n" + "="*60)
print("🚀 STARTING FINE-TUNING")
print("="*60)
print(f"⏱️  Estimated time: {'20-40 min (GPU)' if torch.cuda.is_available() else '3-6 hours (CPU)'}")
print("   You can monitor progress below. Press Ctrl+C to stop early.\n")

start = time.time()
try:
    trainer.train()
except KeyboardInterrupt:
    print("\n⚠️  Training interrupted by user. Saving current model...")

elapsed = time.time() - start
print(f"\n✅ Training complete in {elapsed/60:.1f} minutes")

# ── Save Model ────────────────────────────────────────────────────────────────

print(f"\n💾 Saving fine-tuned model to: {OUTPUT_DIR}/")
trainer.save_model(OUTPUT_DIR)
processor.save_pretrained(OUTPUT_DIR)
print("✅ Model saved!")

# ── Final Evaluation ──────────────────────────────────────────────────────────

print("\n📊 Running final evaluation...")
results = trainer.evaluate()
print("\n" + "="*60)
print("📋 FINAL RESULTS:")
print("="*60)
for k, v in results.items():
    print(f"   {k:30s}: {v:.4f}")

print(f"""
{'='*60}
✅ FINE-TUNING COMPLETE!

The improved model is saved at:
  {Path(OUTPUT_DIR).resolve()}

👉 NEXT STEP:
  Restart the Python server to use the fine-tuned model:
    python server.py

  The server automatically detects and loads the fine-tuned
  model instead of the original dima806 model.
{'='*60}
""")
