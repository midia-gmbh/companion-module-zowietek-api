import {
	combineRgb,
	CompanionFeedbackDefinition,
	CompanionFeedbackDefinitions,
	CompanionOptionValues,
} from '@companion-module/base'
import { graphics } from 'companion-module-utils'
import type { ZowietekInstance } from '../index.js'
import { outputResolutionChoices } from '../modules/constants.js'
import { ConsoleLog } from '../modules/logger.js'
import {
	LogLevel,
	ZowieStatus,
	OutputResolution,
	AudioBitrate_ID,
	AudioCodec_ID,
	AudioInputType_ID,
	AudioOutputType_ID,
	AudioSampleRate_ID
} from '../modules/enums.js'
import { getZowieStatusLabel } from '../helpers/commonHelpers.js'

export enum FeedbackId {
	getOutputInfo = 'getOutputInfo',
	getAudioConfig = 'getAudioConfig',
	getDeviceTime = 'getDeviceTime',
	getTally = 'getTally',
	getRecordingStatus = 'getRecordingStatus',
	remainingStorageBar = 'remainingStorageBar',
	recordingDuration = 'recordingDuration',
	getNDIDecodeStatus = 'getNDIDecodeStatus',
}

export function UpdateFeedbacks(instance: ZowietekInstance): void {
	const feedbacks: CompanionFeedbackDefinitions = {
		[FeedbackId.getOutputInfo]: {
			name: 'Output Info',
			type: 'boolean',
			description: 'Feedback based on the output settings (resolution, audio, loop out).',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0)
			},
			showInvert: true,
			options: [
				{
					id: 'format',
					type: 'dropdown',
					label: 'Output Resolution',
					choices: outputResolutionChoices,
					default: outputResolutionChoices[0]?.id
				},
				{
					id: 'audio_switch',
					type: 'dropdown',
					label: 'Audio',
					choices: [
						{ id: '0', label: 'Mute' },
						{ id: '1', label: 'Unmute' }
					],
					default: '0'
				},
				{
					id: 'loop_out_switch',
					type: 'dropdown',
					label: 'Loop Out',
					choices: [
						{ id: '0', label: 'Output' },
						{ id: '1', label: 'Loop Out' }
					],
					default: '0'
				}
			],
			learn: async (feedback, context) => {
				const request = await instance.api.getOutputInfo()
				if (
					request.status === ZowieStatus.Successful ||
					request.status === ZowieStatus.ModificationSuccessful
					) {
					ConsoleLog(instance, `Learn Output Info: ${JSON.stringify(request.data)}`, LogLevel.DEBUG)
					return {
						...feedback.options,
						format: request.data.format,
						audio_switch: request.data.audio_switch.toString(),
						loop_out_switch: request.data.loop_out_switch.toString()
					}
				} else {
					ConsoleLog(instance, `Failed to learn Output Info: ${getZowieStatusLabel(request.status)}`, LogLevel.ERROR)
					return undefined
				}
			},
			callback: async (feedback, context) => {
				const desiredFormat = feedback.options.format as OutputResolution
				const desiredAudio = feedback.options.audio_switch as string
				const desiredLoop = feedback.options.loop_out_switch as string

				if (instance.constants.outputInfo?.format === undefined || 
					instance.constants.outputInfo?.audio_switch === undefined || 
					instance.constants.outputInfo?.loop_out_switch === undefined) {
					return false
				}

				if (
					instance.constants.outputInfo?.format === desiredFormat &&
					instance.constants.outputInfo?.audio_switch.toString() === desiredAudio &&
					instance.constants.outputInfo?.loop_out_switch.toString() === desiredLoop
				) {
					return true
				} else {
					return false
				}
			}
		},
		[FeedbackId.getAudioConfig]: {
			name: 'Audio Config',
			type: 'boolean',
			description: 'Feedback based on audio configuration settings.',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(128, 0, 128)
			},
			showInvert: true,
			options: [
				{
					id: 'ai_type',
					type: 'dropdown',
					label: 'Audio Input Type',
					choices: [
						{ id: AudioInputType_ID.LINE_IN, label: 'Line In' },
						{ id: AudioInputType_ID.INTERNAL_MIC, label: 'Internal MIC' },
						{ id: AudioInputType_ID.HDMI_IN, label: 'HDMI IN' }
					],
					default: '0'
					},
					{
					id: 'switch',
					type: 'dropdown',
					label: 'Audio Switch',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' }
					],
					default: '1'
					},
					{
					id: 'codec',
					type: 'dropdown',
					label: 'Audio Codec',
					choices: [
						{ id: AudioCodec_ID.AAC, label: 'AAC' },
						{ id: AudioCodec_ID.MP3, label: 'MP3' },
						{ id: AudioCodec_ID.G711A, label: 'G.711A' }
					],
					default: '0'
					},
					{
					id: 'bitrate',
					type: 'dropdown',
					label: 'Audio Bitrate',
					choices: [
						{ id: AudioBitrate_ID.BR_32000, label: '32000' },
						{ id: AudioBitrate_ID.BR_48000, label: '48000' },
						{ id: AudioBitrate_ID.BR_64000, label: '64000' },
						{ id: AudioBitrate_ID.BR_96000, label: '96000' },
						{ id: AudioBitrate_ID.BR_128000, label: '128000' }
					],
					default: '0'
					},
					{
					id: 'sample_rate',
					type: 'dropdown',
					label: 'Audio Sample Rate',
					choices: [
						{ id: AudioSampleRate_ID.SR_8000, label: '8000' },
						{ id: AudioSampleRate_ID.SR_16000, label: '16000' },
						{ id: AudioSampleRate_ID.SR_32000, label: '32000' },
						{ id: AudioSampleRate_ID.SR_44100, label: '44100' },
						{ id: AudioSampleRate_ID.SR_48000, label: '48000' }
					],
					default: '3'
					},
					{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					choices: [
						{ id: '1', label: 'Mono' },
						{ id: '2', label: 'Stereo' }
					],
					default: '2'
					},
					{
					id: 'volume',
					type: 'number',
					label: 'Volume (0-100)',
					min: 0,
					max: 100,
					default: 100,
					step: 1,
					required: true
					},
					{
					id: 'ao_devtype',
					type: 'dropdown',
					label: 'Audio Output Type',
					choices: [
						{ id: AudioOutputType_ID.LINEOUT, label: 'Line Out' },
						{ id: AudioOutputType_ID.HDMI, label: 'HDMI' }
					],
					default: '1'
					}
			],
			learn: async (feedback, context) => {
				const request = await instance.api.getAudioConfig();
				if (
				request.status === ZowieStatus.Successful ||
				request.status === ZowieStatus.ModificationSuccessful
				) {
					ConsoleLog(instance, `Learn Audio Config: ${JSON.stringify(request.all)}`, LogLevel.DEBUG)
					return {
						...feedback.options,
						ai_type: request.all.ai_type.selected_id.toString(),
						switch: request.all.switch.toString(),
						codec: request.all.codec.selected_id.toString(),
						bitrate: request.all.bitrate.selected_id.toString(),
						sample_rate: request.all.sample_rate.selected_id.toString(),
						channel: request.all.channel.toString(),
						volume: request.all.volume,
						ao_devtype: request.all.ai_devid.toString()
					}
				} else {
					ConsoleLog(instance, `Failed to learn Audio Config: ${getZowieStatusLabel(request.status)}`, LogLevel.ERROR)
					return undefined
				}
			},
			callback: async (feedback, context) => {
				const desiredAI = feedback.options.ai_type as AudioInputType_ID
				const desiredSwitch = feedback.options.switch as string
				const desiredCodec = feedback.options.codec as AudioCodec_ID
				const desiredBitrate = feedback.options.bitrate as AudioBitrate_ID
				const desiredSampleRate = feedback.options.sample_rate as AudioSampleRate_ID
				const desiredChannel = feedback.options.channel as string
				const desiredVolume = Number(feedback.options.volume)
				const desiredAO = feedback.options.ao_devtype as AudioOutputType_ID

				if (instance.constants.audioConfig?.ai_type === undefined || 
					instance.constants.audioConfig?.switch === undefined ||
					instance.constants.audioConfig?.codec === undefined ||
					instance.constants.audioConfig?.bitrate === undefined ||
					instance.constants.audioConfig?.sample_rate === undefined ||
					instance.constants.audioConfig?.channel === undefined ||
					instance.constants.audioConfig?.volume === undefined ||
					instance.constants.audioConfig?.ao_devtype === undefined) {
					return false
				}

				if (
					instance.constants.audioConfig?.ai_type === desiredAI &&
					instance.constants.audioConfig?.switch === desiredSwitch &&
					instance.constants.audioConfig?.codec.toString() === desiredCodec &&
					instance.constants.audioConfig?.bitrate.toString() === desiredBitrate &&
					instance.constants.audioConfig?.sample_rate.toString() === desiredSampleRate &&
					instance.constants.audioConfig?.channel.toString() === desiredChannel &&
					instance.constants.audioConfig?.volume === desiredVolume &&
					instance.constants.audioConfig?.ao_devtype.toString() === desiredAO
				) {
					return true
				} else {
					return false
				}
			}
		},

		[FeedbackId.getDeviceTime]: {
			name: 'Device Time',
			type: 'boolean',
			description: 'Feedback for current device time.',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 128)
			},
			showInvert: true,
			options: [
				{
					id: 'device_time',
					type: 'textinput',
					label: 'Device Time (ISO)',
					default: '2025-03-01T12:00:00Z'
				}
			],
			learn: async (feedback, context) => {
				const request = await instance.api.getDeviceTime()
				if (
          request.status === ZowieStatus.Successful ||
          request.status === ZowieStatus.ModificationSuccessful
        ) {
					const dt = request.data.time;
					// Reconstruct ISO string from individual properties
					const iso = new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second)).toISOString();
					ConsoleLog(instance, `Learn Device Time: ${iso}`, LogLevel.DEBUG)
					return { ...feedback.options, device_time: iso }
				} else {
					ConsoleLog(instance, `Failed to learn Device Time: ${getZowieStatusLabel(request.status)}`, LogLevel.ERROR)
					return undefined
				}
			},
			callback: async (feedback, context) => {
				const desiredTime = feedback.options.device_time as string

				if (instance.constants.deviceTime?.iso === undefined) {
					return false
				}
				
				if (desiredTime === instance.constants.deviceTime?.iso) {
					return true;
				} else {
					return false;
				}
			}
		},
		[FeedbackId.getTally]: {
			name: 'Tally',
			type: 'boolean',
			description: 'Feedback based on tally settings.',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 165, 0)
			},
			showInvert: true,
			options: [
				{
					id: 'color_id',
					type: 'dropdown',
					label: 'Tally Color',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'Red' },
						{ id: '2', label: 'Green' },
						{ id: '3', label: 'Blue' }
					],
					default: '1'
				},
				{
					id: 'mode_id',
					type: 'dropdown',
					label: 'Mode',
					choices: [
						{ id: '0', label: 'Auto' },
						{ id: '1', label: 'Manual' }
					],
					default: '0'
				}
			],
			learn: async (feedback, context) => {
				const request = await instance.api.getTallyParameters()
				if (
				request.status === ZowieStatus.Successful ||
				request.status === ZowieStatus.ModificationSuccessful
				) {
					ConsoleLog(instance, `Learn Tally: ${JSON.stringify(request.data)}`, LogLevel.DEBUG)
					return {
						...feedback.options,
						color_id: request.data.color_id.toString(),
						mode_id: request.data.mode_id.toString()
					}
				} else {
					ConsoleLog(instance, `Failed to learn Tally: ${getZowieStatusLabel(request.status)}`, LogLevel.ERROR)
					return undefined
				}
			},
			callback: async (feedback, context) => {
				const desiredColor = feedback.options.color_id as string
				const desiredMode = feedback.options.mode_id as string

				if (instance.constants.tally?.color_id === undefined || 
					instance.constants.tally?.mode_id === undefined) {
					return false
				}
				
				if (
					instance.constants.tally?.color_id.toString() === desiredColor &&
					instance.constants.tally?.mode_id.toString() === desiredMode
				) {
					return true
				} else {
					return false
				}
			}
		},
		[FeedbackId.getRecordingStatus]: {
			name: 'Recording Status',
			type: 'boolean',
			description: 'Feedback based on the status of recording tasks (aggregated).',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(204, 0, 0)
			},
			showInvert: true,
			options: [
				{
					id: 'recording_status',
					type: 'dropdown',
					label: 'Recording Status',
					choices: [
						{ id: '0', label: 'Not Recording' },
						{ id: '1', label: 'Recording' },
						{ id: '2', label: 'Recording Paused' },
						{ id: '3', label: 'The storage device is full and cannot record' },
						{ id: '4', label: 'Storage device is invalid/not mounted' },
						{ id: '5', label: 'No signal source' }
					],
					default: '1'
				}
			],
			callback: async (feedback, context) => {
				const desiredStatus = feedback.options.recording_status as string;
				if (!instance.constants.recordingTasks || instance.constants.recordingTasks.length === 0) {
					return false;
				}
				// Check if any task has the desired status
				return instance.constants.recordingTasks.some((task: any) => {
					return task.status.toString() === desiredStatus;
				});
			}
		},
		[FeedbackId.remainingStorageBar]: {
			type: 'advanced',
			name: 'Remaining Storage',
			description: 'Displays a progress bar showing the percentage of free/used storage on a selected device and shows the percentage as text.',
			options: [
				{
					id: 'type',
					type: 'dropdown',
					label: 'Display Mode',
					choices: [
						{ id: 'countUp', label: 'Free Storage' },
						{ id: 'countDown', label: 'Used Storage' },
					],
					default: 'countUp',
				},
				{
					id: 'storage',
					type: 'dropdown',
					label: 'Storage Device',
					choices: [
						{ id: 'usb1_0', label: 'USB' },
						{ id: 'nas1_0', label: 'NAS' },
						{ id: 'sdcard_0', label: 'SD Card' }
					],
					default: 'usb1_0'
				}
			],
			callback: (feedback, context) => {
				// Ermitteln des ausgewählten Storage-Typs
				const storageId = feedback.options.storage as string;
				const storageChoices = [
					{ id: 'usb1_0', label: 'USB' },
					{ id: 'nas1_0', label: 'NAS' },
					{ id: 'sdcard_0', label: 'SD Card' }
				];
				const storageChoice = storageChoices.find(choice => choice.id === storageId);
				const storageName = storageChoice ? storageChoice.label : storageId;
				
				// Dynamisch Variablennamen anhand des ausgewählten Speichers:
				const freeVar = `recording_${storageId}_storageInfo_freespace`;
				const totalVar = `recording_${storageId}_storageInfo_totalspace`;
				
				const freeSpace = parseFloat(String(instance.getVariableValue(freeVar))) || 0;
				const totalSpace = parseFloat(String(instance.getVariableValue(totalVar))) || 0;
				const freePercentage = totalSpace > 0 ? (freeSpace / totalSpace) * 100 : 0;
			
				let colors, value;
				switch (feedback.options.type) {
					case 'countUp':
						colors = [
							{ size: freePercentage, color: combineRgb(0, 200, 0), background: combineRgb(0, 50, 0), backgroundOpacity: 255 },
						];
						value = freePercentage;
						break;
					case 'countDown':
					default:
						colors = [
							{ size: freePercentage, color: combineRgb(0, 50, 0), background: combineRgb(0, 0, 0), backgroundOpacity: 255 },
							{ size: 100 - freePercentage, color: combineRgb(0, 200, 0), background: combineRgb(0, 200, 0), backgroundOpacity: 255 },
						];
						value = 100;
						break;
				}
			
				// Warning und Error Color:
				// Orange: 10% - 1%
				// Red: 1% - 0%
				const red = { r: 204, g: 0, b: 0 }
				const orange = { r: 204, g: 101, b: 0 }
				let bgcolor;
				if (freePercentage <= 10 && freePercentage > 1) {
					bgcolor = combineRgb(orange.r, orange.g, orange.b)
				} else if (freePercentage <= 1) {
					bgcolor = combineRgb(red.r, red.g, red.b)
				} else {
					bgcolor = combineRgb(0, 0, 0)
				}
			
				const barWidth = 6;
				const barLength = 62;
				const verticalOptions = {
					width: 72,
					height: 72,
					colors: colors,
					barLength: barLength,
					barWidth: barWidth,
					value: value,
					type: 'vertical' as 'vertical',
					// Setze offsetX so, dass der Balken rechts erscheint:
					offsetX: 72 - barWidth - 5,
					offsetY: 5,
					opacity: 255,
				};
			
				// Text je nach Display Mode: "Free Storage" (countUp) oder "Used Storage" (countDown).
				let textStatus;
				if (feedback.options.type === 'countUp') {
					textStatus = `Free Storage\n${storageName}\n${freePercentage.toFixed(1)}%`;
				} else {
					const usedPercentage = 100 - freePercentage;
					textStatus = `Used Storage\n${storageName}\n${usedPercentage.toFixed(1)}%`;
				}
			
				return {
					imageBuffer: graphics.bar(verticalOptions),
					bgcolor: bgcolor,
					text: textStatus,
					textColor: combineRgb(255, 255, 255),
					size: 14,
					alignment: 'left:center',
					show_topbar: false,
				};
			},
		},
		[FeedbackId.recordingDuration]: {
			type: 'advanced',
			name: 'Recording Duration',
			description: 'Displays the consolidated recording duration from USB, SDCard and NAS formatted as hh:mm:ss or mm:ss.',
			options: [],
			callback: (feedback, context) => {
				// Hole die Dauerwerte aller Speicher. Ist der Wert undefined oder 0, wird 0 zurückgegeben.
				const usbDuration = parseFloat(String(instance.getVariableValue('recording_usb1_0_duration'))) || 0;
				const sdcardDuration = parseFloat(String(instance.getVariableValue('recording_sdcard_0_duration'))) || 0;
				const nasDuration = parseFloat(String(instance.getVariableValue('recording_nas1_0_duration'))) || 0;
				
				// Konsolidiere den Wert: Nehme den ersten Wert > 0, ansonsten 0
				const durationSeconds = usbDuration > 0 ? usbDuration :
										   sdcardDuration > 0 ? sdcardDuration :
										   nasDuration > 0 ? nasDuration : 0;
		
				// Berechnung der Stunden, Minuten und Sekunden:
				const hh = Math.floor(durationSeconds / 3600);
				const mm = Math.floor((durationSeconds % 3600) / 60);
				const ss = Math.floor(durationSeconds % 60);
		
				// Formatierung: Wenn Stunden > 0, dann hh:mm:ss, ansonsten mm:ss
				const formatted = hh > 0
					? `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`
					: `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
		
				return {
					text: 'REC Duration:\n'+formatted,
					textColor: combineRgb(255, 255, 255)
				};
			}
		},
		[FeedbackId.getNDIDecodeStatus]: {
			name: 'NDI Decode Status',
			type: 'advanced',
			description: 'Changes the button background based on the NDI decode status.',
			options: [
				{
					id: 'ndi_name',
					type: 'textinput',
					label: 'NDI Source Name',
					default: '',
				},
			],
			callback: (feedback, context) => {
				const ndiName = feedback.options.ndi_name as string;
				const ndiSource = instance.constants.ndiSources?.find((source: any) => source.name === ndiName);
		
				if (!ndiSource) {
					return {
						bgcolor: combineRgb(128, 128, 128), // Grau, wenn keine Quelle gefunden wurde
						text: 'NDI Source Not Found',
					};
				}
		
				// Hintergrundfarbe und Text basierend auf dem Status
				let bgcolor;
				let text;
				switch (ndiSource.streamplay_status) {
					case 0:
						bgcolor = combineRgb(0, 0, 0); // Schwarz
						//text = `NDI: ${ndiSource.name}\nStatus: Not turned on`;
						break;
					case 1:
						bgcolor = combineRgb(0, 204, 0); // Grün
						//text = `NDI: ${ndiSource.name}\nStatus: Pulling stream`;
						break;
					case 2:
						bgcolor = combineRgb(204, 102, 0); // Orange
						//text = `NDI: ${ndiSource.name}\nStatus: Pulling stream stopped`;
						break;
					case 3:
						bgcolor = combineRgb(204, 0, 0); // Rot
						//text = `NDI: ${ndiSource.name}\nStatus: No video`;
						break;
					case 4:
						bgcolor = combineRgb(153, 0, 255); // Lila
						//text = `NDI: ${ndiSource.name}\nStatus: Video format unsupported`;
						break;
					case 5:
						bgcolor = combineRgb(204, 102, 0); // Blau
						//text = `NDI: ${ndiSource.name}\nStatus: No audio`;
						break;
					case 6:
						bgcolor = combineRgb(153, 0, 255); // Lila
						//text = `NDI: ${ndiSource.name}\nStatus: Audio format unsupported`;
						break;
					default:
						bgcolor = combineRgb(0, 0, 0); // Schwarz
						//text = `NDI: ${ndiSource.name}\nStatus: Unknown`;
				}
		
				return {
					bgcolor,
					text,
					textColor: combineRgb(255, 255, 255),
				};
			},
		},
	}
	instance.setFeedbackDefinitions(feedbacks)
}
