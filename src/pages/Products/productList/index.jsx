import { 
  CheckCircle, 
  Eye, 
  ListFilter, 
  Plus, 
  Search, 
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import ActivateProductModal from "./components/ActivateProductModal";
import { useState, useEffect } from "react";
import ConfirmProductModal from "./components/ConfirmModal";
import ViewProductModal from "./components/ViewModal";
import { useQuery } from "@tanstack/react-query";
import { 
  getProducts,
  getProviders,
  getProductCategories,
  getProductTypes
} from "../../../services/product_management_service.js";
import { getCoutries } from "../../../services/public_service.js";
import { Autocomplete, TextField } from "@mui/material";

const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL1;

function ProductList() {

  const [openActivateModal, setOpenActivateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewProductId, setViewProductId] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({});
  const [phone, setPhone] = useState("");


  const [filters, setFilters] = useState({
    search: "",
    countryId: "",
    businessTypeId: "",
    providerId: "",
    productCategoryId: "",
    productTypeId: "",
    status: "",
    minPrice: "",
    maxPrice: "",
  });
  
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    businessTypes: [],
    providers: [],
    productCategories: [],
    productTypes: [],
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");


  const { data, isLoading, isError, error } = useQuery({
  queryKey: ["products"],
  queryFn: () => getProducts(),
});

useQuery({
  queryKey: ["filterOptions"],
  queryFn: async () => {
    console.log("Starting to fetch filter options...");
    try {
      const [countries, providers, categories, types] = await Promise.all([
        getCoutries(),
        getProviders(),
        getProductCategories(),
        getProductTypes(),
      ]);

      console.log("Countries response:", countries); // Add this
      console.log("Countries data structure:", countries?.data); // Add this

      setFilterOptions({
        countries: countries?.data || [],
        providers: providers || [],
        productCategories: categories.data || [],
        productTypes: types.data || [],
      });

      return true;
    } catch (err) {
      console.error("Error fetching filter options:", err);
      return false;
    }
  },
});


  useEffect(() => {
    if (!data?.data) return;
    
    const filtered = data.data.filter(product => {
      const matchesSearch = filters.search === "" || 
        (product.productName && 
          product.productName.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCountry = filters.countryId === "" || 
        product.countryId === parseInt(filters.countryId);
      
      const matchesProvider = filters.providerId === "" || 
        product.providerId === parseInt(filters.providerId);
      
      const matchesCategory = filters.productCategoryId === "" || 
        product.productCategoryId === parseInt(filters.productCategoryId);
      
      const matchesType = filters.productTypeId === "" || 
        product.productTypeId === parseInt(filters.productTypeId);
      
      const matchesStatus = filters.status === "" || 
        product.status === (filters.status === "active");
      
      const price = parseFloat(product.price);
      const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : -Infinity;
      const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
      const matchesPrice = price >= minPrice && price <= maxPrice;
      

      const matchesCategoryFilter = selectedCategory === "all" || 
        product.productCategoryId === parseInt(selectedCategory);
      
      return (
        matchesSearch &&
        matchesCountry &&
        matchesProvider &&
        matchesCategory &&
        matchesType &&
        matchesStatus &&
        matchesPrice &&
        matchesCategoryFilter
      );
    });
    
    setFilteredProducts(filtered);
  }, [data, filters, selectedCategory]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      countryId: "",
      businessTypeId: "",
      providerId: "",
      productCategoryId: "",
      productTypeId: "",
      status: "",
      minPrice: "",
      maxPrice: "",
    });
    setSelectedCategory("all");
  };

  const toggleFilterSection = (section) => {
    setExpandedFilter(expandedFilter === section ? null : section);
  };

  const openConfirmModal = () => setConfirmModal(true);
  const closeConfirmModal = () => setConfirmModal(false);
  const closeActivateModal = () => setOpenActivateModal(false);
  const closeViewModal = () => setOpenViewModal(false);

  if (isLoading) return <div className="text-center py-10">Loading products...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;
const dropdownStyles = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    padding: "8px 12px",
    borderRadius: "12px",
    backgroundColor: "white",
    "&.Mui-focused": {
      borderColor: "#CD0202",
      boxShadow: "0 0 0 2px rgba(205, 2, 2, 0.2)",
    },
    "&:hover": {
      borderColor: "#CD0202",
    },
  },
  "& .MuiInputLabel-root": {
    transform: "translate(14px, 14px) scale(1)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -6px) scale(0.75)",
  },
};

const darkDropdownStyles = {
  ...dropdownStyles,
  "& .MuiOutlinedInput-root": {
    ...dropdownStyles["& .MuiOutlinedInput-root"],
    backgroundColor: "#1e293b",
    color: "white",
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },
  "& .MuiAutocomplete-popupIndicator": {
    color: "#94a3b8",
  },
  "& .MuiAutocomplete-clearIndicator": {
    color: "#94a3b8",
  },
};
  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      {/* Modals */}
      
      <ActivateProductModal
        open={openActivateModal}
        onClose={closeActivateModal}
        openConfirmModal={openConfirmModal}
        closeConfirmModal={closeConfirmModal}
        product={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        phone={phone}
        setPhone={setPhone}
      />
      
      <ConfirmProductModal
        open={confirmModal}
        phone={phone}
        onClose={closeConfirmModal}
        product={selectedProduct}
      />
      
      <ViewProductModal
        productId={selectedProductId}
        open={openViewModal}
        onClose={closeViewModal}
      />


      <div className="flex flex-wrap items-center  gap-4 mb-6">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="bg-white dark:bg-slate-800 dark:placeholder-gray-300 h-12 pl-12 w-full rounded-lg border border-[#E4E7EC] dark:border-gray-600 focus:ring-2 focus:ring-[#CD0202] focus:border-transparent transition-all shadow-sm"
          />
          <Search 
            size={20} 
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${
              showFilters 
                ? "bg-[#CD0202]/10 border-[#CD0202] text-[#CD0202]" 
                : "border-[#E4E7EC] dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300"
            } transition-colors`}
          >
            <ListFilter size={20} />
            <span>Filters</span>
          </button>
          
    
        </div>
      </div>


    {showFilters && (
        <div className="mb-6 p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Filter Products</h3>
            <div className="flex gap-3">
              <button 
                onClick={resetFilters}
                className="text-sm text-[#CD0202] dark:text-[#ff4d4d] hover:underline"
              >
                Reset filters
              </button>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Country Filter - Beautiful Autocomplete */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Country
                </label>
                <Autocomplete
                  options={filterOptions.countries}
                  getOptionLabel={(option) => option.countryName || option.name || ""}
                  value={filterOptions.countries.find(c => c.id === filters.countryId) || null}
                  onChange={(event, newValue) => 
                    handleFilterChange("countryId", newValue?.id || "")
                  }
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Select country"
                      variant="outlined"
                      sx={document.documentElement.classList.contains('dark') ? darkDropdownStyles : dropdownStyles}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} className="px-4 py-2 hover:bg-red-50 dark:hover:bg-slate-700">
                      {option.countryName || option.name}
                    </li>
                  )}
                  disableClearable={!filters.countryId}
                  noOptionsText="No countries found"
                />
              </div>
              
              {/* Provider Filter - Beautiful Autocomplete */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Provider
                </label>
                <Autocomplete
                  options={filterOptions.providers}
                  getOptionLabel={(option) => option.name || ""}
                  value={filterOptions.providers.find(p => p.id === filters.providerId) || null}
                  onChange={(event, newValue) => 
                    handleFilterChange("providerId", newValue?.id || "")
                  }
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Select provider"
                      variant="outlined"
                      sx={document.documentElement.classList.contains('dark') ? darkDropdownStyles : dropdownStyles}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} className="px-4 py-2 hover:bg-red-50 dark:hover:bg-slate-700">
                      {option.name}
                    </li>
                  )}
                  disableClearable={!filters.providerId}
                  noOptionsText="No providers found"
                />
              </div>
              
              {/* Product Type Filter - Beautiful Autocomplete */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Product Type
                </label>
                <Autocomplete
                  options={filterOptions.productTypes}
                  getOptionLabel={(option) => option.productType || option.name || ""}
                  value={filterOptions.productTypes.find(t => t.id === filters.productTypeId) || null}
                  onChange={(event, newValue) => 
                    handleFilterChange("productTypeId", newValue?.id || "")
                  }
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Select type"
                      variant="outlined"
                      sx={document.documentElement.classList.contains('dark') ? darkDropdownStyles : dropdownStyles}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} className="px-4 py-2 hover:bg-red-50 dark:hover:bg-slate-700">
                      {option.productType || option.name}
                    </li>
                  )}
                  disableClearable={!filters.productTypeId}
                  noOptionsText="No types found"
                />
              </div>
              
              {/* Status Filter - Beautiful Autocomplete */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Status
                </label>
                <Autocomplete
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" }
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={
                    filters.status ? 
                    { label: filters.status === "active" ? "Active" : "Inactive", value: filters.status } : 
                    null
                  }
                  onChange={(event, newValue) => 
                    handleFilterChange("status", newValue?.value || "")
                  }
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Select status"
                      variant="outlined"
                      sx={document.documentElement.classList.contains('dark') ? darkDropdownStyles : dropdownStyles}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} className="px-4 py-2 hover:bg-red-50 dark:hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          option.value === "active" ? "bg-green-500" : "bg-red-500"
                        }`}></div>
                        {option.label}
                      </div>
                    </li>
                  )}
                  disableClearable={!filters.status}
                  noOptionsText="No statuses found"
                />
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Category Filter Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium dark:text-white">Categories</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === "all"
                ? "bg-[#CD0202] text-white"
                : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
            }`}
          >
            All Categories
          </button>
          
          {filterOptions.productCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id.toString())}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.id.toString()
                  ? "bg-[#CD0202] text-white"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
              }`}
            >
              {category.category_name || category.name}
            </button>
          ))}
        </div>
      </div>


      <div className="w-full border mt-2 border-gray-100 rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-xl font-bold dark:text-white">
              Product List
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and review your products
            </p>
          </div>
          
          <div className="flex items-center mt-3 sm:mt-0">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
              Showing {filteredProducts.length} of {data?.data.length} products
            </span>
            <div className="bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm font-medium">
              {filteredProducts.filter(p => p.status).length} Active
            </div>
          </div>
        </div>
        
        <div className="my-3 grid grid-cols-1 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-gray-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter to find what you're looking for
              </p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-sm font-medium text-[#CD0202] dark:text-[#ff4d4d] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 px-4 py-3 flex flex-col sm:flex-row items-center justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={`${IMG_BASE_URL}/uploads/product_images/${product?.image}`}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/150";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-gray-900 dark:text-white text-lg font-medium">
                        {product?.productName}
                      </h3>
                      <span 
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.status 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {product.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {product?.price} AF
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.tag?.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 bg-[#CD0202]/10 text-[#CD0202] dark:bg-[#CD0202]/20 dark:text-[#ff4d4d] rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setSelectedProductId(product?.id);
                      setOpenViewModal(true);
                    }}
                    className="flex items-center gap-2 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" /> 
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedProductId(product?.id);
                      setOpenActivateModal(true);
                    }}
                    className="flex items-center gap-2 bg-[#CD0202] hover:bg-[#b00202] text-white px-4 py-2 rounded-lg transition-all shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> 
                    Activate
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;