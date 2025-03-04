import {
	AudioSampleRate,
	OutputResolution,
	SwitchState,
	PTZProtocol,
	VideoCodec,
	VideoProfile,
	RateControlMode,
	RotateAngle,
	StreamType,
	AudioInputType,
	AudioOutputType,
	AudioCodec,
	AudioBitrate,
	AudioChannel,
	RecordingCommand,
	TallyColourList,
	TallyModeList,
	DeviceTimeMode,
	RecordingIndex,
	Group,
	Opt,
	AudioBitrate_ID,
	AudioCodec_ID,
	AudioInputType_ID,
	AudioOutputType_ID,
	AudioSampleRate_ID,
  } from './enums'
  
  /* --------------------------------------------------------------------------
	 API Response
  -------------------------------------------------------------------------- */
  export interface ApiResponse {
	status: string
	rsp: string
	data?: any
  }
  
  /* --------------------------------------------------------------------------
	 1) Input/Output
  -------------------------------------------------------------------------- */
  
  /** Input signal detection */
  export interface InputSignalRequest {
	group: Group.HDMI
	opt: Opt.GET_INPUT_INFO
  }
  export interface InputSignalResponse extends ApiResponse {
	data: {
	  hdmi_signal: 0 | 1
	  audio_signal: 0 | AudioSampleRate.SR_32000 | AudioSampleRate.SR_44100 | AudioSampleRate.SR_48000
	  width: number
	  height: number
	  framerate: number
	  desc: string
	}
  }
  
  /** Get output information */
  export interface OutputInfoGetRequest {
	group: Group.HDMI
	opt: Opt.GET_OUTPUT_INFO
  }
  export interface OutputInfoResponse extends ApiResponse {
	data: {
	  switch?: number
	  format: OutputResolution
	  audio_switch: SwitchState
	  loop_out_switch: SwitchState
	}
  }
  
  /** Set output information */
  export interface OutputInfoSetRequest {
	group: Group.HDMI
	opt: Opt.SET_OUTPUT_INFO
	data: {
	  format: OutputResolution
	  audio_switch: SwitchState
	  loop_out_switch: SwitchState
	}
  }
  
  /* --------------------------------------------------------------------------
	 2) PTZ Camera Control
  -------------------------------------------------------------------------- */
  
  /** Get PTZ configuration */
  export interface PTZConfigGetRequest {
	group: Group.PTZ
	opt: Opt.GET_PTZ_INFO
  }
  export interface PTZProtocolItem {
	index: number
	lable: string
	type?: 0 | 1
	ip?: string
	port?: number
	onvif_port?: number
	soap_port?: number
	addr?: number
	addr_fix?: 0 | 1
	baudrate_id?: number
  }
  export interface PTZConfigResponse extends ApiResponse {
	data: {
	  protocol: PTZProtocol
	  protocol_list: PTZProtocolItem[]
	  usb2serial: 0 | 1
	}
  }
  
  /** Set PTZ configuration */
  export interface PTZConfigSetRequest {
	group: Group.PTZ
	opt: Opt.SET_PTZ_INFO
	data: {
	  protocol: PTZProtocol
	  type?: 0 | 1
	  ip?: string
	  port?: number
	  baudrate_id?: number
	  addr?: number
	  addr_fix?: 0 | 1
	}
  }
  
  /** PTZ control command (pan/tilt/focus/presets, etc.) */
  export interface PTZControlRequest {
	group: Group.PTZ
	opt: Opt.CONTROL
	opid: number
	data?: {
	  value?: number
	  id?: number
	  desc?: string
	  point?: {
		x_percent: number
		y_percent: number
		d_pixel: number
	  }
	}
  }
  
  export interface GetFocusModeRequest {
	group: Group.PTZ
	opt: Opt.GET_FOCUSMODE
  }
  export interface GetFocusModeResponse extends ApiResponse {
	data: {
	  selected_id: number
	  focusmode_list: string[]
	}
  }
  
  export interface GetAFSensitivityRequest {
	group: Group.PTZ
	opt: Opt.GET_SENSITIVITY
  }
  export interface GetAFSensitivityResponse extends ApiResponse {
	data: {
	  selected_id: number
	  sensitivity_list: string[]
	}
  }
  
  export interface GetFocusZoneRequest {
	group: Group.PTZ
	opt: Opt.GET_FOCUS_ZONE
  }
  export interface GetFocusZoneResponse extends ApiResponse {
	data: {
	  selected_id: number
	  zone_list: string[]
	  point?: {
		x_percent: number
		y_percent: number
		d_pixel: number
	  }
	}
  }
  
  export interface GetFocusSpeedRequest {
	group: Group.PTZ
	opt: Opt.GET_FOCUS_SPEED
  }
  export interface GetFocusSpeedResponse extends ApiResponse {
	data: {
	  focus: number
	}
  }
  
  export interface GetAFLockStatusRequest {
	group: Group.PTZ
	opt: Opt.GET_AF_LOCK_STATUS
  }
  export interface GetAFLockStatusResponse extends ApiResponse {
	data: {
	  af_lock_status: 0 | 1
	}
  }
  
  /** For setDigitalZoom + get digital_zoom */
  export interface GetDigitalZoomRequest {
	group: 'digital_zoom'
  }
  export interface GetDigitalZoomResponse extends ApiResponse {
	digital_zoom: number
	digital_zoom_enable: 0 | 1
	digital_zoom_max: number
  }
  
  export interface GetZoomSpeedRequest {
	group: Group.PTZ
	opt: Opt.GET_ZOOM_SPEED
  }
  export interface GetZoomSpeedResponse extends ApiResponse {
	data: {
	  zoom: number
	}
  }
  
  export interface SetFocusModeRequest {
	group: Group.PTZ
	opt: Opt.SET_FOCUS_MODE
	data: {
	  focusmode: number
	}
  }
  
  export interface SetAFSensitivityRequest {
	group: Group.PTZ
	opt: Opt.SET_SENSITIVITY
	data: {
	  selected_id: number
	}
  }
  
  export interface SetFocusAreaRequest {
	group: Group.PTZ
	opt: Opt.SET_FOCUS_ZONE
	data: {
	  selected_id: number
	  point?: {
		x_percent: number
		y_percent: number
		d_pixel: number
	  }
	}
  }
  
  export interface SetFocusSpeedRequest {
	group: Group.PTZ
	opt: Opt.SET_FOCUS_SPEED
	data: {
	  focus: number
	  save_flag: 0 | 1
	}
  }
  
  export interface SetAFLockRequest {
	group: Group.PTZ
	opt: Opt.SET_AF_LOCK_STATUS
	data: {
	  af_lock_status: 0 | 1
	}
  }
  
  export interface SetDigitalZoomRequest {
	group: 'digital_zoom'
	digital_zoom: number
	digital_zoom_enable: 0 | 1
	digital_zoom_max?: number
  }
  
  export interface SetZoomSpeedRequest {
	group: Group.PTZ
	opt: Opt.SET_ZOOM_SPEED
	data: {
	  zoom: number
	  save_flag: 0 | 1
	}
  }
  
  /* --------------------------------------------------------------------------
	 3) Encoding
  -------------------------------------------------------------------------- */
  
  /** Get encoding parameters */
  export interface EncodingGetRequest {
	group: Group.ALL
  }
  export interface EncodingResponse extends ApiResponse {
	data: {
	  resolution_list: Array<{ desc: string; width: number; height: number }>
	  output_list: OutputResolution[]
	  venc?: Array<{
		venc_chnid: number
		followVI?: number
		codec: {
		  selected_id: number
		  codec_list: [VideoCodec.H264, VideoCodec.H265, VideoCodec.MJPEG]
		}
		profile: {
		  selected_id: number
		  profile_list: [VideoProfile.BP, VideoProfile.MP, VideoProfile.HP]
		}
		ratecontrol: {
		  selected_id: number
		  mode_list: [RateControlMode.CBR, RateControlMode.VBR]
		}
		bitrate: number
		ndi_bitrate_pre: number
		width: number
		height: number
		framerate: number
		keyinterval: number
		gop: number
		MaxQP: number
		MinQP: number
		keyMinQP: number
		QPlevel: number
		rotate: {
		  selected_id: RotateAngle
		  rotate_list: [RotateAngle._0, RotateAngle._90, RotateAngle._180, RotateAngle._270]
		}
		stream_id: number
		desc: string
	  }>
	}
  }
  
  /** Modify encoding parameters */
  export interface EncodingSetRequest {
	group: Group.VENC
	venc: Array<{
	  venc_chnid: number
	  codec: {
		selected_id: number
		codec_list: [VideoCodec.H264, VideoCodec.H265, VideoCodec.MJPEG]
	  }
	  profile: {
		selected_id: number
		profile_list: [VideoProfile.BP, VideoProfile.MP, VideoProfile.HP]
	  }
	  ratecontrol: {
		selected_id: number
		mode_list: [RateControlMode.CBR, RateControlMode.VBR]
	  }
	  bitrate: number
	  ndi_bitrate_pre: number
	  width: number
	  height: number
	  framerate: number
	  keyinterval: number
	  gop: number
	  MaxQP: number
	  MinQP: number
	  keyMinQP: number
	  QPlevel: number
	  rotate: {
		selected_id: RotateAngle
		rotate_list: [RotateAngle._0, RotateAngle._90, RotateAngle._180, RotateAngle._270]
	  }
	  stream_id: number
	  desc: string
	}>
  }
  
  /* --------------------------------------------------------------------------
	 4) Decoding
  -------------------------------------------------------------------------- */
  
  /** Add decoding URL */
  export interface DecodingAddRequest {
	group: Group.STREAMPLAY
	opt: Opt.STREAMPLAY_ADD
	data: {
	  switch: SwitchState
	  name: string
	  streamtype: StreamType
	  url: string
	}
  }
  
  /** Get decoding information */
  export interface DecodingGetRequest {
	group: Group.STREAMPLAY
	opt: Opt.STREAMPLAY_GET_ALL
  }
  export interface DecodingResponse extends ApiResponse {
	data: Array<{
	  index: number
	  switch: SwitchState
	  name: string
	  streamtype: StreamType
	  url: string
	  streamplay_status: number
	  bandwidth: number
	  framerate: number
	  width: number
	  height: number
	}>
  }
  
  /** Delete decoding URL */
  export interface DecodingDeleteRequest {
	group: Group.STREAMPLAY
	opt: Opt.STREAMPLAY_DEL
	data: {
	  index: number
	}
  }
  
  /** Modify decoding information */
  export interface DecodingModifyRequest {
	group: Group.STREAMPLAY
	opt: Opt.STREAMPLAY_MODIFY
	data: {
	  index: number
	  switch: SwitchState
	  name: string
	  streamtype: StreamType
	  url: string
	}
  }
  
  /** Get decoding status */
  export interface DecodingStatusRequest {
	group: Group.STREAMPLAY
	opt: Opt.GET_DECODER_STATE
  }
  
  /* --------------------------------------------------------------------------
	 5) NDI Decoding
  -------------------------------------------------------------------------- */
  
  export interface NDIFindRequest {
	group: Group.STREAMPLAY_NDI
	opt: Opt.NDI_FIND
  }
  export interface NDISourceGetRequest {
	group: Group.STREAMPLAY_NDI
	opt: Opt.NDI_GET_ALL
  }
  export interface NDISourceResponse extends ApiResponse {
	data: Array<{
	  index: number
	  name: string
	  url: string
	  streamplay_status: number
	  bandwidth: number
	  framerate: number
	  width: number
	  height: number
	}>
  }
  export interface NDIDecodingEnableRequest {
	group: Group.STREAMPLAY_NDI
	opt: Opt.NDI_RECV
	data: {
	  ndi_name: string
	}
  }
  export interface NDIDecodingDisableRequest {
	group: Group.STREAMPLAY_NDI
	opt: Opt.NDI_CLOSE
  }
  export interface NDIGroupInfoRequest {
	group: Group.STREAMPLAY_NDI
	opt: Opt.NDI_GET_RECV_CONFIG
  }
  export interface NDIGroupSetRequest {
	group: Group.STREAMPLAY_NDI
	opt: Opt.NDI_SET_RECV_CONFIG
	data: {
	  groups: string
	}
  }
  
  /* --------------------------------------------------------------------------
	 6) NDI
  -------------------------------------------------------------------------- */
  
  export interface NDIActivateRequest {
	group: Group.NDI
	opt: Opt.NDI_ACTIVATE
	data: {
	  license_key: string
	}
  }
  export interface NDIAuthCodeGetRequest {
	group: Group.NDI
	opt: Opt.GET_AUTH_CODE
  }
  export interface NDIConfigGetRequest {
	group: Group.NDI
	opt: Opt.GET_CONFIG
  }
  export interface NDIConfigSetRequest {
	group: Group.NDI
	opt: Opt.SET_CONFIG
	data: {
	  authorization_code: string
	  ndi_mode: number
	  network_bandwidth: number
	}
  }
  export interface NDISwitchRequest {
	group: Group.NDI
	opt: Opt.NDI_SWITCH
	data: {
	  switch_value: number
	}
  }
  
  /* --------------------------------------------------------------------------
	 7) Audio
  -------------------------------------------------------------------------- */
  
  export interface AudioConfigGetRequest {
	group: Group.ALL
  }
  export interface AudioConfigGetResponse extends ApiResponse {
	all: {
	  switch: SwitchState
	  ai_devid: number
	  ai_chnid: number[]
	  ai_type: {
		selected_id: 0 | 1 | 2
		ai_type_list: [AudioInputType.LINE_IN, AudioInputType.INTERNAL_MIC, AudioInputType.HDMI_IN]
	  }
	  adec_chnid: number
	  aenc_chnnum: number
	  stream_id: number[]
	  aenc_chnid: number[]
	  ao_devnum: number
	  ao_devid: number[]
	  ao_chnid: number[]
	  ao_devtype: [AudioOutputType.LINEOUT, AudioOutputType.HDMI]
	  codec: {
		selected_id: 0 | 1 | 2
		codec_list: [AudioCodec.AAC, AudioCodec.MP3, AudioCodec.G711A]
	  }
	  bitrate: {
		selected_id: 0 | 1 | 2 | 3 | 4
		bitrate_list: [
		  AudioBitrate.BR_32000,
		  AudioBitrate.BR_48000,
		  AudioBitrate.BR_64000,
		  AudioBitrate.BR_96000,
		  AudioBitrate.BR_128000
		]
	  }
	  sample_rate: {
		selected_id: 0 | 1 | 2 | 3 | 4
		sample_rate_list: [
		  AudioSampleRate.SR_8000,
		  AudioSampleRate.SR_16000,
		  AudioSampleRate.SR_32000,
		  AudioSampleRate.SR_44100,
		  AudioSampleRate.SR_48000
		]
	  }
	  bit_width: 16
	  channel: AudioChannel
	  volume: number
	}
  }
  export interface AudioConfigSetRequest {
	group: Group.AUDIO
	audio: {
	  stream_id: number
	  ai_devid: number
	  ai_chnid: number[]
	  adec_chnid: number
	  aenc_chnid: number
	  ai_type: {
		selected_id: AudioInputType_ID
		ai_type_list: [AudioInputType.LINE_IN, AudioInputType.INTERNAL_MIC, AudioInputType.HDMI_IN]
	  }
	  ao_devid: number
	  ao_chnid: number
	  ao_devtype: {
		selected_id: AudioOutputType_ID
		ao_devtype_list: [AudioOutputType.LINEOUT, AudioOutputType.HDMI]
	  }
	  switch: SwitchState
	  codec: {
		selected_id: AudioCodec_ID
		codec_list: [AudioCodec.AAC, AudioCodec.MP3, AudioCodec.G711A]
	  }
	  bitrate: {
		selected_id: AudioBitrate_ID
		bitrate_list: [
		  AudioBitrate.BR_32000,
		  AudioBitrate.BR_48000,
		  AudioBitrate.BR_64000,
		  AudioBitrate.BR_96000,
		  AudioBitrate.BR_128000
		]
	  }
	  sample_rate: {
		selected_id: AudioSampleRate_ID
		sample_rate_list: [
		  AudioSampleRate.SR_8000,
		  AudioSampleRate.SR_16000,
		  AudioSampleRate.SR_32000,
		  AudioSampleRate.SR_44100,
		  AudioSampleRate.SR_48000
		]
	  }
	  bit_width: 16
	  channel: AudioChannel
	  volume: number
	}
  }
  
  /** New interface for Audio Switch only */
  export interface AudioSwitchRequest {
	group: Group.AUDIO
	opt: Opt.SET_AUDIO_SWITCH
	data: {
	  switch: SwitchState
	}
  }
  
  /* --------------------------------------------------------------------------
	 8) Streaming
  -------------------------------------------------------------------------- */
  
  export interface StreamPublishRequest {
	group: Group.PUBLISH
	opt: Opt.ADD_PUBLISH_INFO
	data: {
	  service: string
	  protocol: string
	  url: string
	  key: string
	  switch: SwitchState
	  desc: string
	  name: string
	}
  }
  export interface StreamInfoGetRequest {
	group: Group.STREAMPLAY
	opt: Opt.STREAMPLAY_GET_ALL
  }
  export interface StreamDeleteRequest {
	group: Group.PUBLISH
	opt: Opt.DEL_PUBLISH_INFO
	data: {
	  index: number
	}
  }
  export interface StreamModifyRequest {
	group: Group.PUBLISH
	opt: Opt.UPDATE_STREAMS_INDEX
	data: Array<{
	  index: number
	  show_index: number
	}>
  }
  export interface StreamToggleRequest {
	group: Group.PUBLISH
	opt: Opt.UPDATE_PUBLISH_SWITCH
	data: {
	  index: number
	  switch: number
	}
  }
  
  /* --------------------------------------------------------------------------
	 9) Device Time
  -------------------------------------------------------------------------- */
  
  export interface DeviceTimeGetRequest {
	group: Group.SYSTIME
	opt: Opt.GET_SYSTIME_INFO
  }
  export interface DeviceTimeResponse extends ApiResponse {
	data: {
	  time: {
		year: number
		month: number
		day: number
		hour: number
		minute: number
		second: number
	  }
	  setting_mode_id: DeviceTimeMode
	  time_zone_id: string
	  ntp_enable: number
	  ntp_server: string
	  ntp_port: number
	}
  }
  export interface DeviceTimeSetRequest {
	group: Group.SYSTIME
	opt: Opt.SET_SYSTIME_INFO
	data: {
	  time: {
		year: number
		month: number
		day: number
		hour: number
		minute: number
		second: number
	  }
	  setting_mode_id: DeviceTimeMode
	  time_zone_id: string
	  ntp_enable: number
	  ntp_server: string
	  ntp_port: number
	}
  }
  
  /* --------------------------------------------------------------------------
	 10) Recording
  -------------------------------------------------------------------------- */
  
  export interface RecordingStatusGetRequest {
	group: Group.RECORD
	opt: Opt.GET_STATUS
  }
  export interface RecordingStatusResponse extends ApiResponse {
	data: {
	  storage_status: string
	  free_space: number
	}
  }
  export interface RecordingTaskListRequest {
	group: Group.RECORD
	opt: Opt.GET_TASK_LIST
  }
  export interface RecordingTaskListResponse extends ApiResponse {
	data: Array<{
	  id: RecordingIndex
	  name: string
	  status: string
	  start_time: string
	  end_time: string
	}>
  }
  export interface RecordingTaskModifyRequest {
	group: Group.RECORD
	opt: Opt.MODIFY_TASK
	data: {
	  id: RecordingIndex
	  name: string
	  schedule: string
	  record_duration: number
	  resolution: string
	}
  }
  export interface RecordingControlRequest {
	group: Group.RECORD
	opt: Opt.SET_TASK_ENABLE
	data: {
	  index: RecordingIndex
	  enable: RecordingCommand
	}
  }
  
  /* --------------------------------------------------------------------------
	 11) Tally
  -------------------------------------------------------------------------- */
  
  export interface TallyGetRequest {
	group: Group.TALLY_LED
	opt: Opt.GET_TALLY_LED_INFO
  }
  export interface TallyResponse extends ApiResponse {
	data: {
	  selected_color: string
	  switch: number
	  mode_id: number
	  mode_list: TallyModeList
	  color_id: number
	  color_list: TallyColourList
	}
  }
  export interface TallySetRequest {
	group: Group.TALLY_LED
	opt: Opt.SET_TALLY_LED_INFO
	data: {
	  mode_id: TallyModeList
	  color_id: TallyColourList
	}
  }
  export interface TallySwitchRequest {
	group: Group.TALLY_LED
	opt: Opt.SET_TALLY_LED_SWITCH
	data: {
	  switch: SwitchState
	}
  }
  export interface TallyColorGetRequest {
	group: Group.TALLY_LED
	opt: Opt.GET_TALLY_LED_COLOR
  }
  
  /* --------------------------------------------------------------------------
	 12) Restore and Reboot
  -------------------------------------------------------------------------- */
  
  export interface RebootRequest {
	group: Group.SYSCONTROL
	opt: Opt.SET_REBOOT_INFO
	data: {
	  command: string
	}
  }
  export interface RestoreFactoryRequest {
	group: Group.SYSCONTROL
	opt: Opt.SET_RESET_INFO
	data: {
	  command: string
	}
  }
  
  /* --------------------------------------------------------------------------
	 13) Exposure
  -------------------------------------------------------------------------- */
  
  export interface GetExposureRequest {
	group: Group.CAMERA
	opt: Opt.GET_EXPOSURE_INFO
  }
  export interface ExposureResponse extends ApiResponse {
	data: {
	  mode: {
		selected_id: number
		mode_list: string[]
	  }
	  gain: number
	  shutter: {
		selected_id: number
		shutter_list: string[]
	  }
	  wdr: {
		selected_id: number
		wdr_list: number[]
	  }
	  flicker: {
		selected_id: number
		flicker_list: string[]
	  }
	  bias_enable: 0 | 1
	  bias: number
	  backlight_enable: 0 | 1
	  backlight: number
	  metering: {
		selected_id: number
		metering_list: string[]
	  }
	  sensitive: {
		selected_id: number
		sensitive_list: string[]
	  }
	  gain_limit: number
	}
  }
  export interface SetExposureRequest {
	group: Group.CAMERA
	opt: Opt.SET_EXPOSURE_INFO
	data: {
	  mode: { selected_id: number }
	  bright?: number
	  gain: number
	  shutter: { selected_id: number }
	  wdr: { selected_id: number }
	  flicker: { selected_id: number }
	  bias_enable: number
	  bias: number
	  backlight_enable: number
	  backlight: number
	  metering: { selected_id: number }
	  sensitive: { selected_id: number }
	  save_flag: 0 | 1
	}
  }
  
  /* --------------------------------------------------------------------------
	 14) Aperture
  -------------------------------------------------------------------------- */
  
  export interface GetApertureRequest {
	group: Group.PTZ
	opt: Opt.GET_APERTURE
  }
  export interface ApertureResponse extends ApiResponse {
	data: {
	  selected_id: number
	  max_aperture_id: number
	  aperture_id: number
	  aperture_list: string[]
	}
  }
  export interface SetApertureRequest {
	group: Group.PTZ
	opt: Opt.SET_APERTURE
	data: {
	  aperture: number
	}
  }
  
  /* --------------------------------------------------------------------------
	 15) White Balance
  -------------------------------------------------------------------------- */
  
  export interface GetWhiteBalanceRequest {
	group: Group.CAMERA
	opt: Opt.GET_WHITE_BALANCE_INFO
  }
  export interface WhiteBalanceResponse extends ApiResponse {
	data: {
	  mode: {
		selected_id: number
		mode_list: string[]
	  }
	  var: {
		selected_id: number
		var_list: string[]
	  }
	  rgain: number
	  bgain: number
	  saturation: number
	  hue: number
	  ircut: {
		selected_id: number
	  }
	}
  }
  export interface SetWhiteBalanceRequest {
	group: Group.CAMERA
	opt: Opt.SET_WHITE_BALANCE_INFO
	data: {
	  mode: { selected_id: number }
	  var: { selected_id: number }
	  rgain: number
	  bgain: number
	  saturation: number
	  hue: number
	  ircut: { selected_id: number }
	  save_flag: 0 | 1
	}
  }
  
  /* --------------------------------------------------------------------------
	 16) Image Info
  -------------------------------------------------------------------------- */
  
  export interface GetImageInfoRequest {
	group: Group.CAMERA
	opt: Opt.GET_IMAGE_INFO
  }
  export interface ImageSettingResponse extends ApiResponse {
	data: {
	  brightness: number
	  contrast: number
	  sharpness: number
	  gamma: {
		selected_id: number
		gamma_list: string[]
	  }
	  flip: {
		selected_id: number
		flip_list: string[]
	  }
	  color_gray: {
		selected_id: number
		cg_list: string[]
	  }
	}
  }
  export interface SetImageInfoRequest {
	group: Group.CAMERA
	opt: Opt.SET_IMAGE_INFO
	data: {
	  brightness: number
	  contrast: number
	  sharpness: number
	  gamma: { selected_id: number }
	  flip: { selected_id: number }
	  color_gray: { selected_id: number }
	  save_flag: 0 | 1
	}
  }
  
  /* --------------------------------------------------------------------------
	 17) Noise Reduction
  -------------------------------------------------------------------------- */
  
  export interface GetNRInfoRequest {
	group: Group.CAMERA
	opt: Opt.GET_NR_INFO
  }
  export interface NoiseReductionResponse extends ApiResponse {
	data: {
	  nr_2d: {
		selected_id: number
		nr_2d_list: string[]
	  }
	  nr_3d: {
		selected_id: number
		nr_3d_list: string[]
	  }
	  correction: {
		selected_id: number
		correction_list: string[]
	  }
	}
  }
  export interface SetNRInfoRequest {
	group: Group.CAMERA
	opt: Opt.SET_NR_INFO
	data: {
	  nr_2d: { selected_id: number }
	  nr_3d: { selected_id: number }
	  correction: { selected_id: number }
	  save_flag: 0 | 1
	}
  }
  
  /* --------------------------------------------------------------------------
	 18) Image Style
  -------------------------------------------------------------------------- */
  
  export interface GetStyleInfoRequest {
	group: Group.CAMERA
	opt: Opt.GET_STYLE_INFO
  }
  export interface ImageStyleResponse extends ApiResponse {
	data: {
	  selected_id: number
	  style_list: string[]
	}
  }
  export interface SetStyleInfoRequest {
	group: Group.CAMERA
	opt: Opt.SET_STYLE_INFO
	data: {
	  selected_id: number
	  save_flag: 0 | 1
	}
  }
  
  /* --------------------------------------------------------------------------
	 19) AE Lock
  -------------------------------------------------------------------------- */
  
  export interface GetAELockRequest {
	group: Group.CAMERA
	opt: Opt.GET_AE_LOCK_STATUS
  }
  export interface AELockResponse extends ApiResponse {
	data: {
	  ae_lock_status: 0 | 1
	}
  }
  export interface SetAELockRequest {
	group: Group.CAMERA
	opt: Opt.SET_AE_LOCK_STATUS
	data: {
	  ae_lock_status: 0 | 1
	}
  }
  