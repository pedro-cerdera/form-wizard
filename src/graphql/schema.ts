import { createSchema } from "@graphql-yoga/node";
import { GraphQLError } from "graphql";

let leads: Record<string, any> = {};

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    scalar JSON

    type Lead {
      id: ID!
      data: JSON!
      status: String!
    }

    type JourneyDecision {
      journeyType: String!
    }

    type Mutation {
      createLead(data: JSON!): Lead!
      updateLead(id: ID!, data: JSON!): Lead!
      completeLead(id: ID!): Lead!
      resolveJourney(cpf: String!): JourneyDecision!
    }

    type Query {
      leads: [Lead!]!
    }
  `,
  resolvers: {
    Query: {
      leads: () => Object.values(leads),
    },
    Mutation: {
      createLead: (_: any, { data }: { data: any }) => {
        const id = Date.now().toString();
        console.log(`➡️ Creating lead with id: ${id}`, data.data);
        leads[id] = { id, data, status: "CREATED" };
        return leads[id];
      },
      updateLead: (_: any, { id, data }: { id: string; data: any }) => {
        const lead = leads[id];
        if (!lead) {
          throw new GraphQLError(`Lead with id ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        leads[id] = { ...lead, data: { ...lead.data, ...data }, status: "UPDATED" };
        return leads[id];
      },
      completeLead: (_: any, { id }: { id: string }) => {
        leads[id].status = "COMPLETED";
        return leads[id];
      },
      resolveJourney: (_: any, { cpf }: { cpf: string }) => {
        if (cpf.endsWith("1") || cpf.endsWith("2")) return { journeyType: "returning" };
        return { journeyType: "new" };
      }
    }
  }
});
