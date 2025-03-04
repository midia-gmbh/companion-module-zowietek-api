export enum LogLevel {
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
	DEBUG = 'debug',
	TRACE = 'trace'
}

// API status codes (example values; add any missing ones as needed)
export enum ZowieStatus {
	Successful = "00000",
	ModificationSuccessful = "000000",
	ProgramNotReady = "00002",
	MissingRequiredParameters = "00003",
	ProductNotSupported = "00004",
	SwitchOpeningFailed = "00005",
	SwitchNotOpen = "00006",
	EnableNotOpen = "00007",
	VerificationCodeError = "00008",
	OperationTooFast = "00009",
	Restarting = "00010",
	NoSignal = "10001",
	NDIActivationFailed = "50001",
	NDIAlreadyActivated = "50002",
	StreamURLAlreadyExists = "60001",
	FailedToStartStreaming = "60002",
	FailedToCloseStreaming = "60003",
	InvalidURL = "60004",
	StreamProtocolNotSupported = "60005",
	ProtocolMismatch = "60006",
	StreamOpenNeedsClose = "60007",
	InvalidIP = "60008",
	InvalidPort = "60009",
	ProtocolSelectIdMismatch = "60010",
	MaxStreamsReached = "60011",
	PushTypeNotSupported = "60012",
	InvalidIndex = "60013",
	FailedToConnectToWiFi = "70001",
	WrongIPAddress = "70002",
	IPAddressOccupied = "70003",
	NoModificationRequired = "70004",
	PasswordTooShort = "70005",
	AccountEmpty = "70006",
	HTTPPortOccupied = "70007",
	RTMPPortOccupied = "70008",
	RTSPPortOccupied = "70009",
	VISCATCPPortOccupied = "70010",
	VISCAUDPPortOccupied = "70011",
	WebSocketPortOccupied = "70012",
	RTPPortOccupied = "70013",
	OnvifPortOccupied = "70014",
	OnvifSoapPortOccupied = "70015",
	UserNotFound = "80001",
	UserAlreadyExists = "80002",
	UserNotLoggedIn = "80003",
	NonAdminAccount = "80004",
	WrongPassword = "80005",
	FileFormatError = "80006",
	FirmwareUpgradeIllegal = "80007",
	LogClearingError = "80008",
	LogReadingFailed = "80009",
	SignalSourceMissingForAudio = "90001",
	DiskFull = "100001",
	InvalidStorageMedium = "100002",
	PhotoFormatWrong1 = "100003",
	PhotoFormatWrong2 = "100004",
	PhotoFormatWrong3 = "100005",
	UninstallFailed = "100006",
	DiskNotMounted = "100007",
	MountFailed = "100008",
	NASServiceBusy = "100009",
	DiskInfoMaxLimit = "100010",
	OpenNASDeviceExists = "100011",
	ModificationNotAllowedWhenOpen = "100012",
	NASNotOpen = "100013",
	FormatFailed = "100014",
	StorageDeviceOccupied = "100015",
	TaskAlreadyStarted = "110001",
	InvalidTaskIndex = "110002",
	TaskNameAlreadyExists = "110003",
	MissionCannotBeDeleted = "110004",
	TaskStartupFailed = "110005",
	TaskExceedsMaxLimit = "110006",
	RecordingInProgress = "110007",
	OperatingTooFast = "110008",
	MaxValueReached = "120001",
	StartupFailed = "120003",
	CloseFailed = "120004",
	VideoModuleNotStarted = "120005",
	NoSignalSource = "130001",
	OutputResolutionChangeNotAllowed = "130002",
	QualityOutOfRange = "130003",
	OutputLoopSwitchModeFailed = "130004",
  }

  export enum Opt {
	GET_INPUT_INFO = "get_input_info",
	GET_OUTPUT_INFO = "get_output_info",
	SET_OUTPUT_INFO = "set_output_info",
	GET_PTZ_INFO = "get_ptz_info",
	SET_PTZ_INFO = "set_ptz_info",
	CONTROL = "control",
	STREAMPLAY_ADD = "streamplay_add",
	STREAMPLAY_GET_ALL = "streamplay_get_all",
	STREAMPLAY_DEL = "streamplay_del",
	STREAMPLAY_MODIFY = "streamplay_modify",
	GET_DECODER_STATE = "get_decoder_state",
	NDI_FIND = "ndi_find",
	NDI_GET_ALL = "ndi_get_all",
	NDI_RECV = "ndi_recv",
	NDI_CLOSE = "ndi_close",
	NDI_GET_RECV_CONFIG = "ndi_get_recv_config",
	NDI_SET_RECV_CONFIG = "ndi_set_recv_config",
	NDI_ACTIVATE = "ndi_activate",
	GET_AUTH_CODE = "get_auth_code",
	GET_CONFIG = "get_config",
	SET_CONFIG = "set_config",
	NDI_SWITCH = "ndi_switch",
	SET_AUDIO_SWITCH = "set_audio_switch",
	ADD_PUBLISH_INFO = "add_publish_info",
	DEL_PUBLISH_INFO = "del_publish_info",
	UPDATE_STREAMS_INDEX = "update_streams_index",
	UPDATE_PUBLISH_SWITCH = "update_publish_switch",
	GET_SYSTIME_INFO = "get_systime_info",
	SET_SYSTIME_INFO = "set_systime_info",
	GET_STATUS = "get_status",
	GET_TASK_LIST = "get_task_list",
	MODIFY_TASK = "modify_task",
	SET_TASK_ENABLE = "set_task_enable",
	GET_TALLY_LED_INFO = "get_tally_led_info",
	SET_TALLY_LED_INFO = "set_tally_led_info",
	SET_TALLY_LED_SWITCH = "set_tally_led_switch",
	GET_TALLY_LED_COLOR = "get_tally_led_color",
	SET_REBOOT_INFO = "set_reboot_info",
	SET_RESET_INFO = "set_reset_info",
	SET_FOCUS_MODE = "set_focus_mode",
	SET_SENSITIVITY = "set_sensitivity",
	SET_FOCUS_ZONE = "set_focus_zone",
	SET_FOCUS_SPEED = "set_focus_speed",
	SET_AF_LOCK_STATUS = "set_af_lock_status",
	SET_ZOOM_SPEED = "set_zoom_speed",
	GET_FOCUSMODE = "get_focusmode",
	GET_SENSITIVITY = "get_sensitivity",
	GET_FOCUS_ZONE = "get_focus_zone",
	GET_FOCUS_SPEED = "get_focus_speed",
	GET_AF_LOCK_STATUS = "get_af_lock_status",
	GET_ZOOM_SPEED = "get_zoom_speed",
	GET_EXPOSURE_INFO = "get_exposure_info",
	SET_EXPOSURE_INFO = "set_exposure_info",
	GET_APERTURE = "get_aperture",
	SET_APERTURE = "set_aperture",
	GET_WHITE_BALANCE_INFO = "get_white_balance_info",
	SET_WHITE_BALANCE_INFO = "set_white_balance_info",
	GET_IMAGE_INFO = "get_image_info",
	SET_IMAGE_INFO = "set_image_info",
	GET_NR_INFO = "get_nr_info",
	SET_NR_INFO = "set_nr_info",
	GET_STYLE_INFO = "get_style_info",
	SET_STYLE_INFO = "set_style_info",
	GET_AE_LOCK_STATUS = "get_ae_lock_status",
	SET_AE_LOCK_STATUS = "set_ae_lock_status",
  }
  
  export enum Group {
	HDMI = "hdmi",
	PTZ = "ptz",
	ALL = "all",
	VENC = "venc",
	STREAMPLAY = "streamplay",
	STREAMPLAY_NDI = "streamplay_ndi",
	NDI = "ndi",
	AUDIO = "audio",
	PUBLISH = "publish",
	SYSTIME = "systime",
	RECORD = "record",
	TALLY_LED = "tally_led",
	SYSCONTROL = "syscontrol",
	CAMERA = "camera",
  }  
  
  // Binary switch state common to many endpoints.
  export enum SwitchState {
	Off = 0,
	On = 1,
  }
  
  // Output resolution options for the "format" parameter.
  export enum OutputResolution {
	_2160p30 = "2160p30",
	_2160p25 = "2160p25",
	_2160p24 = "2160p24",
	_1080p60 = "1080p60",
	_1080p50 = "1080p50",
	_1080p30 = "1080p30",
	_1080p25 = "1080p25",
	_1080p24 = "1080p24",
	_1080i60 = "1080i60",
	_1080i50 = "1080i50",
	_720p60  = "720p60",
	_720p50  = "720p50",
  }

export enum PTZOpID {
	// Pan left
	PAN_LEFT_ONE_STEP = 1,
	PAN_LEFT_CONTINUOUS = 2,
  
	// Pan right
	PAN_RIGHT_ONE_STEP = 3,
	PAN_RIGHT_CONTINUOUS = 4,
  
	// Tilt up
	TILT_UP_ONE_STEP = 7,
	TILT_UP_CONTINUOUS = 2, // NOTE: some docs conflict with '2'; adjust if your real device differs
  
	// Tilt down
	TILT_DOWN_ONE_STEP = 8,
	TILT_DOWN_CONTINUOUS = 9,
  
	// Move to horizontal position
	HORIZONTAL_POS = 5,  // data: { value: 0~8000 }
  
	// Move to vertical position
	VERTICAL_POS = 10,   // data: { value: 0~2100 }
  
	// Focus far/near (one step & continuous)
	FOCUS_NEAR_ONE_STEP = 19,
	FOCUS_NEAR_CONTINUOUS = 20,
	FOCUS_FAR_ONE_STEP = 21,
	FOCUS_FAR_CONTINUOUS = 22,
  
	// One-push focus
	ONE_PUSH_FOCUS = 25,  // data: { point?: {...} } if needed
  
	// Presets
	SET_PRESET = 26,      // data: { id: number, desc?: string }
	DELETE_PRESET = 28,   // data: { id: number, desc?: string } (some docs show 29 or 28)
	CALL_PRESET = 29,     // data: { id: number }
  }  
  
  // Audio-related enums.
  export enum AudioInputType {
	LINE_IN = "LINE IN",
	INTERNAL_MIC = "Internal MIC",
	HDMI_IN = "HDMI IN",
  }
  
  export enum AudioCodec {
	AAC = "AAC",
	MP3 = "MP3",
	G711A = "G.711A",
  }
  
  export enum AudioBitrate {
	BR_32000 = 32000,
	BR_48000 = 48000,
	BR_64000 = 64000,
	BR_96000 = 96000,
	BR_128000 = 128000,
  }
  
  export enum AudioSampleRate {
	SR_8000 = 8000,
	SR_16000 = 16000,
	SR_32000 = 32000,
	SR_44100 = 44100,
	SR_48000 = 48000,
  }

  export enum AudioOutputType {
	LINEOUT = "LINEOUT",
	HDMI = "HDMI",
  }

  export enum AudioInputType_ID {
	LINE_IN = "0",
	INTERNAL_MIC = "1",
	HDMI_IN = "2",
  }
  
  export enum AudioCodec_ID {
	AAC = "0",
	MP3 = "1",
	G711A = "2",
  }
  
  export enum AudioBitrate_ID {
	BR_32000 = "0",
	BR_48000 = "1",
	BR_64000 = "2",
	BR_96000 = "3",
	BR_128000 = "4",
  }
  
  export enum AudioSampleRate_ID {
	SR_8000 = "0",
	SR_16000 = "1",
	SR_32000 = "2",
	SR_44100 = "3",
	SR_48000 = "4",
  }
  
  export enum AudioOutputType_ID {
	LINEOUT = "0",
	HDMI = "1",
  }
  
  export enum AudioChannel {
	Mono = 1,
	Stereo = 2,
  }
  
  // Recording command.
  export enum RecordingCommand {
	RECORD_OFF = 0,
	RECORD_ON = 1,
	RECORD_PAUSE = 2,
	RECORD_CONTINUE = 3,
  }

  export enum RecordingIndex {
	usb1_0 = "usb1_0",
	sdcard_0 = "sdcard_0",
	nas1_0 = "nas1_0",
  }
  
  // Stream type.
  export enum StreamType {
	Local = 0,
	Live = 1,
  }
  
  // Video rotation angles.
  export enum RotateAngle {
	_0 = "0",
	_90 = "90",
	_180 = "180",
	_270 = "270",
  }
  
  // Rate control mode.
  export enum RateControlMode {
	CBR = "CBR",
	VBR = "VBR",
  }
  
  // Video encoding profile.
  export enum VideoProfile {
	BP = "BP",
	MP = "MP",
	HP = "HP",
  }
  
  // Video codec.
  export enum VideoCodec {
	H264 = "H.264",
	H265 = "H.265",
	MJPEG = "MJPEG",
  }
  
  // PTZ protocol options.
  export enum PTZProtocol {
	AUTO = "0",
	VISCA_OVER_IP = "1",
	VISCA = "3",
	PELOCO_D = "4",
	PELOCO_P = "5",
  }

  export enum BaudRates {
	BAUD_2400 = "0",
	BAUD_4800 = "1",
	BAUD_9600 = "2",
	BAUD_19200 = "3",
	BAUD_38400 = "4"
  }

  export enum TallyColourList {
	OFF = 0,
	RED = 1,
	GREEN = 2,
	BLUE = 3,
  }

  export enum TallyModeList {
	AUTO = 0,
	MANUAL = 1
  }

  export enum DeviceTimeMode {
	COMPUTER = 0,
	MANUAL = 1,
	NTP = 2
  }

  