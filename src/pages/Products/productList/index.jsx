import { CheckCircle, Eye, ListFilter, Search } from "lucide-react";
import ActivateProductModal from "./components/ActivateProductModal";
import { useState } from "react";
import ConfirmProductModal from "./components/ConfirmModal";
import ViewProductModal from "./components/ViewModal";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../../services/product_management_service.js";
const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;
function ProductList() {
  const [openActivateModal, setOpenActivateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewProductId, setViewProductId] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({});
  const [phone, setPhone] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  const openConfirmModal = () => setConfirmModal(true);
  const closeConfirmModal = () => setConfirmModal(false);
  const closeActivateModal = () => setOpenActivateModal(false);
  const closeViewModal = () => setOpenViewModal(false);
  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto  bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)] ">
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

      {/* modal finish */}
      <div className="flex items-center justify-start w-[100%] gap-5 bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
        <div className="max-w-[371px] w-[80%] h-[44px] relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500 ">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent dark:placeholder-gray-200 h-full pl-10  transition-all duration-300  absolute left-0 top-0 px-3 py-2 w-full outline-none "
          />
          <Search size={18} className="absolute top-[12px] left-[8px]" />
        </div>
        <div className="max-w-[95px] cursor-pointer w-[20%] border border-[#E4E7EC] rounded-md dark:border-gray-500 px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800">
          <ListFilter
            size={24}
            // color="#667085"
            className="dark:text-gray-300 text-[#667085]"
          />
          <p className="dark:text-gray-300 text-[#667085] text-[16px]">
            filter
          </p>
        </div>
      </div>
      <div className="w-full border mt-4 border-gray-100 rounded-xl h-screen bg-white dark:bg-transparent p-3">
        <h1 className="text-[16px] font-semibold dark:text-white">
          Product List
        </h1>
        <div className="my-3 flex items-center justify-center flex-col gap-4 ">
          {data?.data.map((product, index) => (
            <div className="w-full border border-gray-200 dark:border-gray-600 rounded-md bg-[#FFFFF8] dark:bg-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center justify-start gap-5">
                <div className="w-[62px] h-[62px] rounded-full border border-[#E4E7EC]">
                  <img
                    src={`${IMG_BASE_URL}${product?.image}`}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <div className="flex  flex-col gap-2">
                  <h3 className="text-[#1D2939] dark:text-gray-200 text-[18px]">
                    {product?.productName}
                  </h3>
                  <p className="text-[#404040] dark:text-gray-200 text-[16px]">
                    {product?.price} AF
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedProductId(product?.id);
                    setOpenViewModal(true);
                  }}
                  className="flex  border border-[#D0D5DD] dark:border-gray-300 items-center justify-center gap-2 bg-white dark:bg-gray-600  dark:text-gray-300 px-4 py-2 rounded-4xl"
                >
                  <Eye className="w-5 h-5 text-[#1D1D1D] dark:text-white" />{" "}
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedProductId(product?.id);
                    setOpenActivateModal(true);
                  }}
                  className="flex border border-[#D0D5DD] dark:border-gray-300 items-center justify-center gap-2 bg-white dark:bg-gray-600 dark:text-gray-300 px-4 py-2 rounded-4xl"
                >
                  <CheckCircle className="w-5 h-5 text-[#1D1D1D] dark:text-white" />{" "}
                  Activate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
