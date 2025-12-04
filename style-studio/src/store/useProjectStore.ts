import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectState, LoadingPhase } from '@/types';

interface ProjectStore extends ProjectState {
  // Phase A Actions
  setReferenceImage: (image: string | null) => void;
  setConceptText: (text: string) => void;
  setDirectorTreatment: (treatment: string) => void;
  sendTreatmentToStudio: () => void;
  
  // Phase B Actions
  setStructureReference: (image: string | null) => void;
  setStyleReference: (image: string | null) => void;
  setStudioPrompt: (prompt: string) => void;
  setGeneratedImage: (image: string | null) => void;
  
  // Loading State Actions
  setLoading: (isLoading: boolean, phase?: LoadingPhase | null) => void;
  addLoadingMessage: (message: string) => void;
  clearLoadingMessages: () => void;
  
  // Error Actions
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // General Actions
  resetProject: () => void;
}

const initialState: ProjectState = {
  // Phase A
  referenceImage: null,
  conceptText: '',
  directorTreatment: '',
  
  // Phase B
  structureReference: null,
  styleReference: null,
  studioPrompt: '',
  generatedImage: null,
  
  // General
  isLoading: false,
  loadingPhase: null,
  loadingMessages: [],
  error: null,
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Phase A Actions
      setReferenceImage: (image) => set({ referenceImage: image }),
      setConceptText: (text) => set({ conceptText: text }),
      setDirectorTreatment: (treatment) => set({ directorTreatment: treatment }),
      
      sendTreatmentToStudio: () => {
        const { directorTreatment, referenceImage } = get();
        set({ 
          studioPrompt: directorTreatment,
          structureReference: referenceImage,
        });
      },
      
      // Phase B Actions
      setStructureReference: (image) => set({ structureReference: image }),
      setStyleReference: (image) => set({ styleReference: image }),
      setStudioPrompt: (prompt) => set({ studioPrompt: prompt }),
      setGeneratedImage: (image) => set({ generatedImage: image }),
      
      // Loading State Actions
      setLoading: (isLoading, phase = null) => set({ 
        isLoading, 
        loadingPhase: phase,
        loadingMessages: isLoading ? [] : get().loadingMessages,
      }),
      
      addLoadingMessage: (message) => set((state) => ({ 
        loadingMessages: [...state.loadingMessages, message] 
      })),
      
      clearLoadingMessages: () => set({ loadingMessages: [] }),
      
      // Error Actions
      setError: (error) => set({ error, isLoading: false, loadingPhase: null }),
      clearError: () => set({ error: null }),
      
      // General Actions
      resetProject: () => set(initialState),
    }),
    {
      name: 'style-studio-project',
      partialize: (state) => ({
        referenceImage: state.referenceImage,
        conceptText: state.conceptText,
        directorTreatment: state.directorTreatment,
        structureReference: state.structureReference,
        styleReference: state.styleReference,
        studioPrompt: state.studioPrompt,
        generatedImage: state.generatedImage,
      }),
    }
  )
);
