import { startService } from "@hejsoftware/cti-plugin-lib";
import Service from "./service";

startService(new Service())
    .catch(console.error);
