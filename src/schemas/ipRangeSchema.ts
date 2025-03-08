
import { z } from "zod";

// IP/CIDR validation regex
// Validates IPv4 addresses with CIDR notation (e.g., 192.168.1.0/24)
export const ipCidrRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))$/;

// Define the schema to ensure all required fields are present
export const IPRangeSchema = z.object({
  range: z.string()
    .min(1, "IP range is required")
    .regex(ipCidrRegex, "Must be a valid IP/CIDR format (e.g., 192.168.1.0/24)"),
  description: z.string().optional(),
  isReserved: z.boolean().default(false),
  dhcpScope: z.boolean().default(false),
  siteId: z.string().optional().nullable()
});

export type IPRangeFormValues = z.infer<typeof IPRangeSchema>;
