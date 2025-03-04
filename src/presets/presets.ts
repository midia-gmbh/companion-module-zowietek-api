import { CompanionPresetDefinitions, combineRgb } from '@companion-module/base';
import { ZowietekInstance } from '../index.js';

const presets: CompanionPresetDefinitions = {};
export async function SetPresets(instance: ZowietekInstance): Promise<void> {

	instance.setPresetDefinitions(presets);
}