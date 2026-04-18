export interface StoreChannel {
	id: string;
	letter: string;
	color: string;
	name: string;
	url: string;
	developer: string;
	version: string;
	description: string;
	updatedAt: string;
	changeLog: string;
}

export interface InstalledChannel {
	id: string;
	letter: string;
	color: string;
	name: string;
	url: string;
}
