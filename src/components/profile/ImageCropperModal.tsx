import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import getCroppedImg from '@/lib/cropImage';

interface ImageCropperModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

export function ImageCropperModal({ imageSrc, onClose, onCropComplete }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropCompleteHandler = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      setIsCropping(true);
      if (!croppedAreaPixels) return;
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden flex flex-col h-[500px] shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-display font-semibold text-lg text-text-primary">Crop your photo</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative flex-1 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        <div className="p-4 space-y-4 border-t border-border bg-bg-card">
          <div>
            <label className="text-xs text-text-secondary mb-2 block">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-accent-primary"
            />
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={onClose} disabled={isCropping}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={isCropping}>
              <Check className="w-4 h-4 mr-2" />
              {isCropping ? 'Cropping...' : 'Apply Crop'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
