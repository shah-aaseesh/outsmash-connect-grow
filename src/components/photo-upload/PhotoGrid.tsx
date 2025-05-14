
import { Button } from "@/components/ui/button";
import { X, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface PhotoGridProps {
  photos: string[];
  maxPhotos: number;
  onRemovePhoto: (index: number) => void;
  onUploadClick: () => void;
  uploading: boolean;
}

export const PhotoGrid = ({
  photos,
  maxPhotos,
  onRemovePhoto,
  onUploadClick,
  uploading,
}: PhotoGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {Array.isArray(photos) && photos.map((url: string, index: number) => (
        <div 
          key={`photo-${index}-${url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))}`}
          className="relative aspect-square rounded-md overflow-hidden group border border-border"
        >
          <AspectRatio ratio={1/1}>
            <img 
              src={url} 
              alt={`User photo ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Handle image load errors
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                toast({
                  variant: "destructive",
                  title: "Image Error",
                  description: "Failed to load image. It may have been deleted or is unavailable."
                });
              }}
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full"
              onClick={() => onRemovePhoto(index)}
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      
      {photos.length < maxPhotos && (
        <div className={cn(
          "border border-dashed border-border rounded-md flex flex-col items-center justify-center p-4",
          "hover:border-primary/50 transition-colors cursor-pointer"
        )}>
          <button
            type="button"
            onClick={onUploadClick}
            className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
            disabled={uploading}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                <span className="text-sm text-muted-foreground text-center">Uploading...</span>
              </div>
            ) : (
              <>
                <Image className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground text-center font-medium">
                  Upload photos
                </span>
                <span className="text-xs text-muted-foreground/70 text-center mt-1">
                  Click or drag files here
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
