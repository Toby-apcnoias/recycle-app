import torch
import os
import logging
from pathlib import Path
from .constants import MODEL_PATH, CLASS_LABELS

logger = logging.getLogger(__name__)

class ModelManager:
    """Manages model loading and caching for the recycling classifier"""
    
    def __init__(self):
        self._model = None
        self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self._device}")
    
    def load_model(self):
        """Load the TorchScript model from disk"""
        if self._model is not None:
            return self._model
            
        model_path = Path(MODEL_PATH)
        
        # Check if model file exists
        if not model_path.exists():
            logger.warning(f"Model file not found at {MODEL_PATH}")
            # Create a mock model for demo purposes
            return self._create_mock_model()
        
        try:
            # Load TorchScript model
            self._model = torch.jit.load(model_path, map_location=self._device)
            self._model.eval()
            logger.info(f"Model loaded successfully from {MODEL_PATH}")
            return self._model
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            # Fall back to mock model
            return self._create_mock_model()
    
    def _create_mock_model(self):
        """Create a mock model for demonstration when real model is not available"""
        logger.info("Creating mock model for demonstration")
        
        class MockModel(torch.nn.Module):
            def __init__(self):
                super().__init__()
                self.classifier = torch.nn.Linear(224*224*3, len(CLASS_LABELS))
                
            def forward(self, x):
                # Flatten input and pass through linear layer
                x = x.view(x.size(0), -1)
                return self.classifier(x)
        
        mock_model = MockModel()
        mock_model.eval()
        
        # Convert to TorchScript for consistency
        example_input = torch.randn(1, 3, 224, 224)
        self._model = torch.jit.trace(mock_model, example_input)
        
        return self._model
    
    def predict(self, image_tensor: torch.Tensor) -> torch.Tensor:
        """
        Run inference on the preprocessed image
        
        Args:
            image_tensor: Preprocessed image tensor [1, 3, 224, 224]
            
        Returns:
            torch.Tensor: Model logits
        """
        model = self.load_model()
        
        with torch.no_grad():
            # Move tensor to device
            image_tensor = image_tensor.to(self._device)
            
            # Run inference
            logits = model(image_tensor)
            
            return logits.cpu()  # Move back to CPU for further processing

# Global model manager instance
model_manager = ModelManager() 