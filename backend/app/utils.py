import torch
import torchvision.transforms as transforms
from PIL import Image
import io
from .constants import INPUT_SIZE

# Image preprocessing pipeline
def get_image_transform():
    """Get the image preprocessing transform pipeline"""
    return transforms.Compose([
        transforms.Resize((INPUT_SIZE, INPUT_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],  # ImageNet standards
            std=[0.229, 0.224, 0.225]
        )
    ])

def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """
    Preprocess uploaded image for model inference
    
    Args:
        image_bytes: Raw image bytes from upload
        
    Returns:
        torch.Tensor: Preprocessed image tensor ready for model
    """
    try:
        # Open image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary (handles RGBA, grayscale, etc.)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Apply preprocessing transforms
        transform = get_image_transform()
        image_tensor = transform(image)
        
        # Add batch dimension [1, 3, 224, 224]
        image_tensor = image_tensor.unsqueeze(0)
        
        return image_tensor
        
    except Exception as e:
        raise ValueError(f"Failed to preprocess image: {str(e)}")

def apply_softmax(logits: torch.Tensor) -> torch.Tensor:
    """Apply softmax to model logits to get probabilities"""
    return torch.softmax(logits, dim=1)

def get_prediction(probabilities: torch.Tensor) -> tuple[int, float]:
    """
    Get the predicted class and confidence from probabilities
    
    Args:
        probabilities: Softmax probabilities tensor
        
    Returns:
        tuple: (predicted_class_index, confidence_score)
    """
    confidence, predicted_class = torch.max(probabilities, 1)
    return predicted_class.item(), confidence.item() 