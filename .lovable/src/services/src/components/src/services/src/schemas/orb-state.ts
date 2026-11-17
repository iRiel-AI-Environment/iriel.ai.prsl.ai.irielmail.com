export type IrielOrbStatus =
  | "idle" // Estático, brilho interno suave
  | "listening" // Filamento interno desliza suavemente (sem deformar a borda)
  | "thinking" // Gradiente lento na borda de vidro
  | "streaming" // Imóvel no cabeçalho durante a resposta
  | "error"; // Brilho âmbar discreto e fixo

export interface IrielOrbMotionConfig {
  /** Mantém largura, altura e posição 100% fixas em todos os estados */
  lockGeometry: true;
  /** Suavização do filamento interno (0.05 = ultra suave, sem tremores) */
  filamentSmoothing: number;
  /** Duração das transições de cor/luz em milissegundos */
  transitionDurationMs: number;
}

export const DEFAULT_ORB_MOTION: IrielOrbMotionConfig = {
  lockGeometry: true,
  filamentSmoothing: 0.08,
  transitionDurationMs: 600,
};
