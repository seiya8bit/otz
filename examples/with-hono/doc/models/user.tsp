import "@typespec/versioning";

import "../util.tsp";

using Versioning;

using WithHonoService.Utils;

namespace WithHonoService.Models;

model User {
  @key
  @visibility(Lifecycle.Read, Lifecycle.Update)
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

  @visibility(Lifecycle.Read)
  createdAt: utcDateTime;

  @visibility(Lifecycle.Read)
  updatedAt: utcDateTime;
}
