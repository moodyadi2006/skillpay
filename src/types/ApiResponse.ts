import { Resume } from "@/model/Freelancer";

export interface ApiResponse {
  success: boolean;
  message: string;
  resume?: Resume;
}