import { startView } from "@hejsoftware/cti-plugin-lib";
import MyView from "./view";

startView(new MyView())
    .catch(console.error);
