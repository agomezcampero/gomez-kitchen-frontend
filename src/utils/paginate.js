export function paginate(items, pageNumber, pageSize) {
  return items.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
}
