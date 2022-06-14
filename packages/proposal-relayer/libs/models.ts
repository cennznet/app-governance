import { MONGODB_SERVER } from "@gov-libs/lib/constants";
import mongoose, { Schema, Model } from "mongoose";

mongoose.connect(MONGODB_SERVER);

export interface ProposalInterface {
	proposalId: number;
	proposalDescription?: string;
	proposalJustificationUri;
	string;
}

const ProposalSchema = new Schema<ProposalInterface>({
	proposalId: { type: Schema.Types.Number, required: true, unique: true },
	proposalDescription: { type: Schema.Types.String },
	proposalJustificationUri: { type: Schema.Types.String },
});

export const Proposal: Model<ProposalInterface> = mongoose.model(
	"Proposal",
	ProposalSchema
);
