
interface PhotoTipsProps {
  className?: string;
}

export const PhotoTips = ({ className }: PhotoTipsProps) => {
  return (
    <div className={`p-4 bg-primary/5 rounded-md ${className}`}>
      <h3 className="font-medium mb-2">Photo Tips</h3>
      <ul className="text-sm space-y-1">
        <li>• Use high quality, recent photos</li>
        <li>• Include at least one clear photo of your face</li>
        <li>• Add photos showing your interests and lifestyle</li>
        <li>• Avoid group photos for your main image</li>
        <li>• Include full-body photos</li>
      </ul>
    </div>
  );
};
