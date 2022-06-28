import type { FC } from "react";
import type {
	ProposalDetails,
	ProposalInfo,
} from "@proposal-relayer/libs/types";

interface ProposalDetailsDisplayProps {
	proposalDetails: ProposalDetails;
	proposalInfo: ProposalInfo;
}

export const ProposalDetailsDisplay: FC<ProposalDetailsDisplayProps> = ({
	proposalDetails,
	proposalInfo,
}) => {
	return (
		<div>
			<div className="space-y-6">
				<span className="border-hero border-b-2 text-4xl">
					{proposalDetails?.title || "Untitled"}
				</span>
				<div className="flex w-full space-x-20">
					<div>
						<span className="italic">Enactment delay</span>
						<p>{proposalInfo?.enactmentDelay || 0} blocks</p>
					</div>
					<div>
						<span className="italic">Sponsor</span>
						<p>{proposalInfo?.sponsor}</p>
					</div>
				</div>
			</div>
			<div className="border-hero my-6 w-full border-b-2" />
			<div>
				<p className="text-xl">{proposalDetails?.description}</p>
			</div>
		</div>
	);
};
