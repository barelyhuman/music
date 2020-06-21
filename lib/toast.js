import Toastify from 'toastify-js'

export const success = (msg = 'Sucess') => {
  return Toastify({
    text: msg,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    backgroundColor: '#000',
  }).showToast()
}

export const error = (msg = 'Sucess') => {
  return Toastify({
    text: msg,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    backgroundColor: '#e00',
  }).showToast()
}

export default {
  success,
  error,
}
