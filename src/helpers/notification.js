import { Notify } from 'quasar'
export function showNotifyResult(bool, message, caption, warning) {
  Notify.create({
    color: bool ? 'green-4' : warning ? 'warning' : 'red-5',
    textColor: 'white',
    icon: bool ? 'cloud_done' : 'warning',
    message: message,
    caption: caption ? caption : null,
    html: true,
    timeout: "2000"
  })
}
