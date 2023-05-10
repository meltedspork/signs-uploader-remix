import type { ActionArgs, HeadersFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export const loader = async ({ request }: ActionArgs) => {
  console.log('request:::', request);
  const search = new URL(request.url).search;
  console.log('search:::', search);
  return redirect(`/${search}`);
};