import { DispatchEventFn, ICtiPluginView } from "@hejsoftware/cti-plugin-lib";
import { IState } from "../state.interface";

export default class MyView implements ICtiPluginView<IState> {
    protected myBtn!: HTMLButtonElement;

    public start(dispatch: DispatchEventFn): void {
        this.myBtn = document.getElementById("myBtn") as HTMLButtonElement;
        this.myBtn.addEventListener("click", () => dispatch({
            type: "BTN_CLICKED",
        }));
    }

    public render({ clickCount }: IState): void {
        this.myBtn.innerText = `Clicked ${clickCount || 0} times`;
    }
}
