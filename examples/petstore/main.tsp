/**
 * Borrowed from: https://typespec.io/docs/getting-started/getting-started-rest/01-setup-basic-syntax/
 */
import "@typespec/http";

using TypeSpec.Http;

@service({
  title: "Pet Store",
})
@server("https://example.com", "Single server endpoint")
namespace PetStore;

model Pet {
  id: int32;

  @minLength(1)
  name: string;

  @minValue(0)
  @maxValue(100)
  age: int32;

  kind: petType;
}

enum petType {
  dog: "dog",
  cat: "cat",
  fish: "fish",
  bird: "bird",
  reptile: "reptile",
}

@route("/pets")
namespace Pets {
  @get
  op list(): {
    @statusCode statusCode: 200;
    @body pets: Pet[];
  };

  @get
  op get(@path petId: int32): {
    @statusCode statusCode: 200;
    @body pet: Pet;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundError;
  };

  @post
  op create(@body pet: Pet): {
    @statusCode statusCode: 201;
    @body newPet: Pet;
  } | {
    @statusCode statusCode: 202;
    @body acceptedPet: Pet;
  } | {
    @statusCode statusCode: 400;
    @body error: ValidationError;
  };

  @put
  op update(@path petId: int32, @body pet: Pet):
    | {
        @statusCode statusCode: 200;
        @body updatedPet: Pet;
      }
    | {
        @statusCode statusCode: 400;
        @body error: ValidationError;
      }
    | {
        @statusCode statusCode: 404;
        @body error: NotFoundError;
      }
    | {
        @statusCode statusCode: 500;
        @body error: InternalServerError;
      };

  @delete
  op delete(@path petId: int32): {
    @statusCode statusCode: 204;
  };
}

@error
model NotFoundError {
  code: "NOT_FOUND";
  message: string;
}

@error
model ValidationError {
  code: "VALIDATION_ERROR";
  message: string;
  details: string[];
}

@error
model InternalServerError {
  code: "INTERNAL_SERVER_ERROR";
  message: string;
}
