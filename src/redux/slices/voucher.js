import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companyId: 0,
  voucherNumber: "",
  type: 0,
  date: "",
  narration: "",
  inVoice:"",
  total:"",
  entries: [
    {
      ledgerId: 0,
      entryType: 0,
      amount: 0
    }
  ],
  items: [
    {
      itemId: 0,
      quantity: 0,
      rate: 0,
      gst: {
        cgstPercent: 0,
        sgstPercent: 0,
        igstPercent: 0
      }
    }
  ],
  dispatchDetails: {
    deliveryNoteNumber: "",
    dispatchDate:"",
    dispatchedThrough: "",
    destination: "",
    lrNumber: "",
    vehicleNumber: "",
    freightCharges: 0
  },
  // Added purchase-specific fields
  vendorDetails: {
    name: "",
    address: "",
    gstNumber: "",
    phoneNumber: ""
  },
  referenceNumber: "",
  referenceDate: "",
  purchaseOrderNumber: "",
  termsOfDelivery: "",
  dueDate: "",
  billDiscountPercent: 0,  // Added bill discount percent field
  errors: {
    companyId: "",
    voucherNumber: "",
    type: "",
    date: "",
    narration: "",
    entries: "",
    items: "",
    dispatchDetails: ""
  }
};

const voucher = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    setCompanyId: (state, action) => {
      state.companyId = action.payload;
    },
    setVoucherNumber: (state, action) => {
      state.voucherNumber = action.payload;
    },
    setInVoice: (state, action) => {
      state.inVoice = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setNarration: (state, action) => {
      state.narration = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    // Entry operations
    addEntry: (state, action) => {
      state.entries.push(action.payload);
    },
    updateEntry: (state, action) => {
      const { index, entry } = action.payload;
      if (index >= 0 && index < state.entries.length) {
        state.entries[index] = entry;
      }
    },
    removeEntry: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.entries.length) {
        state.entries.splice(index, 1);
      }
    },
    setEntries: (state, action) => {
      state.entries = action.payload;
    },
    
    // Item operations
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action) => {
      const { index, item } = action.payload;
      if (index >= 0 && index < state.items.length) {
        state.items[index] = item;
      }
    },
    removeItem: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.items.length) {
        state.items.splice(index, 1);
      }
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    
    // GST operations for specific item
    updateItemGst: (state, action) => {
      const { index, gst } = action.payload;
      if (index >= 0 && index < state.items.length) {
        state.items[index].gst = gst;
      }
    },
    
    // Dispatch details operations
    setDispatchDetails: (state, action) => {
      state.dispatchDetails = { ...state.dispatchDetails, ...action.payload };
    },
    setDeliveryNoteNumber: (state, action) => {
      state.dispatchDetails.deliveryNoteNumber = action.payload;
    },
    setDispatchDate: (state, action) => {
      state.dispatchDetails.dispatchDate = action.payload;
    },
    setDispatchedThrough: (state, action) => {
      state.dispatchDetails.dispatchedThrough = action.payload;
    },
    setDestination: (state, action) => {
      state.dispatchDetails.destination = action.payload;
    },
    setLrNumber: (state, action) => {
      state.dispatchDetails.lrNumber = action.payload;
    },
    setVehicleNumber: (state, action) => {
      state.dispatchDetails.vehicleNumber = action.payload;
    },
    setFreightCharges: (state, action) => {
      state.dispatchDetails.freightCharges = action.payload;
    },
    
    // Purchase-specific reducers
    setVendorDetails: (state, action) => {
      state.vendorDetails = { ...state.vendorDetails, ...action.payload };
    },
    setReferenceNumber: (state, action) => {
      state.referenceNumber = action.payload;
    },
    setReferenceDate: (state, action) => {
      state.referenceDate = action.payload;
    },
    setPurchaseOrderNumber: (state, action) => {
      state.purchaseOrderNumber = action.payload;
    },
    setTermsOfDelivery: (state, action) => {
      state.termsOfDelivery = action.payload;
    },
    setDueDate: (state, action) => {
      state.dueDate = action.payload;
    },
    // Added missing reducer for bill discount percent
    setBillDiscountPercent: (state, action) => {
      state.billDiscountPercent = action.payload;
    },
    
    // Error handling
    setError: (state, action) => {
      const { field, message } = action.payload;
      state.errors[field] = message;
    },
    resetErrors: (state) => {
      state.errors = {
        companyId: "",
        voucherNumber: "",
        inVoice:"",
        type: "",
        date: "",
        narration: "",
        entries: "",
        items: "",
        dispatchDetails: ""
      };
    },
    
    // Reset entire state
    resetVoucher: () => initialState
  }
});

export const {
  setCompanyId,
  setVoucherNumber,
  setType,
  setDate,
  setNarration,
  addEntry,
  updateEntry,
  removeEntry,
  setEntries,
  addItem,
  updateItem,
  removeItem,
  setItems,
  updateItemGst,
  setDispatchDetails,
  setDeliveryNoteNumber,
  setDispatchDate,
  setDispatchedThrough,
  setDestination,
  setLrNumber,
  setVehicleNumber,
  setFreightCharges,
  // Export purchase-specific actions
  setVendorDetails,
  setReferenceNumber,
  setReferenceDate,
  setPurchaseOrderNumber,
  setTermsOfDelivery,
  setDueDate,
  setBillDiscountPercent,
  // Error and reset
  setError,
  resetErrors,
  resetVoucher,
  setInVoice,
  setTotal
} = voucher.actions;

export default voucher.reducer;