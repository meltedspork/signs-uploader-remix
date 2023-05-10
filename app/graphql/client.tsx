import { ApolloClient, InMemoryCache } from '@apollo/client';
import gql from 'graphql-tag';
import { SchemaLink } from '@apollo/client/link/schema';

import schema from '~/graphql/schema';

const graphqlClient = new ApolloClient({
 cache: new InMemoryCache(),
 ssrMode: true,
 link: new SchemaLink({ schema })
});

export async function runQuery(gqlStr: any): Promise<any> {
  return await graphqlClient.query({ query: gql`${gqlStr}` });
}

