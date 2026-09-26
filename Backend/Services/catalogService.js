import { readFile } from "node:fs/promises";

const catalogFileUrl = new URL("../../data.py", import.meta.url);
let catalogPromise;

// The catalogue is CSV data stored in data.py. This parser supports quoted
// values and escaped quotes without requiring an additional dependency.
const parseCsv = (content) => {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (character === '"') {
      if (inQuotes && content[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if (character === "\n" && !inQuotes) {
      row.push(value.replace(/\r$/, ""));
      if (row.some((field) => field.trim())) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  row.push(value.replace(/\r$/, ""));
  if (row.some((field) => field.trim())) rows.push(row);
  return rows;
};

const toCatalogProduct = (fields) => {
  // Some source rows contain unquoted commas in the quantity. The five fields
  // at the end are consistent, so recover the quantity from the middle.
  if (fields.length < 9) return null;

  const [index, brand, productName] = fields;
  const [price, mrp, category, subCategory, image] = fields.slice(-5);
  const quantity = fields.slice(3, -5).join(",").trim();
  const numericPrice = Number.parseFloat(price);

  if (!index || !productName || !Number.isFinite(numericPrice)) return null;

  return {
    _id: `catalog-${index.trim()}`,
    name: [brand, productName].filter(Boolean).join(" - "),
    description: `${productName}${quantity ? ` (${quantity})` : ""}`,
    price: numericPrice,
    originalPrice: Number.parseFloat(mrp) || numericPrice,
    imageUrl: image ? [image.trim()] : [],
    category: category?.trim() || "Grocery",
    subCategory: subCategory?.trim() || "",
    quantity,
    stock: 100,
    source: "catalog",
  };
};

export const getCatalogProducts = async () => {
  if (!catalogPromise) {
    catalogPromise = readFile(catalogFileUrl, "utf8").then((content) =>
      parseCsv(content)
        .slice(1)
        .map(toCatalogProduct)
        .filter(Boolean)
    );
  }

  return catalogPromise;
};

export const findCatalogProduct = async (id) => {
  if (!id.startsWith("catalog-")) return null;

  const products = await getCatalogProducts();
  return products.find((product) => product._id === id) || null;
};
