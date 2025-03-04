import { CompanionPresetDefinitions, combineRgb } from '@companion-module/base';
import { ZowieBoxInstance } from '../index.js';

const presets: CompanionPresetDefinitions = {};
export async function SetPresets(instance: ZowieBoxInstance): Promise<void> {

	instance.setPresetDefinitions(presets);
}