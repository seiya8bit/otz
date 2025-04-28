import "@typespec/http";
import "@typespec/rest";

import "../models";
import "../common";

using TypeSpec.Http;
using TypeSpec.Rest;
namespace Root;

@tag("User")
namespace UserNamespace {
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
}
