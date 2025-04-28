model Timestamps {
  @visibility("read")
  createdAt: utcDateTime;

  @visibility("read")
  updatedAt: utcDateTime;
}
