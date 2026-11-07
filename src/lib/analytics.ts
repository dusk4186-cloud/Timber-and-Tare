// ============================================================
// BrewHub Telemetry & Event Analytics (GDPR-Compliant)
// ============================================================

export type AnalyticsEventType =
  | 'page_view'
  | 'splash_completed'
  | 'auth_welcome_viewed'
  | 'auth_state_change'
  | 'auth_login'
  | 'auth_signup'
  | 'auth_guest'
  | 'auth_logout'
  | 'filter_category'
  | 'search_drinks'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'change_cart_item'
  | 'set_order_mode'
  | 'checkout_started'
  | 'order_placed'
  | 'view_receipt'
  | 'view_legal'
  | 'cookie_consent'
  | 'redeem_reward'

interface EventPayload {
  [key: string]: string | number | boolean | undefined | null
}

export function trackEvent(event: AnalyticsEventType, properties?: EventPayload) {
  const timestamp = new Date().toISOString()
  
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[BrewHub Analytics] ${event}`, { timestamp, ...properties })
  }

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('brewhub_analytics', {
          detail: { event, timestamp, properties },
        })
      )
    }
  } catch {
    // Fail silently in non-browser runtimes
  }
}
