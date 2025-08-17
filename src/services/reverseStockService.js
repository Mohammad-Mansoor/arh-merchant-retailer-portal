import HttpService from "./http.service";

class ReverseStockService {
  createReverseStockByBackoffice(payload) {
    return HttpService.post("/reverseStock/backoffice", payload);
  }

  rejectReverseStock(reverseStockId, payload) {
    return HttpService.patch(`/reverseStock/reject/${reverseStockId}`, payload);
  }

  getAllReverseStocksForAdmin(page = 1, limit = 10, search = null) {
    const endpoint = `reverseStock/backoffice?page=${page}&limit=${limit}&search=${search}`;
    return HttpService.get(endpoint);
  }
  
  getReverseStocksForMerchant(page = 1, limit = 10, search = null) {
    const endpoint = `reverseStock/merchant?page=${page}&limit=${limit}&search=${search}`;
    return HttpService.get(endpoint);
  }
  
  getReverseStocksForRetailer(page = 1, limit = 10, search = null) {
    const endpoint = `reverseStock/retailer?page=${page}&limit=${limit}&search=${search}`;
    return HttpService.get(endpoint);
  }
}

export default new ReverseStockService();