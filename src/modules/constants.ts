import { OutputResolution } from "./enums.js";

export const outputResolutionChoices = Object.values(OutputResolution).map((value) => ({
	id: value,
	label: value,
}));