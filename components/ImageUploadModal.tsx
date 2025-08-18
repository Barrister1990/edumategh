// @ts-nocheck
import React, { useState } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (altText: string, url: string) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [altText, setAltText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const result = await uploadToCloudinary(file, 'curriculum/thumbnails');
        setImageUrl(result.secure_url);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        // Handle error (e.g., show a toast message)
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleInsert = () => {
    if (altText && imageUrl) {
      onInsert(altText, imageUrl);
      onClose();
      setAltText('');
      setImageUrl('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  // Allow Ctrl+Enter for new lines
                  return;
                }
                if (e.key === 'Enter' && (e.target as HTMLInputElement).form) {
                  // Prevent form submission on Enter key
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              placeholder="Descriptive text for the image"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  // Allow Ctrl+Enter for new lines
                  return;
                }
                if (e.key === 'Enter' && (e.target as HTMLInputElement).form) {
                  // Prevent form submission on Enter key
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="text-center text-sm text-gray-500">OR</div>
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload from Computer</Label>
            <Input id="image-upload" type="file" onChange={handleFileChange} accept="image/*" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleInsert} disabled={!altText || !imageUrl || isUploading}>
            {isUploading ? 'Uploading...' : 'Insert Image'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
