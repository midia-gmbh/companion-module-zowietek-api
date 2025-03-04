import axios from 'axios'
import type { ZowietekInstance } from '../index.js'
import { ConsoleLog } from '../modules/logger.js'
import { LogLevel, Group, Opt } from './enums.js'

import {
  ApiResponse,
  InputSignalRequest,
  InputSignalResponse,
  OutputInfoGetRequest,
  OutputInfoResponse,
  OutputInfoSetRequest,
  PTZConfigGetRequest,
  PTZConfigSetRequest,
  PTZConfigResponse,
  PTZControlRequest,
  EncodingGetRequest,
  EncodingResponse,
  EncodingSetRequest,
  DecodingAddRequest,
  DecodingGetRequest,
  DecodingResponse,
  DecodingDeleteRequest,
  DecodingModifyRequest,
  DecodingStatusRequest,
  NDIFindRequest,
  NDISourceGetRequest,
  NDISourceResponse,
  NDIDecodingEnableRequest,
  NDIDecodingDisableRequest,
  NDIGroupInfoRequest,
  NDIGroupSetRequest,
  NDIActivateRequest,
  NDIAuthCodeGetRequest,
  NDIConfigGetRequest,
  NDIConfigSetRequest,
  NDISwitchRequest,
  AudioConfigGetRequest,
  AudioConfigGetResponse,
  AudioConfigSetRequest,
  AudioSwitchRequest,
  StreamPublishRequest,
  StreamInfoGetRequest,
  StreamDeleteRequest,
  StreamModifyRequest,
  StreamToggleRequest,
  DeviceTimeGetRequest,
  DeviceTimeResponse,
  DeviceTimeSetRequest,
  RecordingStatusGetRequest,
  RecordingStatusResponse,
  RecordingTaskListRequest,
  RecordingTaskListResponse,
  RecordingTaskModifyRequest,
  RecordingControlRequest,
  TallyGetRequest,
  TallyResponse,
  TallySetRequest,
  TallySwitchRequest,
  TallyColorGetRequest,
  RebootRequest,
  SetZoomSpeedRequest,
  SetAFLockRequest,
  SetAFSensitivityRequest,
  SetDigitalZoomRequest,
  SetFocusAreaRequest,
  SetFocusModeRequest,
  SetFocusSpeedRequest,
  GetAFLockStatusRequest,
  GetAFLockStatusResponse,
  GetAFSensitivityRequest,
  GetAFSensitivityResponse,
  GetDigitalZoomRequest,
  GetDigitalZoomResponse,
  GetFocusModeRequest,
  GetFocusModeResponse,
  GetFocusSpeedRequest,
  GetFocusSpeedResponse,
  GetFocusZoneRequest,
  GetFocusZoneResponse,
  GetZoomSpeedRequest,
  GetZoomSpeedResponse,
  AELockResponse,
  ApertureResponse,
  ExposureResponse,
  GetAELockRequest,
  GetApertureRequest,
  GetExposureRequest,
  GetImageInfoRequest,
  GetNRInfoRequest,
  GetStyleInfoRequest,
  GetWhiteBalanceRequest,
  ImageSettingResponse,
  ImageStyleResponse,
  NoiseReductionResponse,
  SetAELockRequest,
  SetApertureRequest,
  SetExposureRequest,
  SetImageInfoRequest,
  SetNRInfoRequest,
  SetStyleInfoRequest,
  SetWhiteBalanceRequest,
  WhiteBalanceResponse,
} from './interfaces.js'

export class ZowietekAPI {
  private baseUrl: string
  private instance: ZowietekInstance

  constructor(baseUrl: string, instance: ZowietekInstance) {
    this.baseUrl = baseUrl
    this.instance = instance
  }

  private async sendRequest<T>(endpoint: string, body?: object): Promise<T> {
    if (this.instance.globalSettings.enableComs) {
      try {
        const response = await axios.post(`http://${this.baseUrl}${endpoint}`, body, {
          headers: { 'Content-Type': 'application/json' },
        })
        return response.data as T
      } catch (error) {
        ConsoleLog(this.instance, `Request failed: ${error}.`, LogLevel.ERROR)
        throw error
      }
    } else {
      ConsoleLog(this.instance, 'Comms disabled, skipping request.', LogLevel.INFO, false)
      return null as any
    }
  }

  /* --------------------------------------------------------------------------
     1) Input/Output
  -------------------------------------------------------------------------- */

  async getInputSignal(): Promise<InputSignalResponse> {
    const req: InputSignalRequest = { group: Group.HDMI, opt: Opt.GET_INPUT_INFO }
    return this.sendRequest<InputSignalResponse>('/video?option=getinfo&login_check_flag=1', req)
  }

  async getOutputInfo(): Promise<OutputInfoResponse> {
    const req: OutputInfoGetRequest = { group: Group.HDMI, opt: Opt.GET_OUTPUT_INFO }
    return this.sendRequest<OutputInfoResponse>('/video?option=getinfo&login_check_flag=1', req)
  }

  async setOutputInfo(data: OutputInfoSetRequest['data']): Promise<ApiResponse> {
    const req: OutputInfoSetRequest = { group: Group.HDMI, opt: Opt.SET_OUTPUT_INFO, data }
    return this.sendRequest<ApiResponse>('/video?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     2) PTZ Camera Control
  -------------------------------------------------------------------------- */

  async getPTZConfig(): Promise<PTZConfigResponse> {
    const req: PTZConfigGetRequest = { group: Group.PTZ, opt: Opt.GET_PTZ_INFO }
    return this.sendRequest<PTZConfigResponse>('/ptz?option=getinfo&login_check_flag=1', req)
  }

  async setPTZConfig(data: PTZConfigSetRequest['data']): Promise<ApiResponse> {
    const req: PTZConfigSetRequest = { group: Group.PTZ, opt: Opt.SET_PTZ_INFO, data }
    return this.sendRequest<ApiResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  async controlPTZ(opid: number, data?: PTZControlRequest['data']): Promise<ApiResponse> {
    const req: PTZControlRequest = {
      group: Group.PTZ,
      opt: Opt.CONTROL,
      opid,
      data,
    }
    return this.sendRequest<ApiResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  /* Sub: GET Focus Mode */
  async getFocusMode(): Promise<GetFocusModeResponse> {
    const req: GetFocusModeRequest = { group: Group.PTZ, opt: Opt.GET_FOCUSMODE }
    return this.sendRequest<GetFocusModeResponse>('/ptz?option=getinfo&login_check_flag=1', req)
  }

  /* Sub: GET AF Sensitivity */
  async getAFSensitivity(): Promise<GetAFSensitivityResponse> {
    const req: GetAFSensitivityRequest = { group: Group.PTZ, opt: Opt.GET_SENSITIVITY }
    return this.sendRequest<GetAFSensitivityResponse>('/ptz?option=getinfo&login_check_flag=1', req)
  }

  /* Sub: GET Focus Zone */
  async getFocusZone(): Promise<GetFocusZoneResponse> {
    const req: GetFocusZoneRequest = { group: Group.PTZ, opt: Opt.GET_FOCUS_ZONE }
    return this.sendRequest<GetFocusZoneResponse>('/ptz?option=getinfo&login_check_flag=1', req)
  }

  /* Sub: GET Focus Speed */
  async getFocusSpeed(): Promise<GetFocusSpeedResponse> {
    const req: GetFocusSpeedRequest = { group: Group.PTZ, opt: Opt.GET_FOCUS_SPEED }
    return this.sendRequest<GetFocusSpeedResponse>('/ptz?option=getinfo&login_check_flag=1', req)
  }

  /* Sub: GET AF Lock */
  async getAFLockStatus(): Promise<GetAFLockStatusResponse> {
    const req: GetAFLockStatusRequest = { group: Group.PTZ, opt: Opt.GET_AF_LOCK_STATUS }
    return this.sendRequest<GetAFLockStatusResponse>('/ptz?option=getinfo&login_check_flag=1', req)
  }

  /* Sub: GET Digital Zoom */
  async getDigitalZoom(): Promise<GetDigitalZoomResponse> {
    // Possibly just group="digital_zoom"
    const req: GetDigitalZoomRequest = { group: 'digital_zoom' }
    return this.sendRequest<GetDigitalZoomResponse>('/video?option=getinfo&login_check_flag=1', req)
  }

  /* Sub: GET Zoom Speed */
  async getZoomSpeed(): Promise<GetZoomSpeedResponse> {
    const req: GetZoomSpeedRequest = { group: Group.PTZ, opt: Opt.GET_ZOOM_SPEED }
    return this.sendRequest<GetZoomSpeedResponse>('/ptz?option=getinfo&login_check_flag=1', req)
  }

  /* Sub: Set Focus Mode */
  async setFocusMode(focusmode: number): Promise<ApiResponse> {
    const req: SetFocusModeRequest = {
      group: Group.PTZ,
      opt: Opt.SET_FOCUS_MODE,
      data: { focusmode },
    }
    return this.sendRequest<ApiResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  /* Sub: Set AF Sensitivity */
  async setAFSensitivity(selected_id: number): Promise<ApiResponse> {
    const req: SetAFSensitivityRequest = {
      group: Group.PTZ,
      opt: Opt.SET_SENSITIVITY,
      data: { selected_id },
    }
    return this.sendRequest<ApiResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  /* Sub: Set Focus Area */
  async setFocusArea(
    selected_id: number,
    point?: { x_percent: number; y_percent: number; d_pixel: number }
  ): Promise<ApiResponse> {
    const req: SetFocusAreaRequest = {
      group: Group.PTZ,
      opt: Opt.SET_FOCUS_ZONE,
      data: { selected_id, point },
    }
    return this.sendRequest<ApiResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  /* Sub: Set Focus Speed */
  async setFocusSpeed(focus: number, save_flag: 0 | 1): Promise<ApiResponse> {
    const req: SetFocusSpeedRequest = {
      group: Group.PTZ,
      opt: Opt.SET_FOCUS_SPEED,
      data: { focus, save_flag },
    }
    return this.sendRequest<ApiResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  /* Sub: Set AF Lock Status */
  async setAFLockStatus(af_lock_status: 0 | 1): Promise<ApiResponse> {
    const req: SetAFLockRequest = {
      group: Group.PTZ,
      opt: Opt.SET_AF_LOCK_STATUS,
      data: { af_lock_status },
    }
    return this.sendRequest<ApiResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  /* Sub: Set Digital Zoom */
  async setDigitalZoom(
    digital_zoom: number,
    digital_zoom_enable: 0 | 1,
    digital_zoom_max?: number
  ): Promise<ApiResponse> {
    const body: SetDigitalZoomRequest = {
      group: 'digital_zoom',
      digital_zoom,
      digital_zoom_enable,
    }
    if (digital_zoom_max !== undefined) {
      body.digital_zoom_max = digital_zoom_max
    }
    return this.sendRequest<ApiResponse>('/video?option=setinfo&login_check_flag=1', body)
  }

  /* Sub: Set Zoom Speed */
  async setZoomSpeed(zoom: number, save_flag: 0 | 1): Promise<ApiResponse> {
    const req: SetZoomSpeedRequest = {
      group: Group.PTZ,
      opt: Opt.SET_ZOOM_SPEED,
      data: { zoom, save_flag },
    }
    return this.sendRequest<ApiResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     3) Encoding
  -------------------------------------------------------------------------- */

  async getEncodingParameters(): Promise<EncodingResponse> {
    const req: EncodingGetRequest = { group: Group.ALL }
    return this.sendRequest<EncodingResponse>('/video?option=getinfo&login_check_flag=1', req)
  }

  async modifyEncodingParameters(data: EncodingSetRequest['venc']): Promise<ApiResponse> {
    const req: EncodingSetRequest = { group: Group.VENC, venc: data }
    return this.sendRequest<ApiResponse>('/video?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     4) Decoding
  -------------------------------------------------------------------------- */

  async addDecodingURL(data: DecodingAddRequest['data']): Promise<ApiResponse> {
    const req: DecodingAddRequest = {
      group: Group.STREAMPLAY,
      opt: Opt.STREAMPLAY_ADD,
      data,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  async getDecodingInfo(): Promise<DecodingResponse> {
    const req: DecodingGetRequest = {
      group: Group.STREAMPLAY,
      opt: Opt.STREAMPLAY_GET_ALL,
    }
    return this.sendRequest<DecodingResponse>('/streamplay?option=getinfo&login_check_flag=1', req)
  }

  async deleteDecodingURL(index: number): Promise<ApiResponse> {
    const req: DecodingDeleteRequest = {
      group: Group.STREAMPLAY,
      opt: Opt.STREAMPLAY_DEL,
      data: { index },
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  async modifyDecodingInfo(data: DecodingModifyRequest['data']): Promise<ApiResponse> {
    const req: DecodingModifyRequest = {
      group: Group.STREAMPLAY,
      opt: Opt.STREAMPLAY_MODIFY,
      data,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  async getDecodingStatus(): Promise<ApiResponse> {
    const req: DecodingStatusRequest = {
      group: Group.STREAMPLAY,
      opt: Opt.GET_DECODER_STATE,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=getinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     5) NDI Decoding
  -------------------------------------------------------------------------- */

  async ndiFind(): Promise<ApiResponse> {
    const req: NDIFindRequest = {
      group: Group.STREAMPLAY_NDI,
      opt: Opt.NDI_FIND,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  async getNDISource(): Promise<NDISourceResponse> {
    const req: NDISourceGetRequest = {
      group: Group.STREAMPLAY_NDI,
      opt: Opt.NDI_GET_ALL,
    }
    return this.sendRequest<NDISourceResponse>('/streamplay?option=getinfo&login_check_flag=1', req)
  }

  async enableNDIDecoding(data: NDIDecodingEnableRequest['data']): Promise<ApiResponse> {
    const req: NDIDecodingEnableRequest = {
      group: Group.STREAMPLAY_NDI,
      opt: Opt.NDI_RECV,
      data,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  async disableNDIDecoding(): Promise<ApiResponse> {
    const req: NDIDecodingDisableRequest = {
      group: Group.STREAMPLAY_NDI,
      opt: Opt.NDI_CLOSE,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  async getNDIGroupInfo(): Promise<ApiResponse> {
    const req: NDIGroupInfoRequest = {
      group: Group.STREAMPLAY_NDI,
      opt: Opt.NDI_GET_RECV_CONFIG,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=getinfo&login_check_flag=1', req)
  }

  async setNDIGroup(data: NDIGroupSetRequest['data']): Promise<ApiResponse> {
    const req: NDIGroupSetRequest = {
      group: Group.STREAMPLAY_NDI,
      opt: Opt.NDI_SET_RECV_CONFIG,
      data,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     6) NDI
  -------------------------------------------------------------------------- */

  async activeNDI(data: NDIActivateRequest['data']): Promise<ApiResponse> {
    const req: NDIActivateRequest = {
      group: Group.NDI,
      opt: Opt.NDI_ACTIVATE,
      data,
    }
    return this.sendRequest<ApiResponse>('/video?option=setinfo&login_check_flag=1', req)
  }

  async getSavedAuthCode(): Promise<ApiResponse> {
    const req: NDIAuthCodeGetRequest = {
      group: Group.NDI,
      opt: Opt.GET_AUTH_CODE,
    }
    return this.sendRequest<ApiResponse>('/video?option=getinfo&login_check_flag=1', req)
  }

  async getNDIConfig(): Promise<ApiResponse> {
    const req: NDIConfigGetRequest = {
      group: Group.NDI,
      opt: Opt.GET_CONFIG,
    }
    return this.sendRequest<ApiResponse>('/video?option=getinfo&login_check_flag=1', req)
  }

  async setNDIConfig(data: NDIConfigSetRequest['data']): Promise<ApiResponse> {
    const req: NDIConfigSetRequest = {
      group: Group.NDI,
      opt: Opt.SET_CONFIG,
      data,
    }
    return this.sendRequest<ApiResponse>('/video?option=setinfo&login_check_flag=1', req)
  }

  async ndiSwitch(data: NDISwitchRequest['data']): Promise<ApiResponse> {
    const req: NDISwitchRequest = {
      group: Group.NDI,
      opt: Opt.NDI_SWITCH,
      data,
    }
    return this.sendRequest<ApiResponse>('/video?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     7) Audio
  -------------------------------------------------------------------------- */

  async getAudioConfig(): Promise<AudioConfigGetResponse> {
    const req: AudioConfigGetRequest = { group: Group.ALL }
    return this.sendRequest<AudioConfigGetResponse>('/audio?option=getinfo&login_check_flag=1', req)
  }

  async setAudioConfig(data: AudioConfigSetRequest['audio']): Promise<ApiResponse> {
    const req: AudioConfigSetRequest = { group: Group.AUDIO, audio: data }
    return this.sendRequest<ApiResponse>('/audio?option=setinfo&login_check_flag=1', req)
  }

  async setAudioSwitch(data: AudioSwitchRequest['data']): Promise<ApiResponse> {
    const req: AudioSwitchRequest = { group: Group.AUDIO, opt: Opt.SET_AUDIO_SWITCH, data }
    return this.sendRequest<ApiResponse>('/audio?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     8) Streaming
  -------------------------------------------------------------------------- */

  async publishStream(data: StreamPublishRequest['data']): Promise<ApiResponse> {
    const req: StreamPublishRequest = { group: Group.PUBLISH, opt: Opt.ADD_PUBLISH_INFO, data }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  async getStreamInfo(): Promise<ApiResponse> {
    const req: StreamInfoGetRequest = { group: Group.STREAMPLAY, opt: Opt.STREAMPLAY_GET_ALL }
    return this.sendRequest<ApiResponse>('/streamplay?option=getinfo&login_check_flag=1', req)
  }

  async deleteStream(index: number): Promise<ApiResponse> {
    const req: StreamDeleteRequest = {
      group: Group.PUBLISH,
      opt: Opt.DEL_PUBLISH_INFO,
      data: { index },
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  async modifyStreamDisplayOrder(data: StreamModifyRequest['data']): Promise<ApiResponse> {
    const req: StreamModifyRequest = {
      group: Group.PUBLISH,
      opt: Opt.UPDATE_STREAMS_INDEX,
      data,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  async toggleStreaming(data: StreamToggleRequest['data']): Promise<ApiResponse> {
    const req: StreamToggleRequest = {
      group: Group.PUBLISH,
      opt: Opt.UPDATE_PUBLISH_SWITCH,
      data,
    }
    return this.sendRequest<ApiResponse>('/streamplay?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     9) Device Time
  -------------------------------------------------------------------------- */

  async getDeviceTime(): Promise<DeviceTimeResponse> {
    const req: DeviceTimeGetRequest = { group: Group.SYSTIME, opt: Opt.GET_SYSTIME_INFO }
    return this.sendRequest<DeviceTimeResponse>('/system?option=getinfo&login_check_flag=1', req)
  }

  async setDeviceTime(data: DeviceTimeSetRequest['data']): Promise<ApiResponse> {
    const req: DeviceTimeSetRequest = {
      group: Group.SYSTIME,
      opt: Opt.SET_SYSTIME_INFO,
      data,
    }
    return this.sendRequest<ApiResponse>('/system?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     10) Recording
  -------------------------------------------------------------------------- */

  async getRecordingStatus(): Promise<RecordingStatusResponse> {
    const req: RecordingStatusGetRequest = { group: Group.RECORD, opt: Opt.GET_STATUS }
    return this.sendRequest<RecordingStatusResponse>('/record?option=getinfo&login_check_flag=1', req)
  }

  async getRecordingTaskList(): Promise<RecordingTaskListResponse> {
    const req: RecordingTaskListRequest = { group: Group.RECORD, opt: Opt.GET_TASK_LIST }
    return this.sendRequest<RecordingTaskListResponse>('/record?option=getinfo&login_check_flag=1', req)
  }

  async modifyRecordingTask(data: RecordingTaskModifyRequest['data']): Promise<ApiResponse> {
    const req: RecordingTaskModifyRequest = {
      group: Group.RECORD,
      opt: Opt.MODIFY_TASK,
      data,
    }
    return this.sendRequest<ApiResponse>('/record?option=setinfo&login_check_flag=1', req)
  }

  async startStopRecording(data: RecordingControlRequest['data']): Promise<ApiResponse> {
    const req: RecordingControlRequest = {
      group: Group.RECORD,
      opt: Opt.SET_TASK_ENABLE,
      data,
    }
    return this.sendRequest<ApiResponse>('/record?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     11) Tally
  -------------------------------------------------------------------------- */

  async getTallyParameters(): Promise<TallyResponse> {
    const req: TallyGetRequest = { group: Group.TALLY_LED, opt: Opt.GET_TALLY_LED_INFO }
    return this.sendRequest<TallyResponse>('/system?option=getinfo&login_check_flag=1', req)
  }

  async setTallyParameters(data: TallySetRequest['data']): Promise<ApiResponse> {
    const req: TallySetRequest = {
      group: Group.TALLY_LED,
      opt: Opt.SET_TALLY_LED_INFO,
      data,
    }
    return this.sendRequest<ApiResponse>('/system?option=setinfo&login_check_flag=1', req)
  }

  async toggleTally(data: TallySwitchRequest['data']): Promise<ApiResponse> {
    const req: TallySwitchRequest = {
      group: Group.TALLY_LED,
      opt: Opt.SET_TALLY_LED_SWITCH,
      data,
    }
    return this.sendRequest<ApiResponse>('/system?option=setinfo&login_check_flag=1', req)
  }

  async getTallyColor(): Promise<ApiResponse> {
    const req: TallyColorGetRequest = { group: Group.TALLY_LED, opt: Opt.GET_TALLY_LED_COLOR }
    return this.sendRequest<ApiResponse>('/system?option=getinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     12) Restore and Reboot
  -------------------------------------------------------------------------- */

  async rebootDevice(): Promise<ApiResponse> {
    const req: RebootRequest = {
      group: Group.SYSCONTROL,
      opt: Opt.SET_REBOOT_INFO,
      data: { command: 'reboot' },
    }
    return this.sendRequest<ApiResponse>('/system?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     13) Exposure
  -------------------------------------------------------------------------- */

  async getExposureInfo(): Promise<ExposureResponse> {
    const req: GetExposureRequest = { group: Group.CAMERA, opt: Opt.GET_EXPOSURE_INFO }
    return this.sendRequest<ExposureResponse>('/camera?option=getinfo&login_check_flag=1', req)
  }

  async setExposureInfo(data: SetExposureRequest['data']): Promise<ApiResponse> {
    const req: SetExposureRequest = { group: Group.CAMERA, opt: Opt.SET_EXPOSURE_INFO, data }
    return this.sendRequest<ApiResponse>('/camera?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     14) Aperture
  -------------------------------------------------------------------------- */

  async getAperture(): Promise<ApertureResponse> {
    const req: GetApertureRequest = { group: Group.PTZ, opt: Opt.GET_APERTURE }
    // Note: doc says /ptz?option=setinfo, but you might confirm if it's getinfo
    return this.sendRequest<ApertureResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  async setAperture(aperture: number): Promise<ApiResponse> {
    const req: SetApertureRequest = {
      group: Group.PTZ,
      opt: Opt.SET_APERTURE,
      data: { aperture },
    }
    return this.sendRequest<ApiResponse>('/ptz?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     15) White Balance
  -------------------------------------------------------------------------- */

  async getWhiteBalance(): Promise<WhiteBalanceResponse> {
    const req: GetWhiteBalanceRequest = { group: Group.CAMERA, opt: Opt.GET_WHITE_BALANCE_INFO }
    return this.sendRequest<WhiteBalanceResponse>('/camera?option=getinfo&login_check_flag=1', req)
  }

  async setWhiteBalance(data: SetWhiteBalanceRequest['data']): Promise<ApiResponse> {
    const req: SetWhiteBalanceRequest = {
      group: Group.CAMERA,
      opt: Opt.SET_WHITE_BALANCE_INFO,
      data,
    }
    return this.sendRequest<ApiResponse>('/camera?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     16) Image Info
  -------------------------------------------------------------------------- */

  async getImageInfo(): Promise<ImageSettingResponse> {
    const req: GetImageInfoRequest = { group: Group.CAMERA, opt: Opt.GET_IMAGE_INFO }
    return this.sendRequest<ImageSettingResponse>('/camera?option=getinfo&login_check_flag=1', req)
  }

  async setImageInfo(data: SetImageInfoRequest['data']): Promise<ApiResponse> {
    const req: SetImageInfoRequest = { group: Group.CAMERA, opt: Opt.SET_IMAGE_INFO, data }
    return this.sendRequest<ApiResponse>('/camera?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     17) Noise Reduction
  -------------------------------------------------------------------------- */

  async getNRInfo(): Promise<NoiseReductionResponse> {
    const req: GetNRInfoRequest = { group: Group.CAMERA, opt: Opt.GET_NR_INFO }
    return this.sendRequest<NoiseReductionResponse>('/camera?option=getinfo&login_check_flag=1', req)
  }

  async setNRInfo(data: SetNRInfoRequest['data']): Promise<ApiResponse> {
    const req: SetNRInfoRequest = { group: Group.CAMERA, opt: Opt.SET_NR_INFO, data }
    return this.sendRequest<ApiResponse>('/camera?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     18) Image Style
  -------------------------------------------------------------------------- */

  async getStyleInfo(): Promise<ImageStyleResponse> {
    const req: GetStyleInfoRequest = { group: Group.CAMERA, opt: Opt.GET_STYLE_INFO }
    return this.sendRequest<ImageStyleResponse>('/camera?option=getinfo&login_check_flag=1', req)
  }

  async setStyleInfo(selected_id: number, save_flag: 0 | 1): Promise<ApiResponse> {
    const req: SetStyleInfoRequest = {
      group: Group.CAMERA,
      opt: Opt.SET_STYLE_INFO,
      data: { selected_id, save_flag },
    }
    return this.sendRequest<ApiResponse>('/camera?option=setinfo&login_check_flag=1', req)
  }

  /* --------------------------------------------------------------------------
     19) AE Lock
  -------------------------------------------------------------------------- */

  async getAELockStatus(): Promise<AELockResponse> {
    const req: GetAELockRequest = { group: Group.CAMERA, opt: Opt.GET_AE_LOCK_STATUS }
    return this.sendRequest<AELockResponse>('/camera?option=getinfo&login_check_flag=1', req)
  }

  async setAELockStatus(ae_lock_status: 0 | 1): Promise<ApiResponse> {
    const req: SetAELockRequest = {
      group: Group.CAMERA,
      opt: Opt.SET_AE_LOCK_STATUS,
      data: { ae_lock_status },
    }
    return this.sendRequest<ApiResponse>('/camera?option=setinfo&login_check_flag=1', req)
  }
}
