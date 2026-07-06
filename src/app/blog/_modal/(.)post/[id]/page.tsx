import { findPostBySlug } from "../../../utils";
import { BlogArticleModal } from "../../../BlogArticleModal";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function InterceptedPostPage(props: { params: Params }) {
  const { id } = await props.params;
  const post = findPostBySlug(id);

  if (!post) {
    notFound();
  }

  return <BlogArticleModal post={post} />;
}
