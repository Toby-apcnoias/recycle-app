import pytest
import requests
import io
from PIL import Image

# Test configuration
API_BASE_URL = "http://localhost:8000"

def test_ping_endpoint():
    """Test the health check endpoint"""
    response = requests.get(f"{API_BASE_URL}/ping")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

def test_root_endpoint():
    """Test the root endpoint"""
    response = requests.get(f"{API_BASE_URL}/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data

def create_test_image():
    """Create a test image for upload testing"""
    # Create a simple RGB image
    img = Image.new('RGB', (224, 224), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes

def test_classify_endpoint():
    """Test the image classification endpoint"""
    # Create test image
    test_image = create_test_image()
    
    # Prepare file for upload
    files = {'file': ('test.jpg', test_image, 'image/jpeg')}
    
    response = requests.post(f"{API_BASE_URL}/classify", files=files)
    assert response.status_code == 200
    
    data = response.json()
    assert "material" in data
    assert "confidence" in data
    assert "coinsEarned" in data
    
    # Validate response types
    assert isinstance(data["material"], str)
    assert isinstance(data["confidence"], (int, float))
    assert isinstance(data["coinsEarned"], (int, float))
    
    # Validate confidence range
    assert 0.0 <= data["confidence"] <= 1.0

def test_classify_invalid_file():
    """Test classification endpoint with invalid file"""
    # Test with non-image file
    files = {'file': ('test.txt', io.StringIO('not an image'), 'text/plain')}
    
    response = requests.post(f"{API_BASE_URL}/classify", files=files)
    assert response.status_code == 400

if __name__ == "__main__":
    # Run tests manually
    print("Running backend tests...")
    
    try:
        test_ping_endpoint()
        print("✅ Ping endpoint test passed")
        
        test_root_endpoint()
        print("✅ Root endpoint test passed")
        
        test_classify_endpoint()
        print("✅ Classify endpoint test passed")
        
        test_classify_invalid_file()
        print("✅ Invalid file test passed")
        
        print("🎉 All tests passed!")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        exit(1) 