import { createContext } from "react"

export type TargetedContextType = {
    targetContext: string;
    targets: Array<string>;
}
export const emptyTargetContext: TargetedContextType = {
    targetContext: "",
    targets: []
}

const TargetableCards = createContext<TargetedContextType>(emptyTargetContext);

export default TargetableCards