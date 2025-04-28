import "@typespec/http";
import "@typespec/versioning";

import "../util.tsp";

import "../models/post.tsp";

using TypeSpec.Http;

using WithHonoService.Utils;

namespace WithHonoService.Models;

@route("/posts")
interface Posts {
  @get
  @summary("List posts")
  list(
    @query limit?: string = "20",
    @query offset?: string = "0",
  ): Pagination<Post> | BadRequestResponse;

  @get
  @summary("get post")
  get(@path id: cuid2): Post | NotFoundResponse;

  @post
  @summary("Create post")
  create(@body post: Post): Post | BadRequestResponse;

  @patch
  @summary("Edit post")
  update(@path id: cuid2, @body post: Post): Post | BadRequestResponse;

  @delete
  @summary("Delete post")
  delete(@path id: cuid2): NoContentResponse | BadRequestResponse;
}
