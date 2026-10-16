import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPaidTeam extends Document {
  name: string;
  captainId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PaidTeamSchema: Schema = new Schema(
  {
    name: { type: String, default: "" },
    captainId: { type: String, required: true, index: true },
    memberIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

const PaidTeam: Model<IPaidTeam> =
  mongoose.models.PaidTeam || mongoose.model<IPaidTeam>("PaidTeam", PaidTeamSchema);

export { PaidTeam };
export default PaidTeam;
