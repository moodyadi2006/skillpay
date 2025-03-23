import mongoose, { Schema, Document } from "mongoose";

export interface Resume extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  careerObjective: string;
  education: string[];
  workExperience: string[];
  extraCurricularActivities?: string[];
  trainings?: string[];
  projects?: string[];
  skills: string[];
  workSamples: string[];
  additionalDetails?: string[];
  jobId: mongoose.Types.ObjectId;
}

const ResumeSchema: Schema<Resume> = new Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email address",
    ],
  },
  phoneNumber: { type: String, required: true },
  careerObjective: { type: String, required: true },
  education: { type: [String], required: true },
  workExperience: { type: [String], required: true },
  extraCurricularActivities: { type: [String] },
  trainings: { type: [String] },
  projects: { type: [String] },
  skills: { type: [String], required: true },
  workSamples: { type: [String], required: true },
  additionalDetails: { type: [String] },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPost",
    required: true,
  },
});

export const ResumeModel =
  (mongoose.models.Resume as mongoose.Model<Resume>) ||
  mongoose.model<Resume>("Resume", ResumeSchema);

export interface Payment {
  sender: string;
  amount: number;
  orderId: string;
}

export interface Freelancer extends Document {
  fullName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  resume: mongoose.Types.ObjectId;
  feedbacks: {
    sender: string;
    feedback: string;
    title: string;
    time: Date;
  }[];
}

const FreelancerSchema: Schema<Freelancer> = new Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email address",
    ],
  },
  password: { type: String, required: true },
  verifyCode: { type: String, required: true },
  verifyCodeExpiry: { type: Date, required: true },
  isVerified: { type: Boolean, required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" }, // Corrected reference
  feedbacks: [
    {
      sender: { type: String, required: true },
      feedback: { type: String, required: true },
      title: { type: String, required: true },
      time: { type: Date, required: true },
    },
  ],
});

export const FreelancerModel =
  (mongoose.models.Freelancer as mongoose.Model<Freelancer>) ||
  mongoose.model<Freelancer>("Freelancer", FreelancerSchema);
