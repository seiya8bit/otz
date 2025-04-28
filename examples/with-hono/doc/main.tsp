import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

import "./common";
import "./routes";

using TypeSpec.Http;
using TypeSpec.Rest;

@service({
  title: "With-Hono API Example",
})
@server("", "Development")
@server("", "Production")
namespace Root {

}
