import "@typespec/versioning";

import "../util.tsp";

using Versioning;

using WithHonoService.Utils;

namespace WithHonoService.Models;

model Category {
  @key
  @visibility(Lifecycle.Read, Lifecycle.Update)
  id: cuid2;

  @minLength(2)
  @maxLength(32)
  @doc("category name")
  name: string;

  @visibility(Lifecycle.Read)
  createdAt: utcDateTime;

  @visibility(Lifecycle.Read)
  updatedAt: utcDateTime;
}
