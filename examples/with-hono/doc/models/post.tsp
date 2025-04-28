import ".";
import "../common";

@doc("Post model")
model Post {
  @key
  @visibility("read", "update")
  id: cuid2;

  @minLength(1)
  title: string;

  @minLength(1)
  @doc("Markdown formatted string")
  body: string;

  categories: Category[];

  ...Timestamps;
}
