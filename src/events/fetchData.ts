import { LogLevel, ZowieStatus } from "../modules/enums.js";
import { ZowietekInstance } from "../index.js";
import { ConsoleLog } from "../modules/logger.js";
import { getZowieStatusLabel } from "../helpers/commonHelpers.js";
import { inputVariableConfigs, outputVariableConfigs, recordingVariableConfigs} from '../variables/variables.js';
import { FeedbackId } from "../feedbacks/feedbacks.js";

// Utility zum Extrahieren eines Werts aus einem Objekt anhand eines Dot-Notation-Pfads
function extractValue(data: any, apiPath: string): any {
    const keys = apiPath.split('.');
    let result = data;
    for (const key of keys) {
        if (result == null) return undefined;
        result = result[key];
    }
    return result;
}

export async function fetchData(instance: ZowietekInstance): Promise<void> {
	if (!instance.globalSettings.enableComs || !instance.api || !instance.connected) {
		return;
	}

	const [getInputSignal, getOutputInfo, getAudioConfig, getDeviceTime, getTally, getRecordingStatus] = await Promise.all([
		instance.api.getInputSignal(),
		instance.api.getOutputInfo(),
		instance.api.getAudioConfig(),
		instance.api.getDeviceTime(),
		instance.api.getTallyParameters(),
		instance.api.getRecordingTaskList(),
	]);

	//Fetch Input Signal
	if (getInputSignal.status === ZowieStatus.Successful || getInputSignal.status === ZowieStatus.ModificationSuccessful) {
        //ConsoleLog(instance, `Feedback Input Signal: ${JSON.stringify(getInputSignal.data)}`, LogLevel.DEBUG);
        Object.assign(instance.constants.inputInfo, getInputSignal.data);

        // VARIABLES
		const inputVariableValues: { [key: string]: any } = {};
        inputVariableConfigs.forEach(config => {
            let value = extractValue(instance.constants.inputInfo, config.apiPath);
            if (config.type === 'boolean') {
                value = value === 1 ? true : false;
            } else {
                value = value !== undefined ? value.toString() : undefined;
            }
            const varId = `input_${config.apiPath.replace(/\./g, '_')}`;
            inputVariableValues[varId] = value;
        });
        instance.setVariableValues(inputVariableValues);
    } else {
        ConsoleLog(instance, `Failed to get Input Signal: ${getZowieStatusLabel(getInputSignal.status)}`, LogLevel.ERROR);
    }


    //Fetch Output Info
	if (getOutputInfo.status === ZowieStatus.Successful || getOutputInfo.status === ZowieStatus.ModificationSuccessful) {
		//ConsoleLog(instance, `Feedback Output Info: ${JSON.stringify(getOutputInfo.data)}`, LogLevel.DEBUG);
		Object.assign(instance.constants.outputInfo, getOutputInfo.data);
		instance.checkFeedbacks(FeedbackId.getOutputInfo);
		// VARIABLES
		const outputVariableValues: { [key: string]: any } = {};
        outputVariableConfigs.forEach(config => {
            let value = extractValue(instance.constants.outputInfo, config.apiPath);
            if (config.type === 'boolean') {
                value = value === 1 ? true : false;
            } else {
                value = value !== undefined ? value.toString() : undefined;
            }
            const varId = `output_${config.apiPath.replace(/\./g, '_')}`;
            outputVariableValues[varId] = value;
        });
        instance.setVariableValues(outputVariableValues);
	} else {
		ConsoleLog(instance, `Failed to get Output Info: ${getZowieStatusLabel(getOutputInfo.status)}`, LogLevel.ERROR);
	}


    //Fetch Audio Config
	if (getAudioConfig.status === ZowieStatus.Successful || getAudioConfig.status === ZowieStatus.ModificationSuccessful) {
		//ConsoleLog(instance, `Feedback Audio Config: ${JSON.stringify(getAudioConfig.all)}`, LogLevel.DEBUG);
		Object.assign(instance.constants.audioConfig, {
			ai_type: getAudioConfig.all.ai_type.selected_id.toString(),
			switch: getAudioConfig.all.switch.toString(),
			codec: getAudioConfig.all.codec.selected_id.toString(),
			bitrate: getAudioConfig.all.bitrate.selected_id.toString(),
			sample_rate: getAudioConfig.all.sample_rate.selected_id.toString(),
			channel: getAudioConfig.all.channel.toString(),
			volume: getAudioConfig.all.volume,
			ao_devtype: getAudioConfig.all.ai_devid.toString(),
		});

		instance.checkFeedbacks(FeedbackId.getAudioConfig);
	} else {
		ConsoleLog(instance, `Failed to get Audio Config: ${getZowieStatusLabel(getAudioConfig.status)}`, LogLevel.ERROR);
	}

    //Fetch Device Time
	if (getDeviceTime.status === ZowieStatus.Successful || getDeviceTime.status === ZowieStatus.ModificationSuccessful) {
		const dt = getDeviceTime.data.time;
		instance.constants.deviceTime.iso = new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second)).toISOString();
		instance.checkFeedbacks(FeedbackId.getDeviceTime);
	} else {
		ConsoleLog(instance, `Failed to get Device Time: ${getZowieStatusLabel(getDeviceTime.status)}`, LogLevel.ERROR);
	}

    //Fetch Tally
	if (getTally.status === ZowieStatus.Successful || getTally.status === ZowieStatus.ModificationSuccessful) {
		//ConsoleLog(instance, `Feedback Tally: ${JSON.stringify(getTally.data)}`, LogLevel.DEBUG);
		Object.assign(instance.constants.tally, {
			color_id: getTally.data.color_id.toString(),
			mode_id: getTally.data.mode_id.toString(),
		});
		instance.checkFeedbacks(FeedbackId.getTally);
	} else {
		ConsoleLog(instance, `Failed to get Tally: ${getZowieStatusLabel(getTally.status)}`, LogLevel.ERROR);
	}

	//Fetch Recording Status
    if (getRecordingStatus.status === ZowieStatus.Successful || getRecordingStatus.status === ZowieStatus.ModificationSuccessful) {
		//ConsoleLog(instance, `Feedback Recording Status: ${JSON.stringify(getRecordingStatus.data)}`, LogLevel.DEBUG);
        // Speichere die Recording Tasks in den Konstanten
        instance.constants.recordingTasks = getRecordingStatus.data;
        instance.checkFeedbacks(FeedbackId.getRecordingStatus);
		instance.checkFeedbacks(FeedbackId.remainingStorageBar);
		instance.checkFeedbacks(FeedbackId.recordingDuration);

		// VARIABLES
		const recordingVariableValues: { [key: string]: any } = {};
        instance.constants.recordingTasks.forEach((task: any) => {
            recordingVariableConfigs.forEach(config => {
                let value = extractValue(task, config.apiPath);
                if (config.type === 'boolean') {
                    value = value === 1 ? true : false;
                } else {
                    value = value !== undefined ? value.toString() : undefined;
                }
                const varId = `recording_${task.index}_${config.apiPath.replace(/\./g, '_')}`;
                recordingVariableValues[varId] = value;
            });
        });

        instance.setVariableValues(recordingVariableValues);
    } else {
        ConsoleLog(instance, `Failed to get Recording Status: ${getZowieStatusLabel(getRecordingStatus.status)}`, LogLevel.ERROR);
    }
	// Fetch NDI Decode Status
const getNDISource = await instance.api.getNDISource();
if (getNDISource.status === ZowieStatus.Successful || getNDISource.status === ZowieStatus.ModificationSuccessful) {
    // Speichere die NDI-Daten in den Konstanten
    //ConsoleLog(instance, `Feedback NDI Source: ${JSON.stringify(getNDISource.data)}`, LogLevel.DEBUG);
    instance.constants.ndiSources = getNDISource.data;

    // Aktualisiere Feedbacks
    instance.checkFeedbacks(FeedbackId.getNDIDecodeStatus);

    // Setze Variablen für NDI-Quellen
    const ndiVariableValues: { [key: string]: any } = {};
    instance.constants.ndiSources.forEach((source: any) => {
        ndiVariableValues[`ndi_${source.index}_name`] = source.name;
        ndiVariableValues[`ndi_${source.index}_status`] = source.streamplay_status.toString();
    });
    instance.setVariableValues(ndiVariableValues);
} else {
    //ConsoleLog(instance, `Failed to get NDI Sources: ${getZowieStatusLabel(getNDISource.status)}`, LogLevel.ERROR);
}
}