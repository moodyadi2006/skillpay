import mongoose, { Schema, Document } from "mongoose";

export interface JobPost extends Document {
  title: string;
  description: string;
  techStack: string[];
  reqExperience: number;
  employmentType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Internship"
    | "Freelance";
  salaryRange?: { min: number; max: number };
  location: string;
  isRemote: boolean;
  companyName: string;
  companyLogo?: string;
  applicationDeadline?: Date;
  postedBy: mongoose.Types.ObjectId;
  postedAt: Date;
  responsibilities: string[];
  requirements: string[];
  perksAndBenefits?: string[];
  applicationLink?: string;
  status: "Open" | "Closed" | "Paused";
  mileStones: {
    task: string;
    amount: number;
    workCompletion: number;
    freelancer: object;
    status: string;
    paid: boolean;
  }[];
  freelancersResume: [mongoose.Types.ObjectId];
}

const JobSchema: Schema<JobPost> = new Schema<JobPost>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  techStack: { type: [String], required: true },
  reqExperience: { type: Number, required: true, min: 0 },

  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
    required: true,
  },

  salaryRange: {
    min: { type: Number, required: false },
    max: { type: Number, required: false },
  },

  location: { type: String, required: true },
  isRemote: { type: Boolean, required: true },

  companyName: { type: String, required: true },
  companyLogo: { type: String, required: false },

  applicationDeadline: { type: Date, required: false },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  postedAt: { type: Date, default: Date.now },

  responsibilities: { type: [String], required: true },
  requirements: { type: [String], required: true },
  perksAndBenefits: { type: [String], required: false },

  applicationLink: { type: String, required: false },

  status: {
    type: String,
    enum: ["Open", "Closed", "Paused"],
    default: "Open",
  },
  mileStones: {
    type: [
      {
        task: { type: String, required: true },
        amount: { type: Number, required: true },
        workCompletion: { type: Number, required: true },
        freelancer: { type: Object },
        status: {
          type: String,
          enum: ["completed", "in-review", "pending"],
          default: "pending",
        },
        paid: {
          type: Boolean
        }
      },
    ],
    required: [true, "Atleast one milestone should be present"], // Ensures at least one milestone must be present
  },
  freelancersResume: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
  ],
});

export const JobModel =
  (mongoose.models.JobPost as mongoose.Model<JobPost>) ||
  mongoose.model<JobPost>("JobPost", JobSchema);

export interface Payment {
  recipient: string;
  amount: number;
  orderId: string;
}

export interface Employer extends Document {
  fullName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  payments: Payment[];
}

const EmployerSchema: Schema<Employer> = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  payments: [
    {
      recipient: { type: String, required: true },
      amount: { type: Number, required: true },
      orderId: { type: String, required: true },
    },
  ],
});

export const EmployerModel =
  (mongoose.models.Employer as mongoose.Model<Employer>) ||
  mongoose.model<Employer>("Employer", EmployerSchema);
