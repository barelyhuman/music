export function createAlert(refPointer: Ref) {
  return (msg: string) => {
    refPointer.value = msg
    setTimeout(() => {
      refPointer.value = ''
    }, 3500)
  }
}
