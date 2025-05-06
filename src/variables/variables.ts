import { CompanionVariableDefinition } from '@companion-module/base'
import type { ZowietekInstance } from '../index.js'

export interface VariableConfig {
    name: string;           // Anzeigename
    apiPath: string;        // Dotnotation-Pfad im API-Objekt (z. B. "switch" oder "disp_dev.selected_id")
    type: 'string' | 'boolean';
    group: 'input' | 'output' | 'recording';
}

// Konfiguration für Input-Signal
export const inputVariableConfigs: VariableConfig[] = [
    { name: "Signal present",       apiPath: "hdmi_signal",         type: "boolean", group: 'input' },
    { name: "Input Audio Samplerate",      apiPath: "audio_signal",        type: "string",  group: 'input' },
    { name: "Input Resolution Width",             apiPath: "width",               type: "string",  group: 'input' },
    { name: "Input Resolution Height",            apiPath: "height",              type: "string",  group: 'input' },
    { name: "Input Resolution FPS",         apiPath: "framerate",           type: "string",  group: 'input' },
    { name: "Input Resolution Displayed",              apiPath: "desc",                type: "string",  group: 'input' },
    //{ name: "Fix",               apiPath: "fix",                 type: "boolean", group: 'input' },
    { name: "HDMI Scaler Signal present", apiPath: "gsv2001.input_exist", type: "boolean", group: 'input' },
    { name: "HDMI Scaler VIC",       apiPath: "gsv2001.vic",         type: "string",  group: 'input' },
    { name: "HDMI Scaler FPS",       apiPath: "gsv2001.fps",         type: "string",  group: 'input' },
    { name: "HDMI Scaler Width",     apiPath: "gsv2001.width",       type: "string",  group: 'input' },
    { name: "HDMI Scaler Height",    apiPath: "gsv2001.height",      type: "string",  group: 'input' },
    { name: "HDMI Scaler HDCP",      apiPath: "gsv2001.hdcp_enabled",type: "boolean", group: 'input' },
    { name: "HDMI Scaler EDID",      apiPath: "gsv2001.edid_mode",   type: "string",  group: 'input' },
    { name: "SDI Mode",          apiPath: "sdimode",             type: "boolean", group: 'input' }
];

// Konfiguration für Output-Info
export const outputVariableConfigs: VariableConfig[] = [
    //{ name: "Switch",          apiPath: "switch",           type: "boolean", group: 'output' },
    //{ name: "VO Channel",      apiPath: "vo_chnid",         type: "string",  group: 'output' },
    //{ name: "Display Selected",apiPath: "disp_dev.selected_id", type: "boolean", group: 'output' },
    // Für Arrays wandeln wir in JSON um:
    //{ name: "Display List",    apiPath: "disp_dev.disp_dev_list", type: "string", group: 'output' },
    { name: "Output Resolution",          apiPath: "format",           type: "string",  group: 'output' },
    { name: "Output Audio UnMute",    apiPath: "audio_switch",     type: "boolean", group: 'output' },
    { name: "Output Video Loop Out ", apiPath: "loop_out_switch",  type: "boolean", group: 'output' },
    //{ name: "Bufnum",          apiPath: "bufnum",           type: "string",  group: 'output' },
    //{ name: "Auto Follow",     apiPath: "auto_follow",      type: "boolean", group: 'output' },
    { name: "Output SDI Mode",        apiPath: "sdimode",          type: "boolean", group: 'output' }
];

// Konfiguration für Recording Tasks (hier exemplarisch für einige Keys)
export const recordingVariableConfigs: VariableConfig[] = [
    { name: "Recording Status",          apiPath: "status",           type: "string", group: 'recording' },
	{ name: "Automatic Recording",          apiPath: "record_mode",           type: "boolean", group: 'recording' },
	{ name: "Loop Recording", apiPath: "record_loop_mode", type: "boolean", group: 'recording' },
    { name: "Current File Name", apiPath: "curr_file_name",  type: "string", group: 'recording' },
	{ name: "File Name Prefix", apiPath: "file_name_prefix", type: "string", group: 'recording' },
	{ name: "Recording Time", apiPath: "duration", type: "string", group: 'recording' },
	{ name: "Recording Size", apiPath: "curr_file_size", type: "string", group: 'recording' },
    { name: "Storage Mount",   apiPath: "storageInfo.mount_path", type: "string", group: 'recording' },
	{ name: "Storage Total",    apiPath: "storageInfo.totalspace", type: "string", group: 'recording' },
	{ name: "Storage Free",    apiPath: "storageInfo.freespace", type: "string", group: 'recording' },
	{ name: "Storage Usage", apiPath: "storageInfo.usagespace", type: "string", group: 'recording' },
	{ name: "Limit Type",   apiPath: "limit_type", type: "string", group: 'recording' },
	{ name: "Size Limit", apiPath: "size_limit", type: "string", group: 'recording' },
	{ name: "Time Limit", apiPath: "time_limit", type: "string", group: 'recording' },
	{ name: "Storage Speed Test Status",   apiPath: "storageInfo.speed_test_status", type: "string", group: 'recording' },
	{ name: "Storage Write Speed", apiPath: "storageInfo.write_speed", type: "string", group: 'recording' },
	{ name: "Storage Read Speed", apiPath: "storageInfo.read_speed", type: "string", group: 'recording' },
];

export function UpdateVariableDefinitions(instance: ZowietekInstance): void {
    const variableDefinitions: CompanionVariableDefinition[] = [];

    // Input Variablen (nur einmal, nicht pro Objekt)
    inputVariableConfigs.forEach(config => {
        const varId = `input_${config.apiPath.replace(/\./g, '_')}`;
        variableDefinitions.push({
            variableId: varId,
            name: config.name
        });
    });

    // Output Variablen (nur einmal)
    outputVariableConfigs.forEach(config => {
        const varId = `output_${config.apiPath.replace(/\./g, '_')}`;
        variableDefinitions.push({
            variableId: varId,
            name: config.name
        });
    });

    // Recording Tasks: für jeden Task und für jede Konfiguration
    const recordingTasks: any[] = (instance.constants.recordingTasks && instance.constants.recordingTasks.length > 0)
        ? instance.constants.recordingTasks
        : [
            // Fallback-Beispieldaten
            {
                "index": "usb1_0",
                "file_name_prefix": "usb1_0",
                "name": "usb1",
                "status": 5,
                "curr_file_name": "",
                "storageInfo": {
                    "mount_path": "/mnt/USB1"
                }
            },
            {
                "index": "nas1_0",
                "file_name_prefix": "nas1_0",
                "name": "nas1",
                "status": 0,
                "curr_file_name": "",
                "storageInfo": {
                    "mount_path": "/mnt/NAS1"
                }
            },
            {
                "index": "sdcard_0",
                "file_name_prefix": "sdcard_0",
                "name": "sdcard",
                "status": 0,
                "curr_file_name": "",
                "storageInfo": {
                    "mount_path": "/mnt/SDCard"
                }
            }
        ];
    
    recordingTasks.forEach(task => {
        recordingVariableConfigs.forEach(config => {
            // Erzeuge pro Task die Variable, z. B. "recording_usb1_0_status" oder "recording_nas1_0_storageInfo_mount_path"
            const varId = `recording_${task.index}_${config.apiPath.replace(/\./g, '_')}`;
            // Optional: den Namen erweitern, etwa um den Tasknamen oder file_name_prefix
            const displayName = `${config.name} (${task.name})`;
            variableDefinitions.push({
                variableId: varId,
                name: displayName
            });
        });
    });
    // // NDI Decode Variablen
    // const ndiSources: any[] = instance.constants.ndiSources || [
    //     // Fallback-Beispieldaten
    //     {
    //         index: 0,
    //         name: "HD CAMERA (NDI HB HX,192.168.1.205)",
    //         streamplay_status: 0,
    //         bandwidth: 0,
    //         framerate: 0,
    //         width: 0,
    //         height: 0
    //     },
    //     {
    //         index: 1,
    //         name: "NDI_HX (NDI-901233)",
    //         streamplay_status: 1,
    //         bandwidth: 5000,
    //         framerate: 30,
    //         width: 1920,
    //         height: 1080
    //     }
    // ];

    // ndiSources.forEach(source => {
    //     // Variablen für jede NDI-Quelle erstellen
    //     variableDefinitions.push({
    //         variableId: `ndi_${source.index}_name`,
    //         name: `NDI Source ${source.index} Name`
    //     });
    //     variableDefinitions.push({
    //         variableId: `ndi_${source.index}_status`,
    //         name: `NDI Source ${source.index} Status`
    //     });
    //     variableDefinitions.push({
    //         variableId: `ndi_${source.index}_bandwidth`,
    //         name: `NDI Source ${source.index} Bandwidth`
    //     });
    //     variableDefinitions.push({
    //         variableId: `ndi_${source.index}_framerate`,
    //         name: `NDI Source ${source.index} Framerate`
    //     });
    //     variableDefinitions.push({
    //         variableId: `ndi_${source.index}_resolution`,
    //         name: `NDI Source ${source.index} Resolution`
    //     });
    // });

    // Setze alle Variablendefinitionen (ohne "description")
    instance.setVariableDefinitions(variableDefinitions);
}