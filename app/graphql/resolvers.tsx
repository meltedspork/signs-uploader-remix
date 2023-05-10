import { IResolvers } from '@graphql-tools/utils';

export type Post = {
  title: string;
  sourceLink: string;
  highlightHeading: boolean;
  createdAt: string;
};

const resolvers: IResolvers = {
  Query: {
    posts: async (source, args, context, info) => {
      const posts: Post[] = [
        {
          title: 'Mutation-like immutability in JavaScript using immer.js',
          sourceLink: 'https://layercode.com/community/immerjs-immutability',
          highlightHeading: false,
          createdAt: '20 Nov',
        },
        {
          title: 'How to set up Firebase Authentication in React',
          sourceLink: 'https://layercode.com/community/firebase-auth-with-react',
          highlightHeading: false,
          createdAt: '21 Nov',
        }
      ];
      return posts;
    },
  },
};

export default resolvers;
