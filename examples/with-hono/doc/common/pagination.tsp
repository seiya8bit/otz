model Pagination<T> {
  limit: int32;
  offset: int32;
  total: int32;
  items: T[];
}
