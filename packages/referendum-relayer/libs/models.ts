import type { ReferendumInterface } from "@referendum-relayer/libs/types";

import { MONGODB_SERVER } from "@gov-libs/constants";
import mongoose, { Schema, Model } from "mongoose";

mongoose.connect(MONGODB_SERVER);

const ReferendumSchema = new Schema<ReferendumInterface>({
	proposalId: { type: Schema.Types.Number, required: true, unique: true },
	discordMessageId: { type: Schema.Types.String },
	vetoSum: { type: Schema.Types.Number },
	state: { type: Schema.Types.String, required: true },
	status: { type: Schema.Types.String, required: true },
});

export const Referendum: Model<ReferendumInterface> = mongoose.model(
	"Referendum",
	ReferendumSchema
);
