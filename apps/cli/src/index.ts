#!/usr/bin/env bun

const VERSION = "0.1.0";

const HELP = `cloud — Wrikka cloud platform CLI

Usage: cloud <command>

Commands:
  dev        Start the cloud dashboard (apps/web)
  services   List platform services
  help       Show this help
  version    Print version
`;

const SERVICES = [
	{ name: "notification", path: "packages/services/notification" },
	{ name: "analytics", path: "packages/services/analytics" },
	{ name: "integrations", path: "packages/lib/integrations" },
];

const main = (args: readonly string[]) => {
	const [command] = args;
	switch (command) {
		case "dev":
			console.log("Run `bun --filter @wrikka/cloud-web dev` from the monorepo root.");
			break;
		case "services":
			for (const s of SERVICES) console.log(`${s.name}\t${s.path}`);
			break;
		case "version":
		case "--version":
		case "-v":
			console.log(VERSION);
			break;
		case "help":
		case "--help":
		case "-h":
		case undefined:
			console.log(HELP);
			break;
		default:
			console.error(`Unknown command: ${command}\n\n${HELP}`);
			process.exit(1);
	}
};

main(Bun.argv.slice(2));
