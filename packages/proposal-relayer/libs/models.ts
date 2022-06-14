import { MONGODB_SERVER } from "@gov-libs/lib/constants";
import mongoose, { Schema, Model } from "mongoose";

mongoose.connect(MONGODB_SERVER);

export interface ProposalInterface {
	proposalId: number;
	proposalInfo: Record<string, string | number>;
	proposalDetails: Record<string, string>;
	state: "Created" | "InfoFetched" | "DetailsFetched" | "DiscordSent";
	status: "Pending" | "Successful" | "Failed" | "Skipped" | "Aborted";
}

const ProposalSchema = new Schema<ProposalInterface>({
	proposalId: { type: Schema.Types.Number, required: true, unique: true },
	proposalInfo: { type: Schema.Types.Map, of: Schema.Types.Mixed },
	proposalDetails: { type: Schema.Types.Map, of: Schema.Types.String },
	state: { type: Schema.Types.String, required: true },
	status: { type: Schema.Types.String, required: true },
});

export const Proposal: Model<ProposalInterface> = mongoose.model(
	"Proposal",
	ProposalSchema
);
