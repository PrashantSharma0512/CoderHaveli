import { createSlice } from "@reduxjs/toolkit";

const loadSession = () => {
    try {
        if (typeof window === "undefined" || !window.sessionStorage) return null;
        const raw = sessionStorage.getItem("coderhaveli_video_session");
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error("Failed to load video session:", e);
    }
    return null;
};

const saveSession = (state) => {
    try {
        if (typeof window === "undefined" || !window.sessionStorage) return;
        sessionStorage.setItem("coderhaveli_video_session", JSON.stringify({
            videoUrl: state.videoUrl,
            currentLessonIndex: state.currentLessonIndex,
            currentLesson: state.currentLesson,
            courseId: state.courseId,
            courseTitle: state.courseTitle,
            courseImage: state.courseImage,
            courseType: state.courseType,
            lessons: state.lessons,
            completedLessons: state.completedLessons,
            autoPlayNext: state.autoPlayNext,
            playbackSpeed: state.playbackSpeed
        }));
    } catch (e) {
        console.error("Failed to save video session:", e);
    }
};

const saved = loadSession();

const initialState = {
    videoUrl: saved?.videoUrl || null,
    currentLessonIndex: saved?.currentLessonIndex ?? 0,
    currentLesson: saved?.currentLesson || null,
    courseId: saved?.courseId || null,
    courseTitle: saved?.courseTitle || "",
    courseImage: saved?.courseImage || "",
    courseType: saved?.courseType || "tutorial",
    lessons: saved?.lessons || [],
    completedLessons: saved?.completedLessons || [],
    autoPlayNext: saved?.autoPlayNext ?? true,
    playbackSpeed: saved?.playbackSpeed ?? 1,
};

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setPlaybackSession: (state, action) => {
            const {
                courseId,
                courseTitle,
                courseImage,
                courseType,
                lessons = [],
                currentLessonIndex = 0,
                currentLesson = null,
                videoUrl = null
            } = action.payload || {};

            state.courseId = courseId || null;
            state.courseTitle = courseTitle || "";
            state.courseImage = courseImage || "";
            state.courseType = courseType || "tutorial";
            state.lessons = Array.isArray(lessons) ? lessons : [];
            state.currentLessonIndex = currentLessonIndex;

            const resolvedLesson = currentLesson || (state.lessons[currentLessonIndex] ?? null);
            state.currentLesson = resolvedLesson;
            state.videoUrl = videoUrl || (resolvedLesson?.videoUrl ?? null);

            saveSession(state);
        },
        addVideo: (state, action) => {
            // Backward compatible: accept string or object
            if (typeof action.payload === 'string') {
                state.videoUrl = action.payload;
            } else if (action.payload && typeof action.payload === 'object') {
                if (action.payload.videoUrl) state.videoUrl = action.payload.videoUrl;
                if (action.payload.courseId) state.courseId = action.payload.courseId;
                if (action.payload.courseTitle) state.courseTitle = action.payload.courseTitle;
                if (action.payload.courseImage) state.courseImage = action.payload.courseImage;
                if (action.payload.courseType) state.courseType = action.payload.courseType;
                if (Array.isArray(action.payload.lessons)) state.lessons = action.payload.lessons;
                if (typeof action.payload.currentLessonIndex === 'number') {
                    state.currentLessonIndex = action.payload.currentLessonIndex;
                    state.currentLesson = state.lessons[action.payload.currentLessonIndex] || null;
                }
            }
            saveSession(state);
        },
        setCurrentLessonIndex: (state, action) => {
            const index = action.payload;
            if (index >= 0 && index < state.lessons.length) {
                state.currentLessonIndex = index;
                const lesson = state.lessons[index];
                state.currentLesson = lesson;
                state.videoUrl = lesson?.videoUrl || null;
                saveSession(state);
            }
        },
        toggleLessonComplete: (state, action) => {
            const index = action.payload;
            if (state.completedLessons.includes(index)) {
                state.completedLessons = state.completedLessons.filter(i => i !== index);
            } else {
                state.completedLessons.push(index);
            }
            saveSession(state);
        },
        markLessonComplete: (state, action) => {
            const index = action.payload;
            if (!state.completedLessons.includes(index)) {
                state.completedLessons.push(index);
                saveSession(state);
            }
        },
        setAutoPlayNext: (state, action) => {
            state.autoPlayNext = action.payload;
            saveSession(state);
        },
        setPlaybackSpeed: (state, action) => {
            state.playbackSpeed = action.payload;
            saveSession(state);
        },
        removeVideo: (state) => {
            state.videoUrl = null;
            state.currentLesson = null;
            state.courseId = null;
            state.courseTitle = "";
            state.lessons = [];
            state.currentLessonIndex = 0;
            try {
                if (typeof window !== "undefined" && window.sessionStorage) {
                    sessionStorage.removeItem("coderhaveli_video_session");
                }
            } catch (e) {
                console.error("Failed to clear video session:", e);
            }
        }
    }
});

export const {
    setPlaybackSession,
    addVideo,
    setCurrentLessonIndex,
    toggleLessonComplete,
    markLessonComplete,
    setAutoPlayNext,
    setPlaybackSpeed,
    removeVideo
} = videoSlice.actions;

export default videoSlice.reducer;

