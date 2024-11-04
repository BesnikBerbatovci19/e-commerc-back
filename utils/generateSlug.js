function generateSlugSubCategoryByName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

module.exports = {
  generateSlugSubCategoryByName,
};
