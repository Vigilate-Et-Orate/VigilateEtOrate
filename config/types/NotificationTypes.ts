export type NotificationContent = {
  _id: string
  title: string
  subtitle?: string
  body: string
  sound?: boolean
  data?: any
  autoDismiss?: boolean
}
