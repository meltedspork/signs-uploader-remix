=import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache
} from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';

import schema from '~/graphql/schema';

const GraphQLClientComponent = (props: any) => {
  const { children } = props;
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    ssrMode: true,
    //uri: `${window.ENV.BASE_URL}/graphql`,
    link: new SchemaLink({ schema })
    // headers: request.headers,
    // credentials: 'same-origin', // or 'same-origin' if your backend server is the same domain
  });

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}

export default GraphQLClientComponent;
