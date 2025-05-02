
import * as React from "react";
import { 
  User, 
  CalendarIcon,
  MapPin,
  Camera,
  Heart,
  Settings,
  Mic 
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  User,
  CalendarIcon,
  MapPin,
  Camera,
  Heart,
  Settings,
  Mic
};

interface ProfileSetupProgressProps {
  steps: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  currentStep: number;
}

const ProfileSetupProgress: React.FC<ProfileSetupProgressProps> = ({
  steps,
  currentStep
}) => {
  return (
    <div className="flex items-center justify-between mb-6 px-2 relative">
      {steps.map((s, i) => {
        const IconComponent = iconMap[s.icon] || User;
        
        return (
          <div 
            key={s.id}
            className="flex flex-col items-center"
          >
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-1
                ${i < currentStep 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : i === currentStep 
                  ? "border-primary text-primary" 
                  : "border-muted-foreground/30 text-muted-foreground/50"
                }`}
            >
              {i < currentStep ? (
                <span>✓</span>
              ) : (
                <IconComponent className="h-5 w-5" />
              )}
            </div>
            <span 
              className={`text-xs font-medium hidden md:block
                ${i <= currentStep ? "text-primary" : "text-muted-foreground/50"}`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileSetupProgress;
