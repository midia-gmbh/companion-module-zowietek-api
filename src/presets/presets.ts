import { CompanionPresetDefinitions, combineRgb } from '@companion-module/base';
import { ZowietekInstance } from '../index.js';
import { ActionId } from '../actions/actions.js';
import { FeedbackId } from '../feedbacks/feedbacks.js';

const presets: CompanionPresetDefinitions = {};

const devices = [
    { id: 'usb1_0', label: 'USB' },
    { id: 'nas1_0', label: 'NAS' },
    { id: 'sdcard_0', label: 'SD Card' }
];

// Befehle und deren zugehörige Optionen:
const commands = [
    { command: 1, suffix: 'start', name: 'Start Recording', textPrefix: 'Start Recording' },
    { command: 0, suffix: 'stop', name: 'Stop Recording', textPrefix: 'Stop Recording' },
    { command: 2, suffix: 'pause', name: 'Pause Recording', textPrefix: 'Pause Recording' },
    { command: 3, suffix: 'resume', name: 'Resume Recording', textPrefix: 'Resume Recording' }
];

// Für jedes Gerät und jeden Befehl einen Preset generieren:
devices.forEach(device => {
    commands.forEach(cmd => {
        // Bestimme die Hintergrundfarbe je nach Befehl:
        let commandBgColor, commandColor;
        switch (cmd.suffix) {
            case 'start':
                commandBgColor = combineRgb(0, 204, 0);
				commandColor = combineRgb(255, 255, 255);
                break;
            case 'stop':
                commandBgColor = combineRgb(204, 0, 0);
				commandColor = combineRgb(255, 255, 255);
                break;
            case 'pause':
            case 'resume':
                commandBgColor = combineRgb(204, 204, 0);
				commandColor = combineRgb(0, 0, 0);
                break;
            default:
                commandBgColor = combineRgb(0, 0, 0);
				commandColor = combineRgb(255, 255, 255);
        }
        presets[`recording_${device.id}_${cmd.suffix}`] = {
            type: 'button',
            category: 'Recording',
            name: `${cmd.name} (${device.label})`,
            style: {
                text: `${cmd.textPrefix} ${device.label}`,
                size: '14',
                color: commandColor,
                bgcolor: commandBgColor
            },
            steps: [
                {
                    down: [
                        {
                            actionId: ActionId.recordControl,
                            options: {
                                index: device.id,
                                command: cmd.command
                            }
                        }
                    ],
                    up: []
                }
            ],
            feedbacks: []
        };
    });
});

presets[`recording_status`] = {
    type: 'button', // This must be 'button' for now
    category: 'Recording', // Gruppe für Recording-Presets
    name: `Recording Status`, // Ein Name für den Preset
    style: {
        text: `REC STATUS`,
        size: '14',
        color: combineRgb(255, 255, 255),
        bgcolor: combineRgb(153, 0, 153)
    },
    steps: [
        {
            down: [],
            up: []
        }
    ],
    feedbacks: [
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '0'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(72, 72, 72),
                text: '⏹ STOP'
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '1'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(204, 0, 0),
                text: '⏺ REC'
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '2'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(204, 104, 0),
                text: '⏺⏸ REC'
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '3'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(153, 0, 153),
                text: 'STORAGE FULL'
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '4'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(153, 0, 153),
                text: 'STORAGE INVALID'
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '5'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(153, 0, 153),
                text: 'NO SIGNAL'
            }
        }
    ]
};

presets[`recording_duration`] = {
    type: 'button', // This must be 'button' for now
    category: 'Recording', // Gruppe für Recording-Presets
    name: `Recording Duration`, // Ein Name für den Preset
    style: {
        text: `REC DURATION`,
        size: '14',
        color: combineRgb(255, 255, 255),
        bgcolor: combineRgb(153, 0, 153)
    },
    steps: [
        {
            down: [],
            up: []
        }
    ],
    feedbacks: [
		{
			feedbackId: FeedbackId.recordingDuration,
			options: {
			}
		},
		{
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '0'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(72, 72, 72),
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '1'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(204, 0, 0),
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '2'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(204, 104, 0),
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '3'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(153, 0, 153),
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '4'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(153, 0, 153),
            }
        },
        {
            feedbackId: FeedbackId.getRecordingStatus,
            options: {
                recording_status: '5'
            },
            style: {
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(153, 0, 153),
            }
        }
	]
};
// Erstelle für jedes Gerät zwei Storage-Presets: Free Storage und Used Storage
devices.forEach(device => {
    // Free Storage Preset (countUp)
    presets[`Storage_status_free_${device.id}`] = {
        type: 'button', // Dies muss 'button' sein
        category: 'Storage',
        name: `Free Storage (${device.label})`,
        style: {
            text: `Free Storage ${device.label}`,
            size: '14',
            color: combineRgb(255, 255, 255),
            bgcolor: combineRgb(153, 0, 153)
        },
        steps: [
            {
                down: [],
                up: []
            }
        ],
        feedbacks: [
            {
                feedbackId: FeedbackId.remainingStorageBar,
                options: {
                    type: 'countUp',
                    storage: device.id
                }
            }
        ]
    };

    // Used Storage Preset (countDown)
    presets[`Storage_status_used_${device.id}`] = {
        type: 'button', // Dies muss 'button' sein
        category: 'Storage',
        name: `Used Storage (${device.label})`,
        style: {
            text: `Used Storage ${device.label}`,
            size: '14',
            color: combineRgb(255, 255, 255),
            bgcolor: combineRgb(153, 0, 153)
        },
        steps: [
            {
                down: [],
                up: []
            }
        ],
        feedbacks: [
            {
                feedbackId: FeedbackId.remainingStorageBar,
                options: {
                    type: 'countDown',
                    storage: device.id
                }
            }
        ]
    };
});

presets[`input_status`] = {
    type: 'button', 
    category: 'Input', 
    name: `Input Status`, 
    style: {
        text: `Input:\n$(Zowietek_Encoder1:input_desc)\nAudio:\n$(Zowietek_Encoder1:input_audio_signal)Hz`,
        size: '14',
        color: combineRgb(255, 255, 255),
        bgcolor: combineRgb(73, 73, 73),
		alignment: 'left:center',
		show_topbar: false,
    },
    steps: [
        {
            down: [],
            up: []
        }
    ],
    feedbacks: []
};

export async function SetPresets(instance: ZowietekInstance): Promise<void> {
    instance.setPresetDefinitions(presets);
}