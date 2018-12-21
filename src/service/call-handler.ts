import { Call, ICallApi, ITelephonyApi, NotificationTypes } from "@hejsoftware/cti-plugin-lib";
import { IState } from "../state.interface";

export default class CallHandler {
    protected state: IState = {
        clickCount: 0,
    };

    public constructor(
        call: Call, // Initial call state
        callApi: ICallApi,
        telApi: ITelephonyApi,
    ) {
        // Listen to call updates either using observables
        callApi.callUpdate$.subscribe(() => void 0);

        // or callbacks
        callApi.onCallUpdate.addEventListener(() => void 0);

        // Same applies for UI events and the discard event
        callApi.event$.subscribe(() => void 0);
        callApi.onEvent.addEventListener(() => void 0);

        callApi.discard$.subscribe(() => void 0);
        callApi.onDiscard.addEventListener(() => void 0);


        // Button event handler
        callApi.onEvent.addEventListener((evt: { type: string }) => {
            if (evt.type !== "BTN_CLICKED") {
                return;
            }

            callApi.patchState(this.state = {
                clickCount: this.state.clickCount + 1,
            });

            telApi.showNotification(NotificationTypes.Info, "Button was clicked")
        });
    }
}
