import type { ProposalInterface } from "@proposal-relayer/libs/types";

import { MONGODB_SERVER } from "@gov-libs/constants";
import mongoose, { Schema, Model } from "mongoose";

mongoose.connect(MONGODB_SERVER);

const ProposalSchema = new Schema<ProposalInterface>({
	discordMessageId: { type: Schema.Types.String },
	proposalId: { type: Schema.Types.Number, required: true, unique: true },
	proposalInfo: { type: Schema.Types.Map, of: Schema.Types.Mixed },
	proposalDetails: { type: Schema.Types.Map, of: Schema.Types.String },
	passVotes: { type: Schema.Types.Number },
	rejectVotes: { type: Schema.Types.Number },
	state: { type: Schema.Types.String, required: true },
	status: { type: Schema.Types.String, required: true },
});

export const Proposal: Model<ProposalInterface> = mongoose.model(
	"Proposal",
	ProposalSchema
);
