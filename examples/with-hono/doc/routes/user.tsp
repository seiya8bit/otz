import "@typespec/http";
import "@typespec/versioning";

import "../util.tsp";

import "../models/user.tsp";

using TypeSpec.Http;

using WithHonoService.Utils;

namespace WithHonoService.Models;

@route("/users")
interface Users {
  @get
  @summary("List users")
  list(
    @query limit?: string = "20",
    @query offset?: string = "0",
  ): Pagination<User> | BadRequestResponse;

  @get
  @summary("get user")
  get(@path id: cuid2): User | NotFoundResponse;

  @post
  @summary("Create user")
  create(@body user: User): User | BadRequestResponse;

  @patch
  @summary("Edit user")
  update(@path id: cuid2, @body user: User): User | BadRequestResponse;

  @delete
  @summary("Delete user")
  delete(@path id: cuid2): NoContentResponse | BadRequestResponse;
}
