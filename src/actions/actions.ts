import { Regex } from '@companion-module/base'
import type { ZowieBoxInstance } from '../index.js'
import { ConsoleLog } from '../modules/logger.js'
import {
  LogLevel,
  ZowieStatus,
  OutputResolution,
  RecordingCommand,
  StreamType,
  SwitchState,
  DeviceTimeMode,
  RecordingIndex,
  AudioInputType,
  AudioBitrate,
  AudioCodec,
  AudioOutputType,
  AudioSampleRate,
  AudioInputType_ID,
  AudioCodec_ID,
  AudioBitrate_ID,
  AudioSampleRate_ID,
  AudioOutputType_ID,
  BaudRates,
  PTZProtocol,
  RateControlMode,
  RotateAngle,
  VideoCodec,
  VideoProfile,
} from '../modules/enums.js'
import { outputResolutionChoices } from '../modules/constants.js'
import { PTZControlRequest, PTZProtocolItem } from '../modules/interfaces.js'
import { getZowieStatusLabel } from '../helpers/commonHelpers.js'

// Define our action IDs for clarity
export enum ActionId {
  setOutputInfo = 'setOutputInfo',
  setPTZConfig = 'setPTZConfig',
  controlPTZ = 'controlPTZ',
  setFocusMode = 'setFocusMode',
  setAFSensitivity = 'setAFSensitivity',
  setFocusArea = 'setFocusArea',
  setFocusSpeed = 'setFocusSpeed',
  setAFLockStatus = 'setAFLockStatus',
  setDigitalZoom = 'setDigitalZoom',
  setZoomSpeed = 'setZoomSpeed',
  triggerOnePushFocus = 'triggerOnePushFocus',
  addDecodingURL = 'addDecodingURL',
  enableNDIDecoding = 'enableNDIDecoding',
  disableNDIDecoding = 'disableNDIDecoding',
  setNDIGroup = 'setNDIGroup',
  ndiSwitch = 'ndiSwitch',
  setAudioConfig = 'setAudioConfig',
  setAudioSwitch = 'setAudioSwitch',
  streamControl = 'streamControl',
  setDeviceTime = 'setDeviceTime',
  recordControl = 'recordControl',
  setTally = 'setTally',
  toggleTally = 'toggleTally',
  rebootDevice = 'rebootDevice',
  modifyEncodingParameters = 'modifyEncodingParameters',
  setExposureInfo = 'setExposureInfo',
  setAperture = 'setAperture',
  setWhiteBalance = 'setWhiteBalance',
  setImageInfo = 'setImageInfo',
  setNoiseReduction = 'setNoiseReduction',
  setImageStyle = 'setImageStyle',
  setAELock = 'setAELock',
}

export function UpdateActions(instance: ZowieBoxInstance): void {
  instance.setActionDefinitions({
    [ActionId.setOutputInfo]: {
      name: 'Set Output Info',
      description: 'Change the output settings (resolution, audio, loop out).',
      options: [
        {
          id: 'format',
          type: 'dropdown',
          label: 'Output Resolution',
          choices: outputResolutionChoices,
          default: outputResolutionChoices[0]?.id,
        },
        {
          id: 'audio_switch',
          type: 'dropdown',
          label: 'Audio',
          choices: [
            { id: '0', label: 'Mute' },
            { id: '1', label: 'Unmute' },
          ],
          default: '0',
        },
        {
          id: 'loop_out_switch',
          type: 'dropdown',
          label: 'Loop Out',
          choices: [
            { id: '0', label: 'Output' },
            { id: '1', label: 'Loop Out' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const request = await instance.api.getOutputInfo()
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Got Output Info: ${JSON.stringify(request.data)}`, LogLevel.DEBUG)
          return {
            ...(ev.options as any),
            format: request.data.format,
            audio_switch: request.data.audio_switch.toString(),
            loop_out_switch: request.data.loop_out_switch.toString(),
          }
        } else {
          ConsoleLog(
            instance,
            `Failed to get Output Info. Code: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
          return undefined
        }
      },
      callback: async (ev, context) => {
        const format = ev.options.format as OutputResolution
        const audio_switch = ev.options.audio_switch as string
        const loop_out_switch = ev.options.loop_out_switch as string

        const request = await instance.api.setOutputInfo({
          format,
          audio_switch: Number(audio_switch),
          loop_out_switch: Number(loop_out_switch),
        })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Set Output Info to ${format}, ${audio_switch}, ${loop_out_switch}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set Output Info. Code: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setOutputInfo
        ConsoleLog(instance, `Creating action ${action.id} of type setOutputInfo`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.setPTZConfig]: {
      name: 'Set PTZ Config',
      description: 'Configure PTZ settings (protocol, IP, port, address, baud rate).',
      options: [
        {
          id: 'protocol',
          type: 'dropdown',
          label: 'PTZ Protocol',
          choices: [
            { id: PTZProtocol.AUTO, label: 'Auto' },
            { id: PTZProtocol.VISCA_OVER_IP, label: 'VISCA over IP' },
            { id: PTZProtocol.VISCA, label: 'VISCA' },
            { id: PTZProtocol.PELOCO_D, label: 'Peclo-D' },
            { id: PTZProtocol.PELOCO_P, label: 'Peclo-P' },
          ],
          default: '1',
        },
        {
          id: 'ip',
          type: 'textinput',
          label: 'Camera IP',
          default: '192.168.1.167',
          regex: Regex.IP,
        },
        {
          id: 'port',
          type: 'textinput',
          label: 'Port',
          regex: Regex.PORT,
        },
        {
          id: 'type',
          type: 'dropdown',
          label: 'Port Type',
          choices: [
            { id: '0', label: 'TCP' },
            { id: '1', label: 'UDP' },
          ],
          default: '0',
        },
        {
          id: 'addr',
          type: 'number',
          label: 'Address',
          default: 1,
          min: 0,
          max: 255,
        },
        {
          id: 'addr_fix',
          type: 'dropdown',
          label: 'Fixed Address',
          choices: [
            { id: '0', label: 'Fixed' },
            { id: '1', label: 'Not Fixed' },
          ],
          default: '0',
        },
        {
          id: 'baudrate_id',
          type: 'dropdown',
          label: 'Baud Rate',
          choices: [
            { id: BaudRates.BAUD_2400, label: '2400' },
            { id: BaudRates.BAUD_4800, label: '4800' },
            { id: BaudRates.BAUD_9600, label: '9600' },
            { id: BaudRates.BAUD_9600, label: '11920' },
            { id: BaudRates.BAUD_38400, label: '38400' },
          ],
          default: '1',
        },
      ],
      learn: async (ev, context) => {
        const request = await instance.api.getPTZConfig()
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Got PTZ Config: ${JSON.stringify(request.data)}`, LogLevel.DEBUG)
          const item = request.data.protocol_list?.[1] || ({} as PTZProtocolItem)

          return {
            ...(ev.options as any),
            protocol: request.data.protocol.toString(),
            ip: item.ip || '',
            port: item.port || 1259,
            type: item.type || 0,
            addr: item.addr || 1,
            addr_fix: (item.addr_fix !== undefined ? item.addr_fix : 0).toString(),
            baudrate_id: (item.baudrate_id !== undefined ? item.baudrate_id : 1).toString(),
          }
        } else {
          ConsoleLog(
            instance,
            `Failed to get PTZ Config: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
          return undefined
        }
      },
      callback: async (ev, context) => {
        const protocol = ev.options.protocol as PTZProtocol
        const ip = ev.options.ip as string
        const port = Number(ev.options.port)
        const type = Number(ev.options.type) as 0 | 1
        const addr = Number(ev.options.addr)
        const addr_fix = ev.options.addr_fix === '0' ? 0 : 1
        const baudrate_id = parseInt(ev.options.baudrate_id as BaudRates)

        const request = await instance.api.setPTZConfig({
          protocol: protocol,
          type: type,
          ip: ip,
          port: port,
          addr: addr,
          addr_fix: addr_fix,
          baudrate_id: baudrate_id,
        })

        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `PTZ config set successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set PTZ config: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setPTZConfig
        ConsoleLog(instance, `Creating action ${action.id} of type setPTZConfig`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.controlPTZ]: {
      name: 'Control PTZ',
      description: 'Send a PTZ command (pan, tilt, focus, preset, etc.).',
      options: [
        {
          id: 'command',
          type: 'dropdown',
          label: 'PTZ Command',
          choices: [
            { id: '1', label: 'Pan Left (One Step)' },
            { id: '2', label: 'Pan Left (Continuous)' },
            { id: '3', label: 'Pan Right (One Step)' },
            { id: '4', label: 'Pan Right (Continuous)' },
            { id: '7', label: 'Tilt Up (One Step)' },
            { id: '8', label: 'Tilt Up (Continuous)' },
            { id: '9', label: 'Tilt Down (One Step)' },
            { id: '10', label: 'Tilt Down (Continuous)' },
            { id: '19', label: 'Focus Near (One Step)' },
            { id: '20', label: 'Focus Near (Continuous)' },
            { id: '21', label: 'Focus Far (One Step)' },
            { id: '22', label: 'Focus Far (Continuous)' },
            { id: '25', label: 'Trigger One-Push Focus' },
            { id: '26', label: 'Set Preset' },
            { id: '28', label: 'Delete Preset' },
            { id: '29', label: 'Call Preset' },
            { id: '5', label: 'Set Horizontal Pos' },
            { id: '10', label: 'Set Vertical Pos' },
          ],
          default: '1',
        },
        {
          id: 'value',
          type: 'number',
          label: 'Value (e.g., horizontal=0-8000, vertical=0-2100)',
          min: 0,
          max: 8000,
          default: 0,
          isVisible: (options) => {
            return options.command === '5' || options.command === '10'
          },
        },
        {
          id: 'preset_id',
          type: 'number',
          label: 'Preset ID (0-254)',
          min: 0,
          max: 254,
          default: 0,
          isVisible: (options) => {
            return options.command === '26' || options.command === '28' || options.command === '29'
          },
        },
        {
          id: 'preset_desc',
          type: 'textinput',
          label: 'Preset Name',
          default: '',
          useVariables: true,
          isVisible: (options) => {
            return options.command === '26' || options.command === '28' || options.command === '29'
          },
        },
      ],
      callback: async (ev, context) => {
        const opid = parseInt(ev.options.command as string, 10)
        let data: PTZControlRequest['data'] | undefined = undefined

        if (opid === 5 || opid === 10) {
          data = { value: Number(ev.options.value) }
        }

        if (opid === 26 || opid === 28 || opid === 29) {
          data = {
            id: Number(ev.options.preset_id),
            desc: await context.parseVariablesInString(ev.options.preset_desc as string),
          }
        }

        const request = await instance.api.controlPTZ(opid, data)
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `PTZ command ${opid} sent successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to send PTZ command: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.controlPTZ
        ConsoleLog(instance, `Creating action ${action.id} of type controlPTZ`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.setFocusMode]: {
      name: 'PTZ: Set Focus Mode',
      description: 'Sets the PTZ focus mode',
      options: [
        {
          id: 'focusmode',
          type: 'dropdown',
          label: 'Focus Mode',
          choices: [
            { id: '0', label: 'AUTO' },
            { id: '1', label: 'MANUAL' },
            { id: '2', label: 'ONE_PUSH' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const response = await instance.api.getFocusMode()
        if (response.status === ZowieStatus.Successful || response.status === ZowieStatus.ModificationSuccessful) {
          return {
            ...ev.options,
            focusmode: response.data.selected_id.toString(),
          }
        } else {
          ConsoleLog(instance, `Failed to learn Focus Mode: ${getZowieStatusLabel(response.status)}`, LogLevel.ERROR)
          return undefined
        }
      },
      callback: async (ev, context) => {
        const focusmode = parseInt(ev.options.focusmode as string, 10)
        const resp = await instance.api.setFocusMode(focusmode)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Focus Mode set to ${focusmode}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set Focus Mode: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setFocusMode
        ConsoleLog(instance, `Creating action ${action.id} of type setFocusMode`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setAFSensitivity]: {
      name: 'PTZ: Set AF Sensitivity',
      description: 'Sets the PTZ AF Sensitivity',
      options: [
        {
          id: 'selected_id',
          type: 'dropdown',
          label: 'AF Sensitivity',
          choices: [
            { id: '0', label: 'High' },
            { id: '1', label: 'Medium' },
            { id: '2', label: 'Low' },
            { id: '3', label: 'Ultra Low' },
          ],
          default: '1',
        },
      ],
      learn: async (ev, context) => {
        const response = await instance.api.getAFSensitivity()
        if (response.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            selected_id: response.data.selected_id.toString(),
          }
        } else {
          ConsoleLog(
            instance,
            `Failed to learn AF Sensitivity: ${getZowieStatusLabel(response.status)}`,
            LogLevel.ERROR
          )
          return undefined
        }
      },
      callback: async (ev, context) => {
        const s = parseInt(ev.options.selected_id as string, 10)
        const resp = await instance.api.setAFSensitivity(s)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `AF Sensitivity set to ${s}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set AF Sensitivity: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setAFSensitivity
        ConsoleLog(instance, `Creating action ${action.id} of type setAFSensitivity`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setFocusArea]: {
      name: 'PTZ: Set Focus Area',
      description: 'Adjust focus zone and optional point coords',
      options: [
        {
          id: 'selected_id',
          type: 'dropdown',
          label: 'Focus Zone',
          choices: [
            { id: '0', label: 'top' },
            { id: '1', label: 'center' },
            { id: '2', label: 'bottom' },
            { id: '3', label: 'left' },
            { id: '4', label: 'right' },
            { id: '5', label: 'all' },
            { id: '6', label: 'point' },
          ],
          default: '1',
        },
        {
          id: 'x_percent',
          type: 'number',
          label: 'X percent (0-1000?)',
          default: 500,
          min: 0,
          max: 1000,
        },
        {
          id: 'y_percent',
          type: 'number',
          label: 'Y percent',
          default: 500,
          min: 0,
          max: 99999,
        },
        {
          id: 'd_pixel',
          type: 'number',
          label: 'd_pixel',
          default: 20,
          min: 0,
          max: 99999,
        },
      ],
      learn: async (ev, context) => {
        const response = await instance.api.getFocusZone()
        if (response.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            selected_id: response.data.selected_id.toString(),
            x_percent: response.data.point?.x_percent ?? 500,
            y_percent: response.data.point?.y_percent ?? 500,
            d_pixel: response.data.point?.d_pixel ?? 20,
          }
        } else {
          ConsoleLog(
            instance,
            `Failed to learn Focus Zone: ${getZowieStatusLabel(response.status)}`,
            LogLevel.ERROR
          )
          return undefined
        }
      },
      callback: async (ev, context) => {
        const sid = parseInt(ev.options.selected_id as string, 10)
        let point
        if (sid === 6) {
          point = {
            x_percent: Number(ev.options.x_percent),
            y_percent: Number(ev.options.y_percent),
            d_pixel: Number(ev.options.d_pixel),
          }
        }
        const resp = await instance.api.setFocusArea(sid, point)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Focus area set to ${sid}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set focus area: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setFocusArea
        ConsoleLog(instance, `Creating action ${action.id} of type setFocusArea`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setFocusSpeed]: {
      name: 'PTZ: Set Focus Speed',
      description: 'Set the PTZ focus speed',
      options: [
        {
          id: 'focus',
          type: 'number',
          label: 'Focus Speed (1-10)',
          default: 5,
          min: 1,
          max: 10,
        },
        {
          id: 'save_flag',
          type: 'dropdown',
          label: 'Save?',
          choices: [
            { id: '0', label: 'No' },
            { id: '1', label: 'Yes' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const response = await instance.api.getFocusSpeed()
        if (response.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            focus: response.data.focus,
          }
        }
        return undefined
      },
      callback: async (ev, context) => {
        const focus = Number(ev.options.focus)
        const saveFlag = parseInt(ev.options.save_flag as string, 10) as 0 | 1
        const resp = await instance.api.setFocusSpeed(focus, saveFlag)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Focus speed set to ${focus}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set focus speed: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setFocusSpeed
        ConsoleLog(instance, `Creating action ${action.id} of type setFocusSpeed`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setAFLockStatus]: {
      name: 'PTZ: Set AF Lock',
      description: 'Lock or unlock the PTZ autofocus',
      options: [
        {
          id: 'af_lock_status',
          type: 'dropdown',
          label: 'AF Lock',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const response = await instance.api.getAFLockStatus()
        if (response.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            af_lock_status: response.data.af_lock_status.toString(),
          }
        } else {
          ConsoleLog(instance, `Failed to learn AF Lock: ${getZowieStatusLabel(response.status)}`, LogLevel.ERROR)
          return undefined
        }
      },
      callback: async (ev, context) => {
        const lockVal = parseInt(ev.options.af_lock_status as string, 10) as 0 | 1
        const resp = await instance.api.setAFLockStatus(lockVal)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `AF Lock set to ${lockVal}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set AF Lock: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setAFLockStatus
        ConsoleLog(instance, `Creating action ${action.id} of type setAFLockStatus`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setDigitalZoom]: {
      name: 'PTZ: Set Digital Zoom',
      description: 'Adjust the digital zoom factor',
      options: [
        {
          id: 'digital_zoom',
          type: 'number',
          label: 'Zoom factor (100-1200)',
          default: 100,
          min: 100,
          max: 1200,
        },
        {
          id: 'digital_zoom_enable',
          type: 'dropdown',
          label: 'Zoom On/Off',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '0',
        },
        {
          id: 'digital_zoom_max',
          type: 'number',
          label: 'Max Zoom factor',
          default: 400,
          min: 100,
          max: 1200,
        },
      ],
      learn: async (ev, context) => {
        const response = await instance.api.getDigitalZoom()
        if (response.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            digital_zoom: response.digital_zoom,
            digital_zoom_enable: response.digital_zoom_enable.toString(),
            digital_zoom_max: response.digital_zoom_max ?? 400,
          }
        }
        return undefined
      },
      callback: async (ev, context) => {
        const zoom = Number(ev.options.digital_zoom)
        const enable = parseInt(ev.options.digital_zoom_enable as string, 10) as 0 | 1
        const max = Number(ev.options.digital_zoom_max)

        const resp = await instance.api.setDigitalZoom(zoom, enable, max)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Digital zoom set to ${zoom}, enable=${enable}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set digital zoom: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setDigitalZoom
        ConsoleLog(instance, `Creating action ${action.id} of type setDigitalZoom`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setZoomSpeed]: {
      name: 'PTZ: Set Zoom Speed',
      description: 'Set the PTZ zoom speed',
      options: [
        {
          id: 'zoom',
          type: 'number',
          label: 'Zoom Speed (1-10)',
          default: 5,
          min: 1,
          max: 10,
        },
        {
          id: 'save_flag',
          type: 'dropdown',
          label: 'Save?',
          choices: [
            { id: '0', label: 'No' },
            { id: '1', label: 'Yes' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const response = await instance.api.getZoomSpeed()
        if (response.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            zoom: response.data.zoom,
          }
        }
        return undefined
      },
      callback: async (ev, context) => {
        const zoom = Number(ev.options.zoom)
        const saveFlag = parseInt(ev.options.save_flag as string, 10) as 0 | 1
        const resp = await instance.api.setZoomSpeed(zoom, saveFlag)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Zoom speed set to ${zoom}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set zoom speed: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setZoomSpeed
        ConsoleLog(instance, `Creating action ${action.id} of type setZoomSpeed`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.triggerOnePushFocus]: {
      name: 'PTZ: Trigger One-Push Focus',
      description: 'Trigger the PTZ one-push focus.',
      options: [
        {
          id: 'x_percent',
          type: 'number',
          label: 'X Percent',
          default: 500,
          min: 0,
          max: 1000,
        },
        {
          id: 'y_percent',
          type: 'number',
          label: 'Y Percent',
          default: 500,
          min: 0,
          max: 1000,
        },
        {
          id: 'd_pixel',
          type: 'number',
          label: 'd_pixel',
          default: 20,
          min: 0,
          max: 1000,
        },
      ],
      callback: async (ev, context) => {
        const x = Number(ev.options.x_percent)
        const y = Number(ev.options.y_percent)
        const d = Number(ev.options.d_pixel)

        const resp = await instance.api.controlPTZ(25, {
          point: { x_percent: x, y_percent: y, d_pixel: d },
        })

        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `One-push focus triggered`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to trigger one-push focus: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.triggerOnePushFocus
        ConsoleLog(instance, `Creating action ${action.id} of type triggerOnePushFocus`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.addDecodingURL]: {
      name: 'Add Decoding URL',
      description: 'Add a new decoding URL.',
      options: [
        {
          id: 'name',
          type: 'textinput',
          label: 'Name',
          default: 'MyStream',
        },
        {
          id: 'url',
          type: 'textinput',
          label: 'URL',
          default: 'rtsp://192.168.1.200/live',
        },
        {
          id: 'streamtype',
          type: 'dropdown',
          label: 'Stream Type',
          choices: [
            { id: '0', label: 'Local' },
            { id: '1', label: 'Live' },
          ],
          default: '0',
        },
        {
          id: 'switch',
          type: 'dropdown',
          label: 'Enable',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '1',
        },
      ],
      callback: async (ev, context) => {
        const request = await instance.api.addDecodingURL({
          switch: Number(ev.options.switch) as SwitchState,
          name: ev.options.name as string,
          url: ev.options.url as string,
          streamtype: ev.options.streamtype as StreamType,
        })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Decoding URL added successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to add decoding URL: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.addDecodingURL
        ConsoleLog(instance, `Creating action ${action.id} of type addDecodingURL`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.streamControl]: {
      name: 'Toggle Stream',
      description: 'Start/stop streaming based on the index of the stream.',
      options: [
        {
          id: 'index',
          type: 'textinput',
          label: 'Stream index',
          default: '0',
        },
        {
          id: 'switch',
          type: 'dropdown',
          label: 'Enable Stream',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '1',
        },
      ],
      callback: async (ev, context) => {
        const request = await instance.api.toggleStreaming({
          index: Number(ev.options.index),
          switch: Number(ev.options.switch),
        })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Stream published successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to publish stream: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.streamControl
        ConsoleLog(instance, `Creating action ${action.id} of type publishStream`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.setDeviceTime]: {
      name: 'Set Device Time',
      description: 'Change the device time and related settings.',
      options: [
        {
          id: 'device_time',
          type: 'textinput',
          label: 'New Time (ISO format)',
          default: '2025-03-01T12:00:00Z',
        },
        {
          id: 'setting_mode_id',
          type: 'dropdown',
          label: 'Time Setting Mode',
          choices: [
            { id: '0', label: 'Synchronize with computer time' },
            { id: '1', label: 'Set manually' },
            { id: '2', label: 'Synchronize with NTP server' },
          ],
          default: '1',
        },
        {
          id: 'time_zone_id',
          type: 'textinput',
          label: 'Time Zone',
          default: 'GMT',
        },
        {
          id: 'ntp_enable',
          type: 'dropdown',
          label: 'NTP Enable',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '0',
        },
        {
          id: 'ntp_server',
          type: 'textinput',
          label: 'NTP Server',
          default: '',
        },
        {
          id: 'ntp_port',
          type: 'textinput',
          label: 'NTP Port',
          regex: Regex.PORT,
        },
      ],
      learn: async (ev, context) => {
        const request = await instance.api.getDeviceTime()
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          const dt = request.data.time
          const iso = new Date(
            Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second)
          ).toISOString()

          ConsoleLog(instance, `Learn Device Time: ${iso}`, LogLevel.DEBUG)

          return {
            ...(ev.options as any),
            device_time: iso,
            setting_mode_id: request.data.setting_mode_id.toString(),
            time_zone_id: request.data.time_zone_id,
            ntp_enable: request.data.ntp_enable,
            ntp_server: request.data.ntp_server,
            ntp_port: request.data.ntp_port.toString(),
          }
        } else {
          ConsoleLog(
            instance,
            `Failed to get Device Time: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
          return undefined
        }
      },
      callback: async (ev, context) => {
        const dt = new Date(ev.options.device_time as string)
        const data = {
          time: {
            year: dt.getUTCFullYear(),
            month: dt.getUTCMonth() + 1,
            day: dt.getUTCDate(),
            hour: dt.getUTCHours(),
            minute: dt.getUTCMinutes(),
            second: dt.getUTCSeconds(),
          },
          setting_mode_id: Number(ev.options.setting_mode_id) as DeviceTimeMode,
          time_zone_id: ev.options.time_zone_id as string,
          time_type_id: 0,
          ntp_enable: Number(ev.options.ntp_enable),
          ntp_server: ev.options.ntp_server as string,
          ntp_port: Number(ev.options.ntp_port),
        }

        const request = await instance.api.setDeviceTime(data)
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Device time set successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set device time: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setDeviceTime
        ConsoleLog(instance, `Creating action ${action.id} of type setDeviceTime`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.recordControl]: {
      name: 'Recording Control',
      description: 'Start or stop a recording task.',
      options: [
        {
          id: 'index',
          type: 'dropdown',
          label: 'Device',
          choices: [
            { id: RecordingIndex.usb1_0, label: 'USB' },
            { id: RecordingIndex.sdcard_0, label: 'SD Card' },
            { id: RecordingIndex.nas1_0, label: 'NAS' },
          ],
          default: RecordingIndex.usb1_0,
        },
        {
          id: 'command',
          type: 'dropdown',
          label: 'Command',
          choices: [
            { id: RecordingCommand.RECORD_ON, label: 'Start' },
            { id: RecordingCommand.RECORD_OFF, label: 'Stop' },
            { id: RecordingCommand.RECORD_PAUSE, label: 'Pause' },
            { id: RecordingCommand.RECORD_CONTINUE, label: 'Resume' },
          ],
          default: RecordingCommand.RECORD_ON,
        },
      ],
      callback: async (ev, context) => {
        const request = await instance.api.startStopRecording({
          index: ev.options.index as RecordingIndex,
          enable: ev.options.command as RecordingCommand,
        })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Recording command sent successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to control recording: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.recordControl
        ConsoleLog(instance, `Creating action ${action.id} of type recordControl`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.setTally]: {
      name: 'Set Tally',
      description: 'Set tally parameters (color and mode).',
      options: [
        {
          id: 'color_id',
          type: 'dropdown',
          label: 'Tally Color',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'Red' },
            { id: '2', label: 'Green' },
            { id: '3', label: 'Blue' },
          ],
          default: '1',
        },
        {
          id: 'mode_id',
          type: 'dropdown',
          label: 'Mode',
          choices: [
            { id: '0', label: 'Auto' },
            { id: '1', label: 'Manual' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const request = await instance.api.getTallyParameters()
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Learn Tally: ${JSON.stringify(request.data)}`, LogLevel.DEBUG)
          return {
            ...(ev.options as any),
            color_id: request.data.color_id.toString(),
            mode_id: request.data.mode_id.toString(),
          }
        } else {
          ConsoleLog(instance, `Failed to learn Tally: ${getZowieStatusLabel(request.status)}`, LogLevel.ERROR)
          return undefined
        }
      },
      callback: async (ev, context) => {
        const request = await instance.api.setTallyParameters({
          color_id: Number(ev.options.color_id),
          mode_id: Number(ev.options.mode_id),
        })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Tally set successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set tally: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setTally
        ConsoleLog(instance, `Creating action ${action.id} of type setTally`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.toggleTally]: {
      name: 'Toggle Tally',
      description: 'Toggle tally on/off.',
      options: [
        {
          id: 'switch',
          type: 'dropdown',
          label: 'Tally',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
            { id: '2', label: 'Toggle' },
          ],
          default: '0',
        },
      ],
      callback: async (ev, context) => {
        const _tally = Number(ev.options.switch)
        let tally

        if (_tally === 2) {
          const request = await instance.api.getTallyParameters()
          if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
            tally = !request.data.switch
          }
        } else {
          tally = _tally
        }

        const request = await instance.api.toggleTally({ switch: tally })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Tally toggled successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to toggle tally: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.toggleTally
        ConsoleLog(instance, `Creating action ${action.id} of type toggleTally`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.rebootDevice]: {
      name: 'Reboot Device',
      description: 'Reboot the device.',
      options: [],
      callback: async (ev, context) => {
        const request = await instance.api.rebootDevice()
        if (request.status === ZowieStatus.Restarting) {
          ConsoleLog(instance, `Device rebooted successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to reboot device: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.rebootDevice
        ConsoleLog(instance, `Creating action ${action.id} of type rebootDevice`)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`)
      },
    },

    [ActionId.enableNDIDecoding]: {
      name: 'Enable NDI Decoding',
      description: 'Enable NDI decoding for a given NDI source.',
      options: [
        {
          id: 'ndi_name',
          type: 'textinput',
          label: 'NDI Source Name',
          default: '',
        },
      ],
      callback: async (ev, context) => {
        const ndiName = ev.options.ndi_name as string
        const request = await instance.api.enableNDIDecoding({ ndi_name: ndiName })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `NDI decoding enabled for "${ndiName}"`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to enable NDI decoding: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.enableNDIDecoding
        ConsoleLog(instance, `Creating action ${action.id} of type enableNDIDecoding`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.disableNDIDecoding]: {
      name: 'Disable NDI Decoding',
      description: 'Disable NDI decoding streaming.',
      options: [],
      callback: async (ev, context) => {
        const request = await instance.api.disableNDIDecoding()
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `NDI decoding disabled`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to disable NDI decoding: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.disableNDIDecoding
        ConsoleLog(instance, `Creating action ${action.id} of type disableNDIDecoding`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setNDIGroup]: {
      name: 'Set NDI Group',
      description: 'Set the NDI group in decoder mode.',
      options: [
        {
          id: 'groups',
          type: 'textinput',
          label: 'NDI Group',
          default: 'Public',
        },
      ],
      callback: async (ev, context) => {
        const groups = ev.options.groups as string
        const request = await instance.api.setNDIGroup({ groups })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `NDI group set to "${groups}"`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set NDI group: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setNDIGroup
        ConsoleLog(instance, `Creating action ${action.id} of type setNDIGroup`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.ndiSwitch]: {
      name: 'NDI Switch',
      description: 'Toggle the NDI encoding function on or off.',
      options: [
        {
          id: 'switch_value',
          type: 'dropdown',
          label: 'NDI Switch',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '0',
        },
      ],
      callback: async (ev, context) => {
        const switch_value = Number(ev.options.switch_value)
        const request = await instance.api.ndiSwitch({ switch_value })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `NDI switched to ${switch_value}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to switch NDI: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.ndiSwitch
        ConsoleLog(instance, `Creating action ${action.id} of type ndiSwitch`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setAudioConfig]: {
      name: 'Set Audio Config',
      description: 'Set all audio settings including input type, audio switch, codec, bitrate, sample rate, channel and volume.',
      options: [
        {
          id: 'ai_type',
          type: 'dropdown',
          label: 'Audio Input Type',
          choices: [
            { id: AudioInputType_ID.LINE_IN, label: 'Line In' },
            { id: AudioInputType_ID.INTERNAL_MIC, label: 'Internal MIC' },
            { id: AudioInputType_ID.HDMI_IN, label: 'HDMI IN' },
          ],
          default: '0',
        },
        {
          id: 'switch',
          type: 'dropdown',
          label: 'Audio Switch',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '1',
        },
        {
          id: 'codec',
          type: 'dropdown',
          label: 'Audio Codec',
          choices: [
            { id: AudioCodec_ID.AAC, label: 'AAC' },
            { id: AudioCodec_ID.MP3, label: 'MP3' },
            { id: AudioCodec_ID.G711A, label: 'G.711A' },
          ],
          default: '0',
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
            { id: AudioBitrate_ID.BR_128000, label: '128000' },
          ],
          default: '0',
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
            { id: AudioSampleRate_ID.SR_48000, label: '48000' },
          ],
          default: '3',
        },
        {
          id: 'channel',
          type: 'dropdown',
          label: 'Channel',
          choices: [
            { id: '1', label: 'Mono' },
            { id: '2', label: 'Stereo' },
          ],
          default: '2',
        },
        {
          id: 'volume',
          type: 'number',
          label: 'Volume (0-100)',
          min: 0,
          max: 100,
          default: 100,
          step: 1,
          required: true,
        },
        {
          id: 'ao_devtype',
          type: 'dropdown',
          label: 'Audio Output Type',
          choices: [
            { id: AudioOutputType_ID.LINEOUT, label: 'Line Out' },
            { id: AudioOutputType_ID.HDMI, label: 'HDMI' },
          ],
          default: '1',
        },
      ],
      learn: async (ev, context) => {
        const request = await instance.api.getAudioConfig()
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Learn Audio Config: ${JSON.stringify(request.all)}`, LogLevel.DEBUG)
          return {
            ...ev.options,
            ai_type: request.all.ai_type.selected_id.toString(),
            switch: request.all.switch.toString(),
            codec: request.all.codec.selected_id.toString(),
            bitrate: request.all.bitrate.selected_id.toString(),
            sample_rate: request.all.sample_rate.selected_id.toString(),
            channel: request.all.channel.toString(),
            volume: request.all.volume,
            ao_devtype: request.all.ai_devid.toString(),
          }
        } else {
          ConsoleLog(
            instance,
            `Failed to learn Audio Config: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
          return undefined
        }
      },
      callback: async (ev, context) => {
        const audioOptions = {
          stream_id: 0,
          ai_devid: 0,
          ai_chnid: [0, 1],
          adec_chnid: 0,
          aenc_chnid: 0,
          ai_type: {
            selected_id: Number(ev.options.ai_type) as unknown as AudioInputType_ID,
            ai_type_list: [
              'LINE IN',
              'Internal MIC',
              'HDMI IN',
            ] as [
              AudioInputType.LINE_IN,
              AudioInputType.INTERNAL_MIC,
              AudioInputType.HDMI_IN
            ],
          },
          ao_devid: 0,
          ao_chnid: 0,
          ao_devtype: {
            selected_id: Number(ev.options.ao_devtype) as unknown as AudioOutputType_ID,
            ao_devtype_list: ['LINEOUT', 'HDMI'] as [
              AudioOutputType.LINEOUT,
              AudioOutputType.HDMI
            ],
          },
          switch: Number(ev.options.switch) as 0 | 1,
          codec: {
            selected_id: Number(ev.options.codec) as unknown as AudioCodec_ID,
            codec_list: ['AAC', 'MP3', 'G.711A'] as [
              AudioCodec.AAC,
              AudioCodec.MP3,
              AudioCodec.G711A
            ],
          },
          bitrate: {
            selected_id: Number(ev.options.bitrate) as unknown as AudioBitrate_ID,
            bitrate_list: [32000, 48000, 64000, 96000, 128000] as [
              AudioBitrate.BR_32000,
              AudioBitrate.BR_48000,
              AudioBitrate.BR_64000,
              AudioBitrate.BR_96000,
              AudioBitrate.BR_128000
            ],
          },
          sample_rate: {
            selected_id: Number(ev.options.sample_rate) as unknown as AudioSampleRate_ID,
            sample_rate_list: [8000, 16000, 32000, 44100, 48000] as [
              AudioSampleRate.SR_8000,
              AudioSampleRate.SR_16000,
              AudioSampleRate.SR_32000,
              AudioSampleRate.SR_44100,
              AudioSampleRate.SR_48000
            ],
          },
          bit_width: 16 as 16,
          channel: Number(ev.options.channel) as 1 | 2,
          volume: Number(ev.options.volume),
        }

        const request = await instance.api.setAudioConfig(audioOptions)
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Audio config set successfully`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set audio config: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setAudioConfig
        ConsoleLog(instance, `Creating action ${action.id} of type setAudioConfig`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setAudioSwitch]: {
      name: 'Set Audio Switch',
      description: 'Turn audio on or off.',
      options: [
        {
          id: 'switch',
          type: 'dropdown',
          label: 'Audio Switch',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '0',
        },
      ],
      callback: async (ev, context) => {
        const switchValue = Number(ev.options.switch)
        const request = await instance.api.setAudioSwitch({ switch: switchValue })
        if (request.status === ZowieStatus.Successful || request.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Audio switch set to ${switchValue}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set audio switch: ${getZowieStatusLabel(request.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setAudioSwitch
        ConsoleLog(instance, `Creating action ${action.id} of type setAudioSwitch`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.modifyEncodingParameters]: {
      name: 'Modify Encoding Parameters',
      description: 'Set various encoding parameters (codec, resolution, bitrate, etc.)',
      options: [
        {
          id: 'venc_chnid',
          type: 'dropdown',
          label: 'Channel ID',
          choices: [
            { id: '0', label: 'Main (venc_chnid=0)' },
            { id: '1', label: 'Sub (venc_chnid=1)' },
            { id: '2', label: 'Snapshot (venc_chnid=2)' },
          ],
          default: '0',
        },
        {
          id: 'codec',
          type: 'dropdown',
          label: 'Codec',
          choices: [
            { id: '0', label: 'H.264' },
            { id: '1', label: 'H.265' },
            { id: '2', label: 'MJPEG' },
          ],
          default: '0',
        },
        {
          id: 'profile',
          type: 'dropdown',
          label: 'Profile',
          choices: [
            { id: '0', label: 'BP' },
            { id: '1', label: 'MP' },
            { id: '2', label: 'HP' },
          ],
          default: '0',
        },
        {
          id: 'ratecontrol',
          type: 'dropdown',
          label: 'Rate Control',
          choices: [
            { id: '0', label: 'CBR' },
            { id: '1', label: 'VBR' },
          ],
          default: '0',
        },
        {
          id: 'bitrate',
          type: 'number',
          label: 'Bitrate (64-51200 Main; 64-25600 Sub)',
          min: 64,
          max: 51200,
          default: 5000,
        },
        {
          id: 'ndi_bitrate_pre',
          type: 'number',
          label: 'NDI Bitrate % (50-125)',
          min: 50,
          max: 125,
          default: 50,
        },
        {
          id: 'width',
          type: 'number',
          label: 'Width (e.g. 3840,1920,1280,720)',
          default: 1920,
          min: 1,
          max: 3840,
        },
        {
          id: 'height',
          type: 'number',
          label: 'Height (e.g. 2160,1080,720,360)',
          default: 1080,
          min: 1,
          max: 2160,
        },
        {
          id: 'framerate',
          type: 'dropdown',
          label: 'Framerate (e.g. 60,50,30,25,15)',
          choices: [
            { id: '60', label: '60' },
            { id: '50', label: '50' },
            { id: '30', label: '30' },
            { id: '25', label: '25' },
            { id: '15', label: '15' },
          ],
          default: '30',
        },
        {
          id: 'keyinterval',
          type: 'number',
          label: 'Key Interval (I-frame distance)',
          min: 20,
          max: 240,
          default: 60,
        },
        {
          id: 'gop',
          type: 'number',
          label: 'GOP size',
          default: 60,
          min: 1,
          max: 240,
        },
        {
          id: 'MaxQP',
          type: 'number',
          label: 'Max QP (0-69 typical)',
          default: 45,
          min: 0,
          max: 69,
        },
        {
          id: 'MinQP',
          type: 'number',
          label: 'Min QP (0-69 typical)',
          default: 20,
          min: 0,
          max: 69,
        },
        {
          id: 'keyMinQP',
          type: 'number',
          label: 'Key Min QP',
          default: 10,
          min: 0,
          max: 69,
        },
        {
          id: 'QPlevel',
          type: 'number',
          label: 'QP Level',
          default: 1,
          min: 1,
          max: 10,
        },
        {
          id: 'rotate',
          type: 'dropdown',
          label: 'Rotate Angle',
          choices: [
            { id: '0', label: '0' },
            { id: '1', label: '90' },
            { id: '2', label: '180' },
            { id: '3', label: '270' },
          ],
          default: '0',
        },
        {
          id: 'stream_id',
          type: 'dropdown',
          label: 'Stream ID',
          choices: [
            { id: '0', label: 'Main Stream' },
            { id: '1', label: 'Sub Stream' },
            { id: '2', label: 'Snapshot' },
          ],
          default: '0',
        },
        {
          id: 'desc',
          type: 'textinput',
          label: 'Description',
          default: 'my-stream',
        },
      ],
      learn: async (ev, context) => {
        const response = await instance.api.getEncodingParameters()
        if (response.status === ZowieStatus.Successful || response.status === ZowieStatus.ModificationSuccessful) {
          const chosenChn = parseInt(ev.options.venc_chnid as string, 10)
          const found = response.data?.venc?.find((x: any) => x.venc_chnid === chosenChn)

          if (!found) {
            ConsoleLog(
              instance,
              `No matching channel in getEncodingParameters() for venc_chnid=${chosenChn}. Using defaults.`,
              LogLevel.WARN
            )
            return ev.options
          }

          return {
            ...ev.options,
            codec: found.codec.selected_id.toString(),
            profile: found.profile.selected_id.toString(),
            ratecontrol: found.ratecontrol.selected_id.toString(),
            bitrate: found.bitrate,
            ndi_bitrate_pre: found.ndi_bitrate_pre,
            width: found.width,
            height: found.height,
            framerate: found.framerate,
            keyinterval: found.keyinterval,
            gop: found.gop,
            MaxQP: found.MaxQP,
            MinQP: found.MinQP,
            keyMinQP: found.keyMinQP,
            QPlevel: found.QPlevel,
            rotate: found.rotate.selected_id.toString(),
            stream_id: found.stream_id.toString(),
            desc: found.desc || '',
          }
        } else {
          ConsoleLog(instance, `Failed to learn: ${getZowieStatusLabel(response.status)}`, LogLevel.ERROR)
          return undefined
        }
      },
      callback: async (ev, context) => {
        const userParams = {
          venc_chnid: parseInt(ev.options.venc_chnid as string, 10),
          codec: {
            selected_id: parseInt(ev.options.codec as string, 10),
            codec_list: ['H.264', 'H.265', 'MJPEG'] as [VideoCodec.H264, VideoCodec.H265, VideoCodec.MJPEG],
          },
          profile: {
            selected_id: parseInt(ev.options.profile as string, 10),
            profile_list: ['BP', 'MP', 'HP'] as [VideoProfile.BP, VideoProfile.MP, VideoProfile.HP],
          },
          ratecontrol: {
            selected_id: parseInt(ev.options.ratecontrol as string, 10),
            mode_list: ['CBR', 'VBR'] as [RateControlMode.CBR, RateControlMode.VBR],
          },
          bitrate: Number(ev.options.bitrate),
          ndi_bitrate_pre: Number(ev.options.ndi_bitrate_pre),
          width: Number(ev.options.width),
          height: Number(ev.options.height),
          framerate: Number(ev.options.framerate),
          keyinterval: Number(ev.options.keyinterval),
          gop: Number(ev.options.gop),
          MaxQP: Number(ev.options.MaxQP),
          MinQP: Number(ev.options.MinQP),
          keyMinQP: Number(ev.options.keyMinQP),
          QPlevel: Number(ev.options.QPlevel),
          rotate: {
            selected_id: ev.options.rotate as RotateAngle,
            rotate_list: ['0', '90', '180', '270'] as [
              RotateAngle._0,
              RotateAngle._90,
              RotateAngle._180,
              RotateAngle._270
            ],
          },
          stream_id: parseInt(ev.options.stream_id as string, 10),
          desc: ev.options.desc as string,
        }

        const response = await instance.api.modifyEncodingParameters([userParams])
        if (response.status === ZowieStatus.Successful || response.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(
            instance,
            `Successfully modified encoding parameters for channel: ${ev.options.venc_chnid}`,
            LogLevel.DEBUG
          )
        } else {
          ConsoleLog(
            instance,
            `Failed to modify encoding parameters. Code: ${getZowieStatusLabel(response.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.modifyEncodingParameters
        ConsoleLog(instance, `Creating action ${action.id} of type modifyEncodingParameters`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setExposureInfo]: {
      name: 'Image: Exposure Control',
      description: 'Configure camera’s exposure parameters (mode, shutter, gain, etc.)',
      options: [
        {
          id: 'mode',
          type: 'dropdown',
          label: 'Exposure Mode',
          choices: [
            { id: '0', label: 'Auto' },
            { id: '1', label: 'Manual' },
            { id: '2', label: 'Shutter First' },
            { id: '3', label: 'Aperture First' },
            { id: '4', label: 'Bright First' },
          ],
          default: '0',
        },
        {
          id: 'gain',
          type: 'number',
          label: 'Gain (0–16)',
          default: 0,
          min: 0,
          max: 16,
        },
        {
          id: 'shutter',
          type: 'number',
          label: 'Shutter ID (0–21)',
          default: 0,
          min: 0,
          max: 21,
        },
        {
          id: 'wdr',
          type: 'number',
          label: 'WDR (0–8)',
          default: 0,
          min: 0,
          max: 8,
        },
        {
          id: 'flicker',
          type: 'dropdown',
          label: 'Flicker',
          choices: [
            { id: '0', label: 'Disable' },
            { id: '1', label: '50 Hz' },
            { id: '2', label: '60 Hz' },
            { id: '3', label: 'Auto' },
          ],
          default: '0',
        },
        {
          id: 'bias_enable',
          type: 'dropdown',
          label: 'Enable Exposure Compensation?',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '0',
        },
        {
          id: 'bias',
          type: 'number',
          label: 'Exposure Compensation (-3..3)',
          default: 0,
          min: -3,
          max: 3,
        },
        {
          id: 'backlight_enable',
          type: 'dropdown',
          label: 'Backlight Compensation?',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '0',
        },
        {
          id: 'backlight',
          type: 'number',
          label: 'Backlight Level (0–30)',
          default: 0,
          min: 0,
          max: 30,
        },
        {
          id: 'metering',
          type: 'dropdown',
          label: 'Metering Mode',
          choices: [
            { id: '0', label: 'Average' },
            { id: '1', label: 'Center' },
            { id: '2', label: 'Spot' },
            { id: '3', label: 'Matrix' },
          ],
          default: '0',
        },
        {
          id: 'sensitive',
          type: 'number',
          label: 'Sensitivity ID (0–9)',
          default: 0,
          min: 0,
          max: 9,
        },
        {
          id: 'save_flag',
          type: 'dropdown',
          label: 'Save Settings?',
          choices: [
            { id: '0', label: 'No' },
            { id: '1', label: 'Yes' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const response = await instance.api.getExposureInfo()
        if (response.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            mode: response.data.mode.selected_id.toString(),
            gain: response.data.gain,
            shutter: response.data.shutter.selected_id,
            wdr: response.data.wdr.selected_id,
            flicker: response.data.flicker.selected_id.toString(),
            bias_enable: response.data.bias_enable.toString(),
            bias: response.data.bias,
            backlight_enable: response.data.backlight_enable.toString(),
            backlight: response.data.backlight,
            metering: response.data.metering.selected_id.toString(),
            sensitive: response.data.sensitive.selected_id,
          }
        } else {
          ConsoleLog(instance, `Failed to learn exposure info: ${getZowieStatusLabel(response.status)}`, LogLevel.ERROR)
          return undefined
        }
      },
      callback: async (ev, context) => {
        const data = {
          mode: { selected_id: parseInt(ev.options.mode as string, 10) },
          gain: Number(ev.options.gain),
          shutter: { selected_id: Number(ev.options.shutter) },
          wdr: { selected_id: Number(ev.options.wdr) },
          flicker: { selected_id: parseInt(ev.options.flicker as string, 10) },
          bias_enable: parseInt(ev.options.bias_enable as string, 10),
          bias: Number(ev.options.bias),
          backlight_enable: parseInt(ev.options.backlight_enable as string, 10),
          backlight: Number(ev.options.backlight),
          metering: { selected_id: parseInt(ev.options.metering as string, 10) },
          sensitive: { selected_id: Number(ev.options.sensitive) },
          save_flag: parseInt(ev.options.save_flag as string, 10) as 0 | 1,
        }

        const resp = await instance.api.setExposureInfo(data)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, 'Exposure parameters updated successfully', LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set exposure: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setExposureInfo
        ConsoleLog(instance, `Creating action ${action.id} of type setExposureInfo`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setAperture]: {
      name: 'Image: Aperture Control',
      description: 'Adjust lens aperture (0=CLOSE...12=F1.6)',
      options: [
        {
          id: 'aperture',
          type: 'number',
          label: 'Aperture ID (0..12)',
          default: 12,
          min: 0,
          max: 12,
        },
      ],
      learn: async (ev, context) => {
        const resp = await instance.api.getAperture()
        if (resp.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            aperture: resp.data.selected_id,
          }
        } else {
          ConsoleLog(instance, `Failed to learn Aperture: ${getZowieStatusLabel(resp.status)}`, LogLevel.ERROR)
          return undefined
        }
      },
      callback: async (ev, context) => {
        const apVal = Number(ev.options.aperture)
        const resp = await instance.api.setAperture(apVal)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Aperture set to ${apVal}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set aperture: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setAperture
        ConsoleLog(instance, `Creating action ${action.id} of type setAperture`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setWhiteBalance]: {
      name: 'Image: White Balance',
      description: 'Set color temperature, gains, hue, saturation, IR cut, etc.',
      options: [
        {
          id: 'mode',
          type: 'dropdown',
          label: 'WB Mode',
          choices: [
            { id: '0', label: 'Auto' },
            { id: '1', label: 'Manual' },
            { id: '2', label: 'VAR' },
            { id: '3', label: 'OnePush' },
          ],
          default: '0',
        },
        {
          id: 'var',
          type: 'number',
          label: 'Color Temp ID (0..7)',
          default: 0,
          min: 0,
          max: 7,
        },
        {
          id: 'rgain',
          type: 'number',
          label: 'R Gain (0..255)',
          default: 128,
          min: 0,
          max: 255,
        },
        {
          id: 'bgain',
          type: 'number',
          label: 'B Gain (0..255)',
          default: 128,
          min: 0,
          max: 255,
        },
        {
          id: 'saturation',
          type: 'number',
          label: 'Saturation (1..100)',
          default: 30,
          min: 1,
          max: 100,
        },
        {
          id: 'hue',
          type: 'number',
          label: 'Hue (-180..180)',
          default: 0,
          min: -180,
          max: 180,
        },
        {
          id: 'ircut',
          type: 'dropdown',
          label: 'IR-Cut Mode',
          choices: [
            { id: '0', label: 'Day' },
            { id: '1', label: 'Night' },
          ],
          default: '0',
        },
        {
          id: 'save_flag',
          type: 'dropdown',
          label: 'Save Settings?',
          choices: [
            { id: '0', label: 'No' },
            { id: '1', label: 'Yes' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const resp = await instance.api.getWhiteBalance()
        if (resp.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            mode: resp.data.mode.selected_id.toString(),
            var: resp.data.var.selected_id,
            rgain: resp.data.rgain,
            bgain: resp.data.bgain,
            saturation: resp.data.saturation,
            hue: resp.data.hue,
            ircut: resp.data.ircut.selected_id.toString(),
          }
        } else {
          ConsoleLog(instance, `Failed to learn White Balance: ${getZowieStatusLabel(resp.status)}`, LogLevel.ERROR)
          return undefined
        }
      },
      callback: async (ev, context) => {
        const data = {
          mode: { selected_id: parseInt(ev.options.mode as string, 10) },
          var: { selected_id: Number(ev.options.var) },
          rgain: Number(ev.options.rgain),
          bgain: Number(ev.options.bgain),
          saturation: Number(ev.options.saturation),
          hue: Number(ev.options.hue),
          ircut: { selected_id: parseInt(ev.options.ircut as string, 10) },
          save_flag: parseInt(ev.options.save_flag as string, 10) as 0 | 1,
        }

        const resp = await instance.api.setWhiteBalance(data)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, 'White balance updated', LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set white balance: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setWhiteBalance
        ConsoleLog(instance, `Creating action ${action.id} of type setWhiteBalance`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setImageInfo]: {
      name: 'Image: Picture Settings',
      description: 'Adjust brightness, contrast, sharpness, gamma, flip, color/gray',
      options: [
        {
          id: 'brightness',
          type: 'number',
          label: 'Brightness (0..8)',
          default: 4,
          min: 0,
          max: 8,
        },
        {
          id: 'contrast',
          type: 'number',
          label: 'Contrast (0..15)',
          default: 7,
          min: 0,
          max: 15,
        },
        {
          id: 'sharpness',
          type: 'number',
          label: 'Sharpness (0..10)',
          default: 2,
          min: 0,
          max: 10,
        },
        {
          id: 'gamma',
          type: 'number',
          label: 'Gamma Curve (ID 0..8)',
          default: 2,
          min: 0,
          max: 8,
        },
        {
          id: 'flip',
          type: 'number',
          label: 'Flip ID (0..4)',
          default: 0,
          min: 0,
          max: 4,
        },
        {
          id: 'color_gray',
          type: 'dropdown',
          label: 'Color or Gray',
          choices: [
            { id: '0', label: 'Color' },
            { id: '1', label: 'Gray' },
          ],
          default: '0',
        },
        {
          id: 'save_flag',
          type: 'dropdown',
          label: 'Save Settings?',
          choices: [
            { id: '0', label: 'No' },
            { id: '1', label: 'Yes' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const resp = await instance.api.getImageInfo()
        if (resp.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            brightness: resp.data.brightness,
            contrast: resp.data.contrast,
            sharpness: resp.data.sharpness,
            gamma: resp.data.gamma.selected_id,
            flip: resp.data.flip.selected_id,
            color_gray: resp.data.color_gray.selected_id.toString(),
          }
        } else {
          ConsoleLog(
            instance,
            `Failed to learn Picture Settings: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
          return undefined
        }
      },
      callback: async (ev, context) => {
        const data = {
          brightness: Number(ev.options.brightness),
          contrast: Number(ev.options.contrast),
          sharpness: Number(ev.options.sharpness),
          gamma: { selected_id: Number(ev.options.gamma) },
          flip: { selected_id: Number(ev.options.flip) },
          color_gray: { selected_id: parseInt(ev.options.color_gray as string, 10) },
          save_flag: parseInt(ev.options.save_flag as string, 10) as 0 | 1,
        }

        const resp = await instance.api.setImageInfo(data)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Image settings updated`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set image settings: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setImageInfo
        ConsoleLog(instance, `Creating action ${action.id} of type setImageInfo`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setNoiseReduction]: {
      name: 'Image: Noise Reduction',
      description: 'Configure 2D/3D noise reduction levels and correction factor',
      options: [
        {
          id: 'nr_2d',
          type: 'number',
          label: '2D NR Level (0..8)',
          default: 3,
          min: 0,
          max: 8,
        },
        {
          id: 'nr_3d',
          type: 'number',
          label: '3D NR Level (0..8)',
          default: 3,
          min: 0,
          max: 8,
        },
        {
          id: 'correction',
          type: 'number',
          label: 'Correction ID (0..5)',
          default: 0,
          min: 0,
          max: 5,
        },
        {
          id: 'save_flag',
          type: 'dropdown',
          label: 'Save Settings?',
          choices: [
            { id: '0', label: 'No' },
            { id: '1', label: 'Yes' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const resp = await instance.api.getNRInfo()
        if (resp.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            nr_2d: resp.data.nr_2d.selected_id,
            nr_3d: resp.data.nr_3d.selected_id,
            correction: resp.data.correction.selected_id,
          }
        } else {
          ConsoleLog(
            instance,
            `Failed to learn Noise Reduction: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
          return undefined
        }
      },
      callback: async (ev, context) => {
        const data = {
          nr_2d: { selected_id: Number(ev.options.nr_2d) },
          nr_3d: { selected_id: Number(ev.options.nr_3d) },
          correction: { selected_id: Number(ev.options.correction) },
          save_flag: parseInt(ev.options.save_flag as string, 10) as 0 | 1,
        }
        const resp = await instance.api.setNRInfo(data)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, 'Noise Reduction settings updated', LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set noise reduction: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setNoiseReduction
        ConsoleLog(instance, `Creating action ${action.id} of type setNoiseReduction`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setImageStyle]: {
      name: 'Image: Picture Style',
      description: 'Apply preset style (e.g. default, normal, bright, clarity, etc.)',
      options: [
        {
          id: 'selected_id',
          type: 'number',
          label: 'Style ID (0..5)',
          default: 0,
          min: 0,
          max: 5,
        },
        {
          id: 'save_flag',
          type: 'dropdown',
          label: 'Save Style?',
          choices: [
            { id: '0', label: 'No' },
            { id: '1', label: 'Yes' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const resp = await instance.api.getStyleInfo()
        if (resp.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            selected_id: resp.data.selected_id,
          }
        } else {
          ConsoleLog(
            instance,
            `Failed to learn Picture Style: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
          return undefined
        }
      },
      callback: async (ev, context) => {
        const styleID = Number(ev.options.selected_id)
        const saveFlag = parseInt(ev.options.save_flag as string, 10) as 0 | 1
        const resp = await instance.api.setStyleInfo(styleID, saveFlag)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `Picture style changed to ID=${styleID}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set picture style: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setImageStyle
        ConsoleLog(instance, `Creating action ${action.id} of type setImageStyle`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },

    [ActionId.setAELock]: {
      name: 'Image: Auto-Exposure Lock',
      description: 'Lock or unlock AE so the camera’s exposure remains constant',
      options: [
        {
          id: 'ae_lock_status',
          type: 'dropdown',
          label: 'AE Lock',
          choices: [
            { id: '0', label: 'Off' },
            { id: '1', label: 'On' },
          ],
          default: '0',
        },
      ],
      learn: async (ev, context) => {
        const resp = await instance.api.getAELockStatus()
        if (resp.status === ZowieStatus.Successful) {
          return {
            ...ev.options,
            ae_lock_status: resp.data.ae_lock_status.toString(),
          }
        } else {
          ConsoleLog(instance, `Failed to learn AE Lock: ${getZowieStatusLabel(resp.status)}`, LogLevel.ERROR)
          return undefined
        }
      },
      callback: async (ev, context) => {
        const lockVal = parseInt(ev.options.ae_lock_status as string, 10) as 0 | 1
        const resp = await instance.api.setAELockStatus(lockVal)
        if (resp.status === ZowieStatus.Successful || resp.status === ZowieStatus.ModificationSuccessful) {
          ConsoleLog(instance, `AE Lock set to ${lockVal}`, LogLevel.DEBUG)
        } else {
          ConsoleLog(
            instance,
            `Failed to set AE Lock: ${getZowieStatusLabel(resp.status)}`,
            LogLevel.ERROR
          )
        }
      },
      subscribe: (action) => {
        instance.actions[action.id] = ActionId.setAELock
        ConsoleLog(instance, `Creating action ${action.id} of type setAELock`, LogLevel.DEBUG)
      },
      unsubscribe: (action) => {
        delete instance.actions[action.id]
        ConsoleLog(instance, `Removing action ${action.id}`, LogLevel.DEBUG)
      },
    },
  })
}
