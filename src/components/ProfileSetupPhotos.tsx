
import { useRef } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PhotoGrid } from "@/components/photo-upload/PhotoGrid";
import { PhotoTips } from "@/components/photo-upload/PhotoTips";
import { usePhotoUpload } from "@/hooks/use-photo-upload";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/components/photo-upload/ImagePreview";

const MAX_PHOTOS = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ProfileSetupPhotos = ({ form }: { form: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    uploading, 
    uploadError, 
    handleFileUpload, 
    removePhoto,
    previewFiles,
    removePreviewFile,
    uploadPreviewFiles
  } = usePhotoUpload({
    form,
    maxPhotos: MAX_PHOTOS,
    maxFileSize: MAX_FILE_SIZE
  });
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Add Your Photos</h2>
        <p className="text-muted-foreground text-sm">
          Upload photos that show your best self
        </p>
      </div>
      
      {uploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <FormField
        control={form.control}
        name="photos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photos (Maximum {MAX_PHOTOS})</FormLabel>
            
            {/* Display uploaded photos */}
            <PhotoGrid
              photos={field.value || []}
              maxPhotos={MAX_PHOTOS - (previewFiles.length || 0)}
              onRemovePhoto={removePhoto}
              onUploadClick={handleUploadClick}
              uploading={uploading}
            />
            
            {/* Display preview files if there are any */}
            {previewFiles.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Selected photos</h3>
                  <Button 
                    onClick={uploadPreviewFiles} 
                    disabled={uploading}
                    size="sm"
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload selected"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {previewFiles.map((file, index) => (
                    <ImagePreview
                      key={`preview-${index}-${file.name}`}
                      file={file}
                      onRemove={() => removePreviewFile(index)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="photo-upload"
              ref={fileInputRef}
              multiple
              disabled={uploading}
            />
            
            <FormMessage />
            <p className="text-xs text-muted-foreground mt-2">
              Upload clear photos that show your face (max 5MB each). First photo will be your main profile picture.
            </p>
          </FormItem>
        )}
      />
      
      <PhotoTips />
    </div>
  );
};

export default ProfileSetupPhotos;
