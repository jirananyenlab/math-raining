function getItemsOfCurrentPage(allItems, currentPage, rowsPerPage) {
  if (allItems === null || allItems === undefined) return undefined;
  if (allItems.length === 0) return [];
  if (rowsPerPage <= 0) return allItems;
  if (currentPage <= 0) return allItems;
  const itemsOfCurrentPage = allItems.slice(
    rowsPerPage * (currentPage - 1),
    rowsPerPage * (currentPage - 1) + rowsPerPage
  );

  return itemsOfCurrentPage.length > 0 ? itemsOfCurrentPage : [];
}
function getTotalPages(allItems, rowsPerPage) {
  if (allItems === null || allItems === undefined) return undefined;
  if (rowsPerPage === 0 || rowsPerPage === undefined || rowsPerPage === null)
    return 1;
  return Math.ceil(allItems.length / rowsPerPage);
}

function getPageToShow(totalPages, currentPage, maxPagesToShow = 5) {
  let end = Math.min(currentPage + maxPagesToShow - 1, totalPages);

  if (end === totalPages) {
    currentPage = Math.max(1, end - maxPagesToShow + 1);
  }

  return Array.from(
    { length: end - currentPage + 1 },
    (_, i) => currentPage + i
  );
  // คื่นค่าเป็น array เช่น 1,2,3,4,5
}

export { getItemsOfCurrentPage, getTotalPages, getPageToShow };
