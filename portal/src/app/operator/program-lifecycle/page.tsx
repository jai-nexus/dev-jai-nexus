import { buildFounderActiveProgramControlSurface } from "@/lib/controlPlane/programLifecycle/founder-active-program-control-surface";
import { FounderActiveProgramControlSurface } from "./FounderActiveProgramControlSurface";

export default function ProgramLifecyclePage() {
  return <FounderActiveProgramControlSurface model={buildFounderActiveProgramControlSurface()} />;
}
