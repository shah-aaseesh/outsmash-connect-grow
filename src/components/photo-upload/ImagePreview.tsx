
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export const ImagePreview = ({ file, onRemove }: ImagePreviewProps) => {
  const [isValid, setIsValid] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  // Create preview when component mounts
  useState(() => {
    if (!file) return;
    
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Clean up function to revoke the object URL when component unmounts
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  });

  const handleImageError = () => {
    setIsValid(false);
  };

  return (
    <div className="relative aspect-square rounded-md overflow-hidden group border border-border bg-muted/30">
      <AspectRatio ratio={1/1}>
        {preview ? (
          <img 
            src={preview}
            alt={`Preview of ${file.name}`}
            className={cn(
              "w-full h-full object-cover transition-opacity",
              isValid ? "opacity-100" : "opacity-50"
            )}
            onError={handleImageError}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading preview...
          </div>
        )}
        
        {!isValid && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-destructive p-2 text-center">
            <AlertCircle className="h-8 w-8 mb-1" />
            <p className="text-xs">Invalid image format</p>
          </div>
        )}
      </AspectRatio>
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          type="button"
          className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full"
          onClick={onRemove}
          aria-label="Remove photo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
