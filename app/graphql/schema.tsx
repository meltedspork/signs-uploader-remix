import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from '~/graphql/resolvers';

const typeDefs = gql`
  type Post {
    title: String
    sourceLink: String
    highlightHeading: Boolean
    createdAt: String
  }
   
  type Query {
    posts: [Post]
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
 });
 
 export default schema;
