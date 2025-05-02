
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  gender: z.string().min(1, { message: "Please select your gender" }),
  birthdate: z.date({ required_error: "Please select your birth date" }),
  location: z.string().min(1, { message: "Please enter your location" }),
  photos: z.array(z.string()).min(1, { message: "Please upload at least one photo" }),
  interests: z.array(z.string()).min(1, { message: "Please select at least one interest" }),
  lookingFor: z.array(z.string()).min(1, { message: "Please select what you're looking for" }),
  ageRange: z.object({
    min: z.number().min(18),
    max: z.number().min(18)
  }),
  distance: z.number().min(1),
  bio: z.string().min(10, { message: "Please write a bit more about yourself" }).max(500),
  prompt1: z.string().optional(),
  prompt2: z.string().optional()
});

export type ProfileFormValues = z.infer<typeof formSchema>;

export const steps = [
  { id: "name", label: "Name", icon: "User" },
  { id: "birthdate", label: "Birth Date", icon: "CalendarIcon" },
  { id: "gender", label: "Gender", icon: "User" },
  { id: "location", label: "Location", icon: "MapPin" },
  { id: "photos", label: "Photos", icon: "Camera" },
  { id: "interests", label: "Interests", icon: "Heart" },
  { id: "preferences", label: "Preferences", icon: "Settings" },
  { id: "bio", label: "About You", icon: "Mic" }
];

export const getFieldsForStep = (stepIndex: number): string[] => {
  switch (stepIndex) {
    case 0: return ["name"];
    case 1: return ["birthdate"];
    case 2: return ["gender"];
    case 3: return ["location"];
    case 4: return ["photos"];
    case 5: return ["interests"];
    case 6: return ["lookingFor", "ageRange", "distance"];
    case 7: return ["bio", "prompt1", "prompt2"];
    default: return [];
  }
};
