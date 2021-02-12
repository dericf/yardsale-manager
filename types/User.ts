import { UUID } from "./General";

export interface User {
	uuid: UUID,
	id?: string,
	name: string,
	email: string,
	initials: string,
	hasCompletedOnboarding: boolean,
}