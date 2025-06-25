# Material classification constants
COIN_MAP = {
    "Wood": 0.20,
    "Glass": 0.15,
    "Steel": 0.10,
    "Copper": 0.25,
    "Aluminum": 0.15,
    "Iron": 0.10,
    "Plastic-PET": 0.05,
    "Plastic-HDPE": 0.05,
    "Electrical Wiring": 0.30,
    "Plumbing-PVC": 0.10
}

# Class labels for the model (must match training order)
CLASS_LABELS = [
    "Wood",
    "Glass", 
    "Steel",
    "Copper",
    "Aluminum",
    "Iron",
    "Plastic-PET",
    "Plastic-HDPE",
    "Electrical Wiring",
    "Plumbing-PVC"
]

# Model configuration
MODEL_PATH = "models/model.pt"
INPUT_SIZE = 224 