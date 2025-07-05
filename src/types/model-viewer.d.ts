declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      ar?: boolean;
      'ar-modes'?: string;
      'ar-scale'?: string;
      'camera-controls'?: boolean;
      'touch-action'?: string;
      'disable-zoom'?: boolean;
      'auto-rotate'?: boolean;
      'auto-rotate-delay'?: number;
      'rotation-per-second'?: string;
      loading?: 'auto' | 'lazy' | 'eager';
      reveal?: 'auto' | 'interaction' | 'manual';
      'shadow-intensity'?: number;
      'shadow-softness'?: number;
      'environment-image'?: string;
      skybox?: string;
      poster?: string;
      'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
      'interaction-prompt-style'?: 'basic' | 'wiggle';
      'interaction-prompt-threshold'?: number;
      'camera-orbit'?: string;
      'camera-target'?: string;
      'field-of-view'?: string;
      'min-camera-orbit'?: string;
      'max-camera-orbit'?: string;
      'min-field-of-view'?: string;
      'max-field-of-view'?: string;
      bounds?: 'tight' | 'legacy';
      'interpolation-decay'?: number;
      onLoad?: () => void;
      onError?: (event: any) => void;
      onProgress?: (event: any) => void;
      ref?: React.Ref<any>;
      activateAR?: () => void;
    };
  }
}

// Extend the global interface for model-viewer element
declare global {
  interface HTMLElementTagNameMap {
    'model-viewer': HTMLElement & {
      activateAR(): void;
      canActivateAR: boolean;
    };
  }
}