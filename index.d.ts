declare module '@sensu/color-extractor' {
	type Color = [number,[number,number,number]];
	type Callback = (error: any, data: Array<Color>) => void;
	export const topColors: (filePath: string|Buffer, callback: Callback) => void;
}