import "@typespec/http";
import "@typespec/versioning";

using Versioning;

namespace WithHonoService.Utils;

@added(Versions.v1)
model Pagination<T> {
  limit: int32;
  offset: int32;
  total: int32;
  items: T[];
}

@format("cuid2")
scalar cuid2 extends string;
