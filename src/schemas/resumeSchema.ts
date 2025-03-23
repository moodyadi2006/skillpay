import { z } from 'zod';
import { fullNameValidation } from './signUpSchema';

export const resumeSchema = z.object({
  fullName: fullNameValidation,
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().regex(/^\+?\d{10,15}$/, { message: "Enter a valid phone number (10-15 digits, optional +)." }),
  careerObjective: z.string().min(10, { message: "Career Objective must be at least 10 characters long." }),
  education: z.array(z.string()).min(1, { message: "Please specify at least one recent education entry." }),
  workExperience: z.array(z.string()).min(1, { message: "If no experience, write 'NA'." }),
  extraCurricularActivities: z.array(z.string()).min(1, { message: "If not interested in co-curricular activities, write 'NA'." }),
  trainings: z.array(z.string()).min(1, { message: "If no trainings done, write 'NA'." }),
  projects: z.array(z.string()).min(1, { message: "If no projects are present, write 'NA'." }),
  skills: z.array(z.string()).min(1, { message: "Please specify at least one skill." }),
  workSamples: z.array(z.string()).min(1, { message: "Provide at least one social media or portfolio link." }),
  additionalDetails: z.array(z.string()).min(1, { message: "Provide additional details or write 'NA'." })
});
