import "../common";

@doc("Category model")
model Category {
  @key
  @visibility("read", "update")
  id: cuid2;

  @minLength(2)
  @maxLength(32)
  @doc("category name")
  name: string;

  ...Timestamps;
}
