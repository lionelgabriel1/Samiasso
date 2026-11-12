/**
 * Persistence boundary for the ITPSS application.
 *
 * UI modules depend on this contract, not on browser storage directly.
 * The current demonstration uses LocalStorageRepository. After the first
 * payment, replace the configured repository with an API-backed adapter
 * implementing the same interface; screens and domain actions stay intact.
 */
export interface DataRepository {
  get<T>(key: string, fallback: T): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

export class LocalStorageRepository implements DataRepository {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`[ITPSS] Não foi possível ler "${key}" do armazenamento local.`, error);
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[ITPSS] Não foi possível guardar "${key}". O armazenamento local pode estar cheio.`, error);
      throw new Error('Não foi possível guardar os dados nesta demonstração. Reduza o tamanho dos anexos ou limpe dados antigos.');
    }
  }

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  }
}

let activeRepository: DataRepository = new LocalStorageRepository();

export const getRepository = (): DataRepository => activeRepository;

/** Configure an API/database adapter here during the production migration. */
export const configureRepository = (repository: DataRepository): void => {
  activeRepository = repository;
};
