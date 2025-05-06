import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField, CompanionVariableDefinition } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from "./modules/config.js";
import { UpdateActions } from './actions/actions.js'
import { UpdateFeedbacks } from './feedbacks/feedbacks.js'
import { UpdateVariableDefinitions } from './variables/variables.js';
import { UpgradeScripts } from './upgrade.js'
import { SetPresets } from './presets/presets.js';
import { LogLevel, ZowieStatus } from './modules/enums.js';
import { ZowietekAPI } from "./modules/apiClient.js";
import { isValidIPAddress } from './helpers/commonHelpers.js';
import { ConsoleLog } from './modules/logger.js';
import { fetchData } from './events/fetchData.js';

export class ZowietekInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig;
	globalSettings!: any;
	api: ZowietekAPI;
	states!: any;
	actions!: any;
	moduleInit!: boolean;
	variables!: CompanionVariableDefinition[];
	constants: any;
	connected:boolean;

	constructor(internal: any) {
		super(internal);

		// Store the instance's state and connection info
		this.states = {};
		this.actions = {};
		this.moduleInit = false;
		this.variables = [];
		this.globalSettings = {};
		this.constants = {
			inputInfo: {},
			outputInfo: {},
			audioConfig: {},
			deviceTime: {},
			tally: {}
		};
		this.connected = false;
		this.api;
	}
 
	// Initialize the instance
	async init(config: ModuleConfig): Promise<void> {
		this.config = config;

		this.updateActions();
		this.updateFeedbacks();
		this.updateVariables();
		this.setPresets();

		this.updateStatus(InstanceStatus.Disconnected);
		this.setupClient();

	}

	setupClient(): void {
		if (this.config.enableComs && this.config.ipAddress && isValidIPAddress(this.config.ipAddress)) {
	
			if (!this.moduleInit) {
				this.globalSettings.ipAddress = this.config.ipAddress;
				this.globalSettings.enableComs = this.config.enableComs;
	
				this.api = new ZowietekAPI(this.config.ipAddress, this);
				this.checkConnection();
	
				// Start a timer to collect general data for feedbacks (every 1 second)
				setInterval(() => {
					fetchData(this, { general: true });
				}, 1000);
	
				// Start a timer to fetch NDI and Storage data (every 5 seconds)
				setInterval(() => {
					fetchData(this, { ndi: true, storage: true });
				}, 5000);
	
				// Start a timer to check the health of the connection (every 5 seconds)
				setInterval(() => {
					this.checkConnection();
				}, 5000);
	
				this.moduleInit = true;
				ConsoleLog(this, `Module initialized`, LogLevel.DEBUG);
			}
	
		} else {
			if (!this.config.ipAddress || !isValidIPAddress(this.config.ipAddress)) {
				this.updateStatus(InstanceStatus.BadConfig);
				ConsoleLog(this, `Invalid IP: ${this.config.ipAddress}`, LogLevel.ERROR);
			}
		}
	}

	async checkConnection(): Promise<boolean> {
		try {
			if (this.api && this.config.enableComs) {
				const request = await this.api.getDeviceTime();

				if (!request) {
					this.updateStatus(InstanceStatus.ConnectionFailure);
					ConsoleLog(this, `Failed to connect to ${this.config.ipAddress}`, LogLevel.ERROR);
					return false;
				}

				switch (request.status) {
					case ZowieStatus.Successful:
						this.updateStatus(InstanceStatus.Ok);
						//ConsoleLog(this, `Response: ${JSON.stringify(request.data)}`, LogLevel.DEBUG);
						this.connected = true;
						return true;
					case ZowieStatus.InvalidIP:
						this.updateStatus(InstanceStatus.BadConfig);
						ConsoleLog(this, `Invalid IP: ${this.config.ipAddress}`, LogLevel.ERROR);
						break;
					case ZowieStatus.InvalidPort:
						this.updateStatus(InstanceStatus.BadConfig);
						ConsoleLog(this, `Invalid port: ${this.config.ipAddress}`, LogLevel.ERROR);
						break;
					case ZowieStatus.InvalidURL:
						this.updateStatus(InstanceStatus.BadConfig);
						ConsoleLog(this, `Invalid URL: ${this.config.ipAddress}`, LogLevel.ERROR);
						break;
					case ZowieStatus.HTTPPortOccupied:
						this.updateStatus(InstanceStatus.ConnectionFailure);
						ConsoleLog(this, `Port for ${this.config.ipAddress} is already in use`, LogLevel.ERROR);
						break;
					case ZowieStatus.WrongIPAddress:
						this.updateStatus(InstanceStatus.BadConfig);
						ConsoleLog(this, `Invalid IP: ${this.config.ipAddress}`, LogLevel.ERROR);
						break;
					case ZowieStatus.WrongPassword:
						this.updateStatus(InstanceStatus.BadConfig);
						ConsoleLog(this, `Invalid password for ${this.config.ipAddress}`, LogLevel.ERROR);
						break;
					default:
						ConsoleLog(this, `Unknown error: ${request.status}`, LogLevel.ERROR);
						this.updateStatus(InstanceStatus.UnknownError);
				}
				
				this.connected = false;
				return false;
			} else {
				this.updateStatus(InstanceStatus.Disconnected);
				ConsoleLog(this, `Comms disabled`, LogLevel.DEBUG);
				this.connected = false;
				return false;
			}
		} catch (error) {
			this.connected = false;
			return false;
		}
	}

	updateActions(): void {
		UpdateActions(this);
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this);
	}

	updateVariables(): void {
		UpdateVariableDefinitions(this);
	}

	setPresets(): void {
		SetPresets(this);
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields();
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config;
		this.globalSettings.ipAddress = config.ipAddress;
		this.globalSettings.enableComs = config.enableComs;

		if (config.enableComs && config.ipAddress && isValidIPAddress(config.ipAddress)) {
			this.api = new ZowietekAPI(config.ipAddress, this);

			this.checkConnection();
		} else {
			if (!config.ipAddress) {
				this.updateStatus(InstanceStatus.BadConfig);
			}
		}
	}

	async destroy(): Promise<void> {

		this.log('debug', 'destroy');
	}

}

// Entry point for the module
runEntrypoint(ZowietekInstance, UpgradeScripts);
