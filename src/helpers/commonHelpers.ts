import { RotateAngle, ZowieStatus } from "../modules/enums.js";

export function isValidIPAddress(ip: string): boolean {
	// Regular expression for validating IPv4
	const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	
	// Regular expression for validating IPv6
	const ipv6Regex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
  
	// Check if the input is a valid IPv4 or IPv6 address
	return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export function getZowieStatusLabel(statusCode: string): string {
    // Loop through each key in the ZowieStatus enum
    for (const [key, value] of Object.entries(ZowieStatus)) {
      if (value === statusCode) {
        return `${key} (${statusCode})`;
      }
    }
    // If no match is found, return the code itself
    return statusCode;
}