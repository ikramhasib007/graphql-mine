import { createPubSub } from "graphql-yoga";

// Subscription: {
//   newLink: {
//     subscribe: (parent: unknown, args: {}, context: GraphQLContext) =>
//       context.pubSub.subscribe('newLink')
//   }
// }

// Emitting PubSub events in mutation resolvers
// context.pubSub.publish('newLink', { newLink })

export type PubSubChannels = {
  // newLink: [{ newLink: Link }],
  // "globalCounter:changed": [];
};

export const pubSub = createPubSub<PubSubChannels>();
