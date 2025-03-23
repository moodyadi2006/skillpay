import mongoose, { Document, Schema, Model } from "mongoose";

interface IPayment {
  senderEmail: string;
  receiverId: mongoose.Types.ObjectId;
  amount: number;
  orderId: string;
}

interface IEscrow extends Document {
  description: string;
  githubRepoLink: string;
  modifications: string;
  videoDemoLink: string;
  uploadImageFile: {
    size: number;
    type: string;
    name: string;
    lastModified: number;
  };
  jobId: mongoose.Types.ObjectId;
  payments: IPayment[];
}

const PaymentSchema = new Schema<IPayment>({
  senderEmail: { type: String, required: true },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  orderId: { type: String, required: true },
});

const EscrowSchema = new Schema<IEscrow>({
  description: { type: String },
  githubRepoLink: { type: String },
  modifications: { type: String },
  videoDemoLink: { type: String },
  uploadImageFile: {
    size: { type: Number },
    type: { type: String },
    name: { type: String },
    lastModified: { type: Number },
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPost",
  },
  payments: [PaymentSchema], // Properly defining an array of objects
});

const EscrowModel: Model<IEscrow> =
  mongoose.models.Escrow || mongoose.model<IEscrow>("Escrow", EscrowSchema);

export default EscrowModel;
