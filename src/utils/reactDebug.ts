/**
 * Utilidades para debugging de React en móvil
 * Usa estas funciones en tus componentes para logear el estado
 */

/**
 * Loguea el estado de un componente de forma legible
 * @param componentName - Nombre del componente
 * @param state - Estado del componente
 *
 * @example
 * logComponentState('Timer', { time: 1500, isRunning: true })
 */
export function logComponentState(componentName: string, state: Record<string, unknown>) {
  console.groupCollapsed(`%c[${componentName}] Estado`, 'color: #61dafb; font-weight: bold')
  Object.entries(state).forEach(([key, value]) => {
    console.log(`${key}:`, value)
  })
  console.groupEnd()
}

/**
 * Loguea cuando un componente se renderiza
 * @param componentName - Nombre del componente
 * @param props - Props del componente (opcional)
 *
 * @example
 * logRender('Timer', { initialTime: 1500 })
 */
export function logRender(componentName: string, props?: Record<string, unknown>) {
  console.log(
    `%c[${componentName}] Render`,
    'color: #ffa500; font-weight: bold',
    props || ''
  )
}

/**
 * Loguea efectos secundarios (útil en useEffect)
 * @param componentName - Nombre del componente
 * @param effectDescription - Descripción del efecto
 * @param dependencies - Dependencias del efecto
 *
 * @example
 * logEffect('Timer', 'Iniciando intervalo', [isRunning])
 */
export function logEffect(
  componentName: string,
  effectDescription: string,
  dependencies?: unknown[]
) {
  console.log(
    `%c[${componentName}] Effect: ${effectDescription}`,
    'color: #90ee90; font-weight: bold',
    dependencies || ''
  )
}

/**
 * Loguea eventos del usuario
 * @param componentName - Nombre del componente
 * @param eventName - Nombre del evento
 * @param eventData - Datos del evento (opcional)
 *
 * @example
 * logEvent('Timer', 'click', { button: 'start' })
 */
export function logEvent(
  componentName: string,
  eventName: string,
  eventData?: Record<string, unknown>
) {
  console.log(
    `%c[${componentName}] Event: ${eventName}`,
    'color: #ff69b4; font-weight: bold',
    eventData || ''
  )
}
