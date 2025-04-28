import ".";
import "../common";

@doc("User model")
model User {
  @key
  @visibility("read", "update")
  id: cuid2;

  @minLength(2)
  @maxLength(32)
  @doc("username")
  name: string;

  @format("email")
  email: string;

  @minValue(18)
  age: int16;

  posts: Post[];

  ...Timestamps;
}
