import "@typespec/http";
import "@typespec/versioning";

import "../util.tsp";

import "../models/category.tsp";

using TypeSpec.Http;

using WithHonoService.Utils;

namespace WithHonoService.Models;

@route("/categories")
interface Categories {
  @get
  @summary("List categories")
  list(
    @query limit?: string = "20",
    @query offset?: string = "0",
  ): Pagination<Category> | BadRequestResponse;

  @get
  @summary("get category")
  get(@path id: cuid2): Category | NotFoundResponse;

  @post
  @summary("Create category")
  create(@body category: Category): Category | BadRequestResponse;

  @patch
  @summary("Edit category")
  update(
    @path id: cuid2,
    @body category: Category,
  ): Category | BadRequestResponse;

  @delete
  @summary("Delete category")
  delete(@path id: cuid2): NoContentResponse | BadRequestResponse;
}
