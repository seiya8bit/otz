import "@typespec/http";
import "@typespec/versioning";

import "./util.tsp";

/* Routes */
import "./routes/category.tsp";
import "./routes/post.tsp";
import "./routes/user.tsp";

using Http;
using Versioning;

@service(#{
  title: "With-Hono API Example",
})
@server("", "Development")
@server("", "Production")
@versioned(Versions)
namespace WithHonoService;

enum Versions {
  v1,
}
