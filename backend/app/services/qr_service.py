import cv2
import numpy as np
import logging
from typing import Dict, Any, Tuple, Optional
from fastapi import UploadFile, HTTPException

logger = logging.getLogger("scamsense.qr")

class QRScannerService:
    def __init__(self):
        self.detector = cv2.QRCodeDetector()

    async def decode_qr_image(self, file: UploadFile) -> Dict[str, Any]:
        """Read uploaded image file and decode contained QR code matrix."""
        # 1. Validate file content type & size
        if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/bmp"]:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image file format '{file.content_type}'. Please upload PNG, JPG, or WEBP."
            )

        content = await file.read()
        if len(content) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=400, detail="Image file size exceeds 10MB limit.")

        try:
            # 2. Convert binary bytes to numpy image matrix
            nparr = np.frombuffer(content, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise HTTPException(status_code=400, detail="Could not decode uploaded image file.")

            # 3. Detect and decode QR code
            decoded_text, points, _ = self.detector.detectAndDecode(img)
            
            if not decoded_text:
                return {
                    "success": False,
                    "error": "No QR code detected or image is unreadable.",
                    "payload_text": None,
                    "payload_type": None
                }

            # Determine payload type (URL or text)
            payload_str = decoded_text.strip()
            is_url = payload_str.startswith(("http://", "https://", "www.")) or (
                "." in payload_str and " " not in payload_str
            )

            return {
                "success": True,
                "error": None,
                "payload_text": payload_str,
                "payload_type": "url" if is_url else "text"
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"QR decoding failed: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to process QR code image: {str(e)}")
