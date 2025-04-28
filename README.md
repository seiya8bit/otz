# @seiya8bit/otz

`otz` is a command-line tool that generates Zod schemas from your OpenAPI definitions.
Maps OpenAPI types and formats to Zod schemas, and generates validation messages useful for UI forms.

## Features

- **Type & Format Conversion:** Translates OpenAPI `type` (e.g., `integer`) and `format` (e.g., `email`) properties into the appropriate Zod schema types.
- **Validation Rule Mapping:** Converts OpenAPI validation keywords like `minimum`, `exclusiveMinimum`, etc., into Zod validation checks (e.g., `.min()`, `.max()`).
- **Customizable Null Handling:** Choose how `nullable: true` properties are handled – map them to either `.nullish()` or `.optional()` in the generated Zod schemas.
- **Validation Message Generation:** Option to automatically include validation messages within the generated Zod schemas, perfect for displaying feedback in forms.
- **Split Definition Support:** Seamlessly handles OpenAPI definitions that are split across multiple files using `$ref`.

## Usage

Run the `otz` command, specifying the input OpenAPI file, the desired output path, and any relevant options:

```sh
otz -i path/to/openapi.yaml -o path/to/output.ts -c -p -q -n nullish
```

## Command-Line Options

The following options are available for the `otz` command:

| Options               | Description                                                         | Required | Default  |
| --------------------- | ------------------------------------------------------------------- | -------- | -------- |
| `-i, --input`         | Path to the root OpenAPI definition file (YAML or JSON).            | ✅       | N/A      |
| `-o, --output`        | Output file path for the generated Zod schema.                      | ✅       | N/A      |
| `-c, --components`    | Generate schemas for definitions in components/schemas.             |          | false    |
| `-p, --paths`         | Generate schemas for request bodies and responses defined in paths. |          | false    |
| `-q, --queries`       | Generate schemas for query parameters defined in paths.             |          | false    |
| `-n, --nullable-mode` | Set null handling mode: nullish or optional.                        |          | optional |

## Split OpenAPI Definitions

For OpenAPI definitions split across multiple files, specify the root file in the `--input` option.

## Guides

- **For OpenAPI users:** See the [OpenAPI Usage Guide](README_OpenAPI.md) for details on converting existing OpenAPI files.
- **For TypeSpec users:** See the [TypeSpec Usage Guide](README_TypeSpec.md) for integrating `otz` into your TypeSpec workflow.

## Examples

- [Petstore(basic)](https://github.com/seiya8bit/otz/tree/main/examples/petstore)
- [with Hono(advanced)](https://github.com/seiya8bit/otz/tree/main/examples/with-hono)

## Contributing

Contributions are welcome!

If you find a bug or have a feature request, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
