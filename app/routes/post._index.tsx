import { Link, useLoaderData } from "@remix-run/react";
import { runQuery } from '~/graphql/client';
import { Post } from '~/graphql/resolvers';
import { ApolloQueryResult } from '@apollo/client/core/types';

export const loader = async () => {
  const res = await runQuery(`
    query getPosts {
      posts {
        title
        sourceLink
        highlightHeading
        createdAt
      }
    }
  `);
  return res;
 };

 export default function Posts() {
  const queryResults = useLoaderData<ApolloQueryResult<{ posts: Post[] }>>();
  const data = queryResults.data?.posts;
 
  return (
    <div className="container">
      {data.map((post: any, index: number) => (
        <article key={index}>
          <p className="date">{post.createdAt}</p>
          <a
            href={post.sourceLink}
            className={`title highlight ${post.highlightHeading}`}
          >
            {post.title}
          </a>
        </article>
      ))}
    </div>
  );
 }