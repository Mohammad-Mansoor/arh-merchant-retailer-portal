import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

const getLang = () => localStorage.getItem("i18nextLng") || "en";
// Async Thunks
export const fetchAmenities = createAsyncThunk(
  "lookup/fetchAmenities",
  async () => {
    const response = await axios.get(`${BASE_URL}/amenities?lang=${getLang()}`);
    return response.data;
  }
);

const initialState = {
  amenities: [],
  cities: [],
  provinces: [],
  status: "idle",
  error: null,
};

const lookupSlice = createSlice({
  name: lookupSlice,
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.amenities = action.payload;
      });
  },
});
