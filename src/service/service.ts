import { ICtiPluginService, ITelephonyApi } from "@hejsoftware/cti-plugin-lib";
import CallHandler from "./call-handler";

export default class Service implements ICtiPluginService {
    public start(telApi: ITelephonyApi): void {
        telApi.onCall((call, callApi) => new CallHandler(call, callApi, telApi));
    }
}
