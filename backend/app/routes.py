from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import logging
from .model import model_manager
from .utils import preprocess_image, apply_softmax, get_prediction
from .constants import CLASS_LABELS, COIN_MAP

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/ping")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

@router.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    """
    Classify uploaded recyclable material image
    
    Args:
        file: Uploaded image file
        
    Returns:
        dict: Classification result with material, confidence, and coins earned
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload an image file."
            )
        
        # Read image bytes
        image_bytes = await file.read()
        
        if len(image_bytes) == 0:
            raise HTTPException(
                status_code=400,
                detail="Empty file uploaded"
            )
        
        # Preprocess image
        try:
            image_tensor = preprocess_image(image_bytes)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Image preprocessing failed: {str(e)}"
            )
        
        # Run model inference
        try:
            logits = model_manager.predict(image_tensor)
            probabilities = apply_softmax(logits)
            predicted_class_idx, confidence = get_prediction(probabilities)
            
        except Exception as e:
            logger.error(f"Model inference failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Model inference failed"
            )
        
        # Get material name and coins
        if predicted_class_idx >= len(CLASS_LABELS):
            raise HTTPException(
                status_code=500,
                detail="Invalid model prediction"
            )
            
        material = CLASS_LABELS[predicted_class_idx]
        coins_earned = COIN_MAP.get(material, 0.0)
        
        # Log prediction
        logger.info(f"Classified image as {material} with confidence {confidence:.3f}")
        
        return {
            "material": material,
            "confidence": float(confidence),
            "coinsEarned": float(coins_earned)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in classify_image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        ) 