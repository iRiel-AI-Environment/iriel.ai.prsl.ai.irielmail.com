import { CAPABILITIES } from "@/contracts/capability.registry";
import { MODELS } from "@/contracts/model.registry";

export function resolveModel(capabilityId: string) {
  const capability = CAPABILITIES.find((x) => x.id === capabilityId);

  if (!capability) {
    throw new Error(`Capability ${capabilityId} not found`);
  }

  return MODELS.filter((model) => capability.requiredModelTypes.includes(model.category));
}
