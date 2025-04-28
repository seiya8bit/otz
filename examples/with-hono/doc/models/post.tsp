import "@typespec/versioning";

import "../util.tsp";

using Versioning;

using WithHonoService.Utils;

namespace WithHonoService.Models;

model Post {
  @key
  @visibility(Lifecycle.Read, Lifecycle.Update)
  id: cuid2;

  @minLength(1)
  title: string;

  @minLength(1)
  @doc("Markdown formatted string")
  body: string;

  categories: Category[];

  @visibility(Lifecycle.Read)
  createdAt: utcDateTime;

  @visibility(Lifecycle.Read)
  updatedAt: utcDateTime;
}
