import { combineReducers, configureStore } from '@reduxjs/toolkit'
import leadSlice from './features/lead/leadSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './features/auth/authSlice';
import taskSlice from './features/task/taskSlice';
import navbarSlice from './features/navbar/navbarSlice';
import coursesSlice from './features/courses/coursesSlice';
import homeSlice from './features/home/homeSlice';
import calendarSlice from './features/calender/calenderSlice';
import batchSlice from './features/batch/batchSlice';
import trainerSlice from './features/trainer/trainerSlice';
import campaignSlice from './features/campaign/campaignSlice';
import learnerSlice from './features/learner/learnerSlice';
import mainTaskSlice from './features/mainTask/mainTaskSlice';
import activitySlice from './features/activity/activitySlice';

export const makeStore = () => {
    const rootReducer = combineReducers({
        auth: authSlice,
        lead: leadSlice,
        task: taskSlice,
        nav: navbarSlice,
        courses: coursesSlice,
        home: homeSlice,
        calendar: calendarSlice,
        batch: batchSlice,
        trainer: trainerSlice,
        campaign: campaignSlice,
        learner: learnerSlice,
        mainTask: mainTaskSlice,
        activity: activitySlice,
    });

    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    // Ignore these action types
                    ignoredActions: ['/authLogin/fulfilled'],
                    // Ignore these field paths in all actions
                    ignoredActionPaths: ['payload.headers', 'payload.config', 'payload.request'],
                },
            }),
    });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useAppSelector((state) => state);