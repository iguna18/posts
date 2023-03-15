import { createSlice } from '@reduxjs/toolkit'
import _enum from '../components/enum'
const popupSlice = createSlice({
  name: 'popup',
  initialState:{
    popupContentN: _enum.NO_POPUP,
    popupProps: {}
  },
  reducers: {
    setpopupContentN: (state, action) => {
      state.popupContentN = action.payload
    },
    setPopupProps: (state, action) => {
      state.popupProps = action.payload
    }
  }
})

export const { setpopupContentN, setPopupProps } = popupSlice.actions

export default popupSlice.reducer
