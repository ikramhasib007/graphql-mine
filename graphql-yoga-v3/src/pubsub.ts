import { createPubSub } from "graphql-yoga";
import { UserSubscriptionPayload } from "./generated/graphql";

export type PubSubChannels = {
  user: [UserSubscriptionPayload];
  "globalCounter:changed": [];
};

export const pubSub = createPubSub<PubSubChannels>();
