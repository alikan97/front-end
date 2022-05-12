import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { rootState, AppDispatch } from '../stores'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<rootState> = useSelector