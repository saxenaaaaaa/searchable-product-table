import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

export type Category = "Fruits" | "Vegetables";

export interface Product {
  name: string;
  category: Category;
  price: string;
  stocked: boolean;
}

export interface ProductTableProps {
  products: Array<Product>
  searchText: string;
  includeOutOfStock: boolean;
}

export interface ProductRowProps {
  product: Product
}

export interface ProductCategoryRowProps {
  category: Category;
}

export interface SearchBarProps {
  onSearchTextChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onIncludeOutOfStockChange: (e: React.FormEvent<HTMLInputElement>) => void;
  searchTextValue: string;
  includeOutOfStock: boolean;
}

function SearchBar({onSearchTextChange, onIncludeOutOfStockChange, searchTextValue, includeOutOfStock}: SearchBarProps) {
  return (
    <form>
      <input type="text" placeholder='Search...' onChange={onSearchTextChange} value={searchTextValue}/>
      <div>
        <input type="checkbox" onChange={onIncludeOutOfStockChange} checked={includeOutOfStock}/> Include Out of Stock products
      </div>
    </form>
  )
}

function ProductRow({product}: ProductRowProps) {
  const productDisplayName = product.stocked ? product.name : (
    <span style={{color: 'red'}}>
      {product.name}
    </span>
  )

  return (
    <tr>
      <td>{productDisplayName}</td>
      <td>{product.price}</td>
    </tr>
  )
}

function ProductCategoryRow({category}: ProductCategoryRowProps) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  )
}

export function ProductTable({products, searchText, includeOutOfStock}: ProductTableProps) {

  // console.log("please", ("apple".indexOf("app") !== -1) && (includeOutOfStock ? true : true));
  const filteredProducts = products.filter(product => (product.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) && (includeOutOfStock ? true : (product.stocked)));

  const productsByCategory:Map<Category, Array<Product>> = new Map();
  filteredProducts.forEach(product => {
    const categoryProducts = productsByCategory.get(product.category) ?? [];
    categoryProducts.push(product);
    productsByCategory.set(product.category, categoryProducts);
  });

  const rows: Array<React.JSX.Element> = [];
  productsByCategory.forEach((products, category) => {
    rows.push(
      <ProductCategoryRow category={category} key={category}/>
    )
    products.forEach(product => {
      rows.push(
        <ProductRow product={product} key={product.name} />
      )
    })
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

export default function SearchableProductTable() {
  
  const [searchText, setSearchText] = useState<string>('');
  const [includeOutOfStock, setIncludeOutOfStock] = useState<boolean>(false);

  const handleSearchTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }

  const handleOutOfStockChange = (e: React.FormEvent<HTMLInputElement>) => {
    setIncludeOutOfStock(e.currentTarget.checked);
  }

  return (
    <div>
      <SearchBar
        onSearchTextChange={handleSearchTextChange}
        onIncludeOutOfStockChange={handleOutOfStockChange}
        searchTextValue={searchText}
        includeOutOfStock={includeOutOfStock} />
      <ProductTable products={PRODUCTS} searchText={searchText} includeOutOfStock={includeOutOfStock} />
    </div>
  )
}

const PRODUCTS: Array<Product> = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
] 
